import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination as SwiperPagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import {
  Grid,
  List,
  Search,
  Filter,
  Calendar,
  Share2,
  Edit,
  Trash2,
  MoreVertical,
  ChevronDown,
  Tag,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLazyGetUserAllPostsQuery } from '../../store/api';
import { useTheme } from '../../context/ThemeContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'react-datepicker/dist/react-datepicker.css';

interface Image {
  url: string;
  label: string;
  _id: string;
}

interface Post {
  _id: string;
  images: Image[];
  topic: string;
  contentType: string;
  status: string;
  postContentId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export const UserAllPosts: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;
  const [getUserAllPosts, { data: rawPosts, isLoading, isError, error }] = useLazyGetUserAllPostsQuery();

  // Theme-based styles
  const themeStyles = {
    light: {
      background: 'bg-gradient-to-br from-gray-100 to-gray-200',
      cardBackground: 'bg-white/80',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-300',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-300',
      filterBg: 'bg-gray-100',
      filterText: 'text-gray-700',
      statusBg: 'bg-gray-200',
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800',
      cardBackground: 'bg-gray-800/50',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      border: 'border-gray-700/50',
      buttonBg: 'bg-blue-500',
      buttonHover: 'hover:bg-blue-600',
      inputBg: 'bg-gray-800',
      inputBorder: 'border-gray-700',
      filterBg: 'bg-gray-800',
      filterText: 'text-gray-400',
    },
  };

  const currentTheme = themeStyles[theme as keyof typeof themeStyles] || themeStyles.dark;

  const posts = Array.isArray(rawPosts?.data)
    ? rawPosts.data
        .map((post) => ({
          ...post,
          type:
            post.contentType === 'DYKContent'
              ? 'doyouknow'
              : post.contentType === 'CarouselContent'
              ? 'carousel'
              : post.contentType === 'FestivalContent'
              ? 'festival'
              : post.contentType === 'ProductContent'
              ? 'product'
              : 'image',
        }))
        .reverse() // Reverse the order of posts
    : [];

  const filteredPosts = posts.filter((post) => {
    if (searchQuery) {
      return post.topic.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (selectedFilter !== 'all') {
      return post.type === selectedFilter;
    }
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    getUserAllPosts();
  }, [getUserAllPosts]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters or search change
  }, [searchQuery, selectedFilter]);

  const renderImage = (image: Image) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full aspect-square rounded-xl overflow-hidden shadow-lg ${currentTheme.cardBackground}`}
    >
      <img
        src={image.url}
        alt={image.label}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className={`${currentTheme.textPrimary} text-sm font-medium text-center`}>{image.label}</p>
      </div>
    </motion.div>
  );

  const renderPost = (post: Post) => {
    if (!post.images || !post.images.length) {
      return <div className={`text-center ${currentTheme.textSecondary}`}>No images available</div>;
    }

    if (post.type === 'carousel') {
      return (
        <div className="w-full">
          <Swiper
            modules={[Navigation, SwiperPagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            className="rounded-xl overflow-hidden"
          >
            {post.images.map((image) => (
              <SwiperSlide key={image._id}>{renderImage(image)}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      );
    }

    return renderImage(post.images[0]);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`min-h-screen ${currentTheme.background} p-6`}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className={`text-3xl font-bold text-red-400 mb-4`}>Error Loading Posts</h1>
          <p className={currentTheme.textSecondary}>{JSON.stringify(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} p-4 sm:p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1
            className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400`}
          >
            Content Library
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 ${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-lg border ${currentTheme.inputBorder} focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64`}
              />
              <Search className={`absolute left-3 top-2.5 w-5 h-5 ${currentTheme.textSecondary}`} />
            </div>

            {/* View Toggle */}
            <div className={`flex items-center ${currentTheme.inputBg} rounded-lg p-1`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? `${currentTheme.buttonBg} ${currentTheme.textPrimary}` : currentTheme.textSecondary}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? `${currentTheme.buttonBg} ${currentTheme.textPrimary}` : currentTheme.textSecondary}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                className={`flex items-center gap-2 px-4 py-2 ${currentTheme.inputBg} ${currentTheme.textPrimary} rounded-lg border ${currentTheme.inputBorder}`}
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Type Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'image', 'carousel', 'doyouknow', 'festival', 'product'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === filter
                  ? `${currentTheme.buttonBg} ${currentTheme.textPrimary}`
                  : `${currentTheme.filterBg} ${currentTheme.filterText} hover:bg-gray-700`
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts Grid/List */}
        <div
          className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          }`}
        >
          {currentPosts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${currentTheme.cardBackground} backdrop-blur-sm rounded-xl overflow-hidden ${currentTheme.border} hover:border-gray-600/50 transition-all`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      post.type === 'carousel'
                        ? 'bg-purple-500/20 text-purple-400'
                        : post.type === 'doyouknow'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : post.type === 'festival'
                        ? 'bg-pink-500/20 text-pink-400'
                        : post.type === 'product'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {post.type.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className={`w-4 h-4 ${currentTheme.textSecondary}`} />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Share2 className={`w-4 h-4 ${currentTheme.textSecondary}`} />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className={`w-4 h-4 ${currentTheme.textSecondary}`} />
                    </button>
                  </div>
                </div>

                <h2 className={`text-xl font-semibold ${currentTheme.textPrimary} mb-2`}>{post.topic}</h2>

                <div className={`flex items-center gap-2 text-sm ${currentTheme.textSecondary} mb-4`}>
                  <Clock className="w-4 h-4" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {renderPost(post)}

                <div className="mt-6 flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {post.status}
                  </span>

                  <button
                    onClick={() => navigate(`/user-post/${post._id}`)}
                    className={`flex items-center gap-2 px-4 py-2 ${currentTheme.buttonBg} ${currentTheme.textPrimary} rounded-lg ${currentTheme.buttonHover} transition-colors`}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className={`text-center ${currentTheme.textSecondary} mt-12`}>
            <p className="text-xl">No posts found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredPosts.length > 0 && (
          <div className="flex items-center justify-center mt-8 gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-600 cursor-not-allowed'
                  : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page
                      ? `${currentTheme.buttonBg} ${currentTheme.textPrimary}`
                      : `${currentTheme.filterBg} ${currentTheme.filterText} hover:bg-gray-700`
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-600 cursor-not-allowed'
                  : `${currentTheme.buttonBg} ${currentTheme.buttonHover}`
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};