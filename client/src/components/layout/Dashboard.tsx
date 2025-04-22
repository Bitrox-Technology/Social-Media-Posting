import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface DashboardProps {
  isOpen: boolean;
  toggleDashboard: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isOpen, toggleDashboard }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-yellow-500">Dashboard</h2>
          <button
            onClick={toggleDashboard}
            className="text-white hover:text-yellow-500 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <ul className="space-y-2 flex-1">
          <li>
            <Link
              to="/"
              onClick={toggleDashboard}
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
             Home
            </Link>
          </li>
          <li>
            <Link
              to="/topic"
              onClick={toggleDashboard}
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Topics
            </Link>
          </li>
          <li>
            <Link
              to="/ideas"
              onClick={toggleDashboard}
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Ideas
            </Link>
          </li>
          <li>
            <Link
              to="/tmcarousel"
              onClick={toggleDashboard}
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Carousels
            </Link>
          </li>
          <li>
            <Link
              to="/tmimagegeneration"
              onClick={toggleDashboard}
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
             Image Generation Templates
            </Link>
          </li>
          <li>
            <Link
              to="/auto"
              onClick={toggleDashboard}
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Auto Post
            </Link>
          </li>
          <li>
            <Link
              to="tmdoyouknow"
              onClick={toggleDashboard}
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Do You Know
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Dashboard;