import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { Calendar, Linkedin, Instagram, Facebook, Clock, Share2, CheckCircle } from 'lucide-react';
import { useLazyGetSavePostsQuery, useLazyAuthLinkedInQuery, useLazyGetUserAllPostsQuery } from '../../store/api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-datepicker/dist/react-datepicker.css';

interface Image {
  url: string;
  label: string;
  _id: string;
}

interface Post {
  _id: string;
  images: Image[];
  title: string;
  description: string;
  hashtags: string[];
  contentType: string;
  topic: string;
  status: string;
  postContentId: string;
  type: string; // Added to support normalized type
}

interface Schedule {
  platforms: string[];
  dateTime: Date | null;
}

const platformIcons = {
  linkedin: <Linkedin className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
};

export const UserAllPosts: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<{ [postId: string]: Schedule }>({});
  const [getUserAllPosts, { data: rawPosts, isLoading, isError, error }] = useLazyGetUserAllPostsQuery();
  const [authLinkedIn] = useLazyAuthLinkedInQuery();

  // Map posts and normalize type
  const posts = Array.isArray(rawPosts?.data)
    ? rawPosts.data.map((post) => ({
        ...post,
        type: post.contentType === 'DYKContent' ? 'dyk' : post.contentType === 'CarouselContent' ? 'carousel' : 'image',
      }))
    : [];

  // Group posts into pairs for grid layout
  const postPairs = [];
  for (let i = 0; i < posts.length; i += 2) {
    postPairs.push(posts.slice(i, i + 2));
  }

  useEffect(() => {
    // Fetch all posts for the user (assuming postContentId is optional or fetched differently)
    getUserAllPosts(); // Modify based on your API; assuming it fetches all posts if postContentId is empty
  }, [getUserAllPosts]);

  const handleScheduleSingle = (postId: string) => {
    const schedule = schedules[postId];
    if (!schedule?.platforms.length || !schedule.dateTime) {
      alert('Please select at least one platform and a date/time');
      return;
    }
    // Simulate scheduling (replace with actual API call)
    console.log('Scheduling post:', { postId, ...schedule });
    setSchedules((prev) => ({
      ...prev,
      [postId]: { platforms: [], dateTime: null },
    }));
    alert('Post scheduled successfully!');
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

  const renderImage = (image: Image) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full aspect-square max-w-sm mx-auto rounded-xl overflow-hidden shadow-lg bg-gray-800"
    >
      <img
        src={image.url}
        alt={image.label}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-white text-sm font-medium text-center">{image.label}</p>
      </div>
    </motion.div>
  );

  const renderPost = (post: Post) => {
    if (!post.images || !post.images.length) {
      return <div className="text-center text-gray-400">No images available for this post.</div>;
    }

    if (post.type === 'carousel') {
      return (
        <div className="w-full">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            className="rounded-xl overflow-hidden"
          >
            {post.images.map((image) => (
              <SwiperSlide key={image._id}>{renderImage(image)}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      );
    }

    return renderImage(post.images[0]);
  };

  const handleAuthLinkedIn = async () => {
    try {
      const response = await authLinkedIn().unwrap();
      window.location.href = response.data;
    } catch (error) {
      console.error('Error during LinkedIn authentication:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Error Loading Posts</h1>
          <p className="text-gray-400">{JSON.stringify(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-12 text-center"
        >
          Your Generated Posts
        </motion.h1>

        {posts.length === 0 && (
          <div className="text-center text-gray-400">No posts found.</div>
        )}

        <AnimatePresence>
          <div className="space-y-8">
            {postPairs.map((pair, pairIndex) => (
              <motion.div
                key={pairIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pairIndex * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {pair.map((post) => (
                  <motion.div
                    key={post._id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden"
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                        {post.topic}
                      </h2>
                      <h3 className="text-xl font-medium text-gray-200 mb-2 text-center">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 text-center">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {post.hashtags.map((hashtag: string, index: number) => (
                            <span
                                key={index}
                                className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full"
                            >
                                {hashtag}
                            </span>
                        ))}
                      </div>
                      <p className="text-gray-500 text-sm mb-4 text-center">
                        Content Type: {post.contentType} | Status: {post.status}
                      </p>
                      {renderPost(post)}
                    </div>

                    <div className="bg-gray-900/50 p-6 space-y-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        {Object.entries(platformIcons).map(([platform, icon]) => (
                          <button
                            key={platform}
                            onClick={() => {
                              if (platform === 'linkedin') {
                                handleAuthLinkedIn();
                              }
                              updateSchedule(post._id, platform);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                              schedules[post._id]?.platforms.includes(platform)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {icon}
                            <span className="capitalize text-sm">{platform}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-center gap-4">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <DatePicker
                          selected={schedules[post._id]?.dateTime}
                          onChange={(date: Date | null) => updateSchedule(post._id, '', date)}
                          showTimeSelect
                          dateFormat="Pp"
                          className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full max-w-xs text-center"
                          placeholderText="Select date and time"
                          minDate={new Date()}
                        />
                        <Clock className="w-5 h-5 text-gray-400" />
                      </div>

                      <button
                        onClick={() => handleScheduleSingle(post._id)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
                      >
                        Schedule Post
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};