import React, { useEffect } from 'react';
import { Sparkles, Hash, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedIdea, setIdeas } from '../../store/appSlice';
import { useGenerateIdeasMutation } from '../../store/api';
import { motion } from 'framer-motion';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

export const ContentIdeas: React.FC = () => {
  const topic = useAppSelector((state) => state.app.selectedTopic);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Use RTK Query mutation to fetch content ideas
  const [generateIdeas, { data: response, isLoading, isError, error }] = useGenerateIdeasMutation({
    fixedCacheKey: `contentIdeas_${topic}`,
  });

  // Extract the ideas array from the response
  const ideas: ContentIdea[] = response?.data && Array.isArray(response.data) ? response.data : [];

  // Log the data for debugging
  console.log("Response from RTK Query:", response);
  console.log("Ideas:", ideas);

  // Load ideas from sessionStorage on mount
  useEffect(() => {
    const savedIdeas = sessionStorage.getItem(`contentIdeas_${topic}`);
    if (savedIdeas && !ideas.length) {
      try {
        const parsedIdeas: ContentIdea[] = JSON.parse(savedIdeas);
        if (Array.isArray(parsedIdeas)) {
          dispatch(setIdeas(parsedIdeas)); // Store the array of ideas
          if (parsedIdeas.length > 0) {
            dispatch(setSelectedIdea(parsedIdeas[0])); // Set the first idea as the selected idea
          }
        }
      } catch (err) {
        console.error('Error parsing saved ideas from sessionStorage:', err);
      }
    }
  }, [topic, ideas.length, dispatch]);

  // Save ideas to sessionStorage and Redux whenever they change
  useEffect(() => {
    if (ideas.length > 0) {
      sessionStorage.setItem(`contentIdeas_${topic}`, JSON.stringify(ideas));
      dispatch(setIdeas(ideas)); // Also store in Redux
    }
  }, [ideas, topic, dispatch]);

  const fetchContentIdeas = async () => {
    try {
      await generateIdeas({ topic }).unwrap();
    } catch (err) {
      console.error('Error fetching content ideas:', err);
    }
  };

  const handleSelect = (idea: ContentIdea) => {
    dispatch(setSelectedIdea(idea));
    navigate('/images');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Go back to topic selection"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h2 className="text-2xl font-semibold text-white ml-4">
            Content Ideas for "{topic}"
          </h2>
        </div>
        <motion.button
          onClick={fetchContentIdeas}
          disabled={isLoading}
          className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          whileHover={{ scale: 1.05, backgroundColor: '#FBBF24' }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
          aria-label={ideas.length > 0 ? 'Regenerate content ideas' : 'Generate content ideas'}
        >
          {isLoading ? 'Generating...' : ideas.length > 0 ? 'Regenerate Ideas' : 'Generate Ideas'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.length === 0 && !isLoading ? (
          <p className="text-gray-300">Click "Generate Ideas" to get started!</p>
        ) : isLoading ? (
          <p className="text-gray-300">Loading content ideas...</p>
        ) : isError ? (
          <p className="text-red-500">
            Error fetching ideas: {error ? (error as any).message : 'Unknown error'}
          </p>
        ) : (
          ideas.map((idea, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-yellow-500/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              onClick={() => handleSelect(idea)}
              whileHover={{ scale: 1.02, borderColor: '#FBBF24' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(idea)}
              aria-label={`Select content idea: ${idea.title}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                    {idea.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{idea.content}</p>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-yellow-500" />
                    <div className="flex flex-wrap gap-2">
                      {idea.hashtags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-sm text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};