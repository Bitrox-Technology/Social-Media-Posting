import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Edit3 } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { Post } from './Types';

interface PostCardProps {
  post: Post;
  theme: string;
  onEditPost: (post: Post) => void;
  registerRef: (topic: string, ref: HTMLDivElement) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, theme, onEditPost, registerRef }) => {
  const getStatusIcon = (status: string) => {
    if (status === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    return null;
  };

  return (
    <motion.div
      className={`p-4 md:p-6 rounded-xl border ${
        theme === 'dark'
          ? 'bg-white/10 backdrop-blur-lg border-white/20'
          : 'bg-white shadow-md border-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center space-x-3 md:space-x-4 mb-2 md:mb-0">
          {getStatusIcon(post.status)}
          <div>
            <h3
              className={`text-base md:text-xl font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}
            >
              {post.topic}
            </h3>
            <span
              className={`text-xs md:text-sm capitalize ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {post.type} Post
            </span>
          </div>
        </div>
        {post.status === 'success' && (post.images?.length ?? 0) > 0 && (
          <motion.button
            onClick={() => onEditPost(post)}
            className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 focus:ring-offset-gray-800'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-offset-white'
            } focus:ring-offset-2`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
            <span className="text-xs md:text-sm">Edit Post</span>
          </motion.button>
        )}
      </div>

      <div
        ref={(el) => el && registerRef(post.topic, el)}
        className={`p-4 md:p-6 rounded-xl ${
          theme === 'dark'
            ? 'bg-black/20 backdrop-blur-lg'
            : 'bg-gray-50 border border-gray-200'
        }`}
      >
        <ImageGallery 
          images={post.images || []} 
          type={post.type} 
          theme={theme} 
        />
      </div>
    </motion.div>
  );
};