import React, { useState, useEffect } from 'react';
import { Image, Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedFile } from '../store/appSlice';
import { useGenerateImageMutation, useUploadImageToCloudinaryMutation } from '../store/api';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

interface ImageGeneratorProps {
  contentType: 'post' | 'reel';
}


export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ contentType }) => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [postCreationOption, setPostCreationOption] = useState<'withImage' | 'withoutImage'>('withImage');
  const [postType, setPostType] = useState<'single' | 'carousel' | 'festival'>('single');
  const [carouselImageOption, setCarouselImageOption] = useState<'withImage' | 'withoutImage'>('withImage');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const localContentIdea = useAppSelector((state) => state.app.selectedIdea) as ContentIdea | null;

  const [generateImage] = useGenerateImageMutation();
  const [uploadImageToCloudinary, { isLoading: isUploading }] = useUploadImageToCloudinaryMutation();

  const defaultLogoUrl = '/images/Logo.png';

  useEffect(() => {
    if (location.state && (location.state as any).generatedImageUrl) {
      setGeneratedImageUrl((location.state as any).generatedImageUrl);
      if (postType !== 'carousel') {
        setShowOptions(true);
      }
    }
  }, [location.state, postType]);

  const handleGenerateImage = async () => {
    if (!localContentIdea || !localContentIdea.title) {
      alert('Please provide a content idea with a title to generate an image.');
      return;
    }

    const prompt = `${localContentIdea.title} ${localContentIdea.content}`;
    setIsGenerating(true);
    try {
      const response = await generateImage({ prompt }).unwrap();
      const imageUrl = response.data;
      if (!imageUrl) {
        throw new Error('No image URL returned from API');
      }
      setGeneratedImageUrl(imageUrl);

      if (postType !== 'carousel') {
        setShowOptions(true);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinueToPost = async () => {
    if (generatedImageUrl) {
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
            image.onerror = () => {
              throw new Error('Failed to load generated image');
            };
          }),
          new Promise<void>((resolve) => {
            logo.onload = () => resolve();
            logo.onerror = () => {
              throw new Error('Failed to load logo image');
            };
          }),
        ]);

        canvas.width = image.width;
        canvas.height = image.height;

        console.log('Canvas dimensions:', canvas.width, canvas.height);

        ctx.drawImage(image, 0, 0);

        if (showLogo && (postType === 'single' || postType === 'festival')) {
          const logoWidth = 128; // w-32 = 128px
        const logoHeight = 48; // h-12 = 48px
        const padding = 16; // right-4 and top-4 = 16px

        // Calculate the logo's position (top-right corner)
        const logoX = canvas.width - logoWidth - padding; // Absolute right position
        const logoY = padding; // Absolute top position

        // Calculate the scaling factor to maintain aspect ratio
        const logoAspectRatio = logo.width / logo.height;
        const scaledLogoWidth = Math.min(logoWidth, logoHeight * logoAspectRatio);
        const scaledLogoHeight = scaledLogoWidth / logoAspectRatio;

        // Draw the logo with object-contain behavior
        ctx.drawImage(
          logo,
          0, // Source x
          0, // Source y
          logo.width, // Source width
          logo.height, // Source height
          logoX, // Destination x
          logoY, // Destination y
          scaledLogoWidth, // Destination width
          scaledLogoHeight // Destination height
        );
        }

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b as Blob), 'image/png');
        });

        console.log('Blob:', blob);

        const formData = new FormData();
        formData.append('image', blob, 'generated-image.png');

        const result = await uploadImageToCloudinary(formData).unwrap();
        console.log('Cloudinary upload result:', result);
        const cloudinaryUrl = result?.data?.secure_url;

        console.log('Cloudinary URL:', cloudinaryUrl);
       

        dispatch(
          setSelectedFile({
            name: 'generated-image.png',
            url: cloudinaryUrl,
          })
        );

        setTimeout(() => {
          navigate('/post', { state: { cloudinaryUrl, generatedImageUrl } });
        }, 5000);
      } catch (error) {
        console.error('Error in handleContinueToPost:', error);
        alert('Failed to process and upload image. Please try again.');
      }
    }else{
      dispatch(
        setSelectedFile(null)
      )
      navigate('/post')
        
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    navigate('/carousel', {
      state: {
        initialImage: generatedImageUrl,
        template,
        topic: localContentIdea?.title,
        generatedImageUrl,
      },
    });
  };

  const handleProceed = () => {
    if (postCreationOption === 'withoutImage') {
      handleContinueToPost();
    } else if (postType === 'carousel') {
      if (!selectedTemplate) {
        alert('Please select a carousel template to proceed.');
      } else {
        handleTemplateSelect(selectedTemplate);
      }
    } else {
      handleGenerateImage();
    }
  };

  const handleBack = () => {
    navigate(-1 as any, { state: { generatedImageUrl } });
  };

  const shouldShowGenerateButton =
    postCreationOption === 'withImage' &&
    (postType === 'single' || postType === 'festival' || (postType === 'carousel' && carouselImageOption === 'withImage'));

  const carouselTemplates = [
    '/images/background.png',
    '/images/background1.png',
    '/images/graphic.jpg',
    '/images/2.png',
    '/images/1.jpg',
  ];

  return (
    <div className="space-y-8">
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
            <h2 className="text-2xl font-semibold text-white mb-2">Generate Your Image</h2>
            <p className="text-gray-400">
              Generate an image based on your content idea: {localContentIdea?.title || 'Not provided'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Create Post</h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="postCreationOption"
                value="withImage"
                checked={postCreationOption === 'withImage'}
                onChange={() => setPostCreationOption('withImage')}
                className="text-blue-600"
              />
              <span className="text-white">With Image</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="postCreationOption"
                value="withoutImage"
                checked={postCreationOption === 'withoutImage'}
                onChange={() => setPostCreationOption('withoutImage')}
                className="text-blue-600"
              />
              <span className="text-white">Without Image</span>
            </label>
          </div>
        </div>

        {postCreationOption === 'withImage' && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Select Post Type</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="postType"
                  value="single"
                  checked={postType === 'single'}
                  onChange={() => setPostType('single')}
                  className="text-blue-600"
                />
                <span className="text-white">Single Image Posting</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="postType"
                  value="carousel"
                  checked={postType === 'carousel'}
                  onChange={() => setPostType('carousel')}
                  className="text-blue-600"
                />
                <span className="text-white">Carousel Image</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="postType"
                  value="festival"
                  checked={postType === 'festival'}
                  onChange={() => setPostType('festival')}
                  className="text-blue-600"
                />
                <span className="text-white">Festival</span>
              </label>
            </div>
          </div>
        )}

        {postCreationOption === 'withImage' && postType === 'carousel' && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Carousel Image Options</h3>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="carouselImageOption"
                  value="withImage"
                  checked={carouselImageOption === 'withImage'}
                  onChange={() => setCarouselImageOption('withImage')}
                  className="text-blue-600"
                />
                <span className="text-white">With Image</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="carouselImageOption"
                  value="withoutImage"
                  checked={carouselImageOption === 'withoutImage'}
                  onChange={() => setCarouselImageOption('withoutImage')}
                  className="text-blue-600"
                />
                <span className="text-white">Without Image</span>
              </label>
            </div>
          </div>
        )}

        {postCreationOption === 'withImage' && postType === 'carousel' && carouselImageOption === 'withImage' && !generatedImageUrl && (
          <div className="flex justify-end">
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating || !localContentIdea?.title}
              className="flex items-center px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Image className="w-5 h-5 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </button>
          </div>
        )}

        {postCreationOption === 'withImage' &&
          (postType === 'single' || postType === 'festival' || (postType === 'carousel' && carouselImageOption === 'withImage')) &&
          generatedImageUrl && !showOptions && (
            <div className="grid grid-cols-1 gap-6">
              <div className="relative rounded-xl max-w-3xl max-h-[500px] mx-auto">
                {contentType === 'post' ? (
                  <div className="relative">
                    <img
                      src={generatedImageUrl}
                      alt="Generated Image"
                      className="w-full h-full object-contain"
                    />
                    {(postType === 'single' || postType === 'festival') && showLogo && (
                      <img
                        src={defaultLogoUrl}
                        alt="Logo"
                        className="absolute right-4 top-4 w-32 h-12 object-contain z-10"
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-white">Reels are not supported for generation in this example.</p>
                )}
              </div>
              {(postType === 'single' || postType === 'festival') && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="text-blue-600"
                  />
                  <label className="text-white">Add Logo</label>
                </div>
              )}
            </div>
          )}

        {postCreationOption === 'withImage' &&
          postType === 'carousel' &&
          (carouselImageOption === 'withoutImage' || (carouselImageOption === 'withImage' && generatedImageUrl)) && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Select a Carousel Template</h3>
              <div className="grid grid-cols-3 gap-6">
                {carouselTemplates.map((template, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden cursor-pointer group aspect-[3/4] ${
                      selectedTemplate === template ? 'ring-2 ring-yellow-500' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <img
                      src={template}
                      alt={`Carousel Template ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-yellow-500 rounded-full p-2">
                        {selectedTemplate === template ? (
                          <Check className="w-6 h-6 text-black" />
                        ) : (
                          <Image className="w-6 h-6 text-black" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="flex justify-end">
          <button
            onClick={handleProceed}
            disabled={isGenerating || isUploading || !localContentIdea?.title}
            className="flex items-center px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Image className="w-5 h-5 mr-2" />
            {isGenerating
              ? 'Generating...'
              : isUploading
              ? 'Uploading...'
              : shouldShowGenerateButton && postType !== 'carousel'
              ? 'Generate Image and Proceed'
              : 'Proceed'}
          </button>
        </div>
      </div>

      {showOptions && (
        <div className="space-y-6">
          {generatedImageUrl && (
            <div className="grid grid-cols-1 gap-6">
              <div className="relative rounded-xl overflow-hidden max-w-3xl max-h-[500px] mx-auto">
                <div className="relative">
                  <img
                    src={generatedImageUrl}
                    alt="Generated Image"
                    className="w-full h-full object-contain"
                  />
                  {(postType === 'single' || postType === 'festival') && showLogo && (
                    <img
                      src={defaultLogoUrl}
                      alt="Logo"
                      className="absolute right-14 top-10 w-40 h-12 object-contain z-10"
                    />
                  )}
                </div>
              </div>
              {(postType === 'single' || postType === 'festival') && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="text-blue-600"
                  />
                  <label className="text-white">Add Logo</label>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleContinueToPost}
              disabled={isUploading}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Continue to Post'}
            </button>
            {postType !== 'carousel' && (
              <button
                onClick={() => setShowOptions(false)}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
              >
                Back to Options
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};