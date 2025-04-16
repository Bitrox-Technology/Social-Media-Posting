import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedFile } from '../../store/appSlice';
import { useUploadImageToCloudinaryMutation, useGenerateDoYouKnowMutation, useLazyGetDYKContentQuery } from '../../store/api';
import { DoYouKnowSlide, doYouKnowTemplates } from '../../templetes/doYouKnowTemplates';
import { ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';

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

  const { contentId, contentType, fromAutoPostCreator } = location.state || {};

  // Initialize selectedTemplate
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

  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [generateDoYouKnow, { isLoading: isGenerating }] = useGenerateDoYouKnowMutation();
  const [getDYKContent, { isFetching: isFetchingContent }] = useLazyGetDYKContentQuery();
  const slideRef = useRef<HTMLDivElement>(null);

  // Fetch DoYouKnowContent if contentId exists
  useEffect(() => {
    const fetchDoYouKnowContent = async () => {
      if (contentId && contentType === 'DYKContent' && !isInitialized) {
        try {
          const response = await getDYKContent({ contentId: contentId }).unwrap();
          const data = response.data;
          console.log('Fetched DoYouKnowContent:', data);
          if (data) {
            // Update selectedTemplate based on data.templateId
            const newTemplate = doYouKnowTemplates.find((t) => t.id === data.templateId) || doYouKnowTemplates[0];
            setSelectedTemplate(newTemplate);

            // Update slide with fetched content and new template
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
    navigate(fromAutoPostCreator ? '/auto-post-creator' : '/topic');
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

      dispatch(setSelectedFile({ name: 'do-you-know-slide.png', url: cloudinaryUrl }));

      if (onSave && slideRef.current) {
        onSave(slide, slideRef.current);
      } else {
        navigate('/auto', {
          state: {
            updatedPost: {
              topic: selectedIdea?.title,
              type: 'doyouknow',
              content: slide,
              images: [{ url: cloudinaryUrl, label: 'Do You Know Post' }],
              templateId: selectedTemplate.id,
              status: 'success',
              contentId,
              contentType,
            },
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
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            Create Your "Do You Know" Post
          </h1>
        </div>

        <motion.div
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Template Preview</h2>
          <div
            ref={slideRef}
            className="relative rounded-xl overflow-hidden max-w-2xl max-h-[600px] mx-auto"
            style={{
              background: 'linear-gradient(180deg, #1A2526 0%, #0F1516 100%)',
              width: '500px',
              height: '700px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              boxSizing: 'border-box',
            }}
          >
            {selectedTemplate.renderSlide(slide, showLogo, defaultLogoUrl)}
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              checked={showLogo}
              onChange={(e) => setShowLogo(e.target.checked)}
              className="w-5 h-5 text-yellow-400 border-gray-600 rounded focus:ring-2 focus:ring-yellow-400"
            />
            <label className="text-gray-300">Add Logo</label>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Edit Content</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Title</label>
              <input
                type="text"
                value={customTitle || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomTitle(newValue);
                  setSlide({ ...slide, title: newValue });
                }}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                placeholder="Enter the title (e.g., DID YOU KNOW?)"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Fact</label>
              <textarea
                value={customFact || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomFact(newValue);
                  setSlide({ ...slide, fact: newValue });
                }}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600 h-24 resize-none"
                placeholder="Enter the 'Do You Know' fact here..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Username (e.g., @bitrox.tech)</label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">@</span>
                <input
                  type="text"
                  value={customFooter || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setCustomFooter(newValue);
                    setSlide({ ...slide, footer: newValue });
                  }}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                  placeholder="Enter the username (e.g., bitrox.tech)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Website URL (Optional)</label>
              <input
                type="text"
                value={customWebsiteUrl || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomWebsiteUrl(newValue);
                  setSlide({ ...slide, websiteUrl: newValue });
                }}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                placeholder="Enter the website URL (e.g., https://bitrox.tech)"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </motion.button>

              {(!onImagesGenerated || onSave) && (
                <motion.button
                  onClick={handleSave}
                  disabled={isUploading}
                  className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-green-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isUploading ? 'Uploading...' : 'Save'}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};