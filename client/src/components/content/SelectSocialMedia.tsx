import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLazyGetSavePostsQuery } from '../../store/api';

// Register Swiper modules
SwiperCore.use([Navigation, Pagination]);

interface Image {
  url: string;
  label: string;
  _id: string;
}

interface Post {
  _id: string;
  topic: string;
  type: 'carousel' | 'dyk' | 'image';
  images: Image[];
  postContentId: string;
  status: string;
  contentId: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface Schedule {
  platforms: string[];
  dateTime: Date | null;
}

interface ApiResponse {
  statusCode: number;
  data: Post[];
  message: string;
  success: boolean;
}

export const SelectSocialMedia: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<{ [postId: string]: Schedule }>({});
  const { postContentId } = location.state || {};

  // Fetch posts
  const [getSavePosts, { data: rawPosts, isLoading, isError, error }] = useLazyGetSavePostsQuery();

  // Normalize posts
  const posts = Array.isArray(rawPosts?.data)
    ? rawPosts.data.map((post) => ({
        ...post,
        type: post.type === 'doyouknow' ? 'dyk' : post.type,
      }))
    : [];

  // Chunk posts into pairs
  const postPairs = [];
  for (let i = 0; i < posts.length; i += 2) {
    postPairs.push(posts.slice(i, i + 2));
  }

  useEffect(() => {
    if (postContentId) {
      getSavePosts({ postContentId }).catch((err) =>
        console.error('Failed to fetch posts:', err)
      );
    }
  }, [postContentId, getSavePosts]);

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Raw response:', rawPosts);
    console.log('Normalized posts:', posts);
  }, [location.state, rawPosts, posts]);

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleScheduleAll = () => {
    if (!selectedPlatforms.length) {
      alert('Please select at least one platform');
      return;
    }
    console.log('Scheduled all posts for platforms:', selectedPlatforms);
    const scheduledData = posts.map((post) => ({
      postId: post._id,
      topic: post.topic,
      type: post.type,
      platforms: selectedPlatforms,
      dateTime: new Date().toISOString(),
    }));
    console.log('Collective schedule:', scheduledData);
    navigate('/dashboard');
  };

  const handleScheduleSingle = (postId: string) => {
    const schedule = schedules[postId];
    if (!schedule?.platforms.length || !schedule.dateTime) {
      alert('Please select platforms and a date/time');
      return;
    }
    console.log('Scheduled single post:', {
      postId,
      platforms: schedule.platforms,
      dateTime: schedule.dateTime.toISOString(),
    });
    setSchedules((prev) => ({
      ...prev,
      [postId]: { platforms: [], dateTime: null },
    }));
  };

  const updateSchedule = (postId: string, platform: string, dateTime?: Date | null) => {
    setSchedules((prev) => {
      const current = prev[postId] || { platforms: [], dateTime: null };
      const platforms = platform
        ? current.platforms.includes(platform)
          ? current.platforms.filter((p) => p !== platform)
          : [...current.platforms, platform]
        : current.platforms;
      return {
        ...prev,
        [postId]: {
          platforms,
          dateTime: dateTime !== undefined ? dateTime : current.dateTime,
        },
      };
    });
  };

  const renderImage = (image: Image, index: number) => (
    <div className="relative w-full max-w-sm mx-auto rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 border border-gray-700">
      <img
        src={image.url}
        alt={image.label}
        className="w-full max-h-56 object-contain rounded-t-lg"
        loading="lazy"
      />
      <div className="p-2 bg-gray-800 rounded-b-lg">
        <p className="text-gray-300 text-center text-xs">{image.label}</p>
      </div>
    </div>
  );

  const renderPost = (post: Post) => {
    if (post.type === 'image') {
      const image = post.images[0];
      if (!image) return null;
      return (
        <div className="flex flex-col items-center">
          {renderImage(image, 0)}
          <p className="text-gray-200 mt-3 text-center text-lg font-medium">{post.topic}</p>
        </div>
      );
    } else if (post.type === 'carousel') {
      if (!post.images.length) return null;
      return (
        <div className="relative w-full max-w-full">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true, el: '.swiper-pagination' }}
            spaceBetween={20}
            slidesPerView={1}
            className="mb-4"
          >
            {post.images.map((image, index) => (
              <SwiperSlide key={image._id}>
                <div className="flex justify-center">{renderImage(image, index)}</div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev text-gray-200 opacity-75 hover:opacity-100 scale-75"></div>
          <div className="swiper-button-next text-gray-200 opacity-75 hover:opacity-100 scale-75"></div>
          <div className="swiper-pagination mt-2"></div>
        </div>
      );
    } else if (post.type === 'dyk') {
      const image = post.images[0];
      if (!image) return null;
      return (
        <div className="flex flex-col items-center">
          {renderImage(image, 0)}
          <p className="text-gray-200 mt-3 text-center text-lg font-medium">{post.topic}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Select Social Media</h1>
        <p className="text-red-400 text-center">Error: {JSON.stringify(error)}</p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Select Social Media</h1>
        <p className="text-gray-400 text-center">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-8 text-center">
        Select Social Media
      </h1>

      {/* Collective Platform Selection */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-md mx-auto">
        {['linkedin', 'instagram', 'facebook'].map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformSelect(platform)}
            className={`px-3 py-1 rounded-md shadow-sm ${
              selectedPlatforms.includes(platform)
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-600 hover:bg-gray-500'
            } transition-all duration-200 text-sm`}
          >
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </button>
        ))}
      </div>
      <button
        onClick={handleScheduleAll}
        disabled={!selectedPlatforms.length}
        className={`px-4 py-1.5 rounded-lg shadow-sm mx-auto block ${
          selectedPlatforms.length
            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        } transition-all duration-200 mb-10 text-sm`}
      >
        Schedule All Posts
      </button>

      {/* Posts in Pairs */}
      <div className="space-y-12">
        {postPairs.map((pair, pairIndex) => (
          <div
            key={pairIndex}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in"
          >
            {pair.map((post) => (
              <div
                key={post._id}
                className="bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col"
              >
                <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                  {post.topic}{' '}
                  <span className="text-gray-400 text-lg">
                    ({post.type.charAt(0).toUpperCase() + post.type.slice(1)})
                  </span>
                </h2>
                {renderPost(post) || (
                  <p className="text-gray-400 text-center">
                    No content available for this post.
                  </p>
                )}
                {/* Individual Scheduling */}
                <div className="mt-6 max-w-md mx-auto bg-gray-700 p-4 rounded-md border border-gray-600">
                  <h3 className="text-base font-medium text-yellow-400 mb-3 text-center">
                    Schedule Post
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {['linkedin', 'instagram', 'facebook'].map((platform) => (
                      <button
                        key={platform}
                        onClick={() => updateSchedule(post._id, platform)}
                        className={`px-3 py-1 rounded-md shadow-sm ${
                          schedules[post._id]?.platforms.includes(platform)
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-600 hover:bg-gray-500'
                        } transition-all duration-200 text-sm`}
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-300 mb-1 text-sm text-center">
                      Date & Time
                    </label>
                    <DatePicker
                      selected={schedules[post._id]?.dateTime}
                      onChange={(date: Date | null) => {
                        if (date) {
                          updateSchedule(post._id, '', date);
                        }
                      }}
                      showTimeSelect
                      dateFormat="Pp"
                      className="w-full px-3 py-1 bg-gray-600 text-white rounded-md text-sm"
                      placeholderText="Select date and time"
                      minDate={new Date()}
                    />
                  </div>
                  <button
                    onClick={() => handleScheduleSingle(post._id)}
                    className="w-full px-4 py-1.5 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all duration-200 text-sm"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};