import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setContentType } from '../../store/appSlice';

interface ContentTypeSelectorProps {
  // No props needed since we're using Redux
}

export const Home: React.FC<ContentTypeSelectorProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleProceed = () => {
    navigate('/content-type'); // Navigate to content type selection page
  };

  const handleSelect = (type: 'post' | 'blog') => {
    dispatch(setContentType(type));
    navigate(type === 'post' ? '/topic' : '/blog'); // Proceed to content creation
  };

  // Sample product image URLs from Cloudinary
  const productImages = [
    'https://res.cloudinary.com/deuvfylc5/image/upload/v1745302238/fgtcjvyus4uzidwgrz0k.png',
    'https://res.cloudinary.com/deuvfylc5/image/upload/v1744892993/vtxpt1dfv49kmpftk8jo.png',
    'https://res.cloudinary.com/deuvfylc5/image/upload/v1744892459/u1e65kb3934ctxdyvpqy.png',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
            Welcome to Our AI Content Hub
          </h1>
          <p className="text-lg text-gray-300">
            Discover our AI-crafted product samples below. Click "Proceed" to unleash your creativity!
          </p>
        </header>

        {/* Product Sample Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {productImages.map((imageUrl, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={imageUrl}
                alt={`Sample Product ${index + 1}`}
                className="w-full h-72 object-cover transition-opacity duration-300 hover:opacity-90"
                onError={(e) => { e.currentTarget.src = '/fallback-image.png'; }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">Sample Product {index + 1}</h3>
                <p className="text-gray-400">Premium AI-generated design for your projects.</p>
              </div>
            </div>
          ))}
        </div>

        {/* Proceed Section */}
        <div className="text-center">
          <button
            onClick={handleProceed}
            className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold rounded-full shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Proceed to content type selection"
          >
            Proceed to Create
          </button>
        </div>
      </div>
    </div>
  );
};