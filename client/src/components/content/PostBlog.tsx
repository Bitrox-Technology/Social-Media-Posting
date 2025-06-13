import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLazyGetBlogByIdQuery, usePostBlogMutation, useWordpressAuthMutation, useLazyGetWordpressAuthQuery } from '../../store/api';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { toast, ToastContainer } from 'react-toastify';

// Utility to format plain text content into HTML
const formatPlainTextContent = (content: string) => {
  if (!content) return '';

  if (content.includes('<p>') || content.includes('<h2>') || content.includes('<h3>')) {
    return content;
  }

  const sections = content.split(/(Latest Trends|Why Rust Offers Superior Security|Rust’s Impact|FAQ|Conclusion)/);
  let formattedContent = '';
  let isFAQ = false;

  sections.forEach((section, index) => {
    if (section.trim() === '') return;

    if (['Latest Trends', 'Why Rust Offers Superior Security', 'Rust’s Impact', 'FAQ', 'Conclusion'].includes(section)) {
      if (section === 'FAQ') {
        isFAQ = true;
        formattedContent += `<h3 class="faq-heading">${section}</h3>`;
      } else if (section === 'Conclusion') {
        isFAQ = false;
        formattedContent += `<h2 class="section-heading">${section}</h2>`;
      } else {
        formattedContent += `<h2 class="section-heading">${section}</h2>`;
      }
    } else if (isFAQ) {
      const faqItems = section.split(/Q\d:/).filter(item => item.trim());
      faqItems.forEach(item => {
        const [question, answer] = item.split('?');
        if (question && answer) {
          formattedContent += `<p><strong>${question.trim()}?</strong> ${answer.trim()}</p>`;
        }
      });
    } else {
      const paragraphs = section
        .split(/\n\n|\. (?=[A-Z])/)
        .filter(p => p.trim())
        .map(p => p.trim().replace(/\n/g, ' '));
      paragraphs.forEach(paragraph => {
        formattedContent += `<p class="section-paragraph">${paragraph}${paragraph.endsWith('.') ? '' : '.'}</p>`;
      });
    }
  });

  return formattedContent;
};

export const PostBlog: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<{
    id: string;
    title: string;
    content: string;
    metaDescription: string;
    categories: string[];
    tags: string[];
    imageUrl: string;
    imageAltText: string;
    imageDescription: string;
    scheduleDate: string | null;
    excerpt: string;
    slug: string;
    focusKeyword: string;
    section: string;
  } | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [isPosting, setIsPosting] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [wordpressUsername, setWordpressUsername] = useState('');
  const [wordpressPassword, setWordpressPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [getBlogById] = useLazyGetBlogByIdQuery();
  const [postBlog] = usePostBlogMutation();
  const [getWordpressAuth] = useLazyGetWordpressAuthQuery();
  const [wordpressAuth] = useWordpressAuthMutation();
  const { isOpen, config, showAlert, closeAlert, handleConfirm, error: showErrorAlert } = useAlert();

  // Check WordPress credentials on component mount
  const checkWordpressAuth = async () => {
    try {
      const response = await getWordpressAuth().unwrap();
      if (response.success && response.data.isAuthenticate) {
        setIsAuthenticated(true);
        setWordpressUsername(response.data.wordpress_username);
        setWordpressPassword(response.data.wordpress_password);
      } else {
        setShowCredentialsModal(true);
        showAlert({
          type: 'confirm',
          title: 'WordPress Credentials Required',
          message: 'Please provide your WordPress username and application password to post the blog.',
        });
      }
    } catch (err) {
      console.error('Error checking WordPress auth:', err);
      setShowCredentialsModal(true);
      showErrorAlert('Failed to verify WordPress credentials. Please provide your credentials.');
    }
  };

  const fetchBlog = async () => {
    const blogId = location.state?.blogId;
    if (!blogId) {
      showErrorAlert('No blog ID provided. Redirecting to blog generation.');
      navigate('/blog');
      return;
    }

    try {
      const response = await getBlogById({ blogId }).unwrap();
      setBlog({
        ...response.data,
        id: response.data._id,
        scheduleDate: null,
      });
    } catch (err) {
      console.error('Error fetching blog:', err);
      showErrorAlert('Failed to fetch blog. Redirecting to blog generation.');
      navigate('/blog');
    }
  };

  useEffect(() => {
    checkWordpressAuth();
    fetchBlog();
  }, []);

  const handleSaveCredentials = async () => {
    if (!wordpressUsername || !wordpressPassword) {
      showErrorAlert('Please provide both WordPress username and application password.');
      return;
    }

    try {
      const response = await wordpressAuth({
        wordpress_username: wordpressUsername,
        wordpress_password: wordpressPassword,
      }).unwrap();
      if (response.success) {
        setIsAuthenticated(true);
        setShowCredentialsModal(false);
        toast.success('WordPress credentials saved successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      } else {
        showErrorAlert('Failed to authenticate WordPress credentials. Please try again.');
      }
    } catch (err) {
      console.error('Error saving WordPress credentials:', err);
      showErrorAlert('Failed to save WordPress credentials. Please try again.');
    }
  };

  const handleUpdateCredentials = () => {
    setShowCredentialsModal(true);
    showAlert({
      type: 'confirm',
      title: 'Update WordPress Credentials',
      message: 'Please provide your new WordPress username and application password.',
    });
  };

  const handlePostToWordPress = async () => {
    if (!blog) {
      showErrorAlert('Blog data transplanted.');
      return;
    }

    if (!isAuthenticated) {
      setShowCredentialsModal(true);
      showErrorAlert('Please provide WordPress credentials before posting.');
      return;
    }

    setIsPosting(true);
    try {
      const postData = {
        title: blog.title,
        content: formatPlainTextContent(blog.content),
        metaDescription: blog.metaDescription,
        focusKeyword: blog.focusKeyword,
        excerpt: blog.excerpt,
        imageDescription: blog.imageDescription,
        categories: blog.categories,
        tags: blog.tags,
        imageUrl: blog.imageUrl,
        slug: blog.slug,
        imageAltText: blog.imageAltText,
        scheduleTime: scheduleDate ? new Date(scheduleDate).toISOString() : '',
        section: blog.section,
        wordpress_username: wordpressUsername,
        wordpress_password: wordpressPassword
      };

      const response = await postBlog(postData).unwrap();
      if (response.success) {
        toast.success('Blog posted successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate('/blog');
        }, 2000);
      } else {
        showErrorAlert('Failed to post blog. Please try again later.');
      }
    } catch (err) {
      console.error('Error posting blog:', err);
      showErrorAlert('Failed to post blog. Please try again later.');
    } finally {
      setIsPosting(false);
    }
  };

  if (!blog) {
    return (
      <motion.div
        className="text-center py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading...
      </motion.div>
    );
  }

  return (
    <div
      className={`min-h-screen ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
        : 'bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-900'
        }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className={`text-3xl sm:text-4xl font-bold bg-clip-text text-transparent ${theme === 'dark'
              ? 'bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400'
              : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
              } mb-4`}
          >
            {blog.title}
          </h1>
          <p
            className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}
          >
            {blog.excerpt}
          </p>
        </motion.div>

        {/* WordPress Credentials Modal */}
        {showCredentialsModal && (
          <motion.div
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`p-6 rounded-xl shadow-lg ${theme === 'dark'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-900'
                } max-w-md w-full`}
            >
              <h2 className="text-2xl font-bold mb-4">WordPress Credentials</h2>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  WordPress Username
                </label>
                <input
                  type="text"
                  value={wordpressUsername}
                  onChange={(e) => setWordpressUsername(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter your WordPress username"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">
                  Application Password
                </label>
                <input
                  type="password"
                  value={wordpressPassword}
                  onChange={(e) => setWordpressPassword(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter your WordPress application password"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCredentialsModal(false);
                    navigate('/blog');
                  }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark'
                    ? 'bg-gray-600 text-white hover:bg-gray-500'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCredentials}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-300 hover:to-pink-300'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400'
                    }`}
                >
                  {isAuthenticated ? 'Update Credentials' : 'Save Credentials'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Preview */}
        <motion.div
          className={`${theme === 'dark'
            ? 'bg-gray-800/70 backdrop-blur-md border-gray-700'
            : 'bg-white/90 backdrop-blur-md border-gray-200'
            } border rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Featured Image */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img
              src={blog.imageUrl}
              alt={blog.imageAltText}
              className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md"
            />
            <p className={`text-sm italic mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {blog.imageDescription}
            </p>
          </motion.div>

          {/* Blog Content */}
          <motion.div
            className={`prose ${theme === 'dark' ? 'prose-invert text-gray-200' : 'prose text-gray-800'} max-w-none mb-8`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{ __html: formatPlainTextContent(blog.content) }}
            />
            <style>{`
              .prose .section-heading {
                font-size: 1.75rem;
                font-weight: 700;
                margin: 2rem 0 1rem;
                color: ${theme === 'dark' ? '#fff' : '#1a202c'};
                line-height: 1.3;
              }
              .prose .faq-heading {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 1.5rem 0 1rem;
                color: ${theme === 'dark' ? '#e2e8f0' : '#2d3748'};
              }
              .prose .section-paragraph {
                font-size: 1.125rem;
                line-height: 1.8;
                margin-bottom: 1rem;
                color: ${theme === 'dark' ? '#d7dfe2' : '#4a5568'};
              }
              .prose strong {
                font-weight: 700;
                color: ${theme === 'dark' ? '#fff' : '#1a202c'};
              }
            `}</style>
          </motion.div>

          {/* Meta Information */}
          <motion.div
            className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Blog Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                <span><strong>Meta Description:</strong> {blog.metaDescription}</span>
              </div>
              <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                <span><strong>Categories:</strong> {blog.categories.join(', ')}</span>
              </div>
              <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                <span><strong>Tags:</strong> {blog.tags.join(', ')}</span>
              </div>
              <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                <span><strong>Focus Keyword:</strong> {blog.focusKeyword}</span>
              </div>
            </div>
          </motion.div>

          {/* Update Credentials Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={handleUpdateCredentials}
              className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${theme === 'dark'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-300 hover:to-orange-300'
                : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-400 hover:to-teal-400'
                }`}
            >
              Update WordPress Credentials
            </button>
          </motion.div>

          {/* Scheduling Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label htmlFor="schedule-date" className="flex items-center mb-3">
              <Calendar className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Schedule Post (Optional)
              </span>
            </label>
            <input
              id="schedule-date"
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className={`w-full p-4 rounded-xl border focus:outline-none transition-all duration-300 ${theme === 'dark'
                ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400 focus:border-green-400'
                : 'bg-gray-100/50 text-gray-900 border-gray-300 placeholder-gray-500 focus:border-green-500'
                }`}
            />
          </motion.div>

          {/* Post Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <button
              onClick={handlePostToWordPress}
              disabled={isPosting || !isAuthenticated}
              className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 disabled:cursor-not-allowed gap-2 ${theme === 'dark'
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-300 hover:to-pink-300 disabled:opacity-50'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50'
                }`}
            >
              <Calendar className="w-6 h-6" />
              {isPosting ? (scheduleDate ? 'Scheduling...' : 'Posting...') : (scheduleDate ? 'Schedule Blog' : 'Post Blog Now')}
            </button>
          </motion.div>
        </motion.div>

        <Alert
          type={config.type}
          title={config.title}
          message={config.message}
          isOpen={isOpen}
          onClose={closeAlert}
          onConfirm={config.type === 'confirm' ? () => {
            handleSaveCredentials();
            handleConfirm();
          } : undefined}
        />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default PostBlog;