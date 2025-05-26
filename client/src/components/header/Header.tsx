import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, setUser } from '../../store/appSlice';
import { Menu, X, Bot, User } from 'lucide-react';
import ThemeToggle from '../features/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';


const Header: React.FC<{ toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void }> = ({ toggleDrawer }) => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAppSelector((state) => state.app.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  console.log("User", user)
  // Ensure user state is restored from localStorage on mount
  // useEffect(() => {
  //   if (user) {
  //     console.log('Header: Checking expiresAt=', user.expiresAt, 'vs Date.now()=', Date.now());
  //     if (user.authenticate ) {
  //       console.log('Header: Session expired, redirecting to /signin');
  //       dispatch(logout()); // Clear user state
  //       navigate('/signin', { replace: true });
  //     } else {
  //       console.log('Header: Session valid, redirecting to /dashboard');
  //       navigate('/dashboard', { replace: true });
  //     }
  //   } else {
  //     console.log('Header: No user, redirecting to /signin');
  //     navigate('/signin', { replace: true });
  //   }
  // }, [user, dispatch, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md shadow-lg ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'
        } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            {user && (
              <button
                className={`mr-4 p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={toggleDrawer(true)}
                aria-label="Open dashboard"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2 group">
              <Bot
                className={`h-8 w-8 transition-transform group-hover:scale-110 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}
              />
              <span
                className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
              >

                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark'
                    ? 'from-blue-400 to-purple-400'
                    : 'from-blue-600 to-purple-600'
                    }`}
                >
                  ASocialI
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${theme === 'dark'
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              Home
            </Link>
            <Link
              to="/features"
              className={`text-sm font-medium transition-colors ${theme === 'dark'
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors ${theme === 'dark'
                ? 'text-gray-300 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              Pricing
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${theme === 'dark'
                  ? 'text-gray-300 hover:text-blue-400'
                  : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                Dashboard
              </Link>
            )}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <User
                    className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                  />
                  <span
                    className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}
                  >
                    {user.email ? user.email.split('@')[0] : 'User'}
                  </span>
                </div>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className={`text-sm font-medium transition-colors ${theme === 'dark'
                      ? 'text-gray-300 hover:text-blue-400'
                      : 'text-gray-600 hover:text-blue-600'
                      }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={`px-4 py-2 text-sm font-medium rounded-lg shadow-lg transition-all ${theme === 'dark'
                      ? 'text-white bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25'
                      : 'text-white bg-blue-500 hover:bg-blue-600 hover:shadow-blue-400/25'
                      }`}
                  >
                    Get Started
                  </Link>
                </>
              )}
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className={`ml-2 p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className={`md:hidden absolute inset-x-0 top-16 backdrop-blur-md animate-fadeIn ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'
            } shadow-lg`}
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${theme === 'dark'
                ? 'text-gray-200 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/features"
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${theme === 'dark'
                ? 'text-gray-200 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${theme === 'dark'
                ? 'text-gray-200 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${theme === 'dark'
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}
            <div className="pt-4 border-t border-gray-700 dark:border-gray-200">
              {!user ? (
                <>
                  <Link
                    to="/signin"
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${theme === 'dark'
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={`block px-3 py-2 mt-2 text-base font-medium rounded-lg text-center transition-colors ${theme === 'dark'
                      ? 'text-white bg-blue-600 hover:bg-blue-700'
                      : 'text-white bg-blue-500 hover:bg-blue-600'
                      }`}
                    onClick={toggleMenu}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-2">
                  <User
                    className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}
                  />
                  <span
                    className={`text-base font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}
                  >
                    {user.email ? user.email.split('@')[0] : 'User'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;