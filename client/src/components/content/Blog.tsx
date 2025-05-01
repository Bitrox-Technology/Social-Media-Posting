import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { useGenerateBlogMutation } from '../../store/api';
import { motion } from 'framer-motion';
import { Sparkles, Save, BookOpen, Lightbulb } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext"; // Import ThemeContext

export const Blog: React.FC = () => {
  const { theme } = useTheme(); // Access theme from ThemeContext
  const contentType = useAppSelector((state) => state.app.contentType);
  const [topic, setTopic] = useState('');
  const [generatedBlog, setGeneratedBlog] = useState<{ title: string; content: string } | null>(null);

  const [generateBlog, { isLoading }] = useGenerateBlogMutation();

  const suggestedTopics = [
    'The Future of Technology in 2025',
    'How to Boost Your Productivity',
    'Exploring Hidden Travel Destinations',
    'A Beginners Guide to Healthy Living',
    'The Impact of AI on Everyday Life',
  ];

  const handleGenerateBlog = async () => {
    if (!topic.trim()) {
      alert('Please enter or select a topic!');
      return;
    }

    try {
      const result = await generateBlog({ topic }).unwrap();
      setGeneratedBlog(result.data);
    } catch (err) {
      console.error('Error generating blog:', err);
      alert('Failed to generate blog. Please try again later.');
    }
  };

  const handleSave = () => {
    if (!generatedBlog) {
      alert('Please generate a blog first!');
      return;
    }
    console.log('Blog Saved:', generatedBlog);
    alert('Blog saved! (This is a placeholder action)');
  };

  // Theme-based styles
  const themeStyles = {
    container: theme === 'dark'
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
      : 'bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-900',
    card: theme === 'dark'
      ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50'
      : 'bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-sm',
    input: theme === 'dark'
      ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400/50'
      : 'bg-gray-100/50 text-gray-900 border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50',
    label: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    suggestionButton: theme === 'dark'
      ? 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50 hover:border-yellow-400/50'
      : 'bg-gray-200/50 text-gray-700 border-gray-300 hover:bg-gray-300/50 hover:border-blue-500/50',
    generateButton: theme === 'dark'
      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50'
      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400 disabled:opacity-50',
    saveButton: theme === 'dark'
      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400'
      : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-400 hover:to-cyan-400',
    titleGradient: theme === 'dark'
      ? 'bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400'
      : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500',
    blogTitleGradient: theme === 'dark'
      ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500'
      : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    prose: theme === 'dark' ? 'prose-invert text-gray-300' : 'prose text-gray-700',
  };

  return (
    <div className={`min-h-screen p-6 ${themeStyles.container}`}>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-5xl font-bold ${themeStyles.titleGradient} mb-4`}>
            AI Blog Generator
          </h1>
          <p className={`text-lg ${themeStyles.textSecondary}`}>
            Transform your ideas into engaging blog posts with AI
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className={`rounded-xl p-6 border ${themeStyles.card}`}>
            <div className="mb-6">
              <label htmlFor="topic" className={`block text-lg font-medium ${themeStyles.label} mb-2 flex items-center`}>
                <BookOpen className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-blue-500'}`} />
                Blog Topic
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your blog topic"
                className={`w-full p-4 rounded-xl border focus:outline-none transition-all duration-300 ${themeStyles.input}`}
              />
            </div>

            <div>
              <p className={`text-lg font-medium ${themeStyles.label} mb-3 flex items-center`}>
                <Lightbulb className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-blue-500'}`} />
                Suggested Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    onClick={() => setTopic(suggestion)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${themeStyles.suggestionButton}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleGenerateBlog}
            disabled={isLoading}
            className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${themeStyles.generateButton}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? 'Generating...' : 'Generate Blog'}
          </motion.button>

          {generatedBlog && generatedBlog.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-6 border ${themeStyles.card} space-y-6`}
            >
              <h2 className={`text-2xl font-bold ${themeStyles.blogTitleGradient}`}>
                {generatedBlog.title}
              </h2>
              <div className={`max-w-none ${themeStyles.prose}`}>
                {generatedBlog.content.split('\n').map((line, index) => (
                  <p key={index} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
              <motion.button
                onClick={handleSave}
                className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${themeStyles.saveButton}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" />
                Save Blog
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;