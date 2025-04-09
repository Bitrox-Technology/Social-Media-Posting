import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import {
  useGenerateImageMutation,
  useGenerateCarouselMutation,
  useGenerateDoYouKnowMutation,
  useUploadImageToCloudinaryMutation,
  useGenerateImageContentMutation,
  useSavePostsMutation,
} from '../../store/api';
import { setPosts } from '../../store/appSlice';
import { motion } from 'framer-motion';
import { carouselTemplates, Slide } from '../../templetes/templetesDesign';
import { Carousel } from '../ui/Carousel';
import { DoYouKnow } from '../ui/DoYouKnow';
import { DoYouKnowSlide, doYouKnowTemplates } from '../../templetes/doYouKnowTemplates';
import { imageTemplates, ImageSlide } from '../../templetes/ImageTemplate';
import { ImageGeneration } from '../ui/ImageGeneration';
import html2canvas from 'html2canvas';

interface CarouselContent {
  tagline?: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

interface DoYouKnowContent {
  title: string;
  fact: string;
  footer?: string;
  websiteUrl?: string;
  imageUrl?: string;
}

interface ImageContent {
  title: string;
  description: string;
  footer?: string;
  websiteUrl?: string;
  imageUrl?: string;
}

interface Post {
  topic: string;
  type: 'image' | 'carousel' | 'doyouknow';
  content: ImageContent | DoYouKnowContent | Slide[] | string;
  images?: { url: string; label: string }[];
  templateId?: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

export const AutoPostCreator = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedTopic = useAppSelector((state) => state.app.selectedTopic);
  const [posts, setLocalPosts] = useState<Post[]>([]);
  const [completedPosts, setCompletedPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedIndex, setLastGeneratedIndex] = useState(-1);
  const [activeCarouselTopic, setActiveCarouselTopic] = useState<string | null>(null);
  const [editCarouselTopic, setEditCarouselTopic] = useState<string | null>(null);
  const [activeDoYouKnowTopic, setActiveDoYouKnowTopic] = useState<string | null>(null);
  const [editDoYouKnowTopic, setEditDoYouKnowTopic] = useState<string | null>(null);
  const [activeImageTopic, setActiveImageTopic] = useState<string | null>(null);
  const [editImageTopic, setEditImageTopic] = useState<string | null>(null);

  const [generateImage] = useGenerateImageMutation();
  const [generateCarousel] = useGenerateCarouselMutation();
  const [generateDoYouKnow] = useGenerateDoYouKnowMutation();
  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [generateImageContent] = useGenerateImageContentMutation();
  const [savePosts] = useSavePostsMutation();

  const postRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const topics = selectedTopic ? selectedTopic.split(', ').filter(Boolean).slice(0, 7) : [];
  const postTypes: ('image' | 'carousel' | 'doyouknow')[] = [
    'image',
    'carousel',
    'doyouknow',
    'image',
    'carousel',
    'doyouknow',
    'image',
  ];

  useEffect(() => {
    if (!selectedTopic) {
      navigate('/topic');
    } else {
      const initialPosts: Post[] = topics.map((topic, index) => ({
        topic,
        type: postTypes[index],
        content: '',
        status: 'pending',
      }));
      setLocalPosts(initialPosts);
    }
  }, [selectedTopic, navigate]);

  const captureScreenshot = async (ref: HTMLDivElement | null) => {
    if (!ref) return '';
    await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure rendering
    const canvas = await html2canvas(ref, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      logging: true,
    });
    return canvas.toDataURL('image/png');
  };

  const generatePost = async (topic: string, index: number) => {
    const type = postTypes[index];
    setLocalPosts(prev => prev.map(p => 
      p.topic === topic ? { ...p, status: 'pending' } : p
    ));

    try {
      let newPost: Post;
      switch (type) {
        case 'image':
          const randomTemplateIndex = Math.floor(Math.random() * imageTemplates.length);
          const randomTemplate = imageTemplates[randomTemplateIndex];
          const contentRes = await generateImageContent({ topic }).unwrap();
          const generatedContent = contentRes.data;
          const imageRes = await generateImage({ prompt: topic }).unwrap();
          const imageUrl = imageRes.data;

          const newImageSlide: ImageContent = {
            title: generatedContent.title || randomTemplate.slides[0].title,
            description: generatedContent.description || randomTemplate.slides[0].description,
            footer: randomTemplate.slides[0].footer,
            websiteUrl: randomTemplate.slides[0].websiteUrl || '',
            imageUrl: imageUrl,
          };

          newPost = { topic, type, content: newImageSlide, templateId: randomTemplate.id, status: 'success' };
          setActiveImageTopic(topic);
          break;

        case 'carousel':
          const randomCarouselTemplateIndex = Math.floor(Math.random() * carouselTemplates.length);
          const randomCarouselTemplate = carouselTemplates[randomCarouselTemplateIndex];
          const carouselResponse = await generateCarousel({ topic }).unwrap();
          const generatedCarouselContent: CarouselContent[] = carouselResponse.data;

          const newSlides: Slide[] = randomCarouselTemplate.slides.map((slide, index) => {
            const content = generatedCarouselContent[index] || {};
            let formattedDescription = content.description || slide.description;

            if ((formattedDescription ?? '').trim().match(/^\d+\./)) {
              formattedDescription = (formattedDescription || '')
                .split(/,\s*\d+\./)
                .map((item, i) => {
                  const cleanItem = item.replace(/^\s*\d+\.\s*/, '').trim();
                  return i === 0 ? cleanItem : `${i + 1}. ${cleanItem}`;
                })
                .join('\n')
                .replace(/^\s+/, '');
            }

            return {
              ...slide,
              tagline: content.tagline || slide.tagline,
              title: content.title || slide.title,
              description: formattedDescription,
            };
          });

          newPost = { topic, type, content: newSlides, templateId: randomCarouselTemplate.id, status: 'success' };
          setActiveCarouselTopic(topic);
          break;

        case 'doyouknow':
          const randomDoYouKnowTemplateIndex = Math.floor(Math.random() * doYouKnowTemplates.length);
          const randomDoYouKnowTemplate = doYouKnowTemplates[randomDoYouKnowTemplateIndex];
          const doYouKnowResponse = await generateDoYouKnow({ topic }).unwrap();
          const generatedDoYouKnowContent = doYouKnowResponse.data;

          const newDoYouKnowSlide: DoYouKnowContent = {
            title: generatedDoYouKnowContent.title || randomDoYouKnowTemplate.slides[0].title,
            fact: generatedDoYouKnowContent.description || randomDoYouKnowTemplate.slides[0].fact,
            footer: randomDoYouKnowTemplate.slides[0].footer,
            websiteUrl: randomDoYouKnowTemplate.slides[0].websiteUrl || '',
            imageUrl: randomDoYouKnowTemplate.slides[0].imageUrl || '',
          };

          newPost = { topic, type, content: newDoYouKnowSlide, templateId: randomDoYouKnowTemplate.id, status: 'success' };
          setActiveDoYouKnowTopic(topic);
          break;

        default:
          throw new Error(`Unknown post type: ${type}`);
      }

      setLocalPosts(prev => prev.filter(p => p.topic !== topic));
      setCompletedPosts(prev => [...prev, newPost]);
      setLastGeneratedIndex(index);

      // Wait for the component to render and capture screenshot
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay to ensure rendering
      const ref = postRefs.current.get(topic);
      if (ref) {
        const screenshot = await captureScreenshot(ref);
        setCompletedPosts(prev => prev.map(p =>
          p.topic === topic ? { ...p, images: [{ url: screenshot, label: `${type} Post` }] } : p
        ));
      }

      return true;
    } catch (err) {
      console.error(`Error generating post for ${topic}:`, err);
      setLocalPosts(prev => prev.map(p => 
        p.topic === topic ? { 
          ...p, 
          status: 'error', 
          errorMessage: err instanceof Error ? err.message : 'An error occurred' 
        } : p
      ));
      setLastGeneratedIndex(index - 1);
      return false;
    }
  };

  const generateAllPosts = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    const startIndex = lastGeneratedIndex + 1;
    for (let i = startIndex; i < topics.length; i++) {
      const success = await generatePost(topics[i], i);
      if (!success) {
        break;
      }
    }
    
    setIsGenerating(false);
  };

  const handleImageGenerated = (topic: string, image: string) => {
    const updatedPost = completedPosts.find(post => post.topic === topic && post.type === 'image');
    if (updatedPost) {
      setCompletedPosts(prev => prev.map(p =>
        p.topic === topic ? { ...p, images: [{ url: image, label: 'Image Post' }] } : p
      ));
    }
    setActiveImageTopic(null);
  };

  const handleImageUpdated = async (topic: string, updatedSlide: ImageSlide, imageRef: HTMLDivElement) => {
    try {
      const canvas = await html2canvas(imageRef, { useCORS: true, scale: 2 });
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
      const formData = new FormData();
      formData.append('image', blob, `${topic}-image.png`);
      const result = await uploadImageToCloudinary(formData).unwrap();
      const cloudinaryUrl = result?.data?.secure_url;

      if (!cloudinaryUrl) throw new Error('Failed to upload image');

      setCompletedPosts(prev => prev.map(post =>
        post.topic === topic && post.type === 'image'
          ? {
              ...post,
              content: { ...updatedSlide, imageUrl: cloudinaryUrl },
              images: [{ url: cloudinaryUrl, label: 'Image Post' }],
            }
          : post
      ));
      setEditImageTopic(null);
    } catch (error) {
      console.error('Error uploading image screenshot:', error);
    }
  };

  const handleCarouselImagesGenerated = (topic: string, images: string[]) => {
    const labeledImages = images.map((url, idx) => ({ url, label: `Carousel Slide ${idx + 1}` }));
    setCompletedPosts(prev => prev.map(post =>
      post.topic === topic && post.type === 'carousel'
        ? { ...post, images: labeledImages }
        : post
    ));
    setActiveCarouselTopic(null);
    setEditCarouselTopic(topic);
  };

  const handleCarouselUpdated = (topic: string, updatedSlides: Slide[], images: string[]) => {
    const labeledImages = images.map((url, idx) => ({
      url: url,
      label: `Carousel Slide ${idx + 1}`,
    }));
    setCompletedPosts(prev => prev.map(post =>
      post.topic === topic && post.type === 'carousel'
        ? { ...post, content: updatedSlides, images: labeledImages }
        : post
    ));
    setEditCarouselTopic(null);
  };

  const handleDoYouKnowImagesGenerated = (topic: string, image: string) => {
    const updatedPost = completedPosts.find(post => post.topic === topic && post.type === 'doyouknow');
    if (updatedPost) {
      setCompletedPosts(prev => prev.map(p =>
        p.topic === topic ? { ...p, images: [{ url: image, label: 'Do You Know' }] } : p
      ));
    }
    setActiveDoYouKnowTopic(null);
  };

  const handleDoYouKnowUpdated = async (topic: string, updatedSlide: DoYouKnowSlide, doYouKnowRef: HTMLDivElement) => {
    try {
      const canvas = await html2canvas(doYouKnowRef, { useCORS: true, scale: 2 });
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
      const formData = new FormData();
      formData.append('image', blob, `${topic}-doyouknow.png`);
      const result = await uploadImageToCloudinary(formData).unwrap();
      const cloudinaryUrl = result?.data?.secure_url;

      if (!cloudinaryUrl) throw new Error('Failed to upload Do You Know image');

      setCompletedPosts(prev => prev.map(post =>
        post.topic === topic && post.type === 'doyouknow'
          ? {
              ...post,
              content: { ...updatedSlide, imageUrl: cloudinaryUrl },
              images: [{ url: cloudinaryUrl, label: 'Do You Know' }],
            }
          : post
      ));
      setEditDoYouKnowTopic(null);
    } catch (error) {
      console.error('Error uploading Do You Know screenshot:', error);
    }
  };

  const handleContinueToPost = async () => {
    try {
      const postsToSave = completedPosts.map(post => ({
        type: post.type, // e.g., "image", "carousel", "doyouknow"
        images: post.images?.map(image => image.url) || [], // Only save the URLs
      }));
  
      console.log('Saving posts:', postsToSave);
  
      await savePosts(postsToSave).unwrap();
      navigate('/next-component');
    } catch (error) {
      console.error('Error saving posts:', error);
      alert('Failed to save posts. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/topic');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h2 className="text-2xl font-bold text-white ml-4">Auto Post Creator</h2>
        </div>
        <motion.button
          onClick={generateAllPosts}
          disabled={isGenerating}
          className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {isGenerating ? 'Generating...' : lastGeneratedIndex < topics.length - 1 ? 'Generate Posts' : 'Regenerate Posts'}
        </motion.button>
      </div>

      {topics.length === 0 ? (
        <p className="text-gray-300">No topics selected. Please go back and select topics.</p>
      ) : topics.length < 7 ? (
        <p className="text-red-500">Please select exactly 7 topics to proceed.</p>
      ) : (
        <div className="space-y-4">
          {/* Pending/Error Posts Section */}
          {posts.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-white">In Progress</h3>
              {posts.map((post) => (
                <div key={post.topic} className="bg-gray-800 p-4 rounded-lg border border-yellow-500/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(post.status)}
                      <h3 className="text-lg font-semibold text-white ml-2">
                        {post.topic} ({post.type})
                      </h3>
                    </div>
                    {post.status === 'error' && (
                      <p className="text-red-500">{post.errorMessage}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Posts Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Completed Posts</h3>
            {completedPosts.map((post) => (
              <motion.div
                key={post.topic}
                className="bg-gray-800 p-4 rounded-lg border border-green-500/50"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                ref={(el) => el && postRefs.current.set(post.topic, el)}
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(post.status)}
                      <h3 className="text-lg font-semibold text-white ml-2">
                        {post.topic} ({post.type})
                      </h3>
                    </div>
                    <button
                      onClick={() => {
                        if (post.type === 'image') setEditImageTopic(post.topic);
                        if (post.type === 'carousel') setEditCarouselTopic(post.topic);
                        if (post.type === 'doyouknow') setEditDoYouKnowTopic(post.topic);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Edit
                    </button>
                  </div>
                  <div>
                    {post.type === 'image' && editImageTopic === post.topic ? (
                      <ImageGeneration
                        onSave={(updatedSlide, ref) => handleImageUpdated(post.topic, updatedSlide, ref)}
                        initialSlide={post.content as ImageContent}
                        templateId={post.templateId || imageTemplates[0].id}
                        topic={post.topic}
                      />
                    ) : post.type === 'carousel' && editCarouselTopic === post.topic ? (
                      <Carousel
                        initialTopic={post.topic}
                        template={post.templateId || carouselTemplates[0].id}
                        slides={post.content as Slide[]}
                        onSave={(updatedSlides, images) => handleCarouselUpdated(post.topic, updatedSlides, images)}
                      />
                    ) : post.type === 'doyouknow' && editDoYouKnowTopic === post.topic ? (
                      <DoYouKnow
                        onSave={(updatedSlide, ref) => handleDoYouKnowUpdated(post.topic, updatedSlide, ref)}
                        initialSlide={post.content as DoYouKnowContent}
                        templateId={post.templateId || doYouKnowTemplates[0].id}
                      />
                    ) : (
                      post.type === 'image' ? (
                        <ImageGeneration
                          initialSlide={post.content as ImageContent}
                          templateId={post.templateId || imageTemplates[0].id}
                          topic={post.topic}
                          onImagesGenerated={(image) => handleImageGenerated(post.topic, image)}
                        />
                      ) : post.type === 'carousel' ? (
                        <Carousel
                          initialTopic={post.topic}
                          template={post.templateId || carouselTemplates[0].id}
                          slides={post.content as Slide[]}
                          onImagesGenerated={(images) => handleCarouselImagesGenerated(post.topic, images)}
                        />
                      ) : post.type === 'doyouknow' ? (
                        <DoYouKnow
                          initialSlide={post.content as DoYouKnowContent}
                          templateId={post.templateId || doYouKnowTemplates[0].id}
                          onImagesGenerated={(image) => handleDoYouKnowImagesGenerated(post.topic, image)}
                        />
                      ) : null
                    )}
                  </div>
                  {post.images && (
                    <div className="flex flex-wrap gap-2">
                      {post.images.map((img, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <img
                            src={img.url}
                            alt={img.label}
                            className="w-32 h-32 object-cover rounded"
                          />
                          <span className="text-gray-300 text-sm mt-1">{img.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Continue to Post Button */}
          {completedPosts.length === topics.length && (
            <motion.button
              onClick={handleContinueToPost}
              className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Continue to Post
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};