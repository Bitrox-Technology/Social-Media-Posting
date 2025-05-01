import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedFile, setSelectedDoYouKnowTemplate } from '../../store/appSlice';
import { useUploadImageToCloudinaryMutation } from '../../store/api';
import { DoYouKnowSlide, doYouKnowTemplates } from '../../templetes/doYouKnowTemplates';
import { ArrowLeft, Image as ImageIcon, Type, Settings2, Layout, Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';

interface ExtendedDoYouKnowTemplate {
  id: string;
  slides: DoYouKnowSlide[];
  renderSlide: (slide: DoYouKnowSlide, showLogo: boolean, logoUrl: string) => JSX.Element;
  coverImage: string;
}

interface DoYouKnowTemplateSelectorProps {
  initialTopic?: string;
  generatedImageUrl?: string;
  onSave?: (updatedSlide: DoYouKnowSlide, imageUrl: string) => void;
}

export const DoYouKnowTemplateSelector: React.FC<DoYouKnowTemplateSelectorProps> = ({
  initialTopic = '',
  generatedImageUrl,
  onSave,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const defaultLogoUrl = '/images/Logo1.png';
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);

  const extendedTemplates: ExtendedDoYouKnowTemplate[] = doYouKnowTemplates.map((template) => ({
    ...template,
    coverImage: template.coverImageUrl || '/images/default-cover.jpg',
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
            img.crossOrigin = 'Anonymous';
            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );
  };

  useEffect(() => {
    const loadSlide = async () => {
      const updatedSlide = {
        ...selectedTemplate.slides[0],
        imageUrl: generatedImageUrl || selectedTemplate.slides[0].imageUrl,
        title: customTitle || selectedTemplate.slides[0].title,
        fact: customFact || selectedTemplate.slides[0].fact,
        footer: customFooter || selectedTemplate.slides[0].footer || '',
        websiteUrl: customWebsiteUrl || selectedTemplate.slides[0].websiteUrl || '',
      };
      await preloadSlideImages(updatedSlide);
      setSlide(updatedSlide);

      if (onSave && slideRef.current) {
        const canvas = await html2canvas(slideRef.current, {
          useCORS: true,
          scale: 2,
          backgroundColor: '#1A2526',
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
    };
    loadSlide();
  }, [selectedTemplate, generatedImageUrl, customTitle, customFact, customFooter, customWebsiteUrl, showLogo, onSave]);

  const handleTemplateSelect = (template: ExtendedDoYouKnowTemplate) => {
    setSelectedTemplate(template);
    const newSlide = {
      ...template.slides[0],
      imageUrl: generatedImageUrl || template.slides[0].imageUrl,
      title: customTitle || template.slides[0].title,
      fact: customFact || template.slides[0].fact,
      footer: customFooter || template.slides[0].footer || '',
      websiteUrl: customWebsiteUrl || template.slides[0].websiteUrl || '',
    };
    setSlide(newSlide);
  };

  const handleBack = () => {
    dispatch(setSelectedDoYouKnowTemplate(null));
    navigate('/');
  };

  if (!slide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={handleBack}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back</span>
          </motion.button>
          
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Did You Know Template Editor
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div
                ref={slideRef}
                className="relative rounded-xl overflow-hidden shadow-xl mx-auto"
                style={{
                  width: '500px',
                  height: '700px',
                  maxWidth: '100%',
                  aspectRatio: '5/7',
                }}
              >
                {selectedTemplate.renderSlide(slide, showLogo, defaultLogoUrl)}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
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
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
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
                            ? 'border-yellow-500 bg-gray-700/50'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="aspect-square rounded-t-lg overflow-hidden">
                          <img
                            src={template.coverImage}
                            alt={template.id}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 text-center">
                          <p className="text-sm font-medium">{template.id}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-gray-300">Title</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => {
                          setCustomTitle(e.target.value);
                          setSlide((prev) => ({ ...prev, title: e.target.value }));
                        }}
                        className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300">Fact</label>
                      <textarea
                        value={customFact}
                        onChange={(e) => {
                          setCustomFact(e.target.value);
                          setSlide((prev) => ({ ...prev, fact: e.target.value }));
                        }}
                        className="w-full px-4 py-2 bg-gray-700 rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300">Footer</label>
                      <div className="flex items-center">
                        <span className="text-gray-400 px-3">@</span>
                        <input
                          type="text"
                          value={customFooter}
                          onChange={(e) => {
                            setCustomFooter(e.target.value);
                            setSlide((prev) => ({ ...prev, footer: e.target.value }));
                          }}
                          className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300">Website URL</label>
                      <input
                        type="text"
                        value={customWebsiteUrl}
                        onChange={(e) => {
                          setCustomWebsiteUrl(e.target.value);
                          setSlide((prev) => ({ ...prev, websiteUrl: e.target.value }));
                        }}
                        className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Show Logo</label>
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
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/20 text-white'
              }`}
              whileHover={{ scale: isUploading ? 1 : 1.02 }}
            >
              <Save className="w-5 h-5" />
              {isUploading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};