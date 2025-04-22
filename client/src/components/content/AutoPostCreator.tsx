import { createRoot as reactCreateRoot } from 'react-dom/client';
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
  useImageContentMutation,
  useCarouselContentMutation,
  useDykContentMutation,
  useLazyGetSavePostsQuery,
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
  contentId?: string;
  contentType?: 'ImageContent' | 'CarouselContent' | 'DoyouknowContent';
}

export const AutoPostCreator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [posts, setLocalPosts] = useState<Post[]>([]);
  const [completedPosts, setCompletedPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [postContentId, setPostContentId] = useState<string | null>(location.state?.postContentId || null);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [getPostContent, { isFetching: isFetchingPostContent }] = useLazyGetPostContentQuery();
  const [getSavePosts, { isFetching: isFetchingPosts }] = useLazyGetSavePostsQuery();
  const [generateImage] = useGenerateImageMutation();
  const [generateCarousel] = useGenerateCarouselMutation();
  const [generateDoYouKnow] = useGenerateDoYouKnowMutation();
  const [uploadImageToCloudinary] = useUploadImageToCloudinaryMutation();
  const [generateImageContent] = useGenerateImageContentMutation();
  const [savePosts] = useSavePostsMutation();
  const [imageContent] = useImageContentMutation();
  const [carouselContent] = useCarouselContentMutation();
  const [dykContent] = useDykContentMutation();

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

  // Fetch topics and posts on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!postContentId) {
        navigate('/topic');
        return;
      }

      setPostContentId(postContentId);
      setIsLoadingTopics(true);
      setIsLoadingPosts(true);
      setTopicsError(null);
      setPostsError(null);

      try {
        // Fetch topics
        const topicsResponse = await getPostContent({ postContentId }).unwrap();
        console.log('Fetched topics:', topicsResponse.data);
        if (topicsResponse.data.topics && topicsResponse.data.topics.length > 0) {
          const fetchedTopics = topicsResponse.data.topics.slice(0, 7);
          setTopics(fetchedTopics);

          // Fetch saved posts
          try {
            const postsResponse = await getSavePosts({ postContentId }).unwrap();
            console.log('Fetched saved posts:', postsResponse.data);
            const savedPosts = postsResponse.data || [];

            // Filter saved posts that match fetched topics
            const topicSet = new Set(fetchedTopics);
            interface SavedPost {
              topic: string;
              type: 'image' | 'carousel' | 'doyouknow';
              images?: { url: string; label: string }[];
              status: 'success' | 'error' | 'pending';
              contentId?: string;
              contentType?: 'ImageContent' | 'CarouselContent' | 'DoyouknowContent';
            }

            const completed: Post[] = (savedPosts as SavedPost[])
              .filter((post) => topicSet.has(post.topic))
              .map((post): Post => ({
                topic: post.topic,
                type: post.type,
                content: '',
                images: post.images,
                templateId: undefined,
                status: post.status,
                contentId: post.contentId,
                contentType: post.contentType,
              }));

            // Initialize pending posts for unmatched topics
            const savedTopicTypeKeys = new Set(completed.map((p) => `${p.topic}-${p.type}`));
            const pending: Post[] = fetchedTopics
              .map((topic: string, index: number): Post => ({
                topic,
                type: postTypes[index % postTypes.length],
                content: '',
                status: 'pending' as const,
              }))
              .filter((post: Post) => !savedTopicTypeKeys.has(`${post.topic}-${post.type}`));

            setCompletedPosts(completed);
            setLocalPosts(pending);
            setCurrentIndex(completed.length - 1);
          } catch (postError) {
            console.error('Error fetching posts:', postError);
            setPostsError('Failed to load saved posts. You can still generate new posts.');
            // Initialize all as pending if posts fetch fails
            const initialPosts: Post[] = fetchedTopics.map((topic: string, index: number): Post => ({
              topic,
              type: postTypes[index % postTypes.length],
              content: '',
              status: 'pending',
            }));
            setLocalPosts(initialPosts);
            setCompletedPosts([]);
            setCurrentIndex(-1);
          }
        } else {
          throw new Error('No topics found');
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        setTopicsError('Failed to load topics. Please go back and try again.');
      } finally {
        setIsLoadingTopics(false);
        setIsLoadingPosts(false);
      }
    };

    fetchData();
  }, [getPostContent, getSavePosts, navigate, postContentId]);

  // Handle updated post from location state
  useEffect(() => {
    const { updatedPost } = location.state || {};
    if (updatedPost) {
      setCompletedPosts((prev) =>
        prev.map((p) =>
          p.topic === updatedPost.topic && p.type === updatedPost.type ? { ...updatedPost, status: 'success' } : p
        )
      );
      setLocalPosts((prev) => prev.filter((p) => p.topic !== updatedPost.topic || p.type !== updatedPost.type));
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
      prev.map((p) => (p.topic === topic && p.type === type ? { ...p, status: 'pending' } : p))
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

          const imageResult = await imageContent({
            postContentId,
            topic,
            templateId: randomTemplate.id,
            content: newImageSlide,
            status: 'success',
          }).unwrap();

          newPost = {
            topic,
            type,
            content: newImageSlide,
            templateId: randomTemplate.id,
            status: 'success',
            contentId: imageResult.data._id,
            contentType: 'ImageContent',
          };

          let tempContainer = document.createElement('div');
          tempContainer.style.position = 'absolute';
          tempContainer.style.top = '-9999px';
          tempContainer.style.width = '500px';
          tempContainer.style.height = '700px';
          document.body.appendChild(tempContainer);

          const slide = newPost.content as ImageContent;
          let template = imageTemplates.find((t) => t.id === newPost.templateId) || imageTemplates[0];
          let slideElement = template.renderSlide(slide as ImageSlide, true, '/images/Logo1.png');
          const rootImage = createRoot(tempContainer);
          rootImage.render(slideElement);

          screenshotUrl = await captureAndUploadScreenshot(tempContainer, topic, type);
          document.body.removeChild(tempContainer);
          rootImage.unmount();

          if (screenshotUrl) {
            console.log('Screenshot URL:', screenshotUrl, topic, type, postContentId);
            await savePosts({
              postContentId,
              topic,
              type: 'image',
              status: 'success',
              images: [{ url: screenshotUrl, label: 'Image Post' }],
              contentId: imageResult.data._id,
              contentType: 'ImageContent',
            }).unwrap();
            newPost.images = [{ url: screenshotUrl, label: 'Image Post' }];
          }
          break;

        case 'carousel':
          const randomCarouselTemplateIndex = Math.floor(Math.random() * carouselTemplates.length);
          const randomCarouselTemplate = carouselTemplates[randomCarouselTemplateIndex];
          const carouselResponse = await generateCarousel({ topic }).unwrap();

          const generatedCarouselContent: CarouselContent[] = carouselResponse.data;

          console.log('Generated carousel content:', generatedCarouselContent);

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

          const extractedContent = generatedCarouselContent.map((content, index) => ({
            tagline: content.tagline || '',
            title: content.title || '',
            description: content.description || '',
          }));

          const carouselResult = await carouselContent({
            postContentId,
            topic,
            templateId: randomCarouselTemplate.id,
            content: extractedContent,
            status: 'success',
          }).unwrap();

          newPost = {
            topic,
            type,
            content: newSlides,
            templateId: randomCarouselTemplate.id,
            status: 'success',
            contentId: carouselResult.data._id,
            contentType: 'CarouselContent',
          };

          const images: { url: string; label: string }[] = [];
          for (let i = 0; i < newSlides.length; i++) {
            const slide = newSlides[i];
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.top = '-9999px';
            tempContainer.style.width = '1080px';
            tempContainer.style.height = '1080px';
            tempContainer.style.backgroundColor = '#1A2526';
            document.body.appendChild(tempContainer);

            const template = carouselTemplates.find((t) => t.id === randomCarouselTemplate.id) || carouselTemplates[0];
            const slideElement = template.renderSlide
              ? template.renderSlide(slide, true, '/images/Logo1.png')
              : <div>{slide.title}</div>;
            const root = createRoot(tempContainer);
            root.render(slideElement);

            await new Promise((resolve) => setTimeout(resolve, 100));

            const slideScreenshotUrl = await captureAndUploadScreenshot(tempContainer, `${topic}-slide-${i + 1}`, type);
            document.body.removeChild(tempContainer);
            root.unmount();

            if (slideScreenshotUrl) {
              images.push({ url: slideScreenshotUrl, label: `Carousel Slide ${i + 1}` });
            }
          }

          if (images.length > 0) {
            console.log('Carousel screenshot URLs:', images, topic, type, postContentId);
            await savePosts({
              postContentId,
              topic,
              type: 'carousel',
              status: 'success',
              images,
              contentId: carouselResult.data._id,
              contentType: 'CarouselContent',
            }).unwrap();
            newPost.images = images;
          }
          break;

        case 'doyouknow':
          const randomDoYouKnowTemplateIndex = Math.floor(Math.random() * doYouKnowTemplates.length);
          const randomDoYouKnowTemplate = doYouKnowTemplates[randomDoYouKnowTemplateIndex];
          const doYouKnowResponse = await generateDoYouKnow({ topic }).unwrap();
          const generatedDoYouKnowContent = doYouKnowResponse.data;

          const newDoYouKnowSlide: DoYouKnowSlide = {
            title: generatedDoYouKnowContent.title || randomDoYouKnowTemplate.slides[0].title,
            fact: generatedDoYouKnowContent.description || randomDoYouKnowTemplate.slides[0].fact,
            footer: randomDoYouKnowTemplate.slides[0].footer,
            websiteUrl: randomDoYouKnowTemplate.slides[0].websiteUrl || '',
            imageUrl: randomDoYouKnowTemplate.slides[0].imageUrl || '',
            slideNumber: 1,
          };

          const dykResult = await dykContent({
            postContentId,
            topic,
            templateId: randomDoYouKnowTemplate.id,
            content: { title: generatedDoYouKnowContent.title, fact: generatedDoYouKnowContent.description },
            status: 'success',
          }).unwrap();

          newPost = {
            topic,
            type,
            content: newDoYouKnowSlide,
            templateId: randomDoYouKnowTemplate.id,
            status: 'success',
            contentId: dykResult.data._id,
            contentType: 'DoyouknowContent',
          };

          const tempContainerDYK = document.createElement('div');
          tempContainerDYK.style.position = 'absolute';
          tempContainerDYK.style.top = '-9999px';
          tempContainerDYK.style.width = '500px';
          tempContainerDYK.style.height = '700px';
          tempContainerDYK.style.backgroundColor = '#1A2526';
          document.body.appendChild(tempContainerDYK);

          const doYouKnowTemplate = doYouKnowTemplates.find((t) => t.id === randomDoYouKnowTemplate.id) || doYouKnowTemplates[0];
          const doYouKnowSlideElement = doYouKnowTemplate.renderSlide
            ? doYouKnowTemplate.renderSlide(newDoYouKnowSlide, true, '/images/Logo1.png')
            : <div>{newDoYouKnowSlide.title}</div>;
          const root = createRoot(tempContainerDYK);
          root.render(doYouKnowSlideElement);

          await new Promise((resolve) => setTimeout(resolve, 100));

          screenshotUrl = await captureAndUploadScreenshot(tempContainerDYK, topic, type);
          document.body.removeChild(tempContainerDYK);
          root.unmount();

          if (screenshotUrl) {
            console.log('DoYouKnow screenshot URL:', screenshotUrl, topic, type, postContentId);
            await savePosts({
              postContentId,
              topic,
              type: 'doyouknow',
              status: 'success',
              images: [{ url: screenshotUrl, label: 'DoYouKnow Post' }],
              contentId: dykResult.data._id,
              contentType: 'DYKContent',
            }).unwrap();
            newPost.images = [{ url: screenshotUrl, label: 'DoYouKnow Post' }];
          }
          break;

        default:
          throw new Error(`Unknown post type: ${type}`);
      }

      setLocalPosts((prev) => prev.filter((p) => p.topic !== topic || p.type !== type));
      setCompletedPosts((prev) => [...prev, newPost]);
      setCurrentIndex(index);

      return true;
    } catch (err) {
      console.error(`Error generating post for ${topic}:`, err);
      setLocalPosts((prev) =>
        prev.map((p) =>
          p.topic === topic && p.type === type
            ? {
                ...p,
                status: 'error',
                errorMessage: err instanceof Error ? err.message : 'An error occurred',
              }
            : p
        )
      );
      setCurrentIndex(index - 1);
      return false;
    }
  };

  const generateAllPosts = async () => {
    if (isGenerating || !postContentId) return;
    setIsGenerating(true);

    const startIndex = currentIndex + 1;
    for (let i = startIndex; i < topics.length; i++) {
      const success = await generatePost(topics[i], i);
      if (!success) break;
    }

    setIsGenerating(false);
  };

  const handleEditPost = (post: Post) => {
    console.log('Editing post:', post);
    const commonState = {
      contentId: post.contentId,
      contentType: post.contentType,
      postContentId,
    };

    switch (post.type) {
      case 'image':
        navigate('/image-generator', {
          state: {
            ...commonState, 
            postContentId
          },
        });
        break;
      case 'carousel':
        navigate('/carousel', {
          state: {
            ...commonState,
            postContentId
          },
        });
        break;
      case 'doyouknow':
        navigate('/doyouknow', {
          state: {
            ...commonState,
            postContentId
          },
        });
        break;
    }
  };

  const handleContinueToPost = async () => {
    confirm("Do you want to continue to Post. If you continue with this you can't edit the posts again. Please confirm?")
    try {
      navigate('/select-media', { state: { postContentId } });
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
            disabled={isGenerating || !postContentId || isLoadingTopics || isFetchingPostContent || isLoadingPosts || isFetchingPosts}
            className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow-md disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isGenerating
              ? 'Generating...'
              : currentIndex < topics.length - 1
                ? 'Generate Posts'
                : 'Regenerate Posts'}
          </motion.button>
        </div>

        {isLoadingTopics || isFetchingPostContent || isLoadingPosts || isFetchingPosts ? (
          <p className="text-gray-400 text-center text-lg">Loading topics and posts...</p>
        ) : topicsError ? (
          <p className="text-red-400 text-center text-lg">{topicsError}</p>
        ) : postsError ? (
          <p className="text-red-400 text-center text-lg">{postsError}</p>
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
                      key={`${post.topic}-${post.type}`}
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
                      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-green-400/20 flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {getStatusIcon(post.status)}
                          <h3 className="text-lg font-medium ml-2 text-gray-200">
                            {post.topic}
                          </h3>
                        </div>
                      </div>
                      <div
                        ref={(el) => el && postRefs.current.set(`${post.topic}`, el)}
                        className="bg-gray-700 p-4 rounded-lg mb-4 flex-1"
                      >
                        {post.images && post.images.length > 0 ? (
                          post.type === 'carousel' ? (
                            <div className="flex overflow-x-auto space-x-4 pb-4">
                              {post.images.map((img, idx) => (
                                <div key={idx} className="flex-none w-64 flex flex-col">
                                  <img
                                    src={img.url}
                                    alt={img.label}
                                    className="w-64 h-64 object-cover rounded-lg"
                                  />
                                  <span className="text-gray-400 text-sm mt-2 text-center">{img.label}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
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
                        ) : (
                          <p className="text-gray-400">No content available</p>
                        )}
                      </div>
                      {post.status === 'success' && (post.images?.length ?? 0) > 0 && (
                        <div className="flex justify-start">
                          <motion.button
                            onClick={() => handleEditPost(post)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Edit
                          </motion.button>
                        </div>
                      )}
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

function createRoot(tempContainer: HTMLDivElement) {
  return reactCreateRoot(tempContainer);
}