// src/components/ui/TemplateCarousel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carouselTemplates, Slide, CarouselTemplate, Colors } from '../../templetes/templetesDesign';
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import chroma from 'chroma-js';

// Default Colors from Template2
const defaultColors: Colors = {
  logoColors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    accent: ['#50E3C2', '#F5A623'],
  },
  imageColors: ['#4A90E2', '#50E3C2'],
  glowColor: '#FF5733',
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

interface ExtendedCarouselTemplate extends CarouselTemplate {
  coverImage: string;
  colors: Colors; // Use proper Colors interface
}

interface TemplateCarouselProps {
  initialTopic: string;
  onImagesGenerated?: (images: string[]) => void;
  onSave?: (updatedSlides: Slide[], updatedImages: string[]) => void;
}

export const TemplateCarousel: React.FC<TemplateCarouselProps> = ({ initialTopic, onImagesGenerated, onSave }) => {
  const { theme } = useTheme();
  const [topic] = useState<string>(initialTopic);
  const [selectedTemplate, setSelectedTemplate] = useState<ExtendedCarouselTemplate>({
    ...carouselTemplates[0],
    coverImage: carouselTemplates[0].coverImageUrl || '/images/default-cover.jpg',
    colors: defaultColors, // Use defaultColors
  });
  const [slides, setSlides] = useState<Slide[]>(selectedTemplate.slides);
  const [loading, setLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedSlides, setEditedSlides] = useState<Slide[]>([...slides]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [addLogo, setAddLogo] = useState<boolean>(true);
  const defaultLogoUrl = '/images/Logo.png';
  const slideRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const extendedTemplates: ExtendedCarouselTemplate[] = carouselTemplates.map((template) => ({
    ...template,
    coverImage: template.coverImageUrl || '/images/default-cover.jpg',
    colors: defaultColors, // Use defaultColors for all templates
  }));

  useEffect(() => {
    if (slideRef.current) {
      console.log('Slide Position:', {
        top: slideRef.current.offsetTop,
        height: slideRef.current.offsetHeight,
        width: slideRef.current.offsetWidth,
      });
    }
  }, [loading, editMode, activeIndex]);

  useEffect(() => {
    console.log('Selected Template:', {
      id: selectedTemplate.id,
      name: selectedTemplate.name,
      slidesCount: selectedTemplate.slides.length,
    });
  }, [selectedTemplate]);

  const handleTemplateSelect = async (template: ExtendedCarouselTemplate) => {
    setLoading(true);
    try {
      setSelectedTemplate(template);
      const newSlides = template.slides;
      await Promise.all(newSlides.map(preloadSlideImages));
      setSlides(newSlides);
      setEditedSlides([...newSlides]);
      setActiveIndex(0); // Reset to first slide
      console.log('Selected Template:', template.id, 'Slides:', newSlides.length, newSlides);
    } catch (error) {
      console.error('Error loading template:', error);
    } finally {
      setLoading(false);
    }
  };

  const preloadSlideImages = async (slide: Slide) => {
    const images = [
      slide.imageUrl,
      addLogo ? defaultLogoUrl : '',
    ].filter(Boolean);

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

  const getSlideDimensions = () => {
    return {
      width: '1080px',
      height: '1080px',
      maxWidth: '100%',
      aspectRatio: '1 / 1',
    };
  };

  const handlePrevClick = () => {
    setActiveIndex((prev) => {
      const newIndex = prev === 0 ? slides.length - 1 : prev - 1;
      console.log('Navigating to previous slide:', newIndex);
      return newIndex;
    });
  };

  const handleNextClick = () => {
    setActiveIndex((prev) => {
      const newIndex = prev === slides.length - 1 ? 0 : prev + 1;
      console.log('Navigating to next slide:', newIndex);
      return newIndex;
    });
  };

  class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="text-red-500 p-4">
            Something went wrong: {this.state.error || 'Unknown error'}. Please try again.
          </div>
        );
      }
      return this.props.children;
    }
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar: All Templates */}
            <div
              className={`lg:w-1/4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[80vh]`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  All Templates
                </h2>
                <motion.button
                  onClick={() => navigate(-1)}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
                </motion.button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {extendedTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      selectedTemplate.id === template.id
                        ? theme === 'dark'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-blue-500 bg-blue-50'
                        : theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-square">
                      <img
                        src={template.coverImage}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        onError={() => console.error(`Failed to load cover image: ${template.coverImage}`)}
                      />
                    </div>
                    <div
                      className={`absolute bottom-0 left-0 right-0 p-3 ${
                        theme === 'dark' ? 'bg-black/60' : 'bg-white/60'
                      } backdrop-blur-sm`}
                    >
                      <p
                        className={`text-center font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {template.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side: Selected Template Display */}
            <div className="lg:w-3/4 space-y-6">
              <div
                className={`rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-visible`}
              >
                <div className="p-8 min-h-[1080px]">
                  <div className="flex items-center justify-between mb-6">
                    <h2
                      className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      {selectedTemplate.name}
                    </h2>
                    <div className="flex gap-3 items-center">
                      <motion.button
                        onClick={() => setEditMode(!editMode)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                          theme === 'dark'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Settings size={18} />
                        {editMode ? 'Preview' : 'Edit'}
                      </motion.button>
                      <span
                        className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                      >
                        Slide {activeIndex + 1} of {slides.length}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center min-h-[1080px]"
                      >
                        <Loader2
                          className={`w-12 h-12 animate-spin ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`}
                        />
                      </motion.div>
                    ) : slides.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center min-h-[1080px] text-red-500"
                      >
                        No slides available for this template.
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative flex justify-center"
                      >
                        <div className="relative">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              ref={slideRef}
                              style={{ ...getSlideDimensions(), margin: '0 auto' }}
                              className="relative rounded-xl"
                            >
                              {selectedTemplate.renderSlide(
                                editMode ? editedSlides[activeIndex] : slides[activeIndex],
                                addLogo,
                                defaultLogoUrl,
                                selectedTemplate.colors
                              )}
                            </motion.div>
                          </AnimatePresence>
                          <motion.div
                            className={`absolute top-1/2 -translate-y-1/2 left-4 flex items-center justify-center w-12 h-12 rounded-full ${
                              theme === 'dark' ? 'bg-gray-700/70' : 'bg-gray-200/70'
                            } z-20`}
                            onClick={handlePrevClick}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronLeft className="w-8 h-8 text-white" />
                          </motion.div>
                          <motion.div
                            className={`absolute top-1/2 -translate-y-1/2 right-4 flex items-center justify-center w-12 h-12 rounded-full ${
                              theme === 'dark' ? 'bg-gray-700/70' : 'bg-gray-200/70'
                            } z-20`}
                            onClick={handleNextClick}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronRight className="w-8 h-8 text-white" />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
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
              .relative.rounded-xl {
                transform: scale(0.85);
                margin: 16px auto;
              }
            }
            @media (max-width: 768px) {
              .relative.rounded-xl {
                transform: scale(0.7);
                margin: 24px auto;
              }
            }
            .relative.rounded-xl {
              overflow: visible !important;
            }
            .min-h-\\32 1080px\\33  {
              min-height: 1080px !important;
            }
          `}
        </style>
      </div>
    </ErrorBoundary>
  );
};