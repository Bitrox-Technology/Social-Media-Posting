import React, { useState } from 'react';
import { Search, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setSelectedTopic } from '../store/appSlice';
import { motion } from 'framer-motion';

interface TopicSelectorProps {
  // No props needed since we're using Redux
}

export const TopicSelector: React.FC<TopicSelectorProps> = () => {
  const [customTopic, setCustomTopic] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSelect = (topic: string) => {
    dispatch(setSelectedTopic(topic));
    navigate('/ideas');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const predefinedTopics = [
    'Digital Marketing',
    'Tech Innovation',
    'Business Growth',
    'Personal Development',
    'Industry News',
    'Product Updates',
  ];

  const trendingTopics = [
    'AI in Business',
    'Remote Work Culture',
    'Sustainability',
    'Digital Transformation',
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <button
          onClick={handleBack}
          className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Go back to content type selection"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-semibold text-white ml-4">Choose your topic</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {predefinedTopics.map((topic) => (
          <motion.button
            key={topic}
            onClick={() => handleSelect(topic)}
            className="p-4 bg-gray-800 rounded-lg text-white text-left transition-colors border border-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            whileHover={{ scale: 1.05, borderColor: '#FBBF24' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            aria-label={`Select topic: ${topic}`}
          >
            {topic}
          </motion.button>
        ))}
      </div>

      <div>
        <h3 className="flex items-center text-xl font-semibold text-white mb-4">
          <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
          Trending Topics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trendingTopics.map((topic) => (
            <motion.button
              key={topic}
              onClick={() => handleSelect(topic)}
              className="p-4 bg-gray-800 rounded-lg text-white text-left transition-colors border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              whileHover={{ scale: 1.05, borderColor: '#FBBF24' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              aria-label={`Select trending topic: ${topic}`}
            >
              {topic}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Custom Topic</h3>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Enter your topic..."
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 border border-yellow-500/50 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Enter a custom topic"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <motion.button
            onClick={() => customTopic && handleSelect(customTopic)}
            disabled={!customTopic}
            className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            aria-label="Use custom topic"
          >
            Use Custom Topic
          </motion.button>
        </div>
      </div>
    </div>
  );
};