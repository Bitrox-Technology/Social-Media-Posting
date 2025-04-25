import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setContentType } from '../store/appSlice';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

import Button from '../components/ui/Button';
import ContentCard from '../components/ui/ContentCard';

const DashboardPage: React.FC = () => {
  const { theme } = useTheme(); // Access the theme
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleProceed = () => {
    navigate('/content-type');
  };

  const handleSelect = (type: 'post' | 'blog') => {
    dispatch(setContentType(type));
    navigate(type === 'post' ? '/topic' : '/blog');
  };

  const sampleContent = [
    {
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1745302238/fgtcjvyus4uzidwgrz0k.png',
      title: 'Social Media Post',
      description: 'AI-optimized posts for maximum engagement across all popular platforms. Perfect for businesses looking to increase their social presence.'
    },
    {
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1744892993/vtxpt1dfv49kmpftk8jo.png',
      title: 'Blog Post',
      description: 'SEO-friendly articles and blog posts that rank higher in search results and keep your audience engaged with valuable information.'
    },
    {
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1744892459/u1e65kb3934ctxdyvpqy.png',
      title: 'Visual Post',
      description: 'Eye-catching designs and graphics that complement your written content and make your brand stand out from the competition.'
    }
  ];

  return (
    <div
      className={`min-h-screen animate-gradient-x ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob ${
            theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'
          }`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 ${
            theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/3 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000 ${
            theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
          }`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-6 mb-16 animate-fadeIn">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span
                className={`bg-clip-text text-transparent ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700'
                }`}
              >
                AI-Powered Post Hub
              </span>
            </h1>
            <div
              className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/4 h-1 rounded-full ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}
            />
          </div>

          <p
            className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Transform your ideas into engaging content with our powerful AI technology
          </p>

          <div
            className={`flex flex-wrap justify-center gap-4 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              Fast Generation
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
              SEO Optimized
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
              Engagement Focused
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {sampleContent.map((content, index) => (
            <ContentCard
              key={index}
              index={index}
              imageUrl={content.imageUrl}
              title={content.title}
              description={content.description}
            />
          ))}
        </div>

        <div className="text-center space-y-8">
          <Button
            onClick={handleProceed}
            variant="primary"
            size="lg"
            className="group"
          >
            <span>Start Creating Posts</span>
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Click to begin your creative journey with AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;