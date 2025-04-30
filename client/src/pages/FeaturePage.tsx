import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Target, 
  Calendar, 
  Sparkles, 
  PenTool, 
  Share2, 
  BarChart, 
  MessageSquare,
  CheckCircle 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Import the ThemeContext

export const Features = () => {
  const { theme } = useTheme(); // Access the current theme

  const features = [
    {
      icon: <Zap className={`w-6 h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />,
      title: "AI-Powered Content Generation",
      description: "Create engaging posts in seconds with our advanced AI algorithms tailored to your brand's voice."
    },
    {
      icon: <Target className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />,
      title: "Smart Audience Targeting",
      description: "Reach the right audience with AI-driven insights and content optimization strategies."
    },
    {
      icon: <Calendar className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />,
      title: "Automated Scheduling",
      description: "Schedule posts across multiple platforms at optimal times for maximum engagement."
    },
    {
      icon: <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />,
      title: "Custom Templates",
      description: "Choose from a variety of professionally designed templates or create your own unique style."
    },
    {
      icon: <PenTool className={`w-6 h-6 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />,
      title: "Easy Customization",
      description: "Edit and customize your content with our intuitive drag-and-drop interface."
    },
    {
      icon: <Share2 className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />,
      title: "Multi-Platform Support",
      description: "Seamlessly publish to all major social media platforms from a single dashboard."
    },
    {
      icon: <BarChart className={`w-6 h-6 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />,
      title: "Analytics & Insights",
      description: "Track performance metrics and get actionable insights to improve your content strategy."
    },
    {
      icon: <MessageSquare className={`w-6 h-6 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`} />,
      title: "AI Caption Generator",
      description: "Generate engaging captions and hashtags that resonate with your audience."
    }
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
          : 'bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-20">
          <motion.h1 
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400'
                : 'bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600'
            } mb-6`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Transform Your Social Media
          </motion.h1>
          <motion.p 
            className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Elevate your social media presence with AI-powered content creation and management tools
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`${
                theme === 'dark'
                  ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/70'
                  : 'bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50/90'
              } border rounded-xl p-6 transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div
                className={`rounded-lg p-3 w-fit mb-4 ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-100/50'
                }`}
              >
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2
            className={`text-3xl font-bold mb-8 bg-clip-text text-transparent ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}
          >
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              "AI-powered content generation",
              "Intuitive user interface",
              "24/7 customer support",
              "Regular feature updates",
              "Custom branding options",
              "Advanced analytics"
            ].map((benefit, index) => (
              <div 
                key={benefit}
                className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <CheckCircle
                  className={`w-5 h-5 flex-shrink-0 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}
                />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};