import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setSelectedFile } from '../../store/appSlice';
import {
  useUploadImageToCloudinaryMutation,
  useGenerateImageMutation,
  useGenerateImageContentMutation,
  useLazyGetImageContentQuery,
  useUpdatePostMutation,
} from '../../store/api';
import { FestivalSlide, FestivalTemplates } from '../../templetes/festivalTemplates'; // Adjust import for festival templates
import { ArrowLeft, Image as Sparkles, Wand2, Save, Layout, Settings2, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';

interface FestivalTemplateProps {
  onImagesGenerated?: (image: string) => void;
  onSave?: (updatedSlide: FestivalSlide, ref: HTMLDivElement) => void;
  initialSlide?: { title: string; description: string; footer?: string; websiteUrl?: string; imageUrl?: string; date?: string };
  templateId?: string;
  topic?: string;
}

export const FestivalTemplateEditor: React.FC<FestivalTemplateProps> = ({
  onImagesGenerated,
  onSave,
  initialSlide,
  templateId,
  topic,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const defaultLogoUrl = '/images/Logo1.png';
  const slideRef = useRef<HTMLDivElement>(null);

  const {
    templateId: locationTemplateId,
    fromAutoPostCreator,
    postContentId,
    generatedContent,
    contentId,
    contentType,
    logoUrl: stateLogoUrl,
  } = location.state || {};

  const logoUrl = stateLogoUrl || defaultLogoUrl;

  const [selectedTemplate, setSelectedTemplate] = useState(
    FestivalTemplates.find((t) => t.id === (templateId || locationTemplateId)) || FestivalTemplates[0]
  );

  const [slide, setSlide] = useState<FestivalSlide>(() => {
    const content = generatedContent || initialSlide;
    if (content) {
      return {
        ...selectedTemplate.slides[0],
        title: content.title || selectedTemplate.slides[0].title,
        description: content.description || selectedTemplate.slides[0].description,
        footer: content.footer || selectedTemplate.slides[0].footer || '',
        websiteUrl: content.websiteUrl || selectedTemplate.slides[0].websiteUrl || '',
        imageUrl: content.imageUrl || selectedTemplate.slides[0].imageUrl || '',
        date: content.date || selectedTemplate.slides[0].date || '',
      };
    }
    return selectedTemplate.slides[0];
  });

  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>(slide.title);
  const [customDescription, setCustomDescription] = useState<string>(slide.description);
  const [customFooter, setCustomFooter] = useState<string>(slide.footer || '');
  const [customDate, setCustomDate] = useState<string>(slide.date || '');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [generateImage] = useGenerateImageMutation();
  const [generateImageContent] = useGenerateImageContentMutation();
  const [getImageContent, { isFetching: isFetchingContent }] = useLazyGetImageContentQuery();
  const [updatePost] = useUpdatePostMutation();

  useEffect(() => {
    const fetchImageContent = async () => {
      if (contentId && contentType === 'ImageContent' && !isInitialized) {
        try {
          const response = await getImageContent({ contentId: contentId }).unwrap();
          const data = response.data;

          if (data) {
            const newTemplate = FestivalTemplates.find((t) => t.id === data.templateId) || FestivalTemplates[0];
            setSelectedTemplate(newTemplate);

            const updatedSlide: FestivalSlide = {
              ...newTemplate.slides[0],
              title: data.content.title || '',
              description: data.content.description || '',
              footer: data.content.footer || '',
              websiteUrl: data.content.websiteUrl || '',
              imageUrl: data.content.imageUrl || '',
              date: data.content.date || '',
            };

            await preloadSlideImages(updatedSlide);
            setSlide(updatedSlide);
            setCustomTitle(updatedSlide.title);
            setCustomDescription(updatedSlide.description);
            setCustomFooter(updatedSlide.footer || '');
            setCustomDate(updatedSlide.date || '');
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Error fetching ImageContent:', error);
          initializeSlide();
        }
      } else {
        initializeSlide();
      }
    };

    fetchImageContent();
  }, [contentId, contentType, isInitialized]);

  const preloadSlideImages = async (slide: FestivalSlide) => {
    const images = [slide.imageUrl, showLogo ? logoUrl : ''].filter(Boolean);
    await Promise.all(
      images.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url || '';
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(undefined);
            img.onerror = () => {
              console.error(`Failed to preload image: ${url}`);
              resolve(undefined);
            };
          })
      )
    );
  };

  const initializeSlide = async () => {
    if (isInitialized) return;

    const content = generatedContent || initialSlide;
    let updatedSlide = { ...slide };
    if (content) {
      updatedSlide = {
        ...selectedTemplate.slides[0],
        title: content.title || selectedTemplate.slides[0].title,
        description: content.description || selectedTemplate.slides[0].description,
        footer: content.footer || selectedTemplate.slides[0].footer || '',
        websiteUrl: content.websiteUrl || selectedTemplate.slides[0].websiteUrl || '',
        imageUrl: content.imageUrl || selectedTemplate.slides[0].imageUrl || '',
        date: content.date || selectedTemplate.slides[0].date || '',
      };
    }

    await preloadSlideImages(updatedSlide);
    setSlide(updatedSlide);
    setCustomTitle(updatedSlide.title);
    setCustomDescription(updatedSlide.description);
    setCustomFooter(updatedSlide.footer || '');
    setCustomDate(updatedSlide.date || '');

    if (onImagesGenerated && updatedSlide.imageUrl) {
      const image = await captureScreenshot();
      if (image) onImagesGenerated(image);
    }

    setIsInitialized(true);
  };

  const handleGenerateImage = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const response = await generateImage({ prompt: topic }).unwrap();
      const generatedImageUrl = response.data;
      const updatedSlide = { ...slide, imageUrl: generatedImageUrl || '' };
      await preloadSlideImages(updatedSlide);
      setSlide(updatedSlide);

      if (onImagesGenerated) {
        const image = await captureScreenshot();
        if (image) onImagesGenerated(image);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const contentResponse = await generateImageContent({ topic }).unwrap();
      const { title, description, date } = contentResponse.data;
      setCustomTitle(title);
      setCustomDescription(description);
      setCustomDate(date || '');
      setSlide({ ...slide, title, description, date: date || '' });
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const captureScreenshot = async () => {
    if (!slideRef.current) return '';

    await new Promise((resolve) => setTimeout(resolve, 100));
    const canvas = await html2canvas(slideRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      logging: true,
      windowWidth: 500,
      windowHeight: 700,
    });
    return canvas.toDataURL('image/png');
  };

  const handleSave = async () => {
    if (!slideRef.current || !slide) {
      alert('Please wait for the slide to render');
      return;
    }

    setIsUploading(true);
    try {
      await preloadSlideImages(slide);

      const canvas = await html2canvas(slideRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        logging: true,
        windowWidth: 500,
        windowHeight: 700,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b as Blob), 'image/png');
      });

      const formData = new FormData();
      formData.append('image', blob, 'festival-slide.png');

      const result = await uploadImageToCloudinary(formData).unwrap();
      const cloudinaryUrl = result?.data?.secure_url;

      if (!cloudinaryUrl) throw new Error('Failed to upload image');

      const updatePostData = await updatePost({
        contentId,
        contentType,
        images: [{ url: cloudinaryUrl, label: 'Festival Post' }],
      }).unwrap();

      dispatch(setSelectedFile({ name: 'festival-slide.png', url: cloudinaryUrl }));

      if (onSave && slideRef.current) {
        onSave(slide, slideRef.current);
      }

      navigate('/auto', {
        state: {
          postContentId: updatePostData?.data?.postContentId,
        },
      });
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isInitialized || isFetchingContent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={() => navigate('/auto', { state: { postContentId } })}
            className="p-2 rounded-full bg-gray-800 dark:bg-gray-700 text-gray-200 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-green-500" /> {/* Changed to green for festive theme */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Festival Template Editor</h2>
          </div>
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
                {selectedTemplate.renderSlide(slide, showLogo, logoUrl, colors[selectedTemplate.id])}            
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <motion.button
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isGenerating ? 1 : 1.05 }}
              >
                <Sparkles className="w-5 h-5" />
                Generate Image
              </motion.button>

              <motion.button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-medium hover:shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isGenerating ? 1 : 1.05 }}
              >
                <Wand2 className="w-5 h-5" />
                Generate Content
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <div className="flex gap-4 mb-6">
              {[
                { id: 'content', icon: <Layout className="w-5 h-5" />, label: 'Content' },
                { id: 'settings', icon: <Settings2 className="w-5 h-5" />, label: 'Settings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                      ? 'bg-green-500 text-white'
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
                {activeTab === 'content' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-gray-300">Title</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => {
                          setCustomTitle(e.target.value);
                          setSlide((prev) => ({ ...prev, title: e.target.value }));
                        }}
                        className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500"
                        placeholder="Enter title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300">Description</label>
                      <textarea
                        value={customDescription}
                        onChange={(e) => {
                          setCustomDescription(e.target.value);
                          setSlide((prev) => ({ ...prev, description: e.target.value }));
                        }}
                        className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500 h-32"
                        placeholder="Enter description..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300">Date</label>
                      <input
                        type="text"
                        value={customDate}
                        onChange={(e) => {
                          setCustomDate(e.target.value);
                          setSlide((prev) => ({ ...prev, date: e.target.value }));
                        }}
                        className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500"
                        placeholder="Enter date (e.g., 2024-12-25)..."
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
                          className="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500"
                          placeholder="Enter footer..."
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300">Show Logo</label>
                      <input
                        type="checkbox"
                        checked={showLogo}
                        onChange={(e) => setShowLogo(e.target.checked)}
                        className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-gray-300">Logo Preview</label>
                      {showLogo && (
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="w-24 h-24 object-contain rounded-lg"
                          onError={() => console.error(`Failed to load logo: ${logoUrl}`)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <motion.button
              onClick={handleSave}
              disabled={isUploading}
              className={`mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${isUploading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg hover:shadow-red-500/20 text-white'
                }`}
              whileHover={{ scale: isUploading ? 1 : 1.02 }}
            >
              {isUploading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isUploading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};