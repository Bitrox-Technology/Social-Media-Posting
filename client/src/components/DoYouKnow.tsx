import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedFile, setSelectedDoYouKnowTemplate } from '../store/appSlice';
import { useUploadImageToCloudinaryMutation, useGenerateDoYouKnowMutation } from '../store/api';
import { DoYouKnowSlide, doYouKnowTemplates } from '../templetes/doYouKnowTemplates';
import { ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';

interface DoYouKnowProps {}

export const DoYouKnow: React.FC<DoYouKnowProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedDoYouKnowTemplate = useAppSelector((state) => state.app.selectedDoYouKnowTemplate);
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);
  const { generatedImageUrl, showLogo: initialShowLogo, defaultLogoUrl } = location.state || {};

  const [slide, setSlide] = useState<DoYouKnowSlide | null>(null);
  const [showLogo, setShowLogo] = useState<boolean>(initialShowLogo !== undefined ? initialShowLogo : true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customFact, setCustomFact] = useState<string>('');
  const [customFooter, setCustomFooter] = useState<string>('');
  const [customWebsiteUrl, setCustomWebsiteUrl] = useState<string>('');

  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [generateDoYouKnow, { isLoading: isGenerating }] = useGenerateDoYouKnowMutation();
  const slideRef = useRef<HTMLDivElement>(null);

  const selectedTemplate = doYouKnowTemplates.find((template) => template.id === selectedDoYouKnowTemplate);

  const preloadSlideImages = async (slide: DoYouKnowSlide) => {
    const images = [generatedImageUrl || slide.imageUrl, showLogo ? defaultLogoUrl : ''].filter(Boolean);
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

  useEffect(() => {
    const loadSlide = async () => {
      if (selectedTemplate) {
        const slideToRender = selectedTemplate.slides[0];
        if (slideToRender) {
          await preloadSlideImages(slideToRender);
          const updatedSlide = {
            ...slideToRender,
            imageUrl: generatedImageUrl || slideToRender.imageUrl,
            title: customTitle || slideToRender.title,
            fact: customFact || slideToRender.fact,
            footer: customFooter || slideToRender.footer,
            websiteUrl: customWebsiteUrl || slideToRender.websiteUrl,
          };
          setSlide(updatedSlide);
          if (!customTitle) setCustomTitle(slideToRender.title);
          if (!customFact) setCustomFact(slideToRender.fact);
          if (!customFooter) setCustomFooter(slideToRender.footer);
          if (!customWebsiteUrl) setCustomWebsiteUrl(slideToRender.websiteUrl);
        }
      }
    };

    loadSlide();
  }, [selectedTemplate, generatedImageUrl, showLogo, defaultLogoUrl, customTitle, customFact, customFooter, customWebsiteUrl]);

  const handleBack = () => {
    dispatch(setSelectedDoYouKnowTemplate(null));
    navigate('/images', { state: { generatedImageUrl } });
  };

  const handleGenerateContent = async () => {
    if (!selectedIdea?.title) {
      alert('No topic selected. Please select a content idea first.');
      return;
    }

    try {
      const response = await generateDoYouKnow({ topic: selectedIdea.title }).unwrap();
      console.log('Generated content:', response.data);
      const generatedContent = response.data;


      setCustomTitle(generatedContent.title || 'DID YOU KNOW?');
      setCustomFact(generatedContent.description || 'No description provided.');
      setCustomFooter('bitrox.tech');
      setCustomWebsiteUrl('https://bitrox.tech');

      if (slide) {
        setSlide({
          ...slide,
          title: generatedContent.title || 'DID YOU KNOW?',
          fact: generatedContent.description || 'No description provided.',
          footer: 'bitrox.tech',
          websiteUrl: 'https://bitrox.tech',
        });
      }
    } catch (error: any) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    }
  };

  const handleContinueToPost = async () => {
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

      setTimeout(() => {
        navigate('/post', { state: { cloudinaryUrl, generatedImageUrl } });
      }, 3000);
    } catch (error) {
      console.error('Error in handleContinueToPost:', error);
      alert('Failed to process and upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!selectedTemplate) {
    return <div className="text-white">No template selected. Please go back and select a template.</div>;
  }

  if (!slide) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Template Preview */}
          <motion.div
            className="lg:w-1/1 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
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

          {/* Right Side: Content Editor */}
          <motion.div
            className="lg:w-1/2 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">Edit Content</h2>
            <div className="space-y-4">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  value={customTitle || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setCustomTitle(newValue);
                    if (slide) setSlide({ ...slide, title: newValue });
                  }}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                  placeholder="Enter the title (e.g., DID YOU KNOW?)"
                />
              </div>

              {/* Fact Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Fact</label>
                <textarea
                  value={customFact || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setCustomFact(newValue);
                    if (slide) setSlide({ ...slide, fact: newValue });
                  }}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600 h-24 resize-none"
                  placeholder="Enter the 'Do You Know' fact here..."
                />
              </div>

              {/* Username (Footer) Input */}
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
                      if (slide) setSlide({ ...slide, footer: newValue });
                    }}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                    placeholder="Enter the username (e.g., bitrox.tech)"
                  />
                </div>
              </div>

              {/* Website URL Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Website URL (Optional)</label>
                <input
                  type="text"
                  value={customWebsiteUrl || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setCustomWebsiteUrl(newValue);
                    if (slide) setSlide({ ...slide, websiteUrl: newValue });
                  }}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                  placeholder="Enter the website URL (e.g., https://bitrox.tech)"
                />
              </div>

              {/* Generate Content Button */}
              <motion.button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isGenerating ? 'Generating...' : 'Generate Content'}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Fixed Continue to Post Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={handleContinueToPost}
            disabled={isUploading}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:from-green-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isUploading ? 'Uploading...' : 'Continue to Post'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};