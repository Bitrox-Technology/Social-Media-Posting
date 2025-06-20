import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import {
  useLazyAuthFacebookQuery,
  useLazyAuthInstagramQuery,
  useLazyAuthLinkedInQuery,
  useLazyGetSocialAuthQuery,
  useLazyGetUserPostDetailQuery,
  useLinkedInPostMutation,
  useFacebookPagePostMutation,
  useInstagramBusinessPostMutation,
} from '../../store/api';
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
import { useSocialAuth } from '../providers/useSocialAuth';

type AuthFunction = (...args: any[]) => Promise<{ statusCode: number; data: { authUrl: string } }>;

interface Image {
  url: string;
  label: string;
  _id: string;
}

interface InstagramAccount {
  id: string;
  username: string;
  accessToken: string;
}

interface FacebookManagedPage {
  id: string;
  name: string;
  accessToken: string;
}

interface InstagramAuthData {
  accounts: InstagramAccount[];
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
  imagesUrl?: string[];
  footer?: string;
  websiteUrl?: string;
  price?: string;
  discount?: {
    title: string;
    percentage: number;
    description: string;
  };
  flashSale?: {
    title: string;
    offer: string;
    validUntil: string;
    pricesStartingAt: string;
    description: string;
  };
  postTypes?: string[];
}

interface Schedule {
  platform: string | null;
  subPlatform: string | null;
  dateTime: Date | null;
  userDetails?: {
    name: string;
    profilePage: string;
  };
  selectedPage?: {
    id: string;
    name: string;
    accessToken: string;
  };
  selectedInstagramAccount?: {
    id: string;
    username: string;
    accessToken: string;
  };
}

export const UserPostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [getUserPostDetail, { data, isLoading, isError, error }] = useLazyGetUserPostDetailQuery();
  const [authFacebook] = useLazyAuthFacebookQuery();
  const [authLinkedIn] = useLazyAuthLinkedInQuery();
  const [authInstagram] = useLazyAuthInstagramQuery();
  const [linkedInPost] = useLinkedInPostMutation();
  const [facebookPagePost] = useFacebookPagePostMutation();
  const [instagramBusinessPost] = useInstagramBusinessPostMutation();
  const [getSocialAuth, { data: socialAuthData }] = useLazyGetSocialAuthQuery();

  const [isSocialOptionsOpen, setIsSocialOptionsOpen] = useState(false);
  const [schedule, setSchedule] = useState<Schedule>({ platform: null, subPlatform: null, dateTime: null });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [platformTokens, setPlatformTokens] = useState<{
    [key: string]: { accessToken: string; profilePage: string };
  }>({});
  const [selectedPostType, setSelectedPostType] = useState<'product' | 'discount' | 'flashSale'>('product'); // For ProductContent

  const authLinkedInFn: AuthFunction = async (_subPlatform: string) => {
    const result = await authLinkedIn().unwrap();
    return {
      statusCode: result.statusCode ?? 200,
      data: {
        authUrl: result.data?.authUrl ?? (typeof result.data === 'string' ? result.data : ''),
      },
    };
  };
  const authFacebookFn = async () => {
    const result = await authFacebook().unwrap();
    return {
      statusCode: result.statusCode ?? 200,
      data: {
        authUrl: result.data?.authUrl ?? (typeof result.data === 'string' ? result.data : ''),
      },
    };
  };
  const authInstagramFn = async () => {
    const result = await authInstagram().unwrap();
    return {
      statusCode: result.statusCode ?? 200,
      data: {
        authUrl: result.data?.authUrl ?? (typeof result.data === 'string' ? result.data : ''),
      },
    };
  };

  const { initiateAuth } = useSocialAuth({
    authLinkedIn: authLinkedInFn,
    authFacebook: authFacebookFn,
    authInstagram: authInstagramFn,
    setIsAuthenticating,
  });

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
      getSocialAuth();
    }
  }, [postId, getUserPostDetail, getSocialAuth]);

  useEffect(() => {
    if (socialAuthData?.data) {
      const linkedinData = socialAuthData.data.linkedin;
      const facebookData = socialAuthData.data.facebook;
      const instagramData = socialAuthData.data.instagram;

      if (
        linkedinData?.isAuthenticated &&
        linkedinData.accessToken?.expiresAt &&
        new Date(linkedinData.accessToken.expiresAt) >= new Date()
      ) {
        setPlatformTokens((prev) => ({
          ...prev,
          linkedin: {
            accessToken: linkedinData.accessToken.token,
            profilePage: linkedinData.profilePage || '',
          },
        }));
      }

      if (facebookData?.isAuthenticated) {
        setPlatformTokens((prev) => ({
          ...prev,
          facebook: {
            accessToken: facebookData.accessToken.token,
            profilePage: facebookData,
          },
        }));
      }

      if (instagramData?.isAuthenticated && instagramData.accounts?.length > 0) {
        setPlatformTokens((prev) => ({
          ...prev,
          instagram: {
            accessToken: instagramData.accounts[0].accessToken,
            profilePage: instagramData.accounts[0].id,
          },
        }));
      }
    }
  }, [socialAuthData]);

  const post: Post | undefined = data?.data?.[0];

  const authStatus = {
    linkedin: !!(
      socialAuthData?.data?.linkedin?.isAuthenticated &&
      socialAuthData?.data?.linkedin?.accessToken?.expiresAt &&
      new Date(socialAuthData.data.linkedin.accessToken.expiresAt) >= new Date()
    ),
    linkedinPage: !!(
      socialAuthData?.data?.linkedin?.isAuthenticated &&
      socialAuthData?.data?.linkedin?.accessToken?.expiresAt &&
      new Date(socialAuthData.data.linkedin.accessToken.expiresAt) >= new Date()
    ),
    facebook: socialAuthData?.data?.facebook?.isAuthenticated || false,
    instagram: socialAuthData?.data?.instagram?.isAuthenticated || false,
  };

  const platformIcons = {
    linkedin: <Linkedin className="w-6 h-6" />,
    linkedinPage: <Linkedin className="w-6 h-6" />,
    instagram: <Instagram className="w-6 h-6" />,
    facebook: <Facebook className="w-6 h-6" />,
  };

  const socialPlatforms = [
    { name: 'facebook', label: 'Facebook Page', icon: platformIcons.facebook },
    { name: 'linkedin', subPlatform: 'profile', label: 'LinkedIn Profile', icon: platformIcons.linkedin },
    { name: 'linkedin', subPlatform: 'page', label: 'LinkedIn Page', icon: platformIcons.linkedinPage },
    { name: 'instagram', label: 'Instagram', icon: platformIcons.instagram },
  ];

  const updateSchedule = (
    platform?: string | null,
    subPlatform?: string | null,
    dateTime?: Date | null,
    selectedPage?: Schedule['selectedPage'],
    selectedInstagramAccount?: Schedule['selectedInstagramAccount']
  ) => {
    setSchedule((prev) => ({
      ...prev,
      platform: platform !== undefined ? platform : prev.platform,
      subPlatform: subPlatform !== undefined ? subPlatform : prev.subPlatform,
      dateTime: dateTime !== undefined ? dateTime : prev.dateTime,
      selectedPage: selectedPage !== undefined ? selectedPage : prev.selectedPage,
      selectedInstagramAccount:
        selectedInstagramAccount !== undefined ? selectedInstagramAccount : prev.selectedInstagramAccount,
    }));
  };

  const handlePlatformSelect = (platform: string, subPlatform?: string) => {
    const platformKey = platform === 'linkedin' ? `${platform}${subPlatform === 'page' ? 'Page' : ''}` : platform;

    updateSchedule(platform, subPlatform);
    setIsAuthenticating(true);

    if (!authStatus[platformKey as keyof typeof authStatus]) {
      if (platform === 'linkedin') {
        initiateAuth(platform);
      } else {
        initiateAuth(platform as 'facebook' | 'instagram');
      }
    } else {
      setIsSocialOptionsOpen(false);

      if (platform === 'linkedin' && socialAuthData?.data?.linkedin?.profileData) {
        setSchedule((prev) => ({
          ...prev,
          userDetails: {
            name: socialAuthData.data.linkedin.profileData.name,
            profilePage: socialAuthData.data.linkedin.profilePage || '',
          },
        }));
      } else if (platform === 'facebook' && socialAuthData?.data?.facebook?.profileData) {
        setSchedule((prev) => ({
          ...prev,
          userDetails: {
            name: socialAuthData.data.facebook.profileData.name,
            profilePage: socialAuthData.data.facebook.profileData.id,
          },
        }));
      } else if (platform === 'instagram' && socialAuthData?.data?.instagram?.accounts?.length > 0) {
        setSchedule((prev) => ({
          ...prev,
          userDetails: {
            name: socialAuthData?.data?.instagram?.accounts?.[0]?.username,
            profilePage: socialAuthData?.data?.instagram?.accounts[0]?.id,
          },
          selectedInstagramAccount: socialAuthData?.data?.instagram?.accounts[0],
        }));
      }

      setShowUserDetails(true);
      setIsAuthenticating(false);
    }
  };

  const handlePublishPost = async () => {
    if (!schedule.platform) {
      alert('Please select a platform');
      return;
    }

    if (!post) {
      alert('Post data not available');
      return;
    }

    const platformKey = schedule.platform === 'linkedin' ? (schedule.subPlatform === 'page' ? 'linkedinPage' : 'linkedin') : schedule.platform;
    const tokenData = platformTokens[platformKey];

    if (!tokenData?.accessToken) {
      alert(`Please authenticate with ${schedule.platform} first`);
      return;
    }

    if (schedule.platform === 'facebook' && !schedule.selectedPage) {
      alert('Please select a Facebook page');
      return;
    }

    console.log("Post Data: ==== ", post)

    // Determine which image and description to use based on selectedPostType
    let imagesUrl = [];
    let postTitle = post.title;
    let postDescription = post.description;

    if (post.contentType === 'ProductContent') {
      if (selectedPostType === 'product') {
        imagesUrl.push(post.images[0].url);
      } else if (selectedPostType === 'discount') {
        imagesUrl.push(post.images[1].url);
        postTitle = post.discount?.title || post.title;
        postDescription = post.discount?.description || post.description;
      } else if (selectedPostType === 'flashSale') {
        imagesUrl.push(post.images[2].url);
        postTitle = post.flashSale?.title || post.title;
        postDescription = post.flashSale?.description || post.description;
      }
    } else if (post.contentType === 'CarouselContent' ) {
       post.images.forEach(element => {
         console.log(element)
         imagesUrl.push(element.url)
       });
    }else{
       imagesUrl.push(post?.images[0]?.url)
    }

    try {
      let response;
      if (schedule.platform === 'linkedin') {
        const payload = {
          imagesUrl,
          title: postTitle,
          description: postDescription,
          hashTags: post.hashtags.join(', '),
          scheduleTime: schedule.dateTime ? schedule.dateTime.toISOString() : '',
          accessToken: tokenData.accessToken,
          person_urn: tokenData.profilePage || '',
        };
        console.log("payload---", payload)
        response = await linkedInPost(payload).unwrap();
      } else if (schedule.platform === 'facebook') {
        const payload = {
          title: postTitle,
          description: postDescription,
          hashTags: post.hashtags.join(', '),
          imagesUrl,
          scheduleTime: schedule.dateTime ? schedule.dateTime.toISOString() : '',
          pageId: schedule.selectedPage!.id,
          pageAccessToken: schedule.selectedPage!.accessToken,
        };
        console.log("payload---", payload)
        response = await facebookPagePost(payload).unwrap();
      } else if (schedule.platform === 'instagram') {
        const payload = {
          igBusinessId: schedule.selectedInstagramAccount!.id,
          pageAccessToken: schedule.selectedInstagramAccount!.accessToken,
          imagesUrl,
          title: postTitle,
          description: postDescription,
          hashTags: post.hashtags.join(', '),
          scheduleTime: schedule.dateTime ? schedule.dateTime.toISOString() : '',
        };
        console.log("payload---", payload)
        response = await instagramBusinessPost(payload).unwrap();
      }

      alert(`Post ${schedule.dateTime ? 'scheduled' : 'published'} successfully on ${schedule.platform}`);
      setSchedule({ platform: null, subPlatform: null, dateTime: null, selectedPage: undefined });
      setShowUserDetails(false);
    } catch (err) {
      alert(`Failed to post to ${schedule.platform}`);
    }
  };

  const handlePageSelect = (page: { id: string; name: string; accessToken: string }) => {
    updateSchedule(undefined, undefined, undefined, page);
  };

  const handleInstagramAccountSelect = (selectedAccount: { id: string; username: string; accessToken: string }) => {
    updateSchedule(undefined, undefined, undefined, undefined, selectedAccount);
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

    if (post.contentType === 'ProductContent') {
      // Find the image corresponding to the selected post type
      let selectedImage: Image | undefined;
      if (selectedPostType === 'product') {
        selectedImage = post.images.find((img) => img.label === 'Product');
      } else if (selectedPostType === 'discount') {
        selectedImage = post.images.find((img) => img.label === 'Offer');
      } else if (selectedPostType === 'flashSale') {
        selectedImage = post.images.find((img) => img.label === 'FlashSale');
      }

      return (
        <div className="w-full space-y-4">
          {/* Buttons to toggle between Product, Offer, and Flash Sale */}
          <div className="flex space-x-4 mb-4">
            {post.postTypes?.includes('product') && (
              <motion.button
                onClick={() => setSelectedPostType('product')}
                className={`px-4 py-2 rounded-xl font-semibold ${
                  selectedPostType === 'product'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Product Post
              </motion.button>
            )}
            {post.postTypes?.includes('discount') && (
              <motion.button
                onClick={() => setSelectedPostType('discount')}
                className={`px-4 py-2 rounded-xl font-semibold ${
                  selectedPostType === 'discount'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Offer Post
              </motion.button>
            )}
            {post.postTypes?.includes('flashSale') && (
              <motion.button
                onClick={() => setSelectedPostType('flashSale')}
                className={`px-4 py-2 rounded-xl font-semibold ${
                  selectedPostType === 'flashSale'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Flash Sale Post
              </motion.button>
            )}
          </div>
          {selectedImage ? renderImage(selectedImage) : <p>No image available for this post type</p>}
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

  // Calculate time remaining for Flash Sale
  const calculateTimeRemaining = (validUntil: string): string => {
    const currentDate = new Date('2025-06-17T12:47:00+05:30'); // Current date and time (IST)
    const endDate = new Date('2025-06-17T20:23:00+05:30'); // Flash sale end date (from validUntil, assuming IST)
    const timeDiff = endDate.getTime() - currentDate.getTime();
    if (timeDiff <= 0) return 'Expired';
    const hoursRemaining = Math.floor(timeDiff / (1000 * 3600));
    const minutesRemaining = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    return `${hoursRemaining} hours, ${minutesRemaining} minutes`;
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
              onClick={() => setIsSocialOptionsOpen(true)}
              className={`p-2 ${currentTheme.cardBackground} rounded-lg hover:bg-gray-700/50 transition-all`}
              disabled={isAuthenticating}
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

        {isAuthenticating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${currentTheme.cardBackground} rounded-xl p-6 flex flex-col items-center gap-4`}>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className={currentTheme.textPrimary}>Authenticating...</p>
            </div>
          </div>
        )}

        {isSocialOptionsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed inset-0 flex items-center justify-center bg-black/50 z-50`}
          >
            <div className={`${currentTheme.cardBackground} backdrop-blur-sm rounded-xl p-6 w-full max-w-md border ${currentTheme.border}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${currentTheme.textPrimary}`}>Share to Social Media</h3>
                <button
                  onClick={() => setIsSocialOptionsOpen(false)}
                  className={`text-${currentTheme.textSecondary}`}
                  disabled={isAuthenticating}
                >
                  <span className="text-sm">Close</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {socialPlatforms.map((platform) => {
                  const platformKey = platform.name === 'linkedin' ? `${platform.name}${platform.subPlatform === 'page' ? 'Page' : ''}` : platform.name;
                  return (
                    <button
                      key={`${platform.name}-${platform.subPlatform || 'default'}`}
                      onClick={() => handlePlatformSelect(platform.name, platform.subPlatform)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${
                        authStatus[platformKey as keyof typeof authStatus] ? 'bg-green-500/20' : ''
                      }`}
                      disabled={isAuthenticating}
                    >
                      {platform.icon}
                      <span className={`text-xs mt-2 ${currentTheme.textPrimary}`}>
                        {platform.label}
                        {authStatus[platformKey as keyof typeof authStatus] && ' (Connected)'}
                      </span>
                    </button>
                  );
                })}
              </div>
              {socialAuthData?.data?.linkedin?.isAuthenticated &&
                socialAuthData?.data?.linkedin?.accessToken?.expiresAt &&
                !authStatus.linkedin && (
                  <p className="text-red-400 text-sm mt-4">
                    Your LinkedIn Profile token has expired. Please authenticate again.
                  </p>
                )}
            </div>
          </motion.div>
        )}

        {showUserDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed inset-0 flex items-center justify-center bg-black/50 z-50`}
          >
            <div className={`${currentTheme.cardBackground} backdrop-blur-sm rounded-xl p-6 w-full max-w-md border ${currentTheme.border}`}>
              <div className="flex items-center gap-2 mb-4">
                {platformIcons[schedule.platform as keyof typeof platformIcons]}
                <h3 className={`text-lg font-semibold ${currentTheme.textPrimary}`}>
                  {schedule.subPlatform === 'page'
                    ? 'LinkedIn Page'
                    : schedule.platform
                    ? schedule.platform.charAt(0).toUpperCase() + schedule.platform.slice(1)
                    : ''}
                </h3>
              </div>
              <p className={`text-xl font-semibold ${currentTheme.textPrimary} mb-2`}>
                Publish your design straight to{' '}
                {schedule.subPlatform === 'page'
                  ? 'LinkedIn Pages'
                  : `${(schedule.platform ?? '').charAt(0).toUpperCase() + (schedule.platform ?? '').slice(1)}!`}
              </p>
              {schedule.platform === 'facebook' && (
                <>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-4`}>Select a Facebook Page to post to:</p>
                  {socialAuthData?.data?.facebook?.managedPages?.length > 0 ? (
                    <select
                      className={`${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-lg px-4 py-2 border ${currentTheme.inputBorder} mb-4 w-full`}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const selectedPage: FacebookManagedPage | undefined = (
                          socialAuthData?.data?.facebook?.managedPages as FacebookManagedPage[] | undefined
                        )?.find((page: FacebookManagedPage) => page.id === e.target.value);
                        if (selectedPage) {
                          handlePageSelect(selectedPage);
                        }
                      }}
                      value={schedule.selectedPage?.id || ''}
                    >
                      <option value="">Select a Page</option>
                      {socialAuthData?.data?.facebook?.managedPages.map((page: FacebookManagedPage) => (
                        <option key={page.id} value={page.id}>
                          {page.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-red-400 text-sm mb-4">No Facebook pages found. Please authenticate or link a page.</p>
                  )}
                </>
              )}
              {schedule.platform === 'instagram' && (
                <>
                  <p className={`text-sm ${currentTheme.textSecondary} mb-4`}>Select an Instagram Account to post to:</p>
                  {socialAuthData?.data?.instagram?.accounts?.length > 0 ? (
                    <select
                      className={`${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-lg px-4 py-2 border ${currentTheme.inputBorder} mb-4 w-full`}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const selectedAccount: InstagramAccount | undefined = (
                          socialAuthData?.data?.instagram as InstagramAuthData
                        )?.accounts.find((account: InstagramAccount) => account.id === e.target.value);
                        if (selectedAccount) {
                          handleInstagramAccountSelect(selectedAccount);
                        }
                      }}
                      value={schedule.selectedInstagramAccount?.id || ''}
                    >
                      <option value="">Select an Account</option>
                      {(socialAuthData?.data?.instagram as InstagramAuthData)?.accounts.map((account: InstagramAccount) => (
                        <option key={account.id} value={account.id}>
                          {account.username}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-red-400 text-sm mb-4">No Instagram accounts found. Please link an account.</p>
                  )}
                </>
              )}
              {schedule.userDetails && schedule.platform !== 'facebook' && (
                <div className="flex items-center gap-2 mb-4">
                  <select
                    className={`${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-lg px-4 py-2 border ${currentTheme.inputBorder}`}
                  >
                    <option>{schedule.userDetails.name}</option>
                  </select>
                  <select
                    className={`${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-lg px-4 py-2 border ${currentTheme.inputBorder}`}
                  >
                    <option>{schedule.userDetails.profilePage || 'Select Page'}</option>
                  </select>
                </div>
              )}
              <textarea
                placeholder="Write something..."
                className={`w-full h-32 ${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-lg px-4 py-2 border ${currentTheme.inputBorder} mb-4`}
              />
              <div className="flex items-center gap-4 mb-4">
                <Calendar className={`w-5 h-5 ${currentTheme.textSecondary}`} />
                <DatePicker
                  selected={schedule.dateTime}
                  onChange={(date: Date | null) => updateSchedule(undefined, undefined, date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className={`w-full ${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-lg px-4 py-2 border ${currentTheme.inputBorder}`}
                  placeholderText="Select date and time (optional)"
                  minDate={new Date()}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handlePublishPost}
                  className={`flex-1 px-4 py-2 bg-purple-600 ${currentTheme.textPrimary} rounded-lg hover:bg-purple-700`}
                  disabled={
                    !schedule.platform || isAuthenticating || (schedule.platform === 'facebook' && !schedule.selectedPage)
                  }
                >
                  Publish
                </button>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className={`flex-1 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.textSecondary} rounded-lg hover:bg-gray-700`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full">
            {renderPost()}
            {/* Display Product Images for ProductContent */}
            {/* {post.contentType === 'ProductContent' && post.imagesUrl && (
              <div className="mt-4">
                <h3 className={`text-lg font-semibold ${currentTheme.textPrimary} mb-2`}>Product Images</h3>
                <div className="flex flex-wrap gap-4">
                  {post.imagesUrl.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Product Image ${index + 1}`}
                      className="max-h-40 rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )} */}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
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
              <h2 className={`text-xl font-medium ${currentTheme.textPrimary} mb-4`}>
                {post.contentType === 'ProductContent' && selectedPostType === 'discount' && post.discount
                  ? post.discount.title
                  : post.contentType === 'ProductContent' && selectedPostType === 'flashSale' && post.flashSale
                  ? post.flashSale.title
                  : post.title}
              </h2>
              <p className={`${currentTheme.textSecondary} leading-relaxed mb-4`}>
                {post.contentType === 'ProductContent' && selectedPostType === 'discount' && post.discount
                  ? post.discount.description
                  : post.contentType === 'ProductContent' && selectedPostType === 'flashSale' && post.flashSale
                  ? post.flashSale.description
                  : post.description}
              </p>

              {/* Additional Details for ProductContent */}
              {post.contentType === 'ProductContent' && (
                <div className="space-y-2 mb-4">
                  <p className={`${currentTheme.textSecondary}`}>
                    <strong>Price:</strong> ₹{post.price}
                  </p>
                  {selectedPostType === 'discount' && post.discount && (
                    <>
                      <p className={`${currentTheme.textSecondary}`}>
                        <strong>Discount:</strong> {post.discount.percentage}% off
                      </p>
                      <p className={`${currentTheme.textSecondary}`}>
                        <strong>Price After Discount:</strong> ₹
                        {Math.round(Number(post.price) * (1 - post.discount.percentage / 100))}
                      </p>
                    </>
                  )}
                  {selectedPostType === 'flashSale' && post.flashSale && (
                    <>
                      <p className={`${currentTheme.textSecondary}`}>
                        <strong>Offer:</strong> {post.flashSale.offer}
                      </p>
                      <p className={`${currentTheme.textSecondary}`}>
                        <strong>Prices Starting At:</strong> ₹{post.flashSale.pricesStartingAt.split('"')[1]}
                      </p>
                      <p className={`${currentTheme.textSecondary}`}>
                        <strong>Valid Until:</strong> {post.flashSale.validUntil}
                      </p>
                      <p className={`${currentTheme.textSecondary}`}>
                        <strong>Time Remaining:</strong> {calculateTimeRemaining(post.flashSale.validUntil)}
                      </p>
                    </>
                  )}
                  <p className={`${currentTheme.textSecondary}`}>
                    <strong>Website URL:</strong>{' '}
                    <a
                      href={post.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {post.websiteUrl}
                    </a>
                  </p>
                  <p className={`${currentTheme.textSecondary}`}>
                    <strong>Footer:</strong> @{post.footer}
                  </p>
                </div>
              )}

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