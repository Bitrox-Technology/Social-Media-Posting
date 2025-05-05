import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="rounded-full p-2 bg-gray-50 dark:bg-gray-700">{icon}</div>
      </div>
      <div className="mt-2 flex items-center">
        {changeType === 'increase' ? (
          <ChevronUp className="text-green-500 dark:text-green-400" size={16} />
        ) : (
          <ChevronDown className="text-red-500 dark:text-red-400" size={16} />
        )}
        <span
          className={`text-sm font-medium ${
            changeType === 'increase'
              ? 'text-green-500 dark:text-green-400'
              : 'text-red-500 dark:text-red-400'
          }`}
        >
          {change}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-300 ml-1">from last month</span>
      </div>
    </div>
  );
};

export default StatCard;