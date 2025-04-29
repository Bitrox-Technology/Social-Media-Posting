import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface HeaderProps {
  theme: string;
  handleBack: () => void;
  generateAllPosts: () => void;
  isGenerating: boolean;
  currentIndex: number;
  topicsLength: number;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  handleBack,
  generateAllPosts,
  isGenerating,
  currentIndex,
  topicsLength,
  isLoading,
}) => {
  return (
    <div className="flex items-center justify-between mb-8 md:mb-12">
      <motion.button
        onClick={handleBack}
        className={`flex items-center px-3 py-2 md:px-4 md:py-2 rounded-xl transition-all ${
          theme === 'dark'
            ? 'bg-white/10 backdrop-blur-lg text-white hover:bg-white/20'
            : 'bg-gray-100 border border-gray-200 text-gray-800 hover:bg-gray-200'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-gray-100'
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
        <span className="text-sm md:text-base">Back</span>
      </motion.button>

      <h1
        className={`text-2xl md:text-4xl font-bold text-transparent bg-clip-text ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
        }`}
      >
        AI Content Creator
      </h1>

      <motion.button
        onClick={generateAllPosts}
        disabled={isGenerating || isLoading}
        className={`flex items-center px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-gray-100'
        }`}
        whileHover={{ scale: isGenerating || isLoading ? 1 : 1.03 }}
        whileTap={{ scale: isGenerating || isLoading ? 1 : 0.97 }}
      >
        <RefreshCw
          className={`w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 ${isGenerating ? 'animate-spin' : ''}`}
        />
        <span className="text-sm md:text-base">
          {isGenerating
            ? 'Generating...'
            : currentIndex < topicsLength - 1
            ? 'Generate Posts'
            : 'Regenerate Posts'}
        </span>
      </motion.button>
    </div>
  );
};