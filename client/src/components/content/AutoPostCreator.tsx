import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { Loader2, CheckCircle } from 'lucide-react';

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
  useUploadCarouselToCloudinaryMutation
} from '../../store/api';

import { useTheme } from '../../context/ThemeContext';
import { Header } from './AutoPost/Header';
import { PendingPostCard } from './AutoPost/PendingPostCard';
import { PostCard } from './AutoPost/PostCard';
import { LoadingState } from './AutoPost/LoadingState';
import { ContinueButton } from './AutoPost/ContinueButton';
import { Post, ImageContent, CarouselContent } from './AutoPost/Types';
import { imageTemplates } from '../../templetes/ImageTemplate';
import { carouselTemplates, Slide } from '../../templetes/templetesDesign';
import { doYouKnowTemplates, DoYouKnowSlide } from '../../templetes/doYouKnowTemplates';
import { generateImagePost, generateCarouselPost, generateDoYouKnowPost } from '../../Utilities/functions';

import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';

type BrandStyle = 'Modern' | 'Traditional' | 'Playful' | 'Corporate' | 'Minimal';


export const AutoPostCreator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  // State management
  const [posts, setLocalPosts] = useState<Post[]>([]);
  const [completedPosts, setCompletedPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingTopic, setGeneratingTopic] = useState<string | null>(null); // Track active post
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [postContentId, setPostContentId] = useState<string | null>(location.state?.postContentId || null);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [userLogo, setUserLogo] = useState<string | null>(null);
  const { isOpen, config, showAlert, closeAlert, handleConfirm, error: showErrorAlert, confirm: showConfirmAlert } = useAlert()

  // API hooks
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
  const [uploadCarouselToCloudinary] = useUploadCarouselToCloudinaryMutation();

  // References and data
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

  const isLoading = isLoadingTopics || isFetchingPostContent || isLoadingPosts || isFetchingPosts;

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
        const topicsResponse = await getPostContent({ postContentId }).unwrap();
        if (topicsResponse.data.topics && topicsResponse.data.topics.length > 0) {
          const fetchedTopics = topicsResponse.data.topics.slice(0, 7);
          setTopics(fetchedTopics);
          setUserLogo(topicsResponse?.data?.logo);


          try {
            const postsResponse = await getSavePosts({ postContentId }).unwrap();
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

            setPostsError('Failed to load saved posts. You can still generate new posts.');
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

    // Reset generation state on mount
    setIsGenerating(false);
    setGeneratingTopic(null);
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

  // const captureAndUploadScreenshot = async (ref: HTMLDivElement | null, topic: string, type: string) => {
  //   if (!ref) return '';
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   const canvas = await html2canvas(ref, { useCORS: true, scale: 2, backgroundColor: null });
  //   const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), 'image/png'));
  //   const formData = new FormData();
  //   formData.append('image', blob, `${topic}-${type}.png`);
  //   const result = await uploadImageToCloudinary(formData).unwrap();
  //   return result?.data?.secure_url || '';
  // };

  const generatePost = async (topic: string, index: number) => {

    if (!postContentId) {
      throw new Error('No postContentId available');
    }

    const type = postTypes[index % postTypes.length];
    setGeneratingTopic(`${topic}`);
    setLocalPosts((prev) =>
      prev.map((p) =>
        p.topic === topic && p.type === type ? { ...p, status: 'generating' } : p
      )
    );

    try {
      let newPost: Post | undefined;

      switch (type) {
        case 'image':
          newPost = await generateImagePost(
            topic,
            type,
            postContentId,
            {
              generateImageContent,
              generateImage,
              imageContent,
              savePosts,
              uploadImageToCloudinary,
            },
            userLogo || '/images/Logo1.png',
            'Modern',
            showAlert
          );
          console.log('Generated Image Post:', newPost);
          break;

        case 'carousel':
          newPost = await generateCarouselPost(
            topic,
            type,
            postContentId,
            {
              generateCarousel,
              carouselContent,
              savePosts,
              uploadCarouselToCloudinary, // Pass the new mutation
            },
            showAlert,
            userLogo || '/images/Logo1.png',
          );
          console.log('Generated Carousel Post:', newPost);
          break;

        // case 'doyouknow':
        //   newPost = await generateDoYouKnowPost(
        //     topic,
        //     type,
        //     postContentId,
        //     {
        //       generateDoYouKnow,
        //       dykContent,
        //       savePosts,
        //       uploadImageToCloudinary,
        //     },
        //     showAlert,
        //     userLogo || '/images/Logo1.png',
        //   );
        //   console.log('Generated Do You Know Post:', newPost);
        //   break;
        default:
          throw new Error(`Unknown post type: ${type}`);
      }

      // Only update state if newPost is defined
      if (newPost) {
        setLocalPosts((prev) => prev.filter((p) => p.topic !== topic || p.type !== type));
        setCompletedPosts((prev) => [...prev, newPost]);
        setCurrentIndex(index);
        setGeneratingTopic(null);
        return true;
      } else {
        throw new Error('Failed to generate post: newPost is undefined');
      }
    } catch (err) {
      console.error(`Error generating post for ${topic}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setLocalPosts((prev) =>
        prev.map((p) =>
          p.topic === topic && p.type === type
            ? {
              ...p,
              status: 'error',
              errorMessage,
            }
            : p
        )
      );
      setCurrentIndex(index - 1);
      setGeneratingTopic(null);
      return false;
    }
  };

  const generateAllPosts = async () => {
    if (isGenerating || !postContentId || isLoading) return;
    setIsGenerating(true);

    const startIndex = currentIndex + 1;
    for (let i = startIndex; i < topics.length; i++) {
      const success = await generatePost(topics[i], i);
      if (!success) break;
    }

    setIsGenerating(false);
  };

  // const handleGenerateSinglePost = async (topic: string, index: number) => {
  //   if (isGenerating || !postContentId || isLoading) return;
  //   setIsGenerating(true);
  //   await generatePost(topic, index);
  //   setIsGenerating(false);
  // };

  const handleEditPost = (post: Post) => {
    const commonState = {
      contentId: post.contentId,
      contentType: post.contentType,
      postContentId,
    };

    switch (post.type) {
      case 'image':
        navigate('/image-generator', {
          state: { ...commonState, postContentId },
        });
        break;
      case 'carousel':
        navigate('/carousel', {
          state: { ...commonState, postContentId },
        });
        break;
      case 'doyouknow':
        navigate('/doyouknow', {
          state: { ...commonState, postContentId },
        });
        break;
    }
  };

  const handleContinueToPost = async () => {
    // Show the confirmation dialog using the confirm method from useAlert
    showConfirmAlert(
      'Continue to Post',
      'Do you want to continue to Post? If you continue, you won\'t be able to edit these posts again. Please confirm.',
      async () => {
        navigate('/select-media', { state: { postContentId } });

      }
    );
    return;
  }

  const handleBack = () => navigate('/topic', { state: { fromAutoPostCreator: true } });

  // Calculate progress for the progress bar
  const progressPercentage = topics.length > 0 ? (completedPosts.length / topics.length) * 100 : 0;

  return (
    <div
      className={`min-h-screen ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
        : 'bg-gradient-to-br from-gray-50 to-white'
        } px-4 py-6 md:py-12`}
    >
      <div
        className={`relative max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-10 ${theme === 'dark' ? '' : 'bg-white/90 shadow-xl rounded-xl border border-gray-200'
          }`}
      >
        <Header
          theme={theme}
          handleBack={handleBack}
          generateAllPosts={generateAllPosts}
          isGenerating={isGenerating}
          currentIndex={currentIndex}
          topicsLength={topics.length}
          isLoading={isLoading}
        />

        {topics.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span
                className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Generation Progress
              </span>
              <span
                className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
              >
                {completedPosts.length}/{topics.length} Posts
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <motion.div
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <LoadingState
          isLoading={isLoading}
          error={topicsError || postsError}
          theme={theme}
        />

        {!isLoading && !topicsError && !postsError && topics.length === 0 && (
          <div
            className={`rounded-xl p-6 text-center ${theme === 'dark'
              ? 'bg-yellow-500/10 backdrop-blur-lg'
              : 'bg-yellow-100 border border-yellow-200'
              }`}
          >
            <p
              className={`text-base md:text-lg ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`}
            >
              No topics found. Please go back and select topics.
            </p>
          </div>
        )}

        {!isLoading && !topicsError && !postsError && topics.length > 0 && (
          <div className="space-y-8 md:space-y-12">
            <AnimatePresence>
              {posts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4 md:space-y-6"
                >
                  <h2
                    className={`text-xl md:text-2xl font-semibold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}
                  >
                    <Loader2
                      className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        } ${isGenerating ? 'animate-spin' : ''}`}
                    />
                    In Progress
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {posts.map((post) => (
                      <PendingPostCard
                        key={`${post.topic}-${post.type}`}
                        post={post}
                        theme={theme}
                        isGenerating={
                          post.status === 'generating' && generatingTopic === `${post.topic}-${post.type}`
                        }
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {completedPosts.length > 0 && (
              <div className="space-y-4 md:space-y-6">
                <h2
                  className={`text-xl md:text-2xl font-semibold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}
                >
                  <CheckCircle
                    className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}
                  />
                  Completed Posts
                </h2>
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                  {completedPosts
                    .filter((post): post is Post => post !== undefined && post !== null) // Filter out undefined/null
                    .map((post, index) => (
                      <PostCard
                        key={`${post.topic}-${post.type}`}
                        post={post}
                        theme={theme}
                        onEditPost={handleEditPost}
                        registerRef={(topic, ref) => postRefs.current.set(topic, ref)}
                      />
                    ))}
                </div>
              </div>
            )}

            {completedPosts.length === topics.length && (
              <ContinueButton onClick={handleContinueToPost} theme={theme} />
            )}
          </div>
        )}
      </div>
      <Alert
        type={config.type}
        title={config.title}
        message={config.message}
        isOpen={isOpen}
        onClose={closeAlert}
        onConfirm={config.type === 'confirm' ? handleConfirm : undefined}
      />
    </div>
  );
};