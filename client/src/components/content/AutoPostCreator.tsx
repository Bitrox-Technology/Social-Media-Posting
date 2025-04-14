import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';
import {
  useGenerateImageMutation,
  useGenerateCarouselMutation,
  useGenerateDoYouKnowMutation,
  useUploadImageToCloudinaryMutation,
  useGenerateImageContentMutation,
  useSavePostsMutation,
  useLazyGetPostContentQuery,
} from '../../store/api';
import { setPosts } from '../../store/appSlice';
import { motion } from 'framer-motion';
import { carouselTemplates, Slide } from '../../templetes/templetesDesign';
import { Carousel } from '../ui/Carousel';
import { DoYouKnow } from '../ui/DoYouKnow';
import { DoYouKnowSlide, doYouKnowTemplates } from '../../templetes/doYouKnowTemplates';
import { imageTemplates, ImageSlide } from '../../templetes/ImageTemplate';
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
  imageUrl: string;
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
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [posts, setLocalPosts] = useState<Post[]>([]);
  const [completedPosts, setCompletedPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedIndex, setLastGeneratedIndex] = useState(-1);
  const [postContentId, setPostContentId] = useState<string | null>(location.state?.postContentId || null);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  const [getPostContent, { isFetching: isFetchingPostContent }] = useLazyGetPostContentQuery();
  const [generateImage] = useGenerateImageMutation();
  const [generateCarousel] = useGenerateCarouselMutation();
  const [generateDoYouKnow] = useGenerateDoYouKnowMutation();
  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [generateImageContent] = useGenerateImageContentMutation();
  const [savePosts] = useSavePostsMutation();

  const postRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [topics, setTopics] = useState<string[]>([]);
  const postTypes: ('image' | 'carousel' | 'doyouknow')[] = [
    'image',
    'carousel',
    'doyouknow',
    'image',
    'carousel',
    'doyouknow',
    'image',
  ];

  // Fetch topics on mount
  useEffect(() => {
    const fetchTopics = async () => {
      if (!postContentId) {
        navigate('/topic');
        return;
      }

      setIsLoadingTopics(true);
      setTopicsError(null);

      try {
        const response = await getPostContent({ postContentId }).unwrap();
        console.log('Fetched topics:', response.data.topics);
        if (response.data.topics && response.data.topics.length > 0) {
          setTopics(response.data.topics.slice(0, 7));
          const initialPosts: Post[] = response.data.topics.slice(0, 7).map((topic: string, index: number): Post => ({
            topic,
            type: postTypes[index % postTypes.length],
            content: '',
            status: 'pending',
          }));
          setLocalPosts(initialPosts);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        setTopicsError('Failed to load topics. Please go back and try again.'); 
      } finally {
        setIsLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [getPostContent, navigate]);

  // Handle updated post from location state
  useEffect(() => {
    const { updatedPost } = location.state || {};
    console.log('Updated post from location state:', location.state);
    if (updatedPost) {
      setCompletedPosts((prev) =>
        prev.map((p) =>
          p.topic === updatedPost.topic && p.type === updatedPost.type ? { ...updatedPost } : p
        )
      );
      setLocalPosts((prev) => prev.filter((p) => p.topic !== updatedPost.topic));
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const captureAndUploadScreenshot = async (ref: HTMLDivElement | null, topic: string, type: string) => {
    if (!ref) return '';
    await new Promise((resolve) => setTimeout(resolve, 500));
    const canvas = await html2canvas(ref, { useCORS: true, scale: 2, backgroundColor: null });
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
    const formData = new FormData();
    formData.append('image', blob, `${topic}-${type}.png`);
    const result = await uploadImageToCloudinary(formData).unwrap();
    return result?.data?.secure_url || '';
  };

  const generatePost = async (topic: string, index: number) => {
    if (!postContentId) {
      throw new Error('No postContentId available');
    }

    const type = postTypes[index % postTypes.length];
    setLocalPosts((prev) =>
      prev.map((p) => (p.topic === topic ? { ...p, status: 'pending' } : p))
    );

    try {
      let newPost: Post;
      let screenshotUrl = '';

      switch (type) {
        case 'image':
          const randomTemplateIndex = Math.floor(Math.random() * imageTemplates.length);
          const randomTemplate = imageTemplates[randomTemplateIndex];
          const contentRes = await generateImageContent({ topic }).unwrap();
          const generatedContent = contentRes.data;
          const imageRes = await generateImage({ prompt: topic }).unwrap();
          const imageUrl = imageRes.data || '';

          const newImageSlide: ImageContent = {
            title: generatedContent.title || randomTemplate.slides[0].title,
            description: generatedContent.description || randomTemplate.slides[0].description,
            footer: randomTemplate.slides[0].footer,
            websiteUrl: randomTemplate.slides[0].websiteUrl || '',
            imageUrl: imageUrl,
          };

          newPost = { topic, type, content: newImageSlide, templateId: randomTemplate.id, status: 'success' };

          // Render image post off-screen for screenshot
          const tempContainer = document.createElement('div');
          tempContainer.style.position = 'absolute';
          tempContainer.style.top = '-9999px';
          tempContainer.style.width = '500px';
          tempContainer.style.height = '700px';
          document.body.appendChild(tempContainer);

          const slide = newPost.content as ImageContent;
          const template = imageTemplates.find((t) => t.id === newPost.templateId) || imageTemplates[0];
          const slideElement = template.renderSlide(slide as ImageSlide, true, '/images/Logo1.png');
          ReactDOM.render(slideElement, tempContainer);

          screenshotUrl = await captureAndUploadScreenshot(tempContainer, topic, type);
          document.body.removeChild(tempContainer);
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
          break;

        default:
          throw new Error(`Unknown post type: ${type}`);
      }

      setLocalPosts((prev) => prev.filter((p) => p.topic !== topic));
      setCompletedPosts((prev) => [...prev, newPost]);
      setLastGeneratedIndex(index);

      // Save to backend with postContentId
      const postToSave = {
        postContentId,
        topic: newPost.topic,
        type: newPost.type,
        content: newPost.content,
        templateId: newPost.templateId,
      };

      try {
        await savePosts(postToSave).unwrap();
      } catch (error) {
        console.error(`Error saving ${type} post for ${topic}:`, error);
        throw error;
      }

      // Capture screenshot for carousel and doyouknow
      if (type !== 'image') {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const ref = postRefs.current.get(`${topic}-${type}`);
        if (ref) {
          screenshotUrl = await captureAndUploadScreenshot(ref, topic, type);
        }
      }

      // Update post with screenshot
      if (screenshotUrl) {
        const updatedPost = {
          ...newPost,
          images:
            type === 'carousel'
              ? (newPost.content as Slide[]).map((_, idx) => ({
                url: screenshotUrl,
                label: `Carousel Slide ${idx + 1}`,
              }))
              : [{ url: screenshotUrl, label: `${type.charAt(0).toUpperCase() + type.slice(1)} Post` }],
        };
        setCompletedPosts((prev) => prev.map((p) => (p.topic === topic ? updatedPost : p)));

        // Update saved post with screenshot
        await savePosts({
          ...postToSave,
          content: {
            ...postToSave.content,
            imageUrl: screenshotUrl,
          },
        }).unwrap();
      }

      return true;
    } catch (err) {
      console.error(`Error generating post for ${topic}:`, err);
      setLocalPosts((prev) =>
        prev.map((p) =>
          p.topic === topic
            ? {
              ...p,
              status: 'error',
              errorMessage: err instanceof Error ? err.message : 'An error occurred',
            }
            : p
        )
      );
      setLastGeneratedIndex(index - 1);
      return false;
    }
  };

  const generateAllPosts = async () => {
    if (isGenerating || !postContentId) return;
    setIsGenerating(true);

    const startIndex = lastGeneratedIndex + 1;
    for (let i = startIndex; i < topics.length; i++) {
      const success = await generatePost(topics[i], i);
      if (!success) break;
    }

    setIsGenerating(false);
  };

  const handleEditPost = (post: Post) => {
    if (post.type === 'image') {
      navigate('/image-generator', {
        state: {
          templateId: post.templateId,
          initialSlide: post.content,
          topic: post.topic,
          fromAutoPostCreator: true,
          generatedImageUrl: post.images && post.images.length > 0 ? post.images[0].url : '',
          generatedContent: post.content,
          postContentId,
        },
      });
    }
  };

  const handleContinueToPost = async () => {
    try {
      dispatch(setPosts(completedPosts));
      navigate('/post-preview');
    } catch (error) {
      console.error('Error navigating to post preview:', error);
      alert('Failed to proceed. Please try again.');
    }
  };

  const handleBack = () => navigate('/topic');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={handleBack}
            className="flex items-center text-yellow-300 hover:text-yellow-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </motion.button>
          <h1 className="text-3xl font-bold tracking-tight">Post Creator</h1>
          <motion.button
            onClick={generateAllPosts}
            disabled={isGenerating || !postContentId || isLoadingTopics || isFetchingPostContent}
            className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-md disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isGenerating ? 'Generating...' : lastGeneratedIndex < topics.length - 1 ? 'Generate Posts' : 'Regenerate Posts'}
          </motion.button>
        </div>

        {isLoadingTopics || isFetchingPostContent ? (
          <p className="text-gray-400 text-center text-lg">Loading topics...</p>
        ) : topicsError ? (
          <p className="text-red-400 text-center text-lg">{topicsError}</p>
        ) : topics.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">No topics found. Please go back and select topics.</p>
        ) : topics.length < 7 ? (
          <p className="text-red-400 text-center text-lg">Please select exactly 7 topics to proceed.</p>
        ) : (
          <div className="space-y-8">
            {posts.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">In Progress</h2>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <motion.div
                      key={post.topic}
                      className="bg-gray-700 p-4 rounded-lg shadow-md border border-yellow-400/20"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center">
                        {getStatusIcon(post.status)}
                        <div className="ml-3 flex-1">
                          <h3 className="text-lg font-medium text-gray-200">
                            {post.topic} ({post.type})
                          </h3>
                          {post.status === 'error' && (
                            <p className="text-red-300 text-sm mt-1">{post.errorMessage}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {completedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">Completed Posts</h2>
                <div className="space-y-6">
                  {completedPosts.map((post) => (
                    <motion.div
                      key={`${post.topic}-${post.type}`}
                      className="bg-gray-800 p-4 rounded-xl shadow-lg border border-green-400/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {getStatusIcon(post.status)}
                          <h3 className="text-lg font-medium ml-2 text-gray-200">
                            {post.topic} ({post.type})
                          </h3>
                        </div>
                        {post.status === 'success' && (
                          <motion.button
                            onClick={() => handleEditPost(post)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Edit
                          </motion.button>
                        )}
                      </div>
                      <div
                        ref={(el) => el && postRefs.current.set(`${post.topic}-${post.type}`, el)}
                        className="bg-gray-700 p-4 rounded-lg mb-4"
                      >
                        {post.type === 'carousel' ? (
                          <Carousel
                            initialTopic={post.topic}
                            template={post.templateId || carouselTemplates[0].id}
                            slides={post.content as Slide[]}
                          />
                        ) : post.type === 'doyouknow' ? (
                          <DoYouKnow
                            initialSlide={post.content as DoYouKnowContent}
                            templateId={post.templateId || doYouKnowTemplates[0].id}
                          />
                        ) : (
                          post.images &&
                          post.images.length > 0 && (
                            <div className="space-y-2">
                              {post.images.map((img, idx) => (
                                <div key={idx} className="flex flex-col items-start">
                                  <img
                                    src={img.url}
                                    alt={img.label}
                                    className="w-full max-w-md h-auto object-cover rounded-lg"
                                  />
                                  <span className="text-gray-400 text-sm mt-1">{img.label}</span>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {completedPosts.length === topics.length && (
              <div className="mt-10 text-center">
                <motion.button
                  onClick={handleContinueToPost}
                  className="px-8 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue to Post
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};