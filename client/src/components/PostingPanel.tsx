import React, { useState, useRef, useEffect } from 'react';
import { Instagram, Facebook, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { resetState } from '../store/appSlice';
import { usePostContentMutation } from '../store/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
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
  const [addLogo, setAddLogo] = useState(true);
  const [logoImage, setLogoImage] = useState<string>('/images/Logo.png'); // Set directly like Carousel
  const [updatedImages, setUpdatedImages] = useState<string[]>([]);
  const [logoError, setLogoError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Access state from navigation (from Carousel)
  const { contentType, topic, content: contentString, imageDataUrls } = location.state || {};
  const allImages = imageDataUrls || [];

  // Parse the content from navigation state
  const [postContent, setPostContent] = useState<ContentIdea>({
    title: '',
    content: '',
    hashtags: [],
  });

  useEffect(() => {
    if (contentString) {
      try {
        const parsedContent = JSON.parse(contentString);
        setPostContent(parsedContent);
      } catch (error) {
        console.error('Error parsing content:', error);
        setError('Failed to load post content.');
      }
    }
  }, [contentString]);

  // RTK Query mutation for posting content (renamed to postContentMutation)
  const [postContentMutation] = usePostContentMutation();

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Generate images with logo overlay when addLogo or logoImage changes
  useEffect(() => {
    const generateImagesWithLogo = async () => {
      if (!addLogo || !logoImage || !allImages.length) {
        setUpdatedImages(allImages);
        return;
      }

      const newImages: string[] = [];
      for (let i = 0; i < allImages.length; i++) {
        const slideElement = slideRefs.current[i];
        if (slideElement) {
          try {
            const canvas = await html2canvas(slideElement, { useCORS: true, logging: true });
            const imgData = canvas.toDataURL('image/png');
            newImages.push(imgData);
          } catch (err) {
            console.error(`Error generating canvas for slide ${i + 1}:`, err);
            setError(`Failed to generate image for slide ${i + 1}`);
          }
        }
      }

      setUpdatedImages(newImages);
      // Save updated images to localStorage
      try {
        localStorage.setItem('updatedCarouselImages', JSON.stringify(newImages));
      } catch (error) {
        console.error('Error saving updated images to localStorage:', error);
      }
    };

    generateImagesWithLogo();
  }, [addLogo, logoImage, allImages]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoDataUrl = reader.result as string;
        setLogoImage(logoDataUrl);
        setLogoError(null); // Clear any previous logo error
      };
      reader.onerror = () => {
        setLogoError('Failed to upload logo. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async (platform: string) => {
    if (!postContent) {
      setError('No content available to post.');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', postContent.title);
      formData.append('content', postContent.content);
      formData.append('hashtags', JSON.stringify(postContent.hashtags));

      const imagesToPost = updatedImages.length > 0 ? updatedImages : allImages;
      for (let i = 0; i < imagesToPost.length; i++) {
        const imgData = imagesToPost[i];
        if (imgData.startsWith('data:image')) {
          const response = await fetch(imgData);
          const blob = await response.blob();
          formData.append('images', blob, `slide-${i + 1}.png`);
        } else {
          formData.append('images', imgData);
        }
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
    navigate(-1);
  };

  const isImage = contentType === 'post';

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white space-y-8">
      <div className="flex items-center">
        <button
          onClick={handleBack}
          className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Go back to carousel"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-semibold text-white ml-4">Ready to Post</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 space-y-6">
        {/* Logo Upload and Toggle */}
        <div className="space-y-4">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={addLogo}
              onChange={(e) => setAddLogo(e.target.checked)}
              className="form-checkbox text-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Add logo to images"
            />
            <span>Add Logo to Images</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            />
          </div>
          {logoError && <p className="text-red-500 text-sm">{logoError}</p>}
        </div>

        {/* Carousel Preview */}
        <div className="rounded-lg overflow-hidden relative">
          <h3 className="text-xl font-semibold text-white mb-4">Carousel Preview</h3>
          {isImage && allImages.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              className="w-full max-w-4xl mx-auto h-[600px]"
            >
              {allImages.map((image: string, index: number) => (
                <SwiperSlide key={index}>
                  <div
                    ref={(el) => (slideRefs.current[index] = el)}
                    className="relative w-full h-full flex items-center"
                  >
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover opacity-90 rounded-lg"
                    />
                    {addLogo && logoImage && (
                      <img
                        src={logoImage}
                        alt="Logo"
                        className="absolute right-14 top-10 w-30 h-12 object-contain z-10"
                        onError={() => setLogoError('Failed to load logo in slide.')}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-white">No images to display</p>
          )}
        </div>

        {/* Post Content */}
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

        {/* Scheduling Toggle and Input */}
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
            aria-label={
              posted.includes('instagram')
                ? 'Posted to Instagram'
                : posting
                ? 'Posting to Instagram'
                : isScheduled
                ? 'Schedule post on Instagram'
                : 'Post to Instagram'
            }
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
            aria-label={
              posted.includes('facebook')
                ? 'Posted to Facebook'
                : posting
                ? 'Posting to Facebook'
                : 'Post to Facebook'
            }
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