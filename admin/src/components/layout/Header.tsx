import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { useGetMeQuery } from '../../store/authApi';
import { useTheme } from '../../context/ThemeContext';
import { Menu, Bell, Search, Sun, Moon, Settings, LogIn, UserPlus } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: fetchedUser } = useGetMeQuery(undefined, { skip: !user });
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/login') return 'Sign In';
    if (path === '/signup') return 'Sign Up';
    return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
  };

  const handleLogout = () => {
    dispatch(logout());
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
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            {getPageTitle()}
          </h1>
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

          {user || fetchedUser ? (
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
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                  {(user?.userName || fetchedUser?.userName)?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="absolute right-0 top-10 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 w-48 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-medium">
                      {user?.userName || fetchedUser?.userName || 'Admin User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || fetchedUser?.email}
                    </p>
                  </div>
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
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