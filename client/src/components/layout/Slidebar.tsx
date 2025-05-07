import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Close as CloseIcon, Home, Lightbulb, Image, Description, Rocket, Info, Person, Logout } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/appSlice';

interface SlidebarProps {
  isOpen: boolean;
  toggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}

const Slidebar: React.FC<SlidebarProps> = ({ isOpen, toggleDrawer }) => {
  const user = useAppSelector((state) => state.app.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    toggleDrawer(false)({} as React.MouseEvent);
    navigate('/signin');
  };


  const drawerList = (
    <div className="h-full flex flex-col" role="presentation">
      <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">Dashboard</h2>
        <IconButton onClick={toggleDrawer(false)} aria-label="Close drawer">
          <CloseIcon className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-500" />
        </IconButton>
      </div>
      <List className="flex-1 p-0">
        <ListItem component={Link} to="/" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <Home className="text-gray-600 dark:text-gray-300" />
          </ListItemIcon>
          <ListItemText primary="Home" className="text-gray-700 dark:text-gray-200" />
        </ListItem>
        <ListItem component={Link} to="/topic" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <Lightbulb className="text-gray-600 dark:text-gray-300" />
          </ListItemIcon>
          <ListItemText primary="Topics" className="text-gray-700 dark:text-gray-200" />
        </ListItem>
        <ListItem component={Link} to="/ideas" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <Lightbulb className="text-gray-600 dark:text-gray-300" />
          </ListItemIcon>
          <ListItemText primary="Ideas" className="text-gray-700 dark:text-gray-200" />
        </ListItem>
        <ListItem component={Link} to="/tmcarousel" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <Image className="text-gray-600 dark:text-gray-300" />
          </ListItemIcon>
          <ListItemText primary="Carousels" className="text-gray-700 dark:text-gray-200" />
        </ListItem>
        <ListItem component={Link} to="/tmimagegeneration" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <Image className="text-gray-600 dark:text-gray-300" />
          </ListItemIcon>
          <ListItemText primary="Image Generation" className="text-gray-700 dark:text-gray-200" />
        </ListItem>
        <ListItem component={Link} to="/auto" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <Rocket className="text-gray-600 dark:text-gray-300" />
          </ListItemIcon>
          <ListItemText primary="Auto Post" className="text-gray-700 dark:text-gray-200" />
        </ListItem>
        <ListItem component={Link} to="/tmdoyouknow" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <Info className="text-gray-600 dark:text-gray-300" />
          </ListItemIcon>
          <ListItemText primary="Do You Know" className="text-gray-700 dark:text-gray-200" />
        </ListItem>
        <ListItem component={Link} to="/blog" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <Description className="text-gray-600 dark:text-gray-300" />
          </ListItemIcon>
          <ListItemText primary="Blog" className="text-gray-700 dark:text-gray-200" />
        </ListItem>
      </List>
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Logged in as</p>
          <p className="font-medium text-gray-900 dark:text-white">{user?.email || 'Guest'}</p>
        </div>
        <List>
          <ListItem  component={Link} to="/profile"onClick={toggleDrawer(false)}>
            <ListItemIcon>
              <Person className="text-gray-600 dark:text-gray-300" />
            </ListItemIcon>
            <ListItemText primary="Profile" className="text-gray-700 dark:text-gray-200" />
          </ListItem>
          <ListItem  onClick={handleLogout} className="cursor-pointer">
            <ListItemIcon>
              <Logout className="text-gray-600 dark:text-gray-300" />
            </ListItemIcon>
            <ListItemText primary="Logout" className="text-gray-700 dark:text-gray-200" />
          </ListItem>
        </List>
      </div>
    </div>
  );

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={toggleDrawer(false)}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        className: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-64',
      }}
      className="z-40"
    >
      {drawerList}
    </Drawer>
  );
};

export default Slidebar;