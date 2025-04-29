import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Post } from './Types';

interface PendingPostCardProps {
  post: Post;
  theme: string;
}

export const PendingPostCard: React.FC<PendingPostCardProps> = ({ post, theme }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`p-4 md:p-6 rounded-xl border ${
        theme === 'dark'
          ? 'bg-white/10 backdrop-blur-lg border-white/20'
          : 'bg-white shadow-md border-gray-200'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          {getStatusIcon(post.status)}
          <div>
            <h3
              className={`text-base md:text-lg font-medium ${
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
      </div>
      {post.status === 'error' && (
        <p
          className={`mt-3 md:mt-4 text-xs md:text-sm p-2 md:p-3 rounded-lg ${
            theme === 'dark'
              ? 'text-red-400 bg-red-500/10'
              : 'text-red-600 bg-red-100'
          }`}
        >
          {post.errorMessage}
        </p>
      )}
    </motion.div>
  );
};