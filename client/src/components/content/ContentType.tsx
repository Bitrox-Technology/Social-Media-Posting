import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setContentType } from '../../store/appSlice';
import { Image, PenSquare, Sparkles } from 'lucide-react';


export const ContentTypeSelector: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSelect = (type: 'post' | 'blog') => {
    dispatch(setContentType(type));
    navigate(type === 'post' ? '/topic' : '/blog');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 `}>
      
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 mb-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium text-blue-500 dark:text-blue-400">AI-Powered Creation</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Choose Your Content Type
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select the type of content you want to create and let our AI help you craft the perfect message
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <button
              onClick={() => handleSelect('post')}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group-hover:border-transparent transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Image className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Social Media Post
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    Create engaging social media content with eye-catching visuals and captions
                  </p>
                  
                  <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelect('blog')}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group-hover:border-transparent transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <PenSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Blog Article
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    Write comprehensive blog posts that engage and inform your audience
                  </p>
                  
                  <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};