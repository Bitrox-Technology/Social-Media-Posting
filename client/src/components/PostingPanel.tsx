import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { resetState } from '../store/appSlice';
import { usePostContentMutation } from '../store/api';
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

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { contentType, content: contentString, imageDataUrls } = location.state || {};
  console.log('PostingPanel - location.state:', location.state);

  const reduxContentType = useAppSelector((state) => state.app.contentType);
  const selectedIdea = useAppSelector((state) => state.app.selectedIdea);
  const selectedFile = useAppSelector((state) => state.app.selectedFile);

  const [postContent, setPostContent] = useState<ContentIdea>({
    title: '',
    content: '',
    hashtags: [],
  });

  useEffect(() => {
    // Prioritize navigation state (from Carousel) over Redux state
    if (contentString) {
      try {
        const parsedContent = JSON.parse(contentString);
        setPostContent(parsedContent);
        console.log('Parsed Content from navigation:', parsedContent);
      } catch (error) {
        console.error('Error parsing content from navigation:', error);
        setError('Failed to load post content from navigation.');
      }
    } else if (selectedIdea) {
      setPostContent(selectedIdea);
      console.log('Using selectedIdea from Redux:', selectedIdea);
    } else {
      console.warn('No content available from navigation or Redux');
      setError('No post content available.');
    }
  }, [contentString, selectedIdea]);

  useEffect(() => {
    // Handle images from navigation state (Carousel) or Redux (ImageGenerator)
    if (imageDataUrls) {
      const urls = Array.isArray(imageDataUrls) ? imageDataUrls : [imageDataUrls];
      setPreviewImages(urls);
      console.log('Set previewImages from navigation:', urls);
    } else if (selectedFile) {
      setPreviewImages([selectedFile.url]);
      console.log('Set previewImages from Redux selectedFile:', [selectedFile]);
    } else {
      console.warn('No images provided from navigation or Redux');
    }
  }, [imageDataUrls, selectedFile]);

  const [postContentMutation] = usePostContentMutation();

  const handlePost = async (platform: string) => {
    if (!postContent || !previewImages.length) {
      setError('No content or images available to post.');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', postContent.title);
      formData.append('content', postContent.content);
      formData.append('hashtags', JSON.stringify(postContent.hashtags));

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

  console.log('PostingPanel Rendered - previewImages:', previewImages);

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white space-y-8">
      <div className="flex items-center">
        <button
          onClick={handleBack}
          className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-semibold text-white ml-4">Ready to Post</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 space-y-6">
        <div className="rounded-lg overflow-hidden relative">
          <h3 className="text-xl font-semibold text-white mb-4">Image Preview</h3>
          {previewImages.length > 0 ? (
            previewImages.length === 1 ? (
              <div className="relative w-full h-full max-w-4xl mx-auto h-[600px] flex items-center">
                <img
                  src={previewImages[0]}
                  alt="Preview Image"
                  className="w-full h-full object-cover opacity-90 rounded-lg"
                  onError={(e) => console.error('Single image load error:', e)}
                  onLoad={() => console.log('Single image loaded successfully')}
                />
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{ clickable: true }}
                spaceBetween={20}
                slidesPerView={1}
                className="w-full max-w-4xl mx-auto relative"
              >
                {previewImages.map((imageUrl, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-[600px] flex items-center">
                      <img
                        src={imageUrl}
                        alt={`Carousel Slide ${index + 1}`}
                        className="w-full h-full object-cover opacity-90 rounded-lg"
                        onError={(e) => console.error(`Carousel image ${index + 1} load error:`, e)}
                        onLoad={() => console.log(`Carousel image ${index + 1} loaded successfully`)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
                <div className="swiper-button-prev-custom absolute top-1/2 left-4 transform -translate-y-1/2 text-white cursor-pointer z-10">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path d="M14 18l-6-6 6-6v12z" fill="currentColor" />
                  </svg>
                </div>
                <div className="swiper-button-next-custom absolute top-1/2 right-4 transform -translate-y-1/2 text-white cursor-pointer z-10">
                  <svg className="w-8 h-8" viewBox="0 0 24 24">
                    <path d="M10 6l6 6-6 6V6z" fill="currentColor" />
                  </svg>
                </div>
              </Swiper>
            )
          ) : (
            <p className="text-white">No images to display</p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Post Content</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={postContent.title}
              onChange={(e) => setPostContent({ ...postContent, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
            <textarea
              value={postContent.content}
              onChange={(e) => setPostContent({ ...postContent, content: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 h-24"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Hashtags</label>
            <input
              type="text"
              value={postContent.hashtags.join(' ')}
              onChange={(e) => setPostContent({ ...postContent, hashtags: e.target.value.split(' ').filter(Boolean) })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
              className="form-checkbox text-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Schedule post"
            />
            <span>Schedule Post</span>
          </label>

          {isScheduled && (
            <input
              type="datetime-local"
              value={scheduleDateTime}
              onChange={(e) => setScheduleDateTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              min={new Date().toISOString().slice(0, 16)}
              aria-label="Select date and time to schedule post"
            />
          )}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <motion.button
            onClick={() => handlePost('instagram')}
            disabled={posting || posted.includes('instagram') || (isScheduled && !scheduleDateTime)}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Instagram className="w-5 h-5" />
            <span>
              {posted.includes('instagram')
                ? 'Posted to Instagram'
                : posting
                ? 'Posting...'
                : isScheduled
                ? 'Schedule Post'
                : 'Post to Instagram'}
            </span>
            {posting && <Loader2 className="w-5 h-5 animate-spin" />}
            {posted.includes('instagram') && <CheckCircle className="w-5 h-5" />}
          </motion.button>

          <motion.button
            onClick={() => handlePost('facebook')}
            disabled={posting || posted.includes('facebook')}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Facebook className="w-5 h-5" />
            <span>
              {posted.includes('facebook')
                ? 'Posted to Facebook'
                : posting
                ? 'Posting...'
                : 'Post to Facebook'}
            </span>
            {posting && <Loader2 className="w-5 h-5 animate-spin" />}
            {posted.includes('facebook') && <CheckCircle className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
};