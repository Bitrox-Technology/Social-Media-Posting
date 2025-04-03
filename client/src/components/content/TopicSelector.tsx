import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedTopic, setSelectedBusiness, setApiTopics } from '../../store/appSlice';
import { motion } from 'framer-motion';
import { useGenerateTopicsMutation } from '../../store/api';

interface TopicSelectorProps {
  // No props needed since we're using Redux
}

export const TopicSelector: React.FC<TopicSelectorProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedTopic, selectedBusiness, apiTopics: reduxApiTopics } = useAppSelector((state) => state.app);

  const [customBusiness, setCustomBusiness] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [fetchingTopics, setFetchingTopics] = useState(false);
  const [generateTopics, { isLoading, error }] = useGenerateTopicsMutation();

  const businesses = [
    'E-commerce',
    'Healthcare',
    'Technology',
    'Finance',
    'Education',
  ];

  // Sync local state with Redux on mount
  useEffect(() => {
    if (selectedTopic) {
      const topicsFromRedux = selectedTopic.split(', ').filter(Boolean);
      setSelectedTopics(topicsFromRedux);
    } else {
      setSelectedTopics([]); // Ensure local state is cleared if Redux state is empty
    }
  }, [selectedTopic]);

  const fetchTopics = async (business: string) => {
    if (fetchingTopics) return; // Prevent multiple calls
    setFetchingTopics(true);
    try {
      const response = await generateTopics({ business }).unwrap();
      const topicsArray = Object.values(response.data).filter((topic): topic is string => typeof topic === 'string');
      dispatch(setApiTopics(topicsArray)); // Store in Redux
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      dispatch(setApiTopics([]));
    } finally {
      setFetchingTopics(false);
    }
  };

  const handleBusinessSelect = (business: string) => {
    if (business !== selectedBusiness) {
      dispatch(setSelectedBusiness(business));
      setCustomBusiness(''); // Clear custom business input
      setSelectedTopics([]); // Clear selected topics
      dispatch(setSelectedTopic('')); // Clear selected topics in Redux
      fetchTopics(business); // Fetch new topics
    }
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prevSelectedTopics) => {
      let newSelectedTopics: string[];
      if (prevSelectedTopics.includes(topic)) {
        // Unselect the topic
        newSelectedTopics = prevSelectedTopics.filter((t) => t !== topic);
      } else if (prevSelectedTopics.length < 7) {
        // Select the topic if under the limit
        newSelectedTopics = [...prevSelectedTopics, topic];
      } else {
        // Do nothing if limit is reached
        return prevSelectedTopics;
      }
      // Update Redux immediately
      dispatch(setSelectedTopic(newSelectedTopics.join(', ')));
      return newSelectedTopics;
    });
  };

  const handleCustomTopic = () => {
    if (customTopic && selectedTopics.length < 7 && !selectedTopics.includes(customTopic)) {
      const newSelectedTopics = [...selectedTopics, customTopic];
      setSelectedTopics(newSelectedTopics);
      dispatch(setSelectedTopic(newSelectedTopics.join(', '))); // Update Redux
      setCustomTopic('');
    }
  };

  const handleSubmit = () => {
    if (selectedTopics.length > 0) {
      dispatch(setSelectedTopic(selectedTopics.join(', ')));
      navigate('/auto');
    }
  };

  const handleBack = () => {
    navigate("/"); // Browser back, Redux state persists
  };

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
        <h2 className="text-2xl font-semibold text-white ml-4">Choose your business and topics</h2>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Select Your Business</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map((business) => (
            <motion.button
              key={business}
              onClick={() => handleBusinessSelect(business)}
              className={`p-4 bg-gray-800 rounded-lg text-white text-left transition-colors border ${
                selectedBusiness === business ? 'border-yellow-500' : 'border-yellow-500/50'
              } focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
              whileHover={{ scale: 1.05, borderColor: '#FBBF24' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              aria-label={`Select business: ${business}`}
            >
              {business}
            </motion.button>
          ))}
        </div>
        <div className="mt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={customBusiness}
              onChange={(e) => setCustomBusiness(e.target.value)}
              placeholder="Enter your business..."
              className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 border border-yellow-500/50 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Enter a custom business"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <motion.button
            onClick={() => customBusiness && handleBusinessSelect(customBusiness)}
            disabled={!customBusiness}
            className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            aria-label="Use custom business"
          >
            Use Custom Business
          </motion.button>
        </div>
      </div>

      {selectedBusiness && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Select Topics (up to 7) for {selectedBusiness}
          </h3>
          {(isLoading || fetchingTopics) && <p className="text-white">Loading topics...</p>}
          {error && <p className="text-red-500">Failed to load topics. Click "Generate Topics" to retry.</p>}
          {!reduxApiTopics.length && !isLoading && !fetchingTopics && (
            <motion.button
              onClick={() => fetchTopics(selectedBusiness)}
              className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
              aria-label="Generate topics"
            >
              Generate Topics
            </motion.button>
          )}
          {reduxApiTopics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reduxApiTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <motion.button
                    key={topic}
                    onClick={() => handleTopicToggle(topic)}
                    className={`p-4 rounded-lg text-white text-left transition-colors border ${
                      isSelected
                        ? 'bg-gray-700 border-yellow-500'
                        : 'bg-gray-800 border-yellow-500/50'
                    } focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                    whileHover={{
                      scale: 1.05,
                      borderColor: '#FBBF24',
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    aria-label={`${isSelected ? 'Unselect' : 'Select'} topic: ${topic}`}
                    disabled={!isSelected && selectedTopics.length >= 7}
                  >
                    {topic}
                  </motion.button>
                );
              })}
            </div>
          )}
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-white mb-2">Add Custom Topic</h4>
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
                onClick={handleCustomTopic}
                disabled={!customTopic || selectedTopics.length >= 7}
                className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                aria-label="Add custom topic"
              >
                Add Custom Topic
              </motion.button>
            </div>
          </div>
          <motion.button
            onClick={handleSubmit}
            disabled={selectedTopics.length === 0 || isLoading || fetchingTopics}
            className="mt-6 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            aria-label="Submit selected topics"
          >
            Submit ({selectedTopics.length}/7)
          </motion.button>
        </div>
      )}
    </div>
  );
};