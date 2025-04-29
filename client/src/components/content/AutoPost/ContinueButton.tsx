import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface ContinueButtonProps {
  onClick: () => void;
  theme: string;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({ onClick, theme }) => {
  return (
    <motion.div
      className="mt-12 md:mt-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.button
        onClick={onClick}
        className={`group inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          theme === 'dark'
            ? 'focus:ring-offset-gray-800'
            : 'focus:ring-offset-gray-100'
        } focus:ring-offset-2`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue to Post
        <ChevronRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
};