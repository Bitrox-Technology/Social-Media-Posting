import React, { useState, useEffect } from 'react';
import { useLazyGetAllBlogsQuery } from '../../store/api';
import { motion } from 'framer-motion';
import { BookOpen, Tag, Folder, CheckCircle, PlusCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAlert } from '../hooks/useAlert';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../ui/Alert';

interface Blog {
    _id: string;
    title: string;
    metaDescription: string;
    categories: string[];
    tags: string[];
    slug: string;
    excerpt: string;
    focusKeyword: string;
    imageUrl: string;
    imageAltText: string;
    imageDescription: string;
    createdAt: string;
}

export const BlogList: React.FC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { isOpen, config, showAlert, closeAlert, handleConfirm, error: showErrorAlert } = useAlert();

    // Local state for blogs and loading/error
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Lazy query hook
    const [getAllBlogs, { isFetching }] = useLazyGetAllBlogsQuery();

    // Handle blog click to navigate to /post-blog
    const handleBlogClick = (blogId: string) => {
        navigate('/post-blog', { state: { blogId } });
    };

    // Handle navigation to create blog
    const handleCreateBlog = () => {
        navigate('/blog');
    };
    const fetchBlogs = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await getAllBlogs().unwrap();
            console.log('Fetched blogs:', response);
            if (response.success) {
                setBlogs(response.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setIsError(true);
            showErrorAlert('Failed to load blogs. Please try again later.');
            setBlogs([]);
        } finally {
            setIsLoading(false);
        }
    };
    // Fetch blogs on mount
    useEffect(() => {
        fetchBlogs();
    }, []);

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
                        Your Blog Collection
                    </motion.h1>
                    <motion.p
                        className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Explore all your AI-generated, SEO-optimized blog posts
                    </motion.p>
                </div>

                {/* Loading State */}
                {(isLoading || isFetching) && (
                    <div className="text-center">
                        <motion.div
                            className="inline-block w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <p className={`mt-4 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading blogs...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {isError && !isLoading && !isFetching && (
                    <div className="text-center">
                        <p className={`text-lg ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                            Unable to load blogs. Please try again later.
                        </p>
                    </div>
                )}

                {/* Blog List */}
                {!isLoading && !isFetching && !isError && blogs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                className={`cursor-pointer ${theme === 'dark'
                                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/70'
                                    : 'bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50/90'
                                    } border rounded-xl p-6 transition-all duration-300`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleBlogClick(blog._id)}
                            >
                                {/* Blog Image */}
                                {blog.imageUrl && (
                                    <img
                                        src={blog.imageUrl}
                                        alt={blog.imageAltText}
                                        className="w-full h-48 rounded-lg object-cover mb-4"
                                    />
                                )}

                                {/* Blog Title */}
                                <h2
                                    className={`text-xl font-bold mb-3 leading-tight ${theme === 'dark'
                                        ? 'text-yellow-400'
                                        : 'text-blue-600'
                                        }`}
                                >
                                    {blog.title}
                                </h2>

                                {/* Meta Description */}
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-3`}>
                                    {blog.metaDescription}
                                </p>

                                {/* Blog Details */}
                                <div className="space-y-2">
                                    <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <Folder className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                                        <span className="text-sm">
                                            <strong>Categories:</strong> {blog.categories.join(', ')}
                                        </span>
                                    </div>
                                    <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <Tag className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                                        <span className="text-sm">
                                            <strong>Tags:</strong> {blog.tags.join(', ')}
                                        </span>
                                    </div>
                                    <div className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <CheckCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                                        <span className="text-sm">
                                            <strong>Published:</strong> {new Date(blog.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isFetching && !isError && (!blogs || blogs.length === 0) && (
                    <div className="text-center">
                        <BookOpen className={`w-16 h-16 mx-auto ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-4`} />
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                            No blogs found. Create your first blog to get started!
                        </p>
                        <motion.button
                            onClick={handleCreateBlog}
                            className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 gap-2 ${theme === 'dark'
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <PlusCircle className="w-6 h-6" />
                            Create Blog
                        </motion.button>
                    </div>
                )}

                <Alert
                    type={config.type || 'error'}
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

export default BlogList;