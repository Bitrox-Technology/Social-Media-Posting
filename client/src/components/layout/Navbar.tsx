import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/appSlice';
import { BrainCog, User, Menu, LogOut } from 'lucide-react';

interface NavbarProps {
  toggleDashboard: () => void;
  isDashboardOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleDashboard, isDashboardOpen }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.app.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate('/signin');
  };

  return (
    <nav className="bg-black border-b border-yellow-500 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDashboard}
            className="text-white hover:text-yellow-500 focus:outline-none"
            aria-label="Toggle dashboard"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <BrainCog className="w-8 h-8 text-yellow-500" />
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-white">Bitrox</span>
              <span className="text-xl font-bold text-yellow-500 ml-1">SocialAI</span>
            </div>
          </Link>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white hover:text-yellow-500 focus:outline-none flex items-center"
            aria-label="User menu"
          >
            <User className="w-6 h-6" />
            {user && user.email && (
              <span className="ml-2 text-sm text-white hidden md:inline">
                {user.email.split('@')[0]}
              </span>
            )}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              {user && user.email ? (
                <div className="py-1">
                  <div className="px-4 py-2 text-gray-800 border-b">
                    <span className="block text-sm font-semibold truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="py-1">
                  <Link
                    to="/signup"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/signin"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};