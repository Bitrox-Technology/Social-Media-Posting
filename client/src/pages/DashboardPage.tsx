import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setContentType } from '../store/appSlice';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const DashboardPage: React.FC = () => {
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
      title: 'Social Media Content',
      description: 'AI-optimized posts for maximum engagement'
    },
    {
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1744892993/vtxpt1dfv49kmpftk8jo.png',
      title: 'Blog Content',
      description: 'SEO-friendly articles and blog posts'
    },
    {
      imageUrl: 'https://res.cloudinary.com/deuvfylc5/image/upload/v1744892459/u1e65kb3934ctxdyvpqy.png',
      title: 'Visual Content',
      description: 'Eye-catching designs and graphics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-600">
              AI-Powered Content Hub
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your ideas into engaging content with our AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sampleContent.map((content, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <img
                    src={content.imageUrl}
                    alt={content.title}
                    className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                </div>
                <h3 className="text-xl font-semibold text-primary-400 mb-2">{content.title}</h3>
                <p className="text-gray-300">{content.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-8">
          <Button
            onClick={handleProceed}
            className="px-8 py-6 text-lg bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 rounded-full shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
          >
            Start Creating Content
          </Button>
          <p className="text-gray-400 text-sm">
            Click to begin your creative journey with AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;