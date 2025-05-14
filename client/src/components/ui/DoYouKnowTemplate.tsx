// src/components/ui/DoYouKnowTemplate.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedFile, setSelectedDoYouKnowTemplate } from '../../store/appSlice'; // Corrected import
import { useUploadImageToCloudinaryMutation } from '../../store/api';
import { DoYouKnowSlide, doYouKnowTemplates, Colors } from '../../templetes/doYouKnowTemplates';
import { ArrowLeft, Type, Settings2, Layout, Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import chroma from 'chroma-js';

interface ExtendedDoYouKnowTemplate {
  id: string;
  name: string;
  slides: DoYouKnowSlide[];
  renderSlide: (slide: DoYouKnowSlide, showLogo: boolean, logoUrl: string, colors: Colors) => JSX.Element;
  coverImageUrl: string;
  colors: Colors;
}

interface DoYouKnowTemplateSelectorProps {
  initialTopic?: string;
  generatedImageUrl?: string;
  onSave?: (updatedSlide: DoYouKnowSlide, imageUrl: string) => void;
}

const defaultColors: Colors =  {
  logoColors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    accent: ['#50E3C2', '#F5A623'],
  },
  imageColors: ['#4A90E2', '#50E3C2'],
  glowColor: '#FF5733', // Default complementary color
  complementaryTextColor: '#FFFFFF',
  complementaryFooterColor: '#E0E0E0',
  ensureContrast: (color1: string, color2: string, minContrast: number = 4.5) => {
    try {
      if (!chroma.valid(color1) || !chroma.valid(color2)) {
        return '#FFFFFF';
      }
      const contrast = chroma.contrast(color1, color2);
      if (contrast < minContrast) {
        const adjusted = chroma(color1).luminance(contrast < minContrast ? 0.7 : 0.3).hex();
        return chroma.contrast(adjusted, color2) >= minContrast ? adjusted : '#FFFFFF';
      }
      return color1;
    } catch (error) {
      console.warn(`ensureContrast error: ${error}`);
      return '#FFFFFF';
    }
  },
  vibrantLogoColor: '#4A90E2',
  vibrantTextColor: '#FFFFFF',
  footerColor: '#50E3C2',
  vibrantAccentColor: '#F5A623',
  backgroundColor: '#FFFFFF',
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 500,
    fontSize: '2.5rem',
  },
  graphicStyle: {
    borderRadius: '8px',
    iconStyle: 'sharp',
    filter: 'none',
  },
  materialTheme: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    tertiary: '#F5A623',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
  },
};

export const DoYouKnowTemplateSelector: React.FC<DoYouKnowTemplateSelectorProps> = ({
  initialTopic = '',
  generatedImageUrl,
  onSave,
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const defaultLogoUrl = '/images/Logo1.png';
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);

  

  const extendedTemplates: ExtendedDoYouKnowTemplate[] = doYouKnowTemplates.map((template) => ({
    ...template,
    coverImageUrl: template.coverImageUrl || '/images/default-cover.jpg',
    colors: template.colors ?? defaultColors,
  }));

  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedDoYouKnowTemplate>(extendedTemplates[0]);
  const [slide, setSlide] = useState<DoYouKnowSlide>({
    ...extendedTemplates[0].slides[0],
    imageUrl: generatedImageUrl || extendedTemplates[0].slides[0].imageUrl,
  });
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>(slide.title);
  const [customFact, setCustomFact] = useState<string>(slide.fact);
  const [customFooter, setCustomFooter] = useState<string>(slide.footer || '');
  const [customWebsiteUrl, setCustomWebsiteUrl] = useState<string>(slide.websiteUrl || '');
  const [activeTab, setActiveTab] = useState<'templates' | 'content' | 'settings'>('templates');
  const [error, setError] = useState<string | null>(null);

  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const slideRef = useRef<HTMLDivElement>(null);

  const preloadSlideImages = async (slide: DoYouKnowSlide) => {
    const images = [slide.imageUrl, showLogo ? defaultLogoUrl : ''].filter(Boolean);
    await Promise.all(
      images.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url || '';
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              console.log(`Image loaded: ${url}`);
              resolve(undefined);
            };
            img.onerror = () => {
              console.error(`Failed to load image: ${url}`);
              resolve(undefined);
            };
          })
      )
    );
  };

  useEffect(() => {
    const loadSlide = async () => {
      try {
        const updatedSlide = {
          ...selectedTemplate.slides[0],
          imageUrl: generatedImageUrl || selectedTemplate.slides[0].imageUrl,
          title: customTitle || selectedTemplate.slides[0].title,
          fact: customFact || selectedTemplate.slides[0].fact,
          footer: customFooter || selectedTemplate.slides[0].footer || '',
          websiteUrl: customWebsiteUrl || selectedTemplate.slides[0].websiteUrl || '',
          slideNumber: selectedTemplate.slides[0].slideNumber,
        };
        await preloadSlideImages(updatedSlide);
        setSlide(updatedSlide);

        if (onSave && slideRef.current) {
          setIsUploading(true);
          const canvas = await html2canvas(slideRef.current, {
            useCORS: true,
            scale: 2,
            backgroundColor: theme === 'dark' ? '#1A2526' : '#FFFFFF',
            logging: true,
          });
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
          const formData = new FormData();
          formData.append('image', blob, 'do-you-know-slide.png');
          const result = await uploadImageToCloudinary(formData).unwrap();
          const cloudinaryUrl = result?.data?.secure_url;
          if (cloudinaryUrl) {
            dispatch(setSelectedFile({ name: 'do-you-know-slide.png', url: cloudinaryUrl }));
            onSave(updatedSlide, cloudinaryUrl);
          }
        }
      } catch (err) {
        console.error('Error loading slide:', err);
        setError('Failed to load or save slide. Please try again.');
      } finally {
        setIsUploading(false);
      }
    };
    loadSlide();
  }, [selectedTemplate, generatedImageUrl, customTitle, customFact, customFooter, customWebsiteUrl, showLogo, onSave, theme, dispatch]);

  const handleTemplateSelect = (template: ExtendedDoYouKnowTemplate) => {
    try {
      setSelectedTemplate(template);
      const newSlide = {
        ...template.slides[0],
        imageUrl: generatedImageUrl || template.slides[0].imageUrl,
        title: customTitle || template.slides[0].title,
        fact: customFact || template.slides[0].fact,
        footer: customFooter || template.slides[0].footer || '',
        websiteUrl: customWebsiteUrl || template.slides[0].websiteUrl || '',
        slideNumber: template.slides[0].slideNumber,
      };
      setSlide(newSlide);
      setError(null);
      console.log('Selected template:', template.name, 'Slide:', newSlide);
    } catch (err) {
      console.error('Error selecting template:', err);
      setError('Failed to select template. Please try again.');
    }
  };

  const handleBack = () => {
    dispatch(setSelectedDoYouKnowTemplate(null));
    navigate('/');
  };

  // Error Boundary Component
  class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    render() {
      if (this.state.hasError) {
        return <div className="text-red-500 p-4">Something went wrong. Please try again.</div>;
      }
      return this.props.children;
    }
  }

  if (!slide) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              onClick={handleBack}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Back</span>
            </motion.button>
            <h1
              className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Did You Know Template Editor
            </h1>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar: All Templates */}
            <div
              className={`lg:w-1/4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[80vh]`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                All Templates
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {extendedTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    className={`cursor-pointer rounded-lg border transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="aspect-square rounded-t-lg overflow-hidden">
                      <img
                        src={template.coverImageUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={() => console.error(`Failed to load cover image: ${template.coverImageUrl}`)}
                      />
                    </div>
                    <div
                      className={`p-3 text-center ${
                        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                      }`}
                    >
                      <p className="text-sm font-medium">{template.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side: Slide Preview and Editor */}
            <div className="lg:w-3/4 space-y-6">
              <div
                className={`rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 overflow-visible`}
              >
                <AnimatePresence mode="wait">
                  {isUploading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center min-h-[1080px]"
                    >
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center"
                    >
                      <div
                        ref={slideRef}
                        className="relative rounded-xl overflow-visible shadow-xl"
                        style={{
                          width: '1080px',
                          height: '1080px',
                          maxWidth: '100%',
                          aspectRatio: '1/1',
                        }}
                      >
                        {selectedTemplate.renderSlide(slide, showLogo, defaultLogoUrl, selectedTemplate.colors)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Editor Tabs */}
              {/* <div
                className={`rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}
              >
                <div className="flex gap-4 mb-6">
                  {[
                    { id: 'templates', icon: <Layout className="w-5 h-5" />, label: 'Templates' },
                    { id: 'content', icon: <Type className="w-5 h-5" />, label: 'Content' },
                    { id: 'settings', icon: <Settings2 className="w-5 h-5" />, label: 'Settings' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {activeTab === 'templates' && (
                      <div className="grid grid-cols-2 gap-4">
                        {extendedTemplates.map((template) => (
                          <motion.div
                            key={template.id}
                            className={`cursor-pointer rounded-lg border transition-all ${
                              selectedTemplate.id === template.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : theme === 'dark'
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleTemplateSelect(template)}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="aspect-square rounded-t-lg overflow-hidden">
                              <img
                                src={template.coverImageUrl}
                                alt={template.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div
                              className={`p-3 text-center ${
                                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                              }`}
                            >
                              <p className="text-sm font-medium">{template.name}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'content' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            value={customTitle}
                            onChange={(e) => {
                              setCustomTitle(e.target.value);
                              setSlide((prev) => ({ ...prev, title: e.target.value }));
                            }}
                            className={`w-full px-4 py-2 rounded-lg ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-900 border-gray-300'
                            } border focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}
                          >
                            Fact
                          </label>
                          <textarea
                            value={customFact}
                            onChange={(e) => {
                              setCustomFact(e.target.value);
                              setSlide((prev) => ({ ...prev, fact: e.target.value }));
                            }}
                            className={`w-full px-4 py-2 rounded-lg h-32 ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-900 border-gray-300'
                            } border focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}
                          >
                            Footer
                          </label>
                          <div className="flex items-center">
                            <span
                              className={`px-3 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              @
                            </span>
                            <input
                              type="text"
                              value={customFooter}
                              onChange={(e) => {
                                setCustomFooter(e.target.value);
                                setSlide((prev) => ({ ...prev, footer: e.target.value }));
                              }}
                              className={`flex-1 px-4 py-2 rounded-lg ${
                                theme === 'dark'
                                  ? 'bg-gray-700 text-white border-gray-600'
                                  : 'bg-white text-gray-900 border-gray-300'
                              } border focus:ring-2 focus:ring-blue-500`}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label
                            className={`block text-sm font-medium ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}
                          >
                            Website URL
                          </label>
                          <input
                            type="text"
                            value={customWebsiteUrl}
                            onChange={(e) => {
                              setCustomWebsiteUrl(e.target.value);
                              setSlide((prev) => ({ ...prev, websiteUrl: e.target.value }));
                            }}
                            className={`w-full px-4 py-2 rounded-lg ${
                              theme === 'dark'
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-900 border-gray-300'
                              } border focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'settings' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label
                            className={`text-sm font-medium ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                            }`}
                          >
                            Show Logo
                          </label>
                          <input
                            type="checkbox"
                            checked={showLogo}
                            onChange={(e) => setShowLogo(e.target.checked)}
                            className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <motion.button
                  onClick={() => {
                    if (onSave && slideRef.current) {
                      onSave(slide, '');
                    }
                  }}
                  disabled={isUploading}
                  className={`mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isUploading
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : theme === 'dark'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  whileHover={{ scale: isUploading ? 1 : 1.02 }}
                >
                  <Save className="w-5 h-5" />
                  {isUploading ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Inline CSS for Responsiveness */}
        <style>
          {`
            @media (max-width: 1024px) {
              .flex.lg\\:flex-row {
                flex-direction: column;
              }
              .lg\\:w-1\\/4 {
                width: 100%;
                max-height: 40vh;
                overflow-y: auto;
              }
              .lg\\:w-3\\/4 {
                width: 100%;
              }
              .relative.rounded-xl.overflow-visible.shadow-xl {
                transform: scale(0.85);
                margin: 0 auto;
              }
            }
            @media (max-width: 768px) {
              .relative.rounded-xl.overflow-visible.shadow-xl {
                transform: scale(0.7);
                margin: 0 auto;
              }
            }
            .min-h-[1080px] {
              min-height: 1080px;
            }
          `}
        </style>
      </div>
    </ErrorBoundary>
  );
};