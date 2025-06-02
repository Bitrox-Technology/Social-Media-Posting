import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setContentType } from '../../store/appSlice';
import { 
  Image, 
  PenSquare, 
  Sparkles, 
  Tag, 
  BookOpen, 
  Heart, 
  Building, 
  Calendar, 
  Star, 
  Gift 
} from 'lucide-react';
import cn from 'classnames';

export const ContentTypeSelector: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const typeMap: Record<string, "carousel" | "doyouknow" | "topic" | "blog" | "promotional" | "informative" | "engagement" | "brand" | "event" | "testimonial" | "festivals"> = {
    "Social Media 1 Week Post": "topic",
    "Blog Article": "blog",
    "Promotional/Sales Post": "promotional",
    "Informative/Educational Post": "informative",
    "News Post": "engagement",
    "Product Post": "brand",
    "Event-Related Post": "event",
    "Holidays/Festival Greetings Post": "festivals",
  };

  const handleSelect = (type: string) => {
    const mappedType = typeMap[type];
    if (mappedType) {
      dispatch(setContentType(mappedType));
      navigate(`/${mappedType}`);
    }
  };

  const postCategories = [
    {
      type: 'Social Media 1 Week Post',
      icon: Image,
      description: 'Create engaging social media content with eye-catching visuals and captions',
      gradient: 'from-blue-500 to-purple-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      type: 'Blog Article',
      icon: PenSquare,
      description: 'Write comprehensive blog posts that engage and inform your audience',
      gradient: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      type: 'Promotional/Sales Post',
      icon: Tag,
      description: 'Drive sales with compelling promotional content and offers',
      gradient: 'from-blue-500 to-purple-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      type: 'Informative/Educational Post',
      icon: BookOpen,
      description: 'Educate your audience with insightful and informative content',
      gradient: 'from-green-500 to-teal-600',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      type: 'News Post',
      icon: Heart,
      description: 'Boost engagement with interactive and fun content',
      gradient: 'from-pink-500 to-red-600',
      iconBg: 'bg-pink-100 dark:bg-pink-900/30',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
    {
      type: 'Product Post',
      icon: Building,
      description: 'Strengthen your brand identity with storytelling content',
      gradient: 'from-purple-500 to-indigo-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      type: 'Event-Related Post',
      icon: Calendar,
      description: 'Promote your events with eye-catching announcements',
      gradient: 'from-orange-500 to-yellow-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      type: 'Holidays/Festival Greetings Post',
      icon: Gift,
      description: 'Spread joy with festive greetings and holiday messages',
      gradient: 'from-red-500 to-green-600',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col items-center space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 mb-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium text-blue-500 dark:text-blue-400">
                AI-Powered Creation
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Choose Your Content Type
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select the type of content you want to create and let our AI help you craft the perfect message
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
            {postCategories.map((category) => (
              <button
                key={category.type}
                onClick={() => handleSelect(category.type)}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 focus:outline-none"
              >
                <div
                  className={cn(
                    'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                    `bg-gradient-to-br ${category.gradient}`
                  )}
                />
                <div className="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl group-hover:border-transparent transition-all duration-300">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={cn('p-3 rounded-full', category.iconBg)}>
                      <category.icon className={cn('w-8 h-8', category.iconColor)} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {category.type}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                    <div
                      className={cn(
                        'w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300',
                        `bg-gradient-to-r ${category.gradient}`
                      )}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};