import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { useLazyAuthFacebookQuery, useLazyAuthInstagramQuery, useLazyAuthLinkedInQuery, useLazyGetUserPostDetailQuery, useLinkedInPostMutation } from '../../store/api';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowLeft,
  Calendar,
  Share2,
  Edit2,
  Tag,
  Clock,
  Info,
  Globe,
  MessageSquare,
  Eye,
  Heart,
  Bookmark,
  Linkedin,
  Instagram,
  Facebook,
} from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'react-datepicker/dist/react-datepicker.css';

interface Image {
  url: string;
  label: string;
  _id: string;
}

interface Post {
  _id: string;
  images: Image[];
  topic: string;
  title: string;
  description: string;
  hashtags: string[];
  contentType: string;
  status: string;
  type: string;
  createdAt: string;
}

interface Schedule {
  platforms: string[];
  dateTime: Date | null;
}

export const UserPostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [getUserPostDetail, { data, isLoading, isError, error }] = useLazyGetUserPostDetailQuery();
  const [authFacebook] = useLazyAuthFacebookQuery()
  const [authLinkdIn] = useLazyAuthLinkedInQuery()
  const [authInstagram] = useLazyAuthInstagramQuery()

  const [linkedInPost] = useLinkedInPostMutation()
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>({ platforms: [], dateTime: null });

  console.log(schedule)

  // Theme-based styles
  const themeStyles = {
    light: {
      background: 'bg-gradient-to-br from-gray-100 to-gray-200',
      cardBackground: 'bg-white/80',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-300',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-300',
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800',
      cardBackground: 'bg-gray-800/50',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      border: 'border-gray-700/50',
      buttonBg: 'bg-blue-500',
      buttonHover: 'hover:bg-blue-600',
      inputBg: 'bg-gray-800',
      inputBorder: 'border-gray-700',
    },
  };

  const currentTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles.dark;

  useEffect(() => {
    if (postId) {
      getUserPostDetail({ postId });
    }
  }, [postId, getUserPostDetail]);

  const post: Post | undefined = data?.data?.[0];

  const platformIcons = {
    linkedin: <Linkedin className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
  };

  const updateSchedule = (platform?: string, dateTime?: Date | null) => {
    setSchedule((prev) => {
      let platforms = prev.platforms;
      if (platform) {
        platforms = prev.platforms.includes(platform)
          ? prev.platforms.filter((p) => p !== platform)
          : [...prev.platforms, platform];
      }
      return {
        platforms,
        dateTime: dateTime !== undefined ? dateTime : prev.dateTime,
      };
    });
  };

  const handleSchedulePost = async() => {
    if (!schedule.platforms.length) {
      alert('Please select at least one platform and a date/time');
      return;
    }

    console.log(schedule)

    try {
       if (schedule.platforms.includes("linkedin")){
          
       } else if(schedule.platforms.includes("instagram")){

       }else if (schedule.platforms.includes("facebook")){

       }


      // let response = await authLinkdIn().unwrap()
      // console.log("Response Auth: ", response.data)
      // window.location.href= response.data
      // return;
      
      // let response = await authFacebook().unwrap()
      // console.log("Response Auth: ", response.data)
      // window.location.href= response.data

      //  let response = await authInstagram().unwrap()
      // console.log("Response Auth: ", response.data)
      // window.location.href= response.data
    } catch (error) {
       console.log("Error", error)
    }
    
    setSchedule({ platforms: [], dateTime: null });
    setIsScheduling(false);
  };

  const renderImage = (image: Image) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative w-full aspect-square rounded-xl overflow-hidden shadow-xl ${currentTheme.cardBackground}`}
    >
      <img
        src={image.url}
        alt={image.label}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <p className={`${currentTheme.textPrimary} text-sm font-medium`}>{image.label}</p>
      </div>
    </motion.div>
  );

  const renderPost = () => {
    if (!post?.images?.length) {
      return (
        <div className={`text-center ${currentTheme.textSecondary} p-8 ${currentTheme.cardBackground} rounded-xl`}>
          <Info className={`w-12 h-12 mx-auto mb-4 ${currentTheme.textSecondary}`} />
          <p>No images available for this post</p>
        </div>
      );
    }

    if (post.type === 'carousel') {
      return (
        <div className="w-full">
          <Swiper
            modules={[Navigation, Pagination, EffectFade]}
            navigation
            pagination={{ clickable: true }}
            effect="fade"
            spaceBetween={0}
            slidesPerView={1}
            className="rounded-xl overflow-hidden shadow-2xl"
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

  if (isLoading) {
    return (
      <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className={currentTheme.textSecondary}>Loading post details...</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className={`min-h-screen ${currentTheme.background} p-6`}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${currentTheme.cardBackground} backdrop-blur-sm rounded-xl p-8 ${currentTheme.border}`}
          >
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              {isError ? 'Error Loading Post' : 'Post Not Found'}
            </h1>
            {isError && (
              <p className={`${currentTheme.textSecondary} mb-6`}>
                {error instanceof Error ? error.message : 'An error occurred'}
              </p>
            )}
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 px-6 py-3 ${currentTheme.buttonBg} ${currentTheme.textPrimary} rounded-xl ${currentTheme.buttonHover} transition-all mx-auto`}
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} p-4 sm:p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-4 py-2 ${currentTheme.cardBackground} ${currentTheme.textPrimary} rounded-xl hover:bg-gray-700/50 transition-all`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsScheduling(true)}
              className={`p-2 ${currentTheme.cardBackground} rounded-lg hover:bg-gray-700/50 transition-all`}
            >
              <Share2 className="w-5 h-5 text-blue-400" />
            </button>
            <button className={`p-2 ${currentTheme.cardBackground} rounded-lg hover:bg-gray-700/50 transition-all`}>
              <Edit2 className="w-5 h-5 text-yellow-400" />
            </button>
            <button className={`p-2 ${currentTheme.cardBackground} rounded-lg hover:bg-gray-700/50 transition-all`}>
              <Bookmark className="w-5 h-5 text-purple-400" />
            </button>
          </div>
        </motion.div>

        {/* Scheduling Modal */}
        {isScheduling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed inset-0 flex items-center justify-center bg-black/50 z-50`}
          >
            <div className={`${currentTheme.cardBackground} backdrop-blur-sm rounded-xl p-6 w-full max-w-md border ${currentTheme.border}`}>
              <h3 className={`text-xl font-semibold ${currentTheme.textPrimary} mb-4`}>Schedule Post</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(platformIcons).map(([platform, icon]) => (
                  <button
                    key={platform}
                    onClick={() => updateSchedule(platform)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      schedule.platforms.includes(platform)
                        ? `${currentTheme.buttonBg} ${currentTheme.textPrimary}`
                        : `${currentTheme.inputBg} ${currentTheme.textSecondary} hover:bg-gray-700`
                    }`}
                  >
                    {icon}
                    <span className="capitalize text-sm">{platform}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Calendar className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                <DatePicker
                  selected={schedule.dateTime}
                  onChange={(date: Date | null) => updateSchedule(undefined, date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className={`w-full ${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-lg px-4 py-2 border ${currentTheme.inputBorder}`}
                  placeholderText="Select date and time"
                  minDate={new Date()}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSchedulePost}
                  className={`flex-1 px-4 py-2 ${currentTheme.buttonBg} ${currentTheme.textPrimary} rounded-lg ${currentTheme.buttonHover}`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => setIsScheduling(false)}
                  className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.textSecondary} rounded-lg hover:bg-gray-700`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full"
          >
            {renderPost()}
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Main Content */}
            <div className={`${currentTheme.cardBackground} backdrop-blur-sm rounded-xl p-6 ${currentTheme.border}`}>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    post.type === 'carousel'
                      ? 'bg-purple-500/20 text-purple-400'
                      : post.type === 'doyouknow'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {post.type.toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    post.status === 'published'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}
                >
                  {post.status.toUpperCase()}
                </span>
              </div>

              <h1 className={`text-3xl font-bold ${currentTheme.textPrimary} mb-4`}>{post.topic}</h1>
              <h2 className={`text-xl font-medium ${currentTheme.textPrimary} mb-4`}>{post.title}</h2>
              <p className={`${currentTheme.textSecondary} leading-relaxed mb-6`}>{post.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {post.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className={`flex items-center gap-1 text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full`}
                  >
                    <Tag className="w-3 h-3" />
                    {hashtag}
                  </span>
                ))}
              </div>

              <div className={`flex items-center justify-between text-sm ${currentTheme.textSecondary}`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{post.contentType}</span>
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className={`${currentTheme.cardBackground} backdrop-blur-sm rounded-xl p-6 ${currentTheme.border}`}>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-red-400 mb-1">
                    <Heart className="w-5 h-5" />
                    <span className="text-lg font-semibold">2.4k</span>
                  </div>
                  <p className={`text-sm ${currentTheme.textSecondary}`}>Likes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-lg font-semibold">142</span>
                  </div>
                  <p className={`text-sm ${currentTheme.textSecondary}`}>Comments</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                    <Eye className="w-5 h-5" />
                    <span className="text-lg font-semibold">3.8k</span>
                  </div>
                  <p className={`text-sm ${currentTheme.textSecondary}`}>Views</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};