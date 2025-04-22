import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setContentType } from '../../store/appSlice';
import { Image, PenSquare } from 'lucide-react';

export const ContentTypeSelector: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSelect = (type: 'post' | 'blog') => {
    dispatch(setContentType(type));
    navigate(type === 'post' ? '/topic' : '/blog');
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <h2 className="text-2xl font-semibold text-white">Select Content Type</h2>
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
          onClick={() => handleSelect('blog')}
          className="flex flex-col items-center p-8 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border-2 border-yellow-500 group focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Write a blog post"
          style={{ width: '250px' }}
        >
          <PenSquare className="w-16 h-16 text-yellow-500 group-hover:text-yellow-400" />
          <span className="mt-4 text-xl font-medium text-white">Blog</span>
          <p className="mt-2 text-gray-400 text-center">
            Write a blog post<br />for your audience
          </p>
        </button>
      </div>
    </div>
  );
};