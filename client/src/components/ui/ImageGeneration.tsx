import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setSelectedFile } from '../../store/appSlice';
import {
  useUploadImageToCloudinaryMutation,
  useGenerateImageMutation,
  useGenerateImageContentMutation,
  useLazyGetImageContentQuery,
} from '../../store/api';
import { imageTemplates, ImageSlide } from '../../templetes/ImageTemplate';
import { ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';

interface ImageGenerationProps {
  onImagesGenerated?: (image: string) => void;
  onSave?: (updatedSlide: ImageSlide, ref: HTMLDivElement) => void;
  initialSlide?: { title: string; description: string; footer?: string; websiteUrl?: string; imageUrl?: string };
  templateId?: string;
  topic?: string;
}

export const ImageGeneration: React.FC<ImageGenerationProps> = ({
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

  const {
    templateId: locationTemplateId,
    fromAutoPostCreator,
    generatedImageUrl,
    generatedContent,
    contentId,
    contentType,
  } = location.state || {};

  // Initialize selectedTemplate with fallback
  const [selectedTemplate, setSelectedTemplate] = useState(
    imageTemplates.find((t) => t.id === (templateId || locationTemplateId)) || imageTemplates[0]
  );

  // Initialize slide
  const [slide, setSlide] = useState<ImageSlide>(() => {
    const content = generatedContent || initialSlide;
    if (content) {
      return {
        ...selectedTemplate.slides[0],
        title: content.title || selectedTemplate.slides[0].title,
        description: content.description || selectedTemplate.slides[0].description,
        footer: content.footer || selectedTemplate.slides[0].footer || '',
        websiteUrl: content.websiteUrl || selectedTemplate.slides[0].websiteUrl || '',
        imageUrl: content.imageUrl || selectedTemplate.slides[0].imageUrl || '',
      };
    }
    return selectedTemplate.slides[0];
  });

  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>(slide.title);
  const [customDescription, setCustomDescription] = useState<string>(slide.description);
  const [customFooter, setCustomFooter] = useState<string>(slide.footer || '');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [generateImage, { isLoading: isGeneratingImage }] = useGenerateImageMutation();
  const [generateImageContent, { isLoading: isGeneratingContent }] = useGenerateImageContentMutation();
  const [getImageContent, { isFetching: isFetchingContent }] = useLazyGetImageContentQuery();
  const slideRef = useRef<HTMLDivElement>(null);

  // Fetch ImageContent if contentId and contentType are provided
  useEffect(() => {
    const fetchImageContent = async () => {
      if (contentId && contentType === 'ImageContent' && !isInitialized) {
        try {
          const response = await getImageContent({ contentId: contentId }).unwrap();
          const data = response.data;
          console.log('Fetched ImageContent:', data);

          if (data) {
            // Update selectedTemplate based on data.templateId
            const newTemplate = imageTemplates.find((t) => t.id === data.templateId) || imageTemplates[0];
            setSelectedTemplate(newTemplate);

            // Update slide with fetched content and new template
            const updatedSlide: ImageSlide = {
              ...newTemplate.slides[0],
              title: data.content.title || '',
              description: data.content.description || '',
              footer: data.content.footer ||  '',
              websiteUrl: data.content.websiteUrl || '',
              imageUrl: data.content.imageUrl || '',
            };

            await preloadSlideImages(updatedSlide);
            setSlide(updatedSlide);
            setCustomTitle(updatedSlide.title);
            setCustomDescription(updatedSlide.description);
            setCustomFooter(updatedSlide.footer || '');
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

  const preloadSlideImages = async (slide: ImageSlide) => {
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
      };
    }

    await preloadSlideImages(updatedSlide);
    setSlide(updatedSlide);
    setCustomTitle(updatedSlide.title);
    setCustomDescription(updatedSlide.description);
    setCustomFooter(updatedSlide.footer || '');

    if (onImagesGenerated && updatedSlide.imageUrl) {
      const image = await captureScreenshot();
      if (image) onImagesGenerated(image);
    }

    setIsInitialized(true);
  };

  useEffect(() => {
    const updateSlide = async () => {
      const updatedSlide = {
        ...slide,
        title: customTitle,
        description: customDescription,
        footer: customFooter,
        websiteUrl: slide.websiteUrl || '',
        imageUrl: slide.imageUrl || '',
      };
      await preloadSlideImages(updatedSlide);
      setSlide(updatedSlide);

      if (onImagesGenerated && updatedSlide.imageUrl) {
        const image = await captureScreenshot();
        if (image) onImagesGenerated(image);
      }
    };
    updateSlide();
  }, [customTitle, customDescription, customFooter, showLogo, onImagesGenerated]);

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

  const handleGenerateImage = async () => {
    try {
      if (!topic) {
        throw new Error('Topic is required to generate an image.');
      }
      const response = await generateImage({ prompt: topic }).unwrap();
      const generatedImageUrl = response.data;
      const updatedSlide = { ...slide, imageUrl: generatedImageUrl || '' };
      setSlide(updatedSlide);

      await preloadSlideImages(updatedSlide);
      if (onImagesGenerated) {
        const image = await captureScreenshot();
        if (image) onImagesGenerated(image);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  const handleGenerateContent = async () => {
    if (!topic) return;
    try {
      const contentResponse = await generateImageContent({ topic }).unwrap();
      const { title, description } = contentResponse.data;
      setCustomTitle(title);
      setCustomDescription(description);
      setSlide({ ...slide, title, description });
    } catch (error) {
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
        backgroundColor: null,
        logging: true,
        windowWidth: 500,
        windowHeight: 700,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b as Blob), 'image/png');
      });

      const formData = new FormData();
      formData.append('image', blob, 'image-slide.png');

      const result = await uploadImageToCloudinary(formData).unwrap();
      const cloudinaryUrl = result?.data?.secure_url;

      if (!cloudinaryUrl) throw new Error('Failed to get Cloudinary URL');

      dispatch(setSelectedFile({ name: 'image-slide.png', url: cloudinaryUrl }));

      if (onSave && slideRef.current) {
        onSave(slide, slideRef.current);
      }

      if (fromAutoPostCreator) {
        navigate('/auto', {
          state: {
            updatedPost: {
              topic,
              type: 'image',
              content: slide,
              images: [{ url: cloudinaryUrl, label: 'Image Post' }],
              templateId: selectedTemplate.id,
              status: 'success',
              contentId,
              contentType,
            },
          },
        });
      } else {
        setTimeout(() => {
          navigate('/post', { state: { cloudinaryUrl } });
        }, 3000);
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      alert('Failed to process and upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    if (fromAutoPostCreator) {
      navigate('/auto-post-creator');
    } else {
      navigate('/auto-post-creator');
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
            Create Your Image Post
          </h1>
        </div>

        <motion.div
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Image Preview</h2>
          <div
            ref={slideRef}
            className="relative rounded-xl overflow-hidden max-w-2xl max-h-[600px] mx-auto shadow-none"
            style={{
              width: '500px',
              height: '700px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
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
                value={customTitle}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomTitle(newValue);
                  setSlide((prev) => ({ ...prev, title: newValue }));
                }}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                placeholder="Enter the title (e.g., MENTAL HEALTH INTEGRATION)"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                value={customDescription}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setCustomDescription(newValue);
                  setSlide((prev) => ({ ...prev, description: newValue }));
                }}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600 h-24 resize-none"
                placeholder="Enter the description (e.g., The integration of mental health services into healthcare is crucial for holistic well-being...)"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Footer (e.g., @bitrox.tech)</label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">@</span>
                <input
                  type="text"
                  value={customFooter}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setCustomFooter(newValue);
                    setSlide((prev) => ({ ...prev, footer: newValue }));
                  }}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                  placeholder="Enter the footer (e.g., bitrox.tech)"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleSave}
                disabled={isUploading}
                className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg hover:from-green-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isUploading ? 'Uploading...' : 'Save'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};