import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Adjust path as needed

interface ContentCardProps {
  imageUrl: string;
  title: string;
  description: string;
  index: number;
}

const ContentCard: React.FC<ContentCardProps> = ({ imageUrl, title, description, index }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800/70 to-gray-900/90 border border-gray-700/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/5'
          : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-blue-300/20'
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100'
            : 'bg-gradient-to-br from-blue-200/10 to-purple-200/10 opacity-0 group-hover:opacity-100'
        }`}
      />

      <div className="p-6">
        <div className="relative overflow-hidden rounded-xl mb-6">
          <div
            className={`absolute inset-0 transition-opacity duration-500 z-10 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100'
                : 'bg-gradient-to-br from-blue-300/20 to-purple-300/20 opacity-0 group-hover:opacity-100'
            }`}
          />

          <img
            src={imageUrl}
            alt={title}
            className="w-full h-64 object-cover transform transition-all duration-700 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
          />

          <div
            className={`absolute inset-0 ${
              theme === 'dark'
                ? 'bg-gradient-to-t from-gray-900/70 to-transparent'
                : 'bg-gradient-to-t from-gray-100/50 to-transparent'
            }`}
          />
        </div>

        <h3
          className={`text-xl font-semibold mb-3 transition-all duration-500 bg-clip-text text-transparent ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:from-blue-300 group-hover:to-indigo-300'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500'
          }`}
        >
          {title}
        </h3>

        <p
          className={`leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {description}
        </p>
      </div>

      <div
        className={`absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
            : 'bg-gradient-to-r from-blue-400 to-indigo-400'
        }`}
      />
    </div>
  );
};

export default ContentCard;