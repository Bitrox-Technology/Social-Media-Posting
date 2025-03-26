import React, { useState, useEffect } from 'react';
import { Image, Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedFile, setSelectedDoYouKnowTemplate } from '../store/appSlice';
import { useGenerateImageMutation, useUploadImageToCloudinaryMutation } from '../store/api';
import { carouselTemplates } from '../templetes/templetesDesign';
import { doYouKnowTemplates } from '../templetes/doYouKnowTemplates';

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
  const [postType, setPostType] = useState<'single' | 'carousel' | 'festival' | 'doYouKnow'>('single');
  const [carouselImageOption, setCarouselImageOption] = useState<'withImage' | 'withoutImage'>('withImage');
  const [doYouKnowImageOption, setDoYouKnowImageOption] = useState<'withImage' | 'withoutImage'>('withImage');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDoYouKnowTemplate, setLocalSelectedDoYouKnowTemplate] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const localContentIdea = useAppSelector((state) => state.app.selectedIdea) as ContentIdea | null;

  const [generateImage] = useGenerateImageMutation();
  const [uploadImageToCloudinary, { isLoading: isUploading }] = useUploadImageToCloudinaryMutation();

  const defaultLogoUrl = '/images/Logo1.png';

  useEffect(() => {
    if (location.state && (location.state as any).generatedImageUrl) {
      setGeneratedImageUrl((location.state as any).generatedImageUrl);
      if (postType !== 'carousel' && postType !== 'doYouKnow') {
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
      if (!imageUrl) throw new Error('No image URL returned from API');
      setGeneratedImageUrl(imageUrl);

      if (postType !== 'carousel' && postType !== 'doYouKnow') {
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

        if (showLogo && (postType === 'single' || postType === 'festival' || postType === 'doYouKnow')) {
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
      }
    } else {
      dispatch(setSelectedFile(null));
      navigate('/post');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleDoYouKnowTemplateSelect = (templateId: string) => {
    setLocalSelectedDoYouKnowTemplate(templateId);
    dispatch(setSelectedDoYouKnowTemplate(templateId));
  };

  const handleProceed = () => {
    if (postCreationOption === 'withoutImage') {
      handleContinueToPost();
    } else if (postType === 'carousel') {
      if (!selectedTemplate) {
        alert('Please select a carousel template to proceed.');
      } else {
        navigate('/carousel', {
          state: {
            initialImage: generatedImageUrl,
            template: selectedTemplate,
            topic: localContentIdea?.title,
            generatedImageUrl,
          },
        });
      }
    } else if (postType === 'doYouKnow') {
      if (!selectedDoYouKnowTemplate) {
        alert('Please select a "Do You Know" template to proceed.');
      } else {
        navigate('/doyouknow', {
          state: {
            generatedImageUrl,
            showLogo,
            defaultLogoUrl,
          },
        });
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
    (postType === 'single' || postType === 'festival' ||
      (postType === 'carousel' && carouselImageOption === 'withImage') ||
      (postType === 'doYouKnow' && doYouKnowImageOption === 'withImage'));

  const carouselTemplateOptions = carouselTemplates.map((template) => ({
    id: template.id,
    name: template.name,
    thumbnail: template.coverImageUrl,
  }));

  const doYouKnowTemplateOptions = doYouKnowTemplates.map((template) => ({
    id: template.id,
    name: template.name,
    thumbnail: template.coverImageUrl,
  }));

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
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="postType"
                  value="doYouKnow"
                  checked={postType === 'doYouKnow'}
                  onChange={() => setPostType('doYouKnow')}
                  className="text-blue-600"
                />
                <span className="text-white">Do You Know</span>
              </label>
            </div>
          </div>
        )}

        {postCreationOption === 'withImage' && postType === 'carousel' && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Carousel Image Options</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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

        {postCreationOption === 'withImage' && postType === 'doYouKnow' && (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Do You Know Image Options</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="doYouKnowImageOption"
                  value="withImage"
                  checked={doYouKnowImageOption === 'withImage'}
                  onChange={() => setDoYouKnowImageOption('withImage')}
                  className="text-blue-600"
                />
                <span className="text-white">With Image</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="doYouKnowImageOption"
                  value="withoutImage"
                  checked={doYouKnowImageOption === 'withoutImage'}
                  onChange={() => setDoYouKnowImageOption('withoutImage')}
                  className="text-blue-600"
                />
                <span className="text-white">Without Image</span>
              </label>
            </div>
          </div>
        )}

        {postCreationOption === 'withImage' &&
          ((postType === 'carousel' && carouselImageOption === 'withImage') ||
            (postType === 'doYouKnow' && doYouKnowImageOption === 'withImage')) &&
          !generatedImageUrl && (
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
          (postType === 'single' || postType === 'festival') &&
          generatedImageUrl &&
          !showOptions && (
            <div className="grid grid-cols-1 gap-6">
              <div className="relative rounded-xl max-w-3xl max-h-[500px] mx-auto">
                {contentType === 'post' ? (
                  <div className="relative">
                    <img src={generatedImageUrl} alt="Generated Image" className="w-full h-full object-contain" />
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
              {carouselTemplateOptions.length === 0 ? (
                <p className="text-red-500">No carousel templates available. Please check your templates file.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {carouselTemplateOptions.map((template) => (
                    <div
                      key={template.id}
                      className={`relative rounded-xl overflow-hidden cursor-pointer group aspect-[3/4] ${
                        selectedTemplate === template.id ? 'ring-2 ring-yellow-500' : ''
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-yellow-500 rounded-full p-2">
                          {selectedTemplate === template.id ? (
                            <Check className="w-6 h-6 text-black" />
                          ) : (
                            <Image className="w-6 h-6 text-black" />
                          )}
                        </div>
                        <p className="text-white mt-2 text-sm font-semibold">{template.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        {postCreationOption === 'withImage' &&
          postType === 'doYouKnow' &&
          (doYouKnowImageOption === 'withoutImage' || (doYouKnowImageOption === 'withImage' && generatedImageUrl)) && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Select a "Do You Know" Template</h3>
              {doYouKnowTemplateOptions.length === 0 ? (
                <p className="text-red-500">No "Do You Know" templates available. Please check your templates file.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {doYouKnowTemplateOptions.map((template) => (
                    <div
                      key={template.id}
                      className={`relative rounded-xl overflow-hidden cursor-pointer group aspect-[3/4] ${
                        selectedDoYouKnowTemplate === template.id ? 'ring-2 ring-yellow-500' : ''
                      }`}
                      onClick={() => handleDoYouKnowTemplateSelect(template.id)}
                    >
                      <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-yellow-500 rounded-full p-2">
                          {selectedDoYouKnowTemplate === template.id ? (
                            <Check className="w-6 h-6 text-black" />
                          ) : (
                            <Image className="w-6 h-6 text-black" />
                          )}
                        </div>
                        <p className="text-white mt-2 text-sm font-semibold">{template.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              : shouldShowGenerateButton && postType !== 'carousel' && postType !== 'doYouKnow'
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
                {contentType === 'post' ? (
                  <div className="relative">
                    <img src={generatedImageUrl} alt="Generated Image" className="w-full h-full object-contain" />
                    {(postType === 'single' || postType === 'festival') && showLogo && (
                      <img
                        src={defaultLogoUrl}
                        alt="Logo"
                        className="absolute right-14 top-10 w-40 h-12 object-contain z-10"
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
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleContinueToPost}
              disabled={isUploading}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Continue to Post'}
            </button>
            {(postType !== 'carousel' && postType !== 'doYouKnow') && (
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