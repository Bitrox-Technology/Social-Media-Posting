import React, { useState, useEffect } from 'react';
import { Image, Check, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

interface ImageGeneratorProps {
  contentIdea?: ContentIdea | string | null; // Allow contentIdea to be a string
  contentType: 'post' | 'reel';
  onSelect: (file: File | string) => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ contentIdea, contentType, onSelect }) => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null); // Will store the image URL
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [postCreationOption, setPostCreationOption] = useState<'withImage' | 'withoutImage'>('withImage');
  const [postType, setPostType] = useState<'single' | 'carousel' | 'festival'>('single');
  const [carouselImageOption, setCarouselImageOption] = useState<'withImage' | 'withoutImage'>('withImage');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  console.log("generatedImageUrl---", generatedImageUrl);

  // Parse contentIdea if it's a string, otherwise use it as-is
  const parseContentIdea = (idea: ContentIdea | string | null | undefined): ContentIdea | null => {
    if (!idea) return null;
    if (typeof idea === 'string') {
      try {
        return JSON.parse(idea) as ContentIdea;
      } catch (error) {
        console.error('Error parsing contentIdea:', error);
        return null;
      }
    }
    return idea;
  };

  // Fallback contentIdea if not provided via props
  const [localContentIdea, setLocalContentIdea] = useState<ContentIdea | null>(parseContentIdea(contentIdea));

  // Check if contentIdea is passed via navigation state
  useEffect(() => {
    if (!contentIdea && location.state?.contentIdea) {
      setLocalContentIdea(parseContentIdea(location.state.contentIdea));
    }
  }, [contentIdea, location.state]);

  console.log("Data----", { propsContentIdea: contentIdea, localContentIdea, contentType });

  const handleGenerateImage = async () => {
    console.log("handleGenerateImage called");

    if (!localContentIdea || !localContentIdea.title) {
      console.log("Missing contentIdea or title:", localContentIdea);
      alert('Please provide a content idea with a title to generate an image.');
      return;
    }

    const prompt = localContentIdea.title + " " + localContentIdea.content;
    console.log("Prompt to be used:", prompt);

    setIsGenerating(true);
    try {
      console.log("Making API call to generate image...");
      const response = await axios.post('http://localhost:4000/api/v1/generate-image', {
        prompt: prompt,
      });

      console.log("API response:", response.data);
      const imageUrl = response.data.data; // e.g., "http://localhost:4000/images/output_123456.png"
      if (!imageUrl) {
        throw new Error("No image URL returned from API");
      }

      // Set the image URL directly
      console.log("Setting image URL:", imageUrl);
      setGeneratedImageUrl(imageUrl);

      // For non-carousel types, show the options to proceed
      if (postType !== 'carousel') {
        setShowOptions(true);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
      console.log("API call completed, isGenerating set to false");
    }
  };

  const handleContinueToPost = () => {
    if (generatedImageUrl) {
      fetch(generatedImageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'generated-image.png', { type: 'image/png' });
          onSelect(file);
          navigate('/post', {
            state: {
              contentType,
              topic: localContentIdea?.title,
              content: JSON.stringify(localContentIdea),
              images: [file],
            },
          });
        })
        .catch(error => {
          console.error('Error converting image URL to file:', error);
          alert('Failed to process the generated image for posting.');
        });
    } else {
      // If no image is generated (e.g., "without image" option), navigate to post creation without an image
      onSelect('');
      navigate('/post', {
        state: {
          contentType,
          topic: localContentIdea?.title,
          content: JSON.stringify(localContentIdea),
          images: [],
        },
      });
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    navigate('/carousel', {
      state: {
        initialImage: generatedImageUrl,
        template,
        topic: localContentIdea?.title,
      },
    });
  };

  const handleProceed = () => {
    if (postCreationOption === 'withImage') {
      // Navigate directly to post creation without an image
      handleContinueToPost();
    } else if (postType === 'carousel') {
      // For carousel, wait for the user to select a template
      if (!selectedTemplate) {
        alert('Please select a carousel template to proceed.');
      }
    } else {
      // Generate the image for single or festival
      handleGenerateImage();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isImage = contentType === 'post';
  const shouldShowGenerateButton =
    postCreationOption === 'withImage' &&
    (postType === 'single' || postType === 'festival' || (postType === 'carousel' && carouselImageOption === 'withImage'));

  const carouselTemplates = [
    '/images/1.jpg',
    '/images/background.png',
    '/images/background1.png',
    '/images/2.png',
    '/images/graphic.jpg',
    
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

      {/* All Options on One Page */}
      <div className="space-y-6">
        {/* Post Creation Options */}
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

        {/* Post Type Selection (Enabled only if "With Image" is selected) */}
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

        {/* Carousel Image Options (Enabled only if "Carousel Image" is selected) */}
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

        {/* Generate Image Button (for Carousel with Image) */}
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

        {/* Show Generated Image Preview (if applicable) */}
        {postCreationOption === 'withImage' &&
          (postType === 'single' || postType === 'festival' || (postType === 'carousel' && carouselImageOption === 'withImage')) &&
          generatedImageUrl && !showOptions && (
            <div className="grid grid-cols-1 gap-6">
              <div className="relative rounded-xl overflow-hidden max-w-3xl max-h-[500px] mx-auto">
                {isImage ? (
                  <img
                    src={generatedImageUrl}
                    alt="Generated Image"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <p className="text-white">Reels are not supported for generation in this example.</p>
                )}
              </div>
            </div>
          )}

        {/* Show Carousel Templates (if "Carousel Image" is selected and either image is generated or "Without Image" is selected) */}
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

        {/* Proceed Button */}
        <div className="flex justify-end">
          <button
            onClick={handleProceed}
            disabled={isGenerating || !localContentIdea?.title}
            className="flex items-center px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Image className="w-5 h-5 mr-2" />
            {isGenerating
              ? 'Generating...'
              : shouldShowGenerateButton && postType !== 'carousel'
              ? 'Generate Image and Proceed'
              : 'Proceed'}
          </button>
        </div>
      </div>

      {/* Show options after image generation (for non-carousel post types) */}
      {showOptions && (
        <div className="space-y-6">
          {/* Show the generated image again before proceeding */}
          {generatedImageUrl && (
            <div className="grid grid-cols-1 gap-6">
              <div className="relative rounded-xl overflow-hidden max-w-3xl max-h-[500px] mx-auto">
                <img
                  src={generatedImageUrl}
                  alt="Generated Image"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleContinueToPost}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors"
            >
              Continue to Post
            </button>
            {postType !== 'carousel' && (
              <button
                onClick={() => setShowOptions(false)} // Allow going back to options
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