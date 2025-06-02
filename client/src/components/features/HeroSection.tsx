// src/components/HeroSection.tsx
import React, { useEffect } from 'react';
import { ArrowRight, Bot, TrendingUp, Zap, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ContentCard from '../ui/ContentCard';
import { clearUser, setUser, clearCsrfToken } from '../../store/appSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useCheckAuthStatusQuery } from '../../store/api';
import Cookies from 'js-cookie';

const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.app.user);
  const dispatch = useAppDispatch();

  // Check auth status if cookies are present
  const { data: authData, error: authError } = useCheckAuthStatusQuery(undefined, {
    skip: !Cookies.get('accessToken') && !Cookies.get('refreshToken'),
  });

  useEffect(() => {
    // Handle auth data
    if (authData?.success && authData.data.isAuthenticated) {
      dispatch(
        setUser({
          email: authData.data.user.email,
          expiresAt: authData.data.user.expiresAt,
          role: authData.data.user.role,
          authenticate: true,
        })
      );
    } else if (authError) {
      // Clear state and cookies on auth failure
      dispatch(clearUser());
      dispatch(clearCsrfToken());
      
    }

    // Handle cross-tab logout
    const authChannel = new BroadcastChannel('auth_channel');
    authChannel.onmessage = (event) => {
      if (event.data.type === 'LOGOUT') {
        dispatch(clearUser());
        dispatch(clearCsrfToken());
       
      }
    };

    return () => authChannel.close();
  }, [authData, authError, dispatch]);

  const handleGetStarted = () => {
    navigate(user?.authenticate ? '/dashboard' : '/signup');
  };

  const sampleContent = [
    {
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1745302238/fgtcjvyus4uzidwgrz0k.png',
      title: 'Social Media Post',
      description: 'AI-optimized posts for maximum engagement across all popular platforms. Perfect for businesses looking to increase their social presence.',
    },
    {
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1744892993/vtxpt1dfv49kmpftk8jo.png',
      title: 'Blog Post',
      description: 'SEO-friendly articles and blog posts that rank higher in search results and keep your audience engaged with valuable information.',
    },
    {
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1744892459/u1e65kb3934ctxdyvpqy.png',
      title: 'Visual Post',
      description: 'Eye-catching designs and graphics that complement your written content and make your brand stand out from the competition.',
    },
  ];

  return (
    <div className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-8">
            <h1 className={`text-5xl md:text-6xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Transform Your <span className="text-blue-500">Social Media</span> with AI-Powered Content
            </h1>
            <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Effortlessly create engaging, personalized content for all your social platforms with our AI assistant. Save time, increase engagement, and grow your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-lg font-medium"
                aria-label="Get Started"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link
                to="/features"
                className={`px-8 py-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-lg hover:shadow-xl transition-all text-lg font-medium`}
                aria-label="Learn More"
              >
                Learn More
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                <span>Boost Engagement</span>
              </div>
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Zap className="h-5 w-5 text-blue-500 mr-2" />
                <span>Save Time</span>
              </div>
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Bot className="h-5 w-5 text-blue-500 mr-2" />
                <span>AI-Powered</span>
              </div>
              <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Shield className="h-5 w-5 text-blue-500 mr-2" />
                <span>Secure Platform</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-6 ${theme === 'dark' ? 'opacity-20' : 'opacity-10'}`} />
            <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 rounded-3xl shadow-xl`}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Bot className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        AI Content Assistant
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Powered by advanced AI
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`space-y-4 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-xl`}>
                  <div className="h-2 w-3/4 bg-blue-500/20 rounded-full" />
                  <div className="h-2 w-full bg-blue-500/20 rounded-full" />
                  <div className="h-2 w-5/6 bg-blue-500/20 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Posts Created</h4>
                    <p className="text-2xl font-bold text-blue-500">1,234</p>
                  </div>
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Time Saved</h4>
                    <p className="text-2xl font-bold text-blue-500">127h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </div>
    </div>
  );
};

export default HeroSection;