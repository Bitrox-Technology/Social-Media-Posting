import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/appSlice';
import { Menu, X, Bot, User, LogOut } from 'lucide-react';
import ThemeToggle from '../features/ThemeToggle';

const Header: React.FC<{ toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void }> = ({ toggleDrawer }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const user = useAppSelector((state) => state.app.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate('/signin');
  };

  const handleViewDetails = () => {
    navigate('/user-details');
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-effect bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {user && (
              <button
                className="mr-4 p-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                onClick={toggleDrawer(true)}
                aria-label="Open dashboard"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2 group">
              <Bot className="h-8 w-8 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl text-white">
                Bitrox <span className="text-gradient">SocialAI</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-sm font-medium text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Pricing
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Dashboard
              </Link>
            )}
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link
                    to="/signin"
                    className="text-sm font-medium text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-lg hover:shadow-primary-500/25 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    aria-label="User menu"
                  >
                    <User className="h-6 w-6" />
                    <span className="text-sm font-medium">{user.email ? user.email.split('@')[0] : 'User'}</span>
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 animate-fadeIn">
                      <button
                        onClick={handleViewDetails}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="ml-2 p-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 glass-effect bg-gray-900/80 backdrop-blur-md animate-fadeIn">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-gray-700 transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-gray-700 transition-colors"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-gray-700 transition-colors"
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-gray-700 transition-colors"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-4 border-t border-gray-700">
              {!user ? (
                <>
                  <Link
                    to="/signin"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-gray-700 transition-colors"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 mt-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg text-center transition-colors"
                    onClick={toggleMenu}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleViewDetails}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;