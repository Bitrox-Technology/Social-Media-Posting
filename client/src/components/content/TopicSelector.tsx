import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Sparkles, Building2, Hash, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedTopic, setSelectedBusiness, setApiTopics, addCustomTopic, clearCustomTopics } from '../../store/appSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenerateTopicsMutation, useSavePostContentMutation } from '../../store/api';
import { useTheme } from '../../context/ThemeContext';

export const TopicSelector: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { selectedTopic, selectedBusiness, apiTopics: reduxApiTopics, customTopics } = useAppSelector(
    (state) => state.app
  );
  const [businesses, setBusinesses] = useState<string[]>(['E-commerce', 'Healthcare', 'Technology', 'Finance', 'Education']);
  const [customBusiness, setCustomBusiness] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [fetchingTopics, setFetchingTopics] = useState(false);
  const [generateTopics, { isLoading, error }] = useGenerateTopicsMutation();
  const [savePostContent] = useSavePostContentMutation();

  // Restore selected topics from Redux state
  useEffect(() => {
    if (selectedTopic) {
      const topicsArray = selectedTopic.split(', ').filter(Boolean);
      setSelectedTopics(topicsArray);
    }
  }, [selectedTopic]);

  // Handle navigation state from AutoPostCreator
  useEffect(() => {
    if (location.state?.fromAutoPostCreator && selectedBusiness && reduxApiTopics.length) {
      setFetchingTopics(false);
    }
  }, [location.state, selectedBusiness, reduxApiTopics.length]);

  const fetchTopics = async (business: string) => {
    if (fetchingTopics || reduxApiTopics.length > 0) return;
    setFetchingTopics(true);
    try {
      const response = await generateTopics({ business }).unwrap();
      const topicsArray = Object.values(response.data).filter((topic): topic is string => typeof topic === 'string');
      dispatch(setApiTopics(topicsArray));
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
      setSelectedTopics([]);
      dispatch(setSelectedTopic(''));
      dispatch(setApiTopics([])); // Clear previous API topics
      dispatch(clearCustomTopics()); // Clear custom topics
    }
  };

  const handleAddCustomBusiness = () => {
    if (customBusiness && !businesses.includes(customBusiness)) {
      setBusinesses((prev) => [...prev, customBusiness]);
      setCustomBusiness('');
    }
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prevSelectedTopics) => {
      const newSelectedTopics = prevSelectedTopics.includes(topic)
        ? prevSelectedTopics.filter((t) => t !== topic)
        : prevSelectedTopics.length < 7
        ? [...prevSelectedTopics, topic]
        : prevSelectedTopics;

      dispatch(setSelectedTopic(newSelectedTopics.join(', ')));
      return newSelectedTopics;
    });
  };

  const handleCustomTopic = () => {
    if (
      customTopic &&
      selectedTopics.length < 7 &&
      !selectedTopics.includes(customTopic) &&
      !customTopics.includes(customTopic)
    ) {
      dispatch(addCustomTopic(customTopic));
      setCustomTopic('');
    }
  };

  const handleSubmit = async () => {
    if (selectedTopics.length > 0) {
      try {
        const response = await savePostContent({ topics: selectedTopics }).unwrap();
        dispatch(setSelectedTopic(selectedTopics.join(', ')));
        navigate('/auto', { state: { postContentId: response.data._id, fromTopicSelector: true } });
      } catch (err) {
        console.error('Failed to save selected topics:', err);
        const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Unknown error';
        alert(`Failed to save topics. Please try again: ${errorMessage}`);
      }
    }
  };

  const handleBack = () => {
    navigate('/content-type');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={handleBack}
                className="p-2 rounded-full bg-gray-800 dark:bg-gray-700 text-gray-200 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Creation Hub</h2>
              </div>
            </div>
            
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Select Your Business</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((business) => (
                  <motion.button
                    key={business}
                    onClick={() => handleBusinessSelect(business)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedBusiness === business
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {business}
                  </motion.button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={customBusiness}
                    onChange={(e) => setCustomBusiness(e.target.value)}
                    placeholder="Enter your business..."
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <motion.button
                  onClick={handleAddCustomBusiness}
                  disabled={!customBusiness}
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Custom Business
                </motion.button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {selectedBusiness && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-5 h-5 text-purple-500" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Select Topics for {selectedBusiness} ({selectedTopics.length}/7)
                    </h3>
                  </div>

                  {(isLoading || fetchingTopics) && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl">
                      Failed to load topics. Click "Generate Topics" to retry.
                    </div>
                  )}

                  {!reduxApiTopics.length && !customTopics.length && !isLoading && !fetchingTopics && (
                    <motion.button
                      onClick={() => fetchTopics(selectedBusiness)}
                      className="w-full px-6 py-4 bg-purple-500 text-white font-semibold rounded-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Generate Topics
                    </motion.button>
                  )}

                  {(reduxApiTopics.length > 0 || customTopics.length > 0) && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...reduxApiTopics, ...customTopics].map((topic) => {
                          const isSelected = selectedTopics.includes(topic);
                          return (
                            <motion.button
                              key={topic}
                              onClick={() => handleTopicToggle(topic)}
                              className={`p-4 rounded-xl text-left transition-all ${
                                isSelected
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-600'
                              } ${!isSelected && selectedTopics.length >= 7 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              whileHover={!isSelected && selectedTopics.length >= 7 ? {} : { scale: 1.02 }}
                              whileTap={!isSelected && selectedTopics.length >= 7 ? {} : { scale: 0.98 }}
                              disabled={!isSelected && selectedTopics.length >= 7}
                            >
                              {topic}
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-5 h-5 text-purple-500" />
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Add Custom Topic</h4>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={customTopic}
                              onChange={(e) => setCustomTopic(e.target.value)}
                              placeholder="Enter your topic..."
                              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                          <motion.button
                            onClick={handleCustomTopic}
                            disabled={!customTopic || selectedTopics.length >= 7}
                            className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Add Custom Topic
                          </motion.button>
                        </div>
                      </div>

                      <motion.button
                        onClick={handleSubmit}
                        disabled={selectedTopics.length === 0 || isLoading || fetchingTopics}
                        className="w-full px-6 py-4 bg-blue-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue with {selectedTopics.length} Topics Selected
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};