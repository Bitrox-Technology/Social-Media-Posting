import React, { useState } from 'react';
import { useGenerateBlogMutation, useGenerateBlogWithGeminiMutation, useGenerateImageMutation, useSaveBlogMutation } from '../../store/api';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Sparkles, Save, BookOpen, Lightbulb, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '../hooks/useAlert';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../ui/Alert';
import { setBlogContent, selectBlogContent, setCsrfToken } from '../../store/appSlice';
import DOMPurify from 'dompurify'; // For HTML sanitization

export const Blog: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogContent = useSelector(selectBlogContent);
  const [topic, setTopic] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [section, setSection] = useState<'blog' | 'news' | 'article'>('blog');

  const [generateBlogWithGemini, { isLoading: isGeminiLoading }] = useGenerateBlogWithGeminiMutation();
  const [generateImage] = useGenerateImageMutation();
  const [saveBlog] = useSaveBlogMutation();
  const { isOpen, config, showAlert, closeAlert, handleConfirm, error: showErrorAlert, confirm: showConfirmAlert } = useAlert();

  const suggestedTopics = [
    'Rust is Future of Blockchain',
    'The Future of Technology in 2025',
    'How to Boost Your Productivity',
    'Exploring Hidden Travel Destinations',
    'A Beginners Guide to Healthy Living',
  ];

  const sections = {
    blog: 'Blog',
    news: 'News',
    article: 'Article',
  };

  // Handle blog generation
  const handleGenerateBlog = async () => {
    if (!topic.trim()) {
      showErrorAlert('Please enter or select a topic!');
      return;
    }
    try {
      const result = await generateBlogWithGemini({ topic }).unwrap();
      console.log('Generated Blog Data:', result.data);
      if (!result.success || !result.data) {
        throw new Error('Invalid blog data received');
      }
      dispatch(setBlogContent({
        title: result.data.title,
        content: result.data.content,
        metaDescription: result.data.metaDescription,
        categories: result.data.categories,
        tags: result.data.tags,
        slug: result.data.slug,
        excerpt: result.data.excerpt || '',
        focusKeyword: result.data.focusKeyword || '',
        image: {
          url: '',
          altText: result.data.imageAltText,
          description: result.data.imageDescription || '',
        },
      }));
      setImageUrl(null);
    } catch (err) {
      console.error('Error generating blog:', err);
      showErrorAlert('Failed to generate blog. Please try again later.');
      dispatch(setBlogContent({
        title: '',
        content: '',
        metaDescription: '',
        categories: [],
        tags: [],
        slug: '',
        excerpt: '',
        focusKeyword: '',
        image: { url: '', altText: '', description: '' },
      }));
    }
  };

  // Handle image generation
  const handleGenerateImage = async () => {
    if (!blogContent) {
      showErrorAlert('Please generate a blog first!');
      return;
    }
    setIsImageLoading(true);
    try {
      const result = await generateImage({ prompt: blogContent.title }).unwrap();
      const imageUrl = result.data;
      console.log('Generated Image URL:', imageUrl);
      setImageUrl(imageUrl);
      dispatch(setBlogContent({
        ...blogContent,
        image: { ...blogContent.image, url: imageUrl },
      }));
    } catch (err) {
      console.error('Error generating image:', err);
      showErrorAlert('Failed to generate image. Please try again later.');
    } finally {
      setIsImageLoading(false);
    }
  };

  // Handle saving the blog
  const handleSave = async () => {
    if (!blogContent || !imageUrl) {
      showErrorAlert('Please generate both blog content and image before saving!');
      return;
    }
    const blogData = {
      title: blogContent.title,
      content: blogContent.content,
      metaDescription: blogContent.metaDescription,
      categories: blogContent.categories,
      tags: blogContent.tags,
      excerpt: blogContent.excerpt || '',
      focusKeyword: blogContent.focusKeyword || '',
      slug: blogContent.slug || '',
      imageUrl: imageUrl,
      imageAltText: blogContent.image.altText,
      imageDescription: blogContent.image.description || '',
      section,
    };
    try {
      const response = await saveBlog(blogData).unwrap();
      console.log('Blog saved successfully:', response.data);
      dispatch(setCsrfToken({ token: response.data.csrfToken, expiresAt: response.data.csrfTokenExpiresAt }));
      showConfirmAlert(
        'Blog saved successfully!',
        'Would you like to navigate to the post blog page?',
        () => navigate('/post-blog', { state: { blogId: response.data.user?._id } })
      );
    } catch (err) {
      console.error('Error saving blog:', err);
      showErrorAlert('Failed to save blog. Please try again later.');
    }
  };

  // Sanitize HTML content to prevent XSS
  const sanitizedContent = blogContent?.content ? DOMPurify.sanitize(blogContent.content) : '';

  return (
    <div
      className={`min-h-screen ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
        : 'bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-900'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent ${theme === 'dark'
              ? 'bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400'
              : 'bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600'
              } mb-6`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            AI Blog Generator
          </motion.h1>
          <motion.p
            className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform your ideas into SEO-optimized blog posts with AI
          </motion.p>
        </div>

        {/* Topic Input, Suggested Topics, and Section Selector */}
        <motion.div
          className={`grid grid-cols-1 gap-8 mb-12 ${theme === 'dark'
            ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50'
            : 'bg-white/80 backdrop-blur-sm border-gray-200/50'
            } border rounded-xl p-6 transition-all duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <label htmlFor="topic" className="flex items-center mb-3">
              <BookOpen className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Blog Topic
              </span>
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your blog topic (e.g., Rust is Future of Blockchain)"
              className={`w-full p-4 rounded-xl border focus:outline-none transition-all duration-300 ${theme === 'dark'
                ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/50'
                : 'bg-gray-100/50 text-gray-900 border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/50'
                }`}
            />
          </div>

          <div>
            <p className="flex items-center mb-3">
              <Lightbulb className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Suggested Topics
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => setTopic(suggestion)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 border ${theme === 'dark'
                    ? 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50 hover:border-yellow-400/50'
                    : 'bg-gray-200/50 text-gray-700 border-gray-300 hover:bg-gray-300/50 hover:border-blue-500/50'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="section" className="flex items-center mb-3">
              <BookOpen className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Blog Section
              </span>
            </label>
            <select
              id="section"
              value={section}
              onChange={(e) => setSection(e.target.value as 'blog' | 'news' | 'article')}
              className={`w-full p-4 rounded-xl border focus:outline-none transition-all duration-300 ${theme === 'dark'
                ? 'bg-gray-700/50 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-400/50'
                : 'bg-gray-100/50 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'
                }`}
            >
              {Object.entries(sections).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Generate Blog Button */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            onClick={handleGenerateBlog}
            disabled={isGeminiLoading}
            className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 disabled:cursor-not-allowed gap-2 ${theme === 'dark'
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400 disabled:opacity-50'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-6 h-6" />
            {isGeminiLoading ? 'Generating Blog...' : 'Generate Blog'}
          </motion.button>
        </motion.div>

        {/* Generated Blog Content */}
        {blogContent && (
          <motion.div
            className={`${theme === 'dark'
                ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/70'
                : 'bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50/90'
              } border rounded-xl p-8 transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Blog Title */}
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-8 leading-tight ${theme === 'dark'
                  ? 'bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500'
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
            >
              {blogContent.title}
            </h2>

            {/* Generate Image Button */}
            {!imageUrl && (
              <motion.button
                onClick={handleGenerateImage}
                disabled={isImageLoading}
                className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 disabled:cursor-not-allowed gap-2 mb-8 ${theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-gray-900 hover:from-blue-300 hover:to-purple-300 disabled:opacity-50'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ImageIcon className="w-6 h-6" />
                {isImageLoading ? 'Generating Image...' : 'Generate Featured Image'}
              </motion.button>
            )}

            {/* Display Image */}
            {imageUrl && (
              <div className="mt-6 mb-8">
                <img
                  src={imageUrl}
                  alt={blogContent.image.altText}
                  className="w-full h-auto rounded-lg shadow-md mx-auto"
                  style={{ maxWidth: '1200px', maxHeight: '630px', objectFit: 'cover' }}
                />
                <p
                  className={`text-sm italic mt-2 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                >
                  {blogContent.image.description}
                </p>
              </div>
            )}

            {/* Blog Content with Enhanced Styling */}
            <div
              className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none mb-12`}
              style={{
                fontFamily: "'Inter', sans-serif",
                lineHeight: '1.75',
                color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
              }}
            >
              <div
                className="space-y-8"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
              {/* Custom styles for prose elements */}
              <style>{`
    .prose :where(h2):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
      font-size: 2rem;
      font-weight: 700;
      lineHeight: 1.3;
      margin-top: 3rem;
      margin-bottom: 1.5rem;
      color: ${theme === 'dark' ? '#f3f4f6' : '#111827'};
      border-bottom: 2px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'};
      padding-bottom: 0.5rem;
    }
    .prose :where(h3):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
      font-size: 1.5rem;
      font-weight: 600;
      lineHeight: 1.4;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: ${theme === 'dark' ? '#d1d5db' : '#1f2937'};
    }
    .prose :where(p):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
      font-size: 1.125rem;
      lineHeight: 1.75;
      margin-bottom: 1.5rem;
      color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
    }
    .prose :where(ul, ol):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
      font-size: 1.125rem;
      lineHeight: 1.75;
      margin-bottom: 1.5rem;
      padding-left: 2rem;
    }
    .prose :where(ul li):not(:where([class~="not-prose"],[class~="not-prose"] *))::before {
      content: '•';
      position: absolute;
      left: -1.5rem;
      color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
      font-size: 1.5rem;
      lineHeight: 1;
      top: 0.35rem;
    }
    .prose :where(ol li):not(:where([class~="not-prose"],[class~="not-prose"] *))::before {
      content: counter(list-item) ".";
      counter-increment: list-item;
      position: absolute;
      left: -1.75rem;
      color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
      font-size: 1.125rem;
      font-weight: 600;
    }
    .prose :where(table):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 1rem;
      lineHeight: 1.5;
    }
    .prose :where(th, td):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
      padding: 0.75rem 1rem;
      border: 1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'};
      text-align: left;
    }
    .prose :where(th):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
      background-color: ${theme === 'dark' ? '#374151' : '#f3f4f6'};
      font-weight: 600;
      color: ${theme === 'dark' ? '#f3f4f6' : '#111827'};
    }
    .prose :where(td):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
      background-color: ${theme === 'dark' ? '#1f2937' : '#fff'};
      color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
    }
    .prose :where(table tr:nth-child(even) td):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
      background-color: ${theme === 'dark' ? '#2d3748' : '#f9fafb'};
    }
    @media (max-width: 640px) {
      .prose :where(table):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }
      .prose :where(th, td):not(:where([class~="not-prose"],[class~="not-prose"] *)) {
        padding: 0.5rem;
        font-size: 0.875rem;
      }
    }
  `}</style>
            </div>

            {/* Meta Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
              <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Blog Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <span><strong>Meta Description:</strong> {blogContent.metaDescription}</span>
                </div>
                <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <span><strong>Categories:</strong> {blogContent.categories.join(', ')}</span>
                </div>
                <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <span><strong>Tags:</strong> {blogContent.tags.join(', ')}</span>
                </div>
                <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <span><strong>Image Description:</strong> {blogContent.image.description}</span>
                </div>
                <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <span><strong>Section:</strong> {sections[section]}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <motion.button
                onClick={handleSave}
                className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 gap-2 ${theme === 'dark'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white hover:from-green-300 hover:to-emerald-300'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-400 hover:to-cyan-400'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-6 h-6" />
                Save Blog
              </motion.button>
            </div>
          </motion.div>
        )}

        <Alert
          type={config.type}
          title={config.title}
          message={config.message}
          isOpen={isOpen}
          onClose={closeAlert}
          onConfirm={config.type === 'confirm' ? handleConfirm : undefined}
        />
      </div>
    </div>
  );
};