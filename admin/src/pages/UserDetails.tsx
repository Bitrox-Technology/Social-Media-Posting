import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Edit,
  Trash,
  Eye,
  FileText,
  Clock,
  Tag,
  ThumbsUp,
  Briefcase,
  Globe,
  Target,
  Package,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useLazyGetUserQuery } from '../store/authApi';
import { motion } from 'framer-motion';
import { mockPostsData } from '../data/mockData';

// Default user fallback (used only if API fails and no cached data exists)
const defaultUser = {
  _id: 'default',
  userName: 'Unknown User',
  email: 'N/A',
  countryCode: '',
  phone: 'N/A',
  location: 'N/A',
  logo: 'https://via.placeholder.com/128',
  companyName: 'N/A',
  services: ['N/A'],
  keyProducts: ['N/A'],
  targetMarket: 'N/A',
  websiteUrl: 'https://example.com',
  isProfileCompleted: false,
  role: 'USER',
  subscription: 'FREE',
  status: 'INACTIVE',
  bio: 'No bio available',
  isEmailVerify: false,
  isDeleted: false,
  isBlocked: false,
  productCategories: [
    {
      category: 'N/A',
      productName: 'N/A',
      image: 'https://via.placeholder.com/64',
      _id: 'default',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'posts' | 'activity'>('posts');
  const [getUser, { data, isLoading, error }] = useLazyGetUserQuery();
  const [user, setUser] = useState<any>(defaultUser);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        toast.error('User ID is missing', {
          theme: isDarkMode ? 'dark' : 'light',
        });
        return;
      }

      try {
        const response = await getUser({ userId: id }).unwrap();
        if (response.data) {
          setUser(response.data);
        } else {
          throw new Error('No user data received');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        toast.error('Failed to fetch user data', {
          theme: isDarkMode ? 'dark' : 'light',
        });
        // Fallback to defaultUser if API fails
        setUser(defaultUser);
      }
    };

    fetchUser();
  }, [id, getUser, isDarkMode]);

  // Filter posts by userName (mock data, as API doesn't provide posts)
  const userPosts = mockPostsData.filter((post) => post.author === user.userName);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`w-10 h-10 border-4 border-t-4 border-blue-500 rounded-full ${
            isDarkMode ? 'border-gray-400' : 'border-gray-300'
          }`}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      {/* User Profile Header */}
      <div
        className={`rounded-lg shadow-sm overflow-hidden ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border`}
      >
        <div className="bg-purple-600 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 space-y-3 sm:space-y-0 sm:space-x-5">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <img
                src={user.logo || 'https://via.placeholder.com/128'}
                alt={`${user.companyName} logo`}
                className="h-full w-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/128';
                }}
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {user.userName}
              </h1>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                {user.companyName}
              </p>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                {user.email}
              </p>
            </div>
            <div className="flex space-x-3">
              <motion.button
                onClick={() => navigate(`/users/${user._id}`)}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit size={16} className="mr-2" />
                Edit
              </motion.button>
              <motion.button
                className={`flex items-center px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={16} className="mr-2" />
                Message
              </motion.button>
            </div>
          </div>
        </div>

        <div
          className={`border-t px-6 py-4 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className={`flex items-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              <span>
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div
              className={`flex items-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>{userPosts.length} Posts</span>
            </div>
            <div
              className={`flex items-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Tag className="h-5 w-5 mr-2" />
              <span>{user.subscription} Plan</span>
            </div>
            <div
              className={`flex items-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <MapPin className="h-5 w-5 mr-2" />
              <span>{user.location || 'N/A'}</span>
            </div>
            <div
              className={`flex items-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Phone className="h-5 w-5 mr-2" />
              <span>
                {user.countryCode && user.phone
                  ? `${user.countryCode} ${user.phone}`
                  : 'N/A'}
              </span>
            </div>
            <div
              className={`flex items-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Globe className="h-5 w-5 mr-2" />
              <a
                href={user.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              >
                {user.websiteUrl || 'N/A'}
              </a>
            </div>
            <div
              className={`flex items-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Target className="h-5 w-5 mr-2" />
              <span>{user.targetMarket || 'N/A'}</span>
            </div>
            <div
              className={`flex items-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <Clock className="h-5 w-5 mr-2" />
              <span>
                Last updated: {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Additional User Information */}
        <div
          className={`border-t px-6 py-4 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-4`}
          >
            Company Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p
                className={`flex items-center ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <Briefcase className="h-5 w-5 mr-2" />
                <span>
                  <strong>Bio:</strong> {user.bio || 'No bio available'}
                </span>
              </p>
              <p
                className={`flex items-center ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                } mt-2`}
              >
                <Tag className="h-5 w-5 mr-2" />
                <span>
                  <strong>Services:</strong>{' '}
                  {user.services?.join(', ') || 'N/A'}
                </span>
              </p>
              <p
                className={`flex items-center ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                } mt-2`}
              >
                <Package className="h-5 w-5 mr-2" />
                <span>
                  <strong>Key Products:</strong>{' '}
                  {user.keyProducts?.join(', ') || 'N/A'}
                </span>
              </p>
            </div>
            <div>
              <p
                className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <strong>Product Categories:</strong>
              </p>
              <ul className="mt-2 space-y-2">
                {(user.productCategories || []).map((category: any) => (
                  <li
                    key={category._id}
                    className={`flex items-center ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    <Package className="h-5 w-5 mr-2" />
                    <div>
                      <span>
                        {category.category || 'N/A'}: {category.productName || 'N/A'}
                      </span>
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.productName || 'Product Image'}
                          className="h-12 w-12 object-cover inline-block ml-7 rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64';
                          }}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`rounded-lg shadow-sm ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border`}
      >
        <div
          className={`border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : `border-transparent ${
                      isDarkMode
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                    } hover:border-gray-300`
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : `border-transparent ${
                      isDarkMode
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                    } hover:border-gray-300`
              }`}
            >
              Activity
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'posts' ? (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className={`border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3
                        className={`text-lg font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {post.title}
                      </h3>
                      <p
                        className={`mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        className={`p-2 ${
                          isDarkMode
                            ? 'text-gray-400 hover:text-gray-300'
                            : 'text-gray-400 hover:text-gray-500'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye size={18} />
                      </motion.button>
                      <motion.button
                        className={`p-2 ${
                          isDarkMode
                            ? 'text-blue-400 hover:text-blue-300'
                            : 'text-blue-400 hover:text-blue-500'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        className={`p-2 ${
                          isDarkMode
                            ? 'text-red-400 hover:text-red-300'
                            : 'text-red-400 hover:text-red-500'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash size={18} />
                      </motion.button>
                    </div>
                  </div>
                  <div
                    className={`mt-4 flex items-center space-x-4 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {post.category}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      24 Likes
                    </div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}

              {userPosts.length === 0 && (
                <div className="text-center py-12">
                  <FileText
                    className={`mx-auto h-12 w-12 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  />
                  <h3
                    className={`mt-2 text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}
                  >
                    No posts
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    This user hasn't created any posts yet.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div
                className={`border-l-2 pl-4 ${
                  isDarkMode ? 'border-purple-900' : 'border-purple-200'
                }`}
              >
                <div
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Today
                </div>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`h-8 w-8 rounded-full ${
                          isDarkMode
                            ? 'bg-green-900 text-green-200'
                            : 'bg-green-100 text-green-600'
                        } flex items-center justify-center`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}
                      >
                        Created a new post: "Getting Started with React in 2025"
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`h-8 w-8 rounded-full ${
                          isDarkMode
                            ? 'bg-blue-900 text-blue-200'
                            : 'bg-blue-100 text-blue-600'
                        } flex items-center justify-center`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}
                      >
                        Liked 3 posts
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        5 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`border-l-2 pl-4 ${
                  isDarkMode ? 'border-purple-900' : 'border-purple-200'
                }`}
              >
                <div
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Yesterday
                </div>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`h-8 w-8 rounded-full ${
                          isDarkMode
                            ? 'bg-purple-900 text-purple-200'
                            : 'bg-purple-100 text-purple-600'
                        } flex items-center justify-center`}
                      >
                        <Tag className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}
                      >
                        Upgraded to Premium subscription
                      </p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        1 day ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </div>
  );
};

export default UserDetails;