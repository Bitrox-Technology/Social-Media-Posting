import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedFile } from '../../store/appSlice';
import { useUploadImageToCloudinaryMutation, useGenerateDoYouKnowMutation, useLazyGetDYKContentQuery, useUpdatePostMutation } from '../../store/api';
import { DoYouKnowSlide, doYouKnowTemplates } from '../../templetes/doYouKnowTemplates';
import { ArrowLeft, Image as ImageIcon, Type, Settings2, Save, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';

interface DoYouKnowProps {
  onImagesGenerated?: (image: string) => void;
  onSave?: (updatedSlide: DoYouKnowSlide, ref: HTMLDivElement) => void;
  initialSlide?: { title: string; fact: string; footer?: string; websiteUrl?: string; imageUrl?: string };
  templateId?: string;
}

export const DoYouKnow: React.FC<DoYouKnowProps> = ({ onImagesGenerated, onSave, initialSlide, templateId }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);
  const defaultLogoUrl = '/images/Logo1.png';

  const { contentId, contentType, postContentId } = location.state || {};

  const [selectedTemplate, setSelectedTemplate] = useState(
    doYouKnowTemplates.find((t) => t.id === templateId) || doYouKnowTemplates[0]
  );

  const [slide, setSlide] = useState<DoYouKnowSlide>(
    initialSlide
      ? {
          ...selectedTemplate.slides[0],
          title: initialSlide.title,
          fact: initialSlide.fact,
          footer: initialSlide.footer || '',
          websiteUrl: initialSlide.websiteUrl || '',
          imageUrl: initialSlide.imageUrl || selectedTemplate.slides[0].imageUrl,
        }
      : selectedTemplate.slides[0]
  );

  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>(slide.title);
  const [customFact, setCustomFact] = useState<string>(slide.fact);
  const [customFooter, setCustomFooter] = useState<string>(slide.footer || '');
  const [customWebsiteUrl, setCustomWebsiteUrl] = useState<string>(slide.websiteUrl || '');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');

  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [generateDoYouKnow, { isLoading: isGenerating }] = useGenerateDoYouKnowMutation();
  const [getDYKContent, { isFetching: isFetchingContent }] = useLazyGetDYKContentQuery();
  const [updatePost] = useUpdatePostMutation();
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDoYouKnowContent = async () => {
      if (contentId && contentType === 'DYKContent' && !isInitialized) {
        try {
          const response = await getDYKContent({ contentId: contentId }).unwrap();
          const data = response.data;
          if (data) {
            const newTemplate = doYouKnowTemplates.find((t) => t.id === data.templateId) || doYouKnowTemplates[0];
            setSelectedTemplate(newTemplate);

            const updatedSlide: DoYouKnowSlide = {
              ...newTemplate.slides[0],
              title: data.content.title || newTemplate.slides[0].title,
              fact: data.content.fact || newTemplate.slides[0].fact,
              footer: data.content.footer || newTemplate.slides[0].footer || '',
              websiteUrl: data.content.websiteUrl || newTemplate.slides[0].websiteUrl || '',
              imageUrl: data.content.imageUrl || newTemplate.slides[0].imageUrl || '',
            };

            await preloadSlideImages(updatedSlide);
            setSlide(updatedSlide);
            setCustomTitle(updatedSlide.title);
            setCustomFact(updatedSlide.fact);
            setCustomFooter(updatedSlide.footer || '');
            setCustomWebsiteUrl(updatedSlide.websiteUrl || '');
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Error fetching DoYouKnowContent:', error);
          initializeSlide();
        }
      } else {
        initializeSlide();
      }
    };
    fetchDoYouKnowContent();
  }, [contentId, contentType, isInitialized]);

  const preloadSlideImages = async (slide: DoYouKnowSlide) => {
    const images = [slide.imageUrl, showLogo ? defaultLogoUrl : ''].filter(Boolean);
    await Promise.all(
      images.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url || '';
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(undefined);
            img.onerror = () => resolve(undefined);
          })
      )
    );
  };

  const initializeSlide = async () => {
    if (isInitialized) return;

    const updatedSlide = {
      ...selectedTemplate.slides[0],
      title: initialSlide?.title || selectedTemplate.slides[0].title,
      fact: initialSlide?.fact || selectedTemplate.slides[0].fact,
      footer: initialSlide?.footer || selectedTemplate.slides[0].footer || '',
      websiteUrl: initialSlide?.websiteUrl || selectedTemplate.slides[0].websiteUrl || '',
      imageUrl: initialSlide?.imageUrl || selectedTemplate.slides[0].imageUrl,
    };
    await preloadSlideImages(updatedSlide);
    setSlide(updatedSlide);
    setCustomTitle(updatedSlide.title);
    setCustomFact(updatedSlide.fact);
    setCustomFooter(updatedSlide.footer || '');
    setCustomWebsiteUrl(updatedSlide.websiteUrl || '');

    if (onImagesGenerated) {
      const image = await captureScreenshot(updatedSlide);
      if (image) onImagesGenerated(image);
    }

    setIsInitialized(true);
  };

  useEffect(() => {
    const updateSlide = async () => {
      const updatedSlide = {
        ...slide,
        title: customTitle,
        fact: customFact,
        footer: customFooter,
        websiteUrl: customWebsiteUrl,
        imageUrl: slide.imageUrl,
      };
      await preloadSlideImages(updatedSlide);
      setSlide(updatedSlide);

      if (onImagesGenerated) {
        const image = await captureScreenshot(updatedSlide);
        if (image) onImagesGenerated(image);
      }
    };
    updateSlide();
  }, [customTitle, customFact, customFooter, customWebsiteUrl, showLogo, onImagesGenerated]);

  const captureScreenshot = async (slideToCapture: DoYouKnowSlide) => {
    if (!slideRef.current) return '';
    await preloadSlideImages(slideToCapture);
    const canvas = await html2canvas(slideRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#1A2526',
      logging: true,
    });
    return canvas.toDataURL('image/png');
  };

  const handleBack = () => {
    navigate("/auto", {state: {postContentId: postContentId}});
  };

  const handleGenerateContent = async () => {
    if (!selectedIdea?.title) {
      alert('No topic selected. Please select a content idea first.');
      return;
    }

    try {
      const response = await generateDoYouKnow({ topic: selectedIdea.title }).unwrap();
      const generatedContent = response.data;

      setCustomTitle(generatedContent.title || 'DID YOU KNOW?');
      setCustomFact(generatedContent.description || 'No description provided.');
      setCustomFooter('bitrox.tech');
      setCustomWebsiteUrl('https://bitrox.tech');

      setSlide({
        ...slide,
        title: generatedContent.title || 'DID YOU KNOW?',
        fact: generatedContent.description || 'No description provided.',
        footer: 'bitrox.tech',
        websiteUrl: 'https://bitrox.tech',
      });
    } catch (error: any) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!slideRef.current || !slide) {
      alert('Slide not rendered yet. Please try again.');
      return;
    }

    setIsUploading(true);
    try {
      await preloadSlideImages(slide);

      const canvas = await html2canvas(slideRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#1A2526',
        logging: true,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b as Blob), 'image/png');
      });

      const formData = new FormData();
      formData.append('image', blob, 'do-you-know-slide.png');

      const result = await uploadImageToCloudinary(formData).unwrap();
      const cloudinaryUrl = result?.data?.secure_url;

      if (!cloudinaryUrl) throw new Error('Failed to get Cloudinary URL');

      const updatePostData = await updatePost({
        contentId: contentId,
        contentType: 'DYKContent',
        images: [{url: cloudinaryUrl, label: "DoYouKnow Post"}]
      }).unwrap();

      dispatch(setSelectedFile({ name: 'do-you-know-slide.png', url: cloudinaryUrl }));

      if (onSave && slideRef.current) {
        onSave(slide, slideRef.current);
      } else {
        navigate('/auto', {
          state: {
            postContentId: updatePostData.data?.postContentId
          },
        });
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      alert('Failed to process and upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!slide || isFetchingContent) {
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
            <span className="text-lg font-medium">Back to Posts</span>
          </motion.button>
          
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Did You Know Editor
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
                { id: 'content', icon: <Type className="w-5 h-5" />, label: 'Content' },
                { id: 'design', icon: <ImageIcon className="w-5 h-5" />, label: 'Design' },
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

                    <motion.button
                      onClick={handleGenerateContent}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                    >
                      <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Generate Content'}
                    </motion.button>
                  </>
                )}

                {activeTab === 'design' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Template Style</label>
                      <select
                        value={selectedTemplate.id}
                        onChange={(e) => {
                          const template = doYouKnowTemplates.find((t) => t.id === e.target.value);
                          if (template) setSelectedTemplate(template);
                        }}
                        className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {doYouKnowTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
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
              </motion.div>
            </AnimatePresence>

            <motion.button
              onClick={handleSave}
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