import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import {
  Calendar,
  Linkedin,
  Instagram,
  Facebook,
  Clock,
  Share2,
  ArrowLeft,
  Info,
} from 'lucide-react';
import {
  useLazyAuthLinkedInQuery,
  useLazyGetSavePostsQuery,
  useLazyAuthFacebookQuery,
  useLazyAuthInstagramQuery,
  useLazyGetSocialAuthQuery,
  useLinkedInPostMutation,
  useFacebookPagePostMutation,
  useInstagramBusinessPostMutation,
} from '../../store/api';
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
  type: string;
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

interface Schedule {
  platforms: string[];
  subPlatforms: { [platform: string]: string | null }; // e.g., { linkedin: 'page' }
  dateTimes: Date[]; // Array of 7 dates/times
  selectedPages: { [platform: string]: FacebookManagedPage | null }; // For Facebook pages
  selectedInstagramAccounts: { [platform: string]: InstagramAccount | null }; // For Instagram accounts
}

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

export const SelectSocialMedia: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule>({
    platforms: [],
    subPlatforms: {},
    dateTimes: [],
    selectedPages: {},
    selectedInstagramAccounts: {},
  });
  const [isSocialOptionsOpen, setIsSocialOptionsOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [platformTokens, setPlatformTokens] = useState<{
    [key: string]: { accessToken: string; profilePage: string };
  }>({});
  const { postContentId } = location.state || {};
  const [getSavePosts, { data: rawPosts, isLoading, isError, error }] = useLazyGetSavePostsQuery();
  const [authLinkedIn] = useLazyAuthLinkedInQuery();
  const [authFacebook] = useLazyAuthFacebookQuery();
  const [authInstagram] = useLazyAuthInstagramQuery();
  const [getSocialAuth, { data: socialAuthData }] = useLazyGetSocialAuthQuery();
  const [linkedInPost] = useLinkedInPostMutation();
  const [facebookPagePost] = useFacebookPagePostMutation();
  const [instagramBusinessPost] = useInstagramBusinessPostMutation();

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

  // Generate 7 dates (base date + next 6 days)
  const generateScheduleDates = (baseDate: Date | null): Date[] => {
    if (!baseDate) return [];
    const dates = [new Date(baseDate)];
    for (let i = 1; i < 7; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  };

  // Update dateTimes when base date changes
  const handleBaseDateChange = (date: Date | null) => {
    setSchedule((prev) => ({
      ...prev,
      dateTimes: date ? generateScheduleDates(date) : [],
    }));
  };

  // Update specific date/time in the list
  const handleDateChange = (index: number, date: Date | null) => {
    if (!date) return;
    setSchedule((prev) => {
      const newDateTimes = [...prev.dateTimes];
      newDateTimes[index] = date;
      return { ...prev, dateTimes: newDateTimes };
    });
  };

  useEffect(() => {
    if (postContentId) {
      getSavePosts({ postContentId });
      getSocialAuth();
    }
  }, [postContentId, getSavePosts, getSocialAuth]);

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
            profilePage: facebookData.profilePage || '',
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

  const handlePlatformSelect = async (platform: string, subPlatform?: string) => {
    const platformKey = platform === 'linkedin' ? `${platform}${subPlatform === 'page' ? 'Page' : ''}` : platform;

    setSchedule((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformKey)
        ? prev.platforms.filter((p) => p !== platformKey)
        : [...prev.platforms, platformKey],
      subPlatforms: {
        ...prev.subPlatforms,
        [platform]: subPlatform || null,
      },
    }));

    if (!authStatus[platformKey as keyof typeof authStatus]) {
      setIsAuthenticating(true);
      try {
        let authUrl;
        if (platform === 'linkedin') {
          const response = await authLinkedIn().unwrap();
          authUrl = response.data?.authUrl || response.data;
        } else if (platform === 'facebook') {
          const response = await authFacebook().unwrap();
          authUrl = response.data?.authUrl || response.data;
        } else if (platform === 'instagram') {
          const response = await authInstagram().unwrap();
          authUrl = response.data?.authUrl || response.data;
        }
        if (authUrl) {
          window.location.href = authUrl;
        }
      } catch (err) {
        console.error(`Error authenticating with ${platform}:`, err);
        setIsAuthenticating(false);
      }
    }
  };

  const handleShareAllPosts = async () => {
    if (!schedule.platforms.length) {
      alert('Please select at least one platform');
      return;
    }
    if (schedule.dateTimes.length < 7) {
      alert('Please ensure all seven dates and times are set');
      return;
    }
    if (!posts.length) {
      alert('No posts available to share');
      return;
    }

    // Validate platform authentication and selections
    for (const platformKey of schedule.platforms) {
      if (!authStatus[platformKey as keyof typeof authStatus]) {
        alert(`Please authenticate with ${platformKey} first`);
        return;
      }
      if (platformKey === 'facebook' && !schedule.selectedPages.facebook) {
        alert('Please select a Facebook page');
        return;
      }
      if (platformKey === 'instagram' && !schedule.selectedInstagramAccounts.instagram) {
        alert('Please select an Instagram account');
        return;
      }
    }

    try {
      // Assign dates to posts (up to 7 posts)
      const postsWithDates = posts.slice(0, 7).map((post, index) => ({
        post,
        scheduleTime: schedule.dateTimes[index]?.toISOString() || new Date().toISOString(),
      }));

      for (const { post, scheduleTime } of postsWithDates) {
        // Determine image, title, and description based on selectedPostType
        console.log(post, scheduleTime)

        for (const platformKey of schedule.platforms) {
          const platform = platformKey.startsWith('linkedin') ? 'linkedin' : platformKey;
          const tokenData = platformTokens[platformKey];

          if (!tokenData?.accessToken) {
            alert(`No access token for ${platformKey}`);
            continue;
          }

          let imagesUrl = [];
          if (post.contentType === 'CarouselContent') {
            post.images.forEach((element: Image) => {
              console.log(element)
              imagesUrl.push(element.url)
            });
          } else {
            imagesUrl.push(post?.images[0]?.url)
          }


          try {
            let response;
            if (platform === 'linkedin') {
              const payload = {
                imagesUrl,
                title: post.title,
                description: post.description,
                hashTags: post.hashtags.join(', '),
                scheduleTime,
                accessToken: tokenData.accessToken,
                person_urn: tokenData.profilePage || '',
              };
              response = await linkedInPost(payload).unwrap();
            } else if (platform === 'facebook') {
              const payload = {
                imagesUrl,
                title: post.title,
                description: post.description,
                hashTags: post.hashtags.join(', '),
                scheduleTime,
                pageId: schedule.selectedPages.facebook!.id,
                pageAccessToken: schedule.selectedPages.facebook!.accessToken,
              };

              console.log("Payload: ", payload)
              response = await facebookPagePost(payload).unwrap();
            } else if (platform === 'instagram') {
              const payload = {
                igBusinessId: schedule.selectedInstagramAccounts.instagram!.id,
                pageAccessToken: schedule.selectedInstagramAccounts.instagram!.accessToken,
                imagesUrl,
                title: post.title,
                description: post.description,
                hashTags: post.hashtags.join(', '),
                scheduleTime,
              };
              response = await instagramBusinessPost(payload).unwrap();
            }

            console.log(`Post scheduled successfully on ${platformKey} at ${scheduleTime}`);
          } catch (err) {
            console.error(`Failed to post to ${platformKey} at ${scheduleTime}:`, err);
            alert(`Failed to schedule post to ${platformKey} at ${new Date(scheduleTime).toLocaleString()}`);
          }
        }
      }

      alert('All posts scheduled successfully!');
    } catch (err) {
      console.error('Error sharing posts:', err);
      alert('Failed to schedule some posts');
    }
  };

  const handlePageSelect = (page: FacebookManagedPage) => {
    setSchedule((prev) => ({
      ...prev,
      selectedPages: {
        ...prev.selectedPages,
        facebook: page,
      },
    }));
  };

  const handleInstagramAccountSelect = (account: InstagramAccount) => {
    setSchedule((prev) => ({
      ...prev,
      selectedInstagramAccounts: {
        ...prev.selectedInstagramAccounts,
        instagram: account,
      },
    }));
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
      return (
        <div className="text-center text-gray-400">No images available for this post.</div>
      );
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-12 text-center"
        >
          Schedule Your Posts
        </motion.h1>



        {/* Social Options Modal */}
        {isSocialOptionsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 w-full max-w-md border border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Share to Social Media</h3>
                <button
                  onClick={() => setIsSocialOptionsOpen(false)}
                  className="text-gray-400"
                  disabled={isAuthenticating}
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {socialPlatforms.map((platform) => {
                  const platformKey = platform.name === 'linkedin' ? `${platform.name}${platform.subPlatform === 'page' ? 'Page' : ''}` : platform.name;
                  return (
                    <button
                      key={`${platform.name}-${platform.subPlatform || 'default'}`}
                      onClick={() => handlePlatformSelect(platform.name, platform.subPlatform)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-700 transition-all ${schedule.platforms.includes(platformKey) ? 'bg-green-500/20' : ''
                        }`}
                      disabled={isAuthenticating}
                    >
                      {platform.icon}
                      <span className="text-xs mt-2 text-white">
                        {platform.label}
                        {authStatus[platformKey as keyof typeof authStatus] && ' (Connected)'}
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* Facebook Page Selection */}
              {schedule.platforms.includes('facebook') && socialAuthData?.data?.facebook?.managedPages?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Select a Facebook Page:</p>
                  <select
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-700 w-full"
                    onChange={(e) => {
                      const page = socialAuthData?.data?.facebook?.managedPages?.find((p: FacebookManagedPage) => p.id === e.target.value);
                      if (page) handlePageSelect(page);
                    }}
                    value={schedule.selectedPages.facebook?.id || ''}
                  >
                    <option value="">Select a Page</option>
                    {socialAuthData?.data?.facebook?.managedPages?.map((page: FacebookManagedPage) => (
                      <option key={page.id} value={page.id}>
                        {page.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Instagram Account Selection */}
              {schedule.platforms.includes('instagram') && socialAuthData?.data?.instagram?.accounts?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Select an Instagram Account:</p>
                  <select
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-700 w-full"
                    onChange={(e) => {
                      const account = socialAuthData?.data?.instagram?.accounts?.find((a: InstagramAccount) => a.id === e.target.value);
                      if (account) handleInstagramAccountSelect(account);
                    }}
                    value={schedule.selectedInstagramAccounts.instagram?.id || ''}
                  >
                    <option value="">Select an Account</option>
                    {socialAuthData?.data?.instagram?.accounts?.map((account: InstagramAccount) => (
                      <option key={account.id} value={account.id}>
                        {account.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 text-center"
              >
                <button
                  onClick={handleShareAllPosts}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                  disabled={isAuthenticating}
                >
                  Share All Posts
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {isAuthenticating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-white">Authenticating...</p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
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
                {pair.map((post, postIndex) => (
                  <motion.div
                    key={post._id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden"
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                        {post.topic}
                      </h2>
                      {renderPost(post)}
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
                      <p className="text-gray-400 text-sm text-center">
                        Scheduled for: {schedule.dateTimes[pairIndex * 2 + postIndex]?.toLocaleString() || 'Not scheduled'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <div className='mx-2'>
          {/* Schedule Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Schedule Settings</h2>
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <DatePicker
                selected={schedule.dateTimes[0] || null}
                onChange={(date: Date | null) => handleBaseDateChange(date)}
                showTimeSelect
                dateFormat="Pp"
                className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full max-w-xs text-center"
                placeholderText="Select base date and time"
                minDate={new Date()}
              />
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            {schedule.dateTimes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-white mb-2">Scheduled Dates and Times</h3>
                <div className="space-y-2">
                  {schedule.dateTimes.map((date, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">Post {index + 1}:</span>
                      <DatePicker
                        selected={date}
                        onChange={(newDate: Date | null) => handleDateChange(index, newDate)}
                        showTimeSelect
                        dateFormat="Pp"
                        className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full max-w-xs"
                        minDate={new Date()}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSocialOptionsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all mt-4"
            >
              <Share2 className="w-5 h-5" />
              Select Platforms
            </button>

          </motion.div>
        </div>




      </div>
    </div>
  );
};