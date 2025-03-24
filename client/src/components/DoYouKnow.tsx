import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedFile, setSelectedDoYouKnowTemplate } from '../store/appSlice';
import { useUploadImageToCloudinaryMutation } from '../store/api';
import { DoYouKnowSlide, doYouKnowTemplates } from '../templetes/doYouKnowTemplates';
import { ArrowLeft } from 'lucide-react';

interface DoYouKnowProps {
  // No props needed since we'll get everything from Redux and location.state
}

export const DoYouKnow: React.FC<DoYouKnowProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get the selected template ID from Redux
  const selectedDoYouKnowTemplate = useAppSelector((state) => state.app.selectedDoYouKnowTemplate);

  // Get data from location.state
  const { generatedImageUrl, showLogo: initialShowLogo, defaultLogoUrl } = location.state || {};

  const [slide, setSlide] = useState<DoYouKnowSlide | null>(null);
  const [showLogo, setShowLogo] = useState<boolean>(initialShowLogo !== undefined ? initialShowLogo : true);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();

  // Find the selected template
  const selectedTemplate = doYouKnowTemplates.find((template) => template.id === selectedDoYouKnowTemplate);

  useEffect(() => {
    const preloadSlideImages = async (slide: DoYouKnowSlide) => {
      const images = [
        generatedImageUrl || slide.imageUrl,
        showLogo ? defaultLogoUrl : '',
      ].filter(Boolean);
      await Promise.all(
        images.map(
          (url) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = url || '';
              img.onload = () => {
                console.log(`Successfully loaded: ${url}`);
                resolve(undefined);
              };
              img.onerror = () => {
                console.error(`Failed to load: ${url}`);
                resolve(undefined);
              };
            })
        )
      );
    };

    const loadSlide = async () => {
      if (selectedTemplate) {
        const slideToRender = selectedTemplate.slides[0]; // Since there's only one slide
        if (slideToRender) {
          await preloadSlideImages(slideToRender);
          // Update the slide's imageUrl with the generated image if available
          const updatedSlide = {
            ...slideToRender,
            imageUrl: generatedImageUrl || slideToRender.imageUrl,
          };
          setSlide(updatedSlide);
        }
      }
    };

    loadSlide();
  }, [selectedTemplate, generatedImageUrl, showLogo, defaultLogoUrl]);

  const handleBack = () => {
    // Clear the selected template from Redux
    dispatch(setSelectedDoYouKnowTemplate(null));
    navigate('/images', { state: { generatedImageUrl } });
  };

  const handleContinueToPost = async () => {
    if (generatedImageUrl) {
      setIsUploading(true);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');

        const image = new window.Image();
        const logo = new window.Image();

        image.crossOrigin = 'Anonymous';
        logo.crossOrigin = 'Anonymous';

        image.src = generatedImageUrl;
        logo.src = defaultLogoUrl;

        await Promise.all([
          new Promise<void>((resolve) => {
            image.onload = () => resolve();
            image.onerror = () => { throw new Error('Failed to load generated image'); };
          }),
          new Promise<void>((resolve) => {
            logo.onload = () => resolve();
            logo.onerror = () => { throw new Error('Failed to load logo image'); };
          }),
        ]);

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        if (showLogo) {
          const logoWidth = 128;
          const logoHeight = 48;
          const padding = 16;

          const logoX = canvas.width - logoWidth - padding;
          const logoY = padding;

          const logoAspectRatio = logo.width / logo.height;
          const scaledLogoWidth = Math.min(logoWidth, logoHeight * logoAspectRatio);
          const scaledLogoHeight = scaledLogoWidth / logoAspectRatio;

          ctx.drawImage(logo, 0, 0, logo.width, logo.height, logoX, logoY, scaledLogoWidth, scaledLogoHeight);
        }

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b as Blob), 'image/png');
        });

        const formData = new FormData();
        formData.append('image', blob, 'generated-image.png');

        const result = await uploadImageToCloudinary(formData).unwrap();
        const cloudinaryUrl = result?.data?.secure_url;

        dispatch(setSelectedFile({ name: 'generated-image.png', url: cloudinaryUrl }));

        setTimeout(() => {
          navigate('/post', { state: { cloudinaryUrl, generatedImageUrl } });
        }, 5000);
      } catch (error) {
        console.error('Error in handleContinueToPost:', error);
        alert('Failed to process and upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      dispatch(setSelectedFile(null));
      navigate('/post');
    }
  };

  if (!selectedTemplate) {
    return <div className="text-white">No template selected. Please go back and select a template.</div>;
  }

  if (!slide) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-white mb-2">Preview Your "Do You Know" Post</h2>
            <p className="text-gray-400">Review your selected template and proceed to post.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="relative rounded-xl overflow-hidden max-w-3xl max-h-[500px] mx-auto">
          <div className="relative">
            {selectedTemplate.renderSlide(slide, showLogo, defaultLogoUrl)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showLogo}
            onChange={(e) => setShowLogo(e.target.checked)}
            className="text-blue-600"
          />
          <label className="text-white">Add Logo</label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleContinueToPost}
          disabled={isUploading}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Continue to Post'}
        </button>
      </div>
    </div>
  );
};