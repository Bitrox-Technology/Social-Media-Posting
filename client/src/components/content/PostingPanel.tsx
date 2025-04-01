import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { resetState } from '../../store/appSlice';
import { usePostContentMutation } from '../../store/api';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

export const PostingPanel: React.FC = () => {
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [contentSource, setContentSource] = useState<'single' | 'carousel' | 'doyouknow' | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { contentType, content: contentString, imageDataUrls, cloudinaryUrl, generatedImageUrl } = location.state || {};
  const reduxContentType = useAppSelector((state) => state.app.contentType);
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);
  const selectedFile = useAppSelector((state) => state.app.selectedFile);

  const [postContent, setPostContent] = useState<ContentIdea>({
    title: '',
    content: '',
    hashtags: [],
  });

  const [postContentMutation] = usePostContentMutation();

  useEffect(() => {
    // Determine content source and set post content
    if (contentString) {
      // Likely from Carousel
      try {
        const parsedContent = JSON.parse(contentString);
        setPostContent(parsedContent);
        setContentSource('carousel');
      } catch (error) {
        console.error('Error parsing content from navigation:', error);
        setError('Failed to load carousel content.');
      }
    } else if (cloudinaryUrl || generatedImageUrl) {
      // Likely from DoYouKnow
      setPostContent({
        title: 'Did You Know?',
        content: 'Check out this interesting fact!',
        hashtags: ['#DidYouKnow', '#Facts'],
      });
      setContentSource('doyouknow');
    } else if (selectedIdea) {
      // Single post from Redux (ImageGenerator)
      setPostContent(selectedIdea);
      setContentSource('single');
    } else {
      setError('No post content available.');
      setContentSource(null);
    }
  }, [contentString, cloudinaryUrl, generatedImageUrl, selectedIdea]);

  useEffect(() => {
    // Handle images based on source
    if (imageDataUrls) {
      // Carousel images
      const urls = Array.isArray(imageDataUrls) ? imageDataUrls : [imageDataUrls];
      setPreviewImages(urls);
    } else if (cloudinaryUrl) {
      // DoYouKnow image
      setPreviewImages([cloudinaryUrl]);
    } else if (selectedFile) {
      // Single post image from Redux
      setPreviewImages([selectedFile.url]);
    } else {
      console.warn('No images provided');
    }
  }, [imageDataUrls, cloudinaryUrl, selectedFile]);

  const handlePost = async (platform: string) => {
    if (!postContent || !previewImages.length) {
      setError('No content or images to post.');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', postContent.title);
      formData.append('content', postContent.content);
      formData.append('hashtags', JSON.stringify(postContent.hashtags));
      formData.append('platform', platform);
      formData.append('contentSource', contentSource || 'unknown');

      for (let i = 0; i < previewImages.length; i++) {
        const response = await fetch(previewImages[i]);
        const blob = await response.blob();
        formData.append('images', blob, `image_${i + 1}.png`);
      }

      if (isScheduled && scheduleDateTime) {
        formData.append('scheduleTime', scheduleDateTime);
      }

      await postContentMutation(formData).unwrap();
      setPosted((prev) => [...prev, platform]);
      dispatch(resetState());
      localStorage.removeItem('updatedCarouselImages');
      localStorage.removeItem('carouselImages');
    } catch (err: any) {
      console.error(`Error posting to ${platform}:`, err);
      setError(err.data?.error || `Failed to post to ${platform}`);
    } finally {
      setPosting(false);
    }
  };

  const handleBack = () => {
    navigate(-1 as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
            Share Your Post
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 space-y-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-100">Preview</h2>
            {previewImages.length > 0 ? (
              previewImages.length === 1 ? (
                <div className="w-full max-w-2xl mx-auto">
                  <img
                    src={previewImages[0]}
                    alt="Post Preview"
                    className="w-full h-auto rounded-lg shadow-lg border border-gray-600"
                  />
                </div>
              ) : (
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
                  pagination={{ clickable: true }}
                  spaceBetween={20}
                  slidesPerView={1}
                  className="w-full max-w-2xl mx-auto"
                >
                  {previewImages.map((imageUrl, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={imageUrl}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-auto rounded-lg shadow-lg border border-gray-600"
                      />
                    </SwiperSlide>
                  ))}
                  <div className="swiper-button-prev-custom absolute top-1/2 left-4 text-yellow-400 -translate-y-1/2 z-10">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path d="M14 18l-6-6 6-6v12z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="swiper-button-next-custom absolute top-1/2 right-4 text-yellow-400 -translate-y-1/2 z-10">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path d="M10 6l6 6-6 6V6z" fill="currentColor" />
                    </svg>
                  </div>
                </Swiper>
              )
            ) : (
              <p className="text-gray-400 text-center">No images to display</p>
            )}
          </div>

          {/* Post Content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-100">Post Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={postContent.title}
                  onChange={(e) => setPostContent({ ...postContent, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                <textarea
                  value={postContent.content}
                  onChange={(e) => setPostContent({ ...postContent, content: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600 h-24 resize-none"
                  placeholder="Enter post content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Hashtags</label>
                <input
                  type="text"
                  value={postContent.hashtags.join(' ')}
                  onChange={(e) => setPostContent({ ...postContent, hashtags: e.target.value.split(' ').filter(Boolean) })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                  placeholder="#hashtag1 #hashtag2"
                />
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="w-5 h-5 text-yellow-400 border-gray-600 rounded focus:ring-2 focus:ring-yellow-400"
              />
              <span className="text-lg">Schedule Post</span>
            </label>
            {isScheduled && (
              <input
                type="datetime-local"
                value={scheduleDateTime}
                onChange={(e) => setScheduleDateTime(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 border border-gray-600"
                min={new Date().toISOString().slice(0, 16)}
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-center p-3 bg-red-900/20 rounded-lg border border-red-700">
              {error}
            </div>
          )}

          {/* Post Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <motion.button
              onClick={() => handlePost('instagram')}
              disabled={posting || posted.includes('instagram') || (isScheduled && !scheduleDateTime)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-400 hover:to-orange-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="w-5 h-5" />
              <span>
                {posted.includes('instagram')
                  ? 'Posted'
                  : posting
                  ? 'Posting...'
                  : isScheduled
                  ? 'Schedule'
                  : 'Post to Instagram'}
              </span>
              {posting && <Loader2 className="w-5 h-5 animate-spin" />}
              {posted.includes('instagram') && <CheckCircle className="w-5 h-5" />}
            </motion.button>

            <motion.button
              onClick={() => handlePost('facebook')}
              disabled={posting || posted.includes('facebook') || (isScheduled && !scheduleDateTime)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-400 hover:to-orange-400 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Facebook className="w-5 h-5" />
              <span>
                {posted.includes('facebook')
                  ? 'Posted'
                  : posting
                  ? 'Posting...'
                  : isScheduled
                  ? 'Schedule'
                  : 'Post to Facebook'}
              </span>
              {posting && <Loader2 className="w-5 h-5 animate-spin" />}
              {posted.includes('facebook') && <CheckCircle className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};