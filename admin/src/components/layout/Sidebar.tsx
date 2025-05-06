import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  CreditCard,
  Settings,
  BarChart,
  LogIn,
  UserPlus,
  User,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { admin } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Posts', path: '/posts', icon: <FileText size={20} /> },
    { name: 'Requests', path: '/requests', icon: <Bell size={20} /> },
    { name: 'Subscriptions', path: '/subscriptions', icon: <CreditCard size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const authItems = admin
    ? [
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
        { name: 'Sign Out', path: '#', icon: <LogOut size={20} />, onClick: handleSignOut },
      ]
    : [
        { name: 'Sign In', path: '/login', icon: <LogIn size={20} /> },
        { name: 'Sign Up', path: '/signup', icon: <UserPlus size={20} /> },
      ];

  function handleSignOut() {
    dispatch(logout());
    localStorage.removeItem('admin');
    navigate('/login');
  }

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 ease-in-out bg-purple-600 dark:bg-purple-800 text-white shadow-lg h-screen z-10 fixed md:relative`}
    >
      <div className="p-4 flex items-center justify-between">
        {isOpen ? (
          <h1 className="text-xl font-bold text-white">SocialAI Admin</h1>
        ) : (
          <div className="w-full flex justify-center">
            <LayoutDashboard size={24} className="text-white" />
          </div>
        )}
      </div>

      <div className={`mt-5 ${isOpen ? 'px-2' : 'px-0'}`}>
        {isOpen && (
          <div className="px-3 py-2 text-xs font-semibold text-gray-200 dark:text-gray-300 uppercase tracking-wider">
            Main Navigation
          </div>
        )}

        <nav className="mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${
                  isOpen ? 'px-3' : 'px-0 justify-center'
                } py-3 rounded-md my-1 ${
                  isActive
                    ? 'bg-purple-700 dark:bg-purple-900 text-white'
                    : 'text-gray-200 dark:text-gray-300 hover:bg-purple-700 dark:hover:bg-purple-700 hover:text-white'
                } transition-colors duration-200`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {isOpen && (
          <div className="px-3 py-2 text-xs font-semibold text-gray-200 dark:text-gray-300 uppercase tracking-wider mt-4">
            Authentication
          </div>
        )}

        <nav className="mt-2">
          {authItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={item.onClick}
              className={({ isActive }) =>
                `flex items-center ${
                  isOpen ? 'px-3' : 'px-0 justify-center'
                } py-3 rounded-md my-1 ${
                  isActive && item.path !== '#'
                    ? 'bg-purple-700 dark:bg-purple-900 text-white'
                    : 'text-gray-200 dark:text-gray-300 hover:bg-purple-700 dark:hover:bg-purple-700 hover:text-white'
                } transition-colors duration-200`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {isOpen && admin && (
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-300 dark:border-gray-600">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
              {admin.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                { admin.email || 'Admin User'}
              </p>
              <p className="text-xs text-gray-200 dark:text-gray-300">{admin.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;