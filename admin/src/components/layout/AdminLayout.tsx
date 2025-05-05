import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
        <footer className="py-3 px-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center">
            <div>© 2025 Admin Panel</div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                License
              </a>
              <a
                href="#"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;