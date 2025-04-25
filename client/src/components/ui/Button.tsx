import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Adjust path as needed

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const { theme } = useTheme();

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 focus:ring-blue-500',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 focus:ring-purple-500',
    ghost: 'bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white',
  };

  const sizeClasses = {
    sm: 'text-sm px-4 py-2 space-x-1',
    md: 'text-base px-6 py-3 space-x-2',
    lg: 'text-lg px-8 py-4 space-x-3',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-gray-100'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;