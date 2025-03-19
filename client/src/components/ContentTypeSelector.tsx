import React from 'react';
import { Image, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContentTypeSelectorProps {
  onSelect: (type: 'post' | 'reel') => void;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ onSelect }) => {
  const navigate = useNavigate();

  const handleSelect = (type: 'post' | 'reel') => {
    onSelect(type);
    navigate('/topic');
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-2xl font-semibold text-white">What type of content do you want to create?</h2>
      
      <div className="flex space-x-8">
        <button
          onClick={() => handleSelect('post')}
          className="flex flex-col items-center p-8 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border-2 border-yellow-500 group"
        >
          <Image className="w-16 h-16 text-yellow-500 group-hover:text-yellow-400" />
          <span className="mt-4 text-xl font-medium text-white">Post</span>
          <p className="mt-2 text-gray-400 text-center">
            Create a static post with<br />image and caption
          </p>
        </button>

        <button
          onClick={() => handleSelect('reel')}
          className="flex flex-col items-center p-8 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border-2 border-yellow-500 group"
        >
          <Film className="w-16 h-16 text-yellow-500 group-hover:text-yellow-400" />
          <span className="mt-4 text-xl font-medium text-white">Reel</span>
          <p className="mt-2 text-gray-400 text-center">
            Create a short-form<br />video content
          </p>
        </button>
      </div>
    </div>
  );
}