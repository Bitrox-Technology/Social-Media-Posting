import React, { useState } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { recentSubscriptions } from '../data/mockData';

const Subscriptions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const monthlyData = [
    { name: 'Jan', free: 45, basic: 35, premium: 20, enterprise: 12 },
    { name: 'Feb', free: 50, basic: 38, premium: 25, enterprise: 15 },
    { name: 'Mar', free: 55, basic: 40, premium: 30, enterprise: 18 },
    { name: 'Apr', free: 60, basic: 45, premium: 32, enterprise: 20 },
    { name: 'May', free: 65, basic: 50, premium: 35, enterprise: 22 },
    { name: 'Jun', free: 70, basic: 55, premium: 40, enterprise: 25 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 12500 },
    { name: 'Feb', revenue: 14200 },
    { name: 'Mar', revenue: 16800 },
    { name: 'Apr', revenue: 15900 },
    { name: 'May', revenue: 18500 },
    { name: 'Jun', revenue: 21000 },
  ];

  const filteredSubscriptions = recentSubscriptions.filter(sub => {
    const matchesSearch = sub.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         sub.plan.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'free') return matchesSearch && sub.plan === 'Free';
    if (filter === 'basic') return matchesSearch && sub.plan === 'Basic';
    if (filter === 'premium') return matchesSearch && sub.plan === 'Premium';
    if (filter === 'enterprise') return matchesSearch && sub.plan === 'Enterprise';
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <div className="flex space-x-2">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-primary">Manage Plans</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Subscribers</p>
          <p className="text-2xl font-bold mt-1">3,642</p>
          <div className="mt-2 flex items-center">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-sm font-medium text-green-500">+12.5%</span>
            <span className="text-xs text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
          <p className="text-2xl font-bold mt-1">$21,050</p>
          <div className="mt-2 flex items-center">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-sm font-medium text-green-500">+8.3%</span>
            <span className="text-xs text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500">Average Revenue Per User</p>
          <p className="text-2xl font-bold mt-1">$5.78</p>
          <div className="mt-2 flex items-center">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-sm font-medium text-green-500">+3.2%</span>
            <span className="text-xs text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500">User Retention Rate</p>
          <p className="text-2xl font-bold mt-1">94.2%</p>
          <div className="mt-2 flex items-center">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-sm font-medium text-green-500">+1.5%</span>
            <span className="text-xs text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Subscription Growth</h2>
            <div className="flex items-center text-sm">
              <select className="border-none bg-gray-100 px-2 py-1 rounded text-sm">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>YTD</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="free" stackId="a" fill="#8884d8" />
                <Bar dataKey="basic" stackId="a" fill="#82ca9d" />
                <Bar dataKey="premium" stackId="a" fill="#ffc658" />
                <Bar dataKey="enterprise" stackId="a" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 items-center justify-center">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-sm">Free</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">Basic</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm">Premium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-sm">Enterprise</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Monthly Revenue</h2>
            <div className="flex items-center text-sm">
              <select className="border-none bg-gray-100 px-2 py-1 rounded text-sm">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>YTD</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-semibold">Recent Subscriptions</h2>
            <div className="relative flex items-center w-64">
              <Search size={18} className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                        {sub.user.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{sub.user}</div>
                        <div className="text-sm text-gray-500">{sub.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      sub.plan === 'Free' ? 'bg-gray-100 text-gray-800' :
                      sub.plan === 'Basic' ? 'bg-blue-100 text-blue-800' :
                      sub.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    ${sub.amount}/month
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {sub.date}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="btn-pagination">Previous</button>
            <button className="btn-pagination">Next</button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">{filteredSubscriptions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-purple-50 text-sm font-medium text-purple-600 hover:bg-purple-100">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;