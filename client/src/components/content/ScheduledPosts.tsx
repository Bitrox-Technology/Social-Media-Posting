import React, { useEffect } from 'react';
import { Calendar, Clock, Share2, MoreVertical, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLazyGetUserScheduledPostsQuery } from '../../store/api';
import { FacebookSharp, LinkedIn } from '@mui/icons-material';

interface Post {
  _id: string;
  taskId: string;
  task: string;
  platform: string;
  imageUrl: string;
  title: string;
  description: string;
  scheduleTime: string;
  cronExpression: string;
  status: 'pending' | 'completed' | 'failed';
  postId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ScheduledPosts: React.FC = () => {
  const [getUserScheduledPosts, { data, isLoading, isError, error }] = useLazyGetUserScheduledPostsQuery();

  // Fetch scheduled posts on component mount
  useEffect(() => {
    getUserScheduledPosts();
  }, [getUserScheduledPosts]);

  // Separate posts into pending and completed
  const posts: Post[] = data?.data || [];
  const pendingPosts = posts.filter((post) => post.status === 'pending');
  const completedPosts = posts.filter((post) => post.status === 'completed');

  const platformIcons = {
    instagram: <Instagram className="w-5 h-5" />,
    facebook: <FacebookSharp className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    linkedin: <LinkedIn className="w-5 h-5" />,
  };

  const platformColors = {
    instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    facebook: 'bg-blue-600',
    twitter: 'bg-blue-400',
    linkedin: 'bg-blue-700',
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  const renderPostsSection = (sectionTitle: string, posts: Post[]) => (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-white mb-6">{sectionTitle}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-400">No {sectionTitle.toLowerCase()} posts at the moment.</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{post.description}</p>
                    <div className="flex items-center mt-1 text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDateTime(post.scheduleTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex -space-x-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${platformColors[post.platform as keyof typeof platformColors]} text-white shadow-lg transform hover:scale-110 transition-transform duration-200 cursor-pointer`}
                      title={post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                    >
                      {platformIcons[post.platform as keyof typeof platformIcons]}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      post.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : post.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-400">Task ID: {post.taskId}</span>
                  {post.postId && (
                    <span className="text-sm text-gray-400">Post ID: {post.postId}</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-400">Loading scheduled posts...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Error Loading Scheduled Posts</h1>
          <p className="text-gray-400">
            {error instanceof Error ? error.message : 'An error occurred while fetching scheduled posts.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Scheduled Posts
            </h1>
            <p className="text-gray-400 mt-2">Manage your upcoming social media content</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Schedule New Post
          </motion.button>
        </div>

        {/* Pending Posts Section */}
        {renderPostsSection('Pending Posts', pendingPosts)}

        {/* Completed Posts Section */}
        {renderPostsSection('Completed Posts', completedPosts)}
      </div>
    </div>
  );
};