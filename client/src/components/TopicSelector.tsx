import React, { useState } from 'react';
import { Search, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopicSelectorProps {
  onSelect: (topic: string) => void;
  // Remove onBack since we'll handle it with navigate
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect }) => {
  const [customTopic, setCustomTopic] = useState('');
  const navigate = useNavigate();

  const handleSelect = (topic: string) => {
    onSelect(topic);
    navigate('/ideas');
  };

  const handleBack = () => {
    navigate(-1); // Or navigate('/') if you prefer explicit routing to ContentTypeSelector
  };

  const predefinedTopics = [
    'Digital Marketing',
    'Tech Innovation',
    'Business Growth',
    'Personal Development',
    'Industry News',
    'Product Updates'
  ];

  const trendingTopics = [
    'AI in Business',
    'Remote Work Culture',
    'Sustainability',
    'Digital Transformation'
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <button
          onClick={handleBack}
          className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-semibold text-white ml-4">Choose your topic</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {predefinedTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleSelect(topic)} // Updated to use handleSelect
            className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 text-white text-left transition-colors border border-yellow-500/50 hover:border-yellow-500"
          >
            {topic}
          </button>
        ))}
      </div>

      <div>
        <h3 className="flex items-center text-xl font-semibold text-white mb-4">
          <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
          Trending Topics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {trendingTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleSelect(topic)} // Updated to use handleSelect
              className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 text-white text-left transition-colors border border-yellow-500"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Custom Topic</h3>
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Enter your topic..."
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 border border-yellow-500/50 focus:border-yellow-500 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => customTopic && handleSelect(customTopic)} // Updated to use handleSelect
            disabled={!customTopic}
            className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Use Custom Topic
          </button>
        </div>
      </div>
    </div>
  );
};