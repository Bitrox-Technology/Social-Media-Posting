import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  isOpen: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isOpen }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 md:w-64`}
    >
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-xl font-bold text-yellow-500 mb-4">Dashboard</h2>
        <ul className="space-y-2 flex-1">
          <li>
            <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Content Type
            </Link>
          </li>
          <li>
            <Link to="/topic" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Topics
            </Link>
          </li>
          <li>
            <Link to="/ideas" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Ideas
            </Link>
          </li>
          <li>
            <Link to="/images" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Image Generator
            </Link>
          </li>
          <li>
            <Link to="/post" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Post Creator
            </Link>
          </li>
          <li>
            <Link to="/auto" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Auto Post
            </Link>
          </li>
          <li>
            <Link to="/doyouknow" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Do You Know
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Dashboard;