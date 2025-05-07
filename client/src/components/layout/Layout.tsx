import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {Navbar} from './Navbar';
import Dashboard from './Slidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  const toggleDashboard = () => {
    setIsDashboardOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {!isAuthPage && (
        <Navbar toggleDashboard={toggleDashboard} isDashboardOpen={isDashboardOpen} />
      )}
      <div className="flex flex-1">
        {!isAuthPage && (
          <Dashboard isOpen={isDashboardOpen} toggleDashboard={toggleDashboard} />
        )}
        <div className="flex flex-col flex-1">
          <main className="flex-1 p-4">{children}</main>
          {!isAuthPage && <Footer />}
        </div>
      </div>
    </div>
  );
};