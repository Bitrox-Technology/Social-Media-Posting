import React from 'react';
import { Bot, Image, BarChart3, Calendar, MessageCircle, Share2, Zap, Target } from 'lucide-react';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-fit mb-4 text-primary-600 dark:text-primary-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'AI Content Generation',
      description: 'Create engaging posts, captions, and hashtags with our advanced AI assistant.',
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: 'Image Generation',
      description: 'Generate stunning visuals to accompany your posts with our AI image generator.',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Performance Analytics',
      description: 'Track engagement, reach, and growth with comprehensive analytics dashboards.',
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Content Calendar',
      description: 'Plan and schedule your content across multiple platforms from one interface.',
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Auto Responses',
      description: 'Set up intelligent auto-responses for comments and messages.',
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: 'Multi-Platform Support',
      description: 'Manage all your social media accounts from a single dashboard.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Quick Templates',
      description: 'Access pre-made templates for various content types and industries.',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Audience Targeting',
      description: 'Optimize content for your specific audience demographics and interests.',
    },
  ];

  return (
    <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features to <span className="text-primary-600 dark:text-primary-400">Supercharge</span> Your Social Media
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Our comprehensive suite of tools helps you create, manage, and optimize your social media presence with minimal effort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;