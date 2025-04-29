import React from 'react';
import { Loader2, XCircle } from 'lucide-react';

interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
  theme: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ isLoading, error, theme }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Loader2
            className={`w-10 h-10 md:w-12 md:h-12 animate-spin mx-auto ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}
          />
          <p
            className={`text-base md:text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Loading your content...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-xl p-4 md:p-6 text-center ${
          theme === 'dark'
            ? 'bg-red-500/10 backdrop-blur-lg'
            : 'bg-red-100 border border-red-200'
        }`}
      >
        <XCircle
          className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 ${
            theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`}
        />
        <p
          className={`text-base md:text-lg ${
            theme === 'dark' ? 'text-red-400' : 'text-red-600'
          }`}
        >
          {error}
        </p>
      </div>
    );
  }

  return null;
};