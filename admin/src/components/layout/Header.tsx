import React, { useEffect } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout, setAdmin } from '../../store/authSlice';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Bell, Search, Sun, Moon, Settings, LogIn, UserPlus, Shield } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const admin = useSelector((state: RootState) => state.auth.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!admin) {
      const storedUser = localStorage.getItem('admin');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const { token, expiresAt, email } = parsedUser;

        // Check if token is still valid
        if (expiresAt && Date.now() < expiresAt) {
          dispatch(setAdmin({ email, token, expiresAt}));
        } else {
          dispatch(logout());
          localStorage.removeItem('admin');
          navigate('/login');
        }
      } else {
        // No user in localStorage, redirect to login
        navigate('/login');
      }
    }
  }, [admin, dispatch, navigate]);

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/login':
        return 'Sign In';
      case '/signup':
        return 'Sign Up';
      case '/verify-otp':
        return 'Verify OTP';
      case '/verify-admin-otp':
        return 'Verify Admin OTP';
      default:
        return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{getPageTitle()}</h1>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-2 flex-1 max-w-md mx-4">
          <Search size={16} className="text-gray-500 dark:text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {admin ? (
            <>
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  3
                </span>
              </button>

              <button className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings size={20} />
              </button>

              <div className="relative group">
                <div className="h-8 w-8 rounded-full bg-primary dark:bg-primary/90 text-white flex items-center justify-center font-medium relative">
                  {admin.email?.charAt(0).toUpperCase() || 'A'}
                  {admin.email  && (
                    <Shield
                      size={14}
                      className="absolute bottom-0 right-0 text-yellow-400 dark:text-yellow-300"
                      aria-label="Admin"
                    />
                  )}
                </div>
                <div className="absolute right-0 top-10 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 w-48 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-medium">{admin.email || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {admin.email} 
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
              >
                <LogIn size={20} />
                <span className="text-sm">Sign In</span>
              </NavLink>
              <NavLink
                to="/signup"
                className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
              >
                <UserPlus size={20} />
                <span className="text-sm">Sign Up</span>
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1">
          <NavLink to="/" className="hover:text-primary dark:hover:text-primary/80">
            Home
          </NavLink>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-100">{getPageTitle()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;