import React from 'react';
import { Image, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setContentType } from '../../store/appSlice';

interface ContentTypeSelectorProps {
  // No props needed since we're using Redux
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSelect = (type: 'post' | 'reel') => {
    dispatch(setContentType(type));
    navigate('/topic');
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-2xl font-semibold text-white">What type of content do you want to create?</h2>

      <div className="flex space-x-8">
        <button
          onClick={() => handleSelect('post')}
          className="flex flex-col items-center p-8 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border-2 border-yellow-500 group focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Create a static post with image and caption"
        >
          <Image className="w-16 h-16 text-yellow-500 group-hover:text-yellow-400" />
          <span className="mt-4 text-xl font-medium text-white">Post</span>
          <p className="mt-2 text-gray-400 text-center">
            Create a static post with<br />image and caption
          </p>
        </button>

        <button
          onClick={() => handleSelect('reel')}
          className="flex flex-col items-center p-8 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border-2 border-yellow-500 group focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Create a short-form video content"
          disabled={true}
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          <Film className="w-16 h-16 text-yellow-500 group-hover:text-yellow-400" />
          <span className="mt-4 text-xl font-medium text-white">Reel</span>
          <p className="mt-2 text-gray-400 text-center">
            Create a short-form<br />video content <br/> Coming Soon
          </p>
        </button>
      </div>
    </div>
  );
};