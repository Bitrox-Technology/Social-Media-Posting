import React, { useState, useEffect } from 'react';
import { Image, Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedFile, setSelectedDoYouKnowTemplate } from '../../store/appSlice';
import { useGenerateImageMutation, useUploadImageToCloudinaryMutation } from '../../store/api';
import { carouselTemplates } from '../../templetes/templetesDesign';
import { doYouKnowTemplates } from '../../templetes/doYouKnowTemplates';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

interface ImageGeneratorProps {
  contentType: 'post' | 'blog' | 'carousel' | 'doyouknow';
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ contentType }) => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [postCreationOption, setPostCreationOption] = useState<'withImage' | 'withoutImage'>('withImage');
  const [postType, setPostType] = useState<'single' | 'carousel' | 'festival' | 'doYouKnow'>('single');
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
    }
  }, [location.state]);

  const handleGenerateImage = async () => {
    if (!localContentIdea?.title) {
      alert('Please provide a content idea with a title.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateImage({ prompt: `${localContentIdea.title} ${localContentIdea.content}` }).unwrap();
      setGeneratedImageUrl(response.data);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinueToPost = async () => {
    if (generatedImageUrl) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = new window.Image();
      const logo = new window.Image();
      image.crossOrigin = 'Anonymous';
      logo.crossOrigin = 'Anonymous';
      image.src = generatedImageUrl;
      logo.src = defaultLogoUrl;

      await Promise.all([
        new Promise<void>((resolve) => (image.onload = () => resolve())),
        new Promise<void>((resolve) => (logo.onload = () => resolve())),
      ]);

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      if (showLogo) {
        const logoWidth = 128;
        const logoX = canvas.width - logoWidth - 16;
        const logoY = 16;
        ctx.drawImage(logo, logoX, logoY, logoWidth, 48);
      }

      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
      const formData = new FormData();
      formData.append('image', blob, 'generated-image.png');

      const result = await uploadImageToCloudinary(formData).unwrap();
      const cloudinaryUrl = result?.data?.secure_url;

      dispatch(setSelectedFile({ name: 'generated-image.png', url: cloudinaryUrl }));
      navigate('/post', { state: { cloudinaryUrl, generatedImageUrl } });
    } else {
      dispatch(setSelectedFile(null));
      navigate('/post');
    }
  };

  const handleTemplateNavigation = (templateId: string, type: 'carousel' | 'doYouKnow') => {
    if (type === 'carousel') {
      navigate('/carousel', {
        state: {
          initialImage: generatedImageUrl,
          template: templateId,
          topic: localContentIdea?.title,
          generatedImageUrl,
        },
      });
    } else {
      dispatch(setSelectedDoYouKnowTemplate(templateId));
      navigate('/doyouknow', {
        state: { generatedImageUrl, showLogo, defaultLogoUrl },
      });
    }
  };

  const handleBack = () => {
    navigate('/ideas' );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back to Topics</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            Create Your Visual Content
          </h1>
        </div>

        {/* Content Idea Display */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-2">Your Content Idea</h2>
          <p className="text-gray-300">
            {localContentIdea?.title || 'No content idea selected yet'}
          </p>
        </div>

        {/* Options Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Post Creation Option */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Content Style</h3>
            <div className="space-y-4">
              {['withImage', 'withoutImage'].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="postCreationOption"
                    value={option}
                    checked={postCreationOption === option}
                    onChange={() => setPostCreationOption(option as 'withImage' | 'withoutImage')}
                    className="w-5 h-5 text-yellow-400 border-gray-600 focus:ring-yellow-400"
                  />
                  <span className="text-gray-200 group-hover:text-yellow-400 transition-colors">
                    {option === 'withImage' ? 'With Image' : 'Text Only'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Post Type Selection */}
          {postCreationOption === 'withImage' && (
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Post Type</h3>
              <div className="space-y-4">
                {['single', 'carousel', 'festival', 'doYouKnow'].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="postType"
                      value={type}
                      checked={postType === type}
                      onChange={() => setPostType(type as 'single' | 'carousel' | 'festival' | 'doYouKnow')}
                      className="w-5 h-5 text-yellow-400 border-gray-600 focus:ring-yellow-400"
                    />
                    <span className="text-gray-200 group-hover:text-yellow-400 transition-colors">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Generation and Preview */}
        {postCreationOption === 'withImage' && (
          <div className="mt-8">
            {(postType === 'single' || postType === 'festival') && (
              <>
                {!generatedImageUrl ? (
                  <button
                    onClick={handleGenerateImage}
                    disabled={isGenerating || !localContentIdea?.title}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Image className="w-5 h-5" />
                    {isGenerating ? 'Generating...' : 'Generate Image'}
                  </button>
                ) : (
                  <div className="space-y-6">
                    <div className="relative rounded-xl overflow-hidden max-w-2xl mx-auto shadow-lg">
                      <img src={generatedImageUrl} alt="Generated" className="w-full h-auto object-contain" />
                      {showLogo && (
                        <img
                          src={defaultLogoUrl}
                          alt="Logo"
                          className="absolute right-4 top-4 w-32 h-12 object-contain"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={showLogo}
                        onChange={(e) => setShowLogo(e.target.checked)}
                        className="w-5 h-5 text-yellow-400 border-gray-600"
                      />
                      <label className="text-gray-200">Add Logo</label>
                    </div>
                    <button
                      onClick={handleContinueToPost}
                      disabled={isUploading}
                      className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 transition-all duration-300"
                    >
                      {isUploading ? 'Uploading...' : 'Continue to Post'}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Template Selection */}
            {(postType === 'carousel' || postType === 'doYouKnow') && (
              <div className="mt-8">
                {generatedImageUrl && (
                  <div className="mb-8 relative rounded-xl overflow-hidden max-w-md mx-auto shadow-lg">
                    <img src={generatedImageUrl} alt="Generated" className="w-full h-auto object-contain" />
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-6">
                  Select {postType === 'carousel' ? 'Carousel' : 'Do You Know'} Template
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {(postType === 'carousel' ? carouselTemplates : doYouKnowTemplates).map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateNavigation(template.id, postType)}
                      className="group relative rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg border border-gray-700 hover:border-yellow-400"
                    >
                      <img
                        src={template.coverImageUrl}
                        alt={template.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
                        <p className="text-white font-semibold text-lg group-hover:text-yellow-400 transition-colors">
                          {template.name}
                        </p>
                      </div>
                      <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Check className="w-5 h-5 text-black" />
                      </div>
                    </div>
                  ))}
                </div>
                {!generatedImageUrl && (
                  <button
                    onClick={handleGenerateImage}
                    disabled={isGenerating || !localContentIdea?.title}
                    className="mt-6 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Image className="w-5 h-5" />
                    {isGenerating ? 'Generating...' : 'Generate Base Image'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Proceed without Image */}
        {postCreationOption === 'withoutImage' && (
          <button
            onClick={handleContinueToPost}
            className="mt-8 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300"
          >
            Proceed to Post
          </button>
        )}
      </div>
    </div>
  );
};