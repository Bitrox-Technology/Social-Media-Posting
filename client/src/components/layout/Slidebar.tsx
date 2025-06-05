import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Divider, Avatar } from '@mui/material';
import {
  Close as CloseIcon,
  Home as HomeIcon,
  Lightbulb as LightbulbIcon,
  Collections as CollectionsIcon,
  AutoAwesome as AutoAwesomeIcon,
  QuestionMark as QuestionMarkIcon,
  Article as ArticleIcon,
  Analytics as AnalyticsIcon,
  LibraryBooks as LibraryBooksIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  KeyboardArrowRight as ArrowIcon,
  Festival,
  Schedule,
  ProductionQuantityLimitsSharp,
  PermDeviceInformation,
  Event
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { clearCsrfToken, clearUser } from '../../store/appSlice';
import { BlocksIcon, Bot } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLogoutMutation } from '../../store/api';
import { useAlert } from '../hooks/useAlert';

interface SlidebarProps {
  isOpen: boolean;
  toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const Slidebar: React.FC<SlidebarProps> = ({ isOpen, toggleDrawer }) => {
  const user = useAppSelector((state) => state.app.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation()
  const { theme } = useTheme();
  const { success, error: errorAlert } = useAlert();

  const handleLogout = async() => {
    try {
      const response = await logout().unwrap();
      if (response.success) {
        dispatch(clearUser());
        dispatch(clearCsrfToken());
        success('Logged Out', 'You have been successfully logged out.');
        toggleDrawer(false)({ type: 'click' } as React.MouseEvent);
        setTimeout(() => navigate('/signin', { replace: true }), 2000);
      } else {
        throw new Error('Logout response unsuccessful');
      }
    } catch (err) {
      console.error('Logout error:', err);
      errorAlert('Logout Failed', 'Unable to log out. Please try again.');
    }
  };

  // Menu sections for better organization
  const menuSections = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { path: '/topic', label: 'Topics', icon: <LightbulbIcon /> },
      ]
    },
    {
      title: 'Content Creation',
      items: [
        { path: '/tmcarousel', label: 'Carousels', icon: <CollectionsIcon /> },
        { path: '/tmimagegeneration', label: 'Image Generation', icon: <AutoAwesomeIcon /> },
        { path: '/tmdoyouknow', label: 'Do You Know', icon: <QuestionMarkIcon /> },
        { path: '/tmfestival', label: 'Festival', icon: <Festival /> },
        { path: '/tmproduct', label: 'Product', icon: <ProductionQuantityLimitsSharp /> },
        { path: '/tminformative', label: 'Infromative', icon: <PermDeviceInformation /> },
        { path: '/tmevent', label: 'Event', icon: <Event /> },
        { path: '/blog', label: 'Blog Posts', icon: <ArticleIcon /> },
      ]
    },
    {
      title: 'Analytics & Library',
      items: [
        { path: '/post-analyzer', label: 'Post Analyzer', icon: <AnalyticsIcon /> },
        { path: '/user-posts', label: 'Content Library', icon: <LibraryBooksIcon /> },
        { path: '/saved-blogs', label: 'Blog Library', icon: <BlocksIcon /> },
        { path: '/scheduled-posts', label: 'Scheduled Posts', icon: <Schedule /> },
      ]
    }
  ];

  // Check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const drawerList = (
    <motion.div
      className="h-full flex flex-col bg-white dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header with Logo */}
      <div className="p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center space-x-2 group">
            <Bot
              className={`h-8 w-8 transition-transform group-hover:scale-110 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}
            />
            <span
              className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
            >
              Bitrox{' '}
              <span
                className={`bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark'
                    ? 'from-blue-400 to-purple-400'
                    : 'from-blue-600 to-purple-600'
                  }`}
              >
                SocialAI
              </span>
            </span>
          </Link>
        </div>
        <IconButton
          onClick={toggleDrawer(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </div>

      {/* User Profile Section */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar
            className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900"
            alt={'User'}
          >
            {user?.email?.charAt(0) || 'U'}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {'User'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'guest@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto py-2">
        {menuSections.map((section, index) => (
          <div key={index} className="mb-4">
            <div className="px-5 py-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            <List className="py-0">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <ListItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={toggleDrawer(false)}
                    className={`px-3 mx-2 rounded-lg transition-all duration-200 ${active
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    disableGutters
                    disablePadding
                  >
                    <motion.div
                      className="flex items-center w-full py-2 px-3"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ListItemIcon className={`min-w-[40px] ${active
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        className={active ? 'font-medium' : ''}
                      />
                      {active && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 ml-2"
                        />
                      )}
                    </motion.div>
                  </ListItem>
                );
              })}
            </List>
            {index < menuSections.length - 1 && (
              <Divider className="my-2 mx-5 bg-gray-200 dark:bg-gray-800" />
            )}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <List className="py-0">
          <ListItem
            component={Link}
            to="/profile"
            onClick={toggleDrawer(false)}
            className="px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            disableGutters
            disablePadding
          >
            <div className="flex items-center w-full py-2 px-3">
              <ListItemIcon className="min-w-[40px] text-gray-500 dark:text-gray-400">
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile Settings" />
              <ArrowIcon className="text-gray-400 dark:text-gray-600" fontSize="small" />
            </div>
          </ListItem>

          <ListItem
            onClick={handleLogout}
            className="px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 cursor-pointer transition-colors mt-2"
            disableGutters
            disablePadding
          >
            <div className="flex items-center w-full py-2 px-3">
              <ListItemIcon className="min-w-[40px] text-red-500 dark:text-red-400">
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </div>
          </ListItem>
        </List>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Bitrox Tech © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <Drawer
          anchor="left"
          open={isOpen}
          onClose={toggleDrawer(false)}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            className: 'w-72 border-r border-gray-200 dark:border-gray-800 shadow-xl',
            sx: {
              backgroundColor: 'transparent',
              backgroundImage: 'none'
            }
          }}
          className="z-40"
        >
          {drawerList}
        </Drawer>
      )}
    </AnimatePresence>
  );
};

export default Slidebar;