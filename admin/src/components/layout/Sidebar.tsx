import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/users', icon: <Users size={20} /> },
    { name: 'Posts', path: '/posts', icon: <FileText size={20} /> },
    { name: 'Requests', path: '/requests', icon: <Bell size={20} /> },
    { name: 'Subscriptions', path: '/subscriptions', icon: <CreditCard size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const authItems = [
    { name: 'Sign In', path: '/login', icon: <LogIn size={20} /> },
    { name: 'Sign Up', path: '/signup', icon: <UserPlus size={20} /> },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 ease-in-out bg-primary dark:bg-primary/90 text-white shadow-lg h-screen z-10 fixed md:relative`}
    >
      <div className="p-4 flex items-center justify-between">
        {isOpen ? (
          <h1 className="text-xl font-bold">SocialAI Admin</h1>
        ) : (
          <div className="w-full flex justify-center">
            <LayoutDashboard size={24} />
          </div>
        )}
      </div>

      <div className={`mt-5 ${isOpen ? 'px-2' : 'px-0'}`}>
        {isOpen && (
          <div className="px-3 py-2 text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider">
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
                    ? 'bg-primary/80 dark:bg-primary text-white'
                    : 'text-primary-foreground/70 hover:bg-primary/70 dark:hover:bg-primary/60 hover:text-white'
                } transition-colors duration-200`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {!user && (
          <>
            {isOpen && (
              <div className="px-3 py-2 text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mt-4">
                Authentication
              </div>
            )}
            <nav className="mt-2">
              {authItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${
                      isOpen ? 'px-3' : 'px-0 justify-center'
                    } py-3 rounded-md my-1 ${
                      isActive
                        ? 'bg-primary/80 dark:bg-primary text-white'
                        : 'text-primary-foreground/70 hover:bg-primary/70 dark:hover:bg-primary/60 hover:text-white'
                    } transition-colors duration-200`
                  }
                >
                  <span className="mr-2">{item.icon}</span>
                  {isOpen && <span>{item.name}</span>}
                </NavLink>
              ))}
            </nav>
          </>
        )}
      </div>

      {isOpen && user && (
        <div className="absolute bottom-0 w-full p-4 border-t border-primary-foreground/20">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center text-primary font-bold">
              {user.userName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-primary-foreground">
                {user.userName || 'Admin User'}
              </p>
              <p className="text-xs text-primary-foreground/70">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;