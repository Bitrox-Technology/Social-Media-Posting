import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, FileText, Bell, CreditCard, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { mockUserData, mockPostsData, recentRequests, recentSubscriptions } from '../data/mockData';

const Dashboard: React.FC = () => {
  const subscriptionChartData = [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 78 },
    { name: 'Mar', value: 92 },
    { name: 'Apr', value: 86 },
    { name: 'May', value: 105 },
    { name: 'Jun', value: 120 },
  ];

  const postsChartData = [
    { name: 'Jan', value: 25 },
    { name: 'Feb', value: 35 },
    { name: 'Mar', value: 45 },
    { name: 'Apr', value: 30 },
    { name: 'May', value: 50 },
    { name: 'Jun', value: 40 },
  ];

  const userTypeData = [
    { name: 'Free', value: 400 },
    { name: 'Basic', value: 300 },
    { name: 'Premium', value: 200 },
    { name: 'Enterprise', value: 100 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
  const DARK_COLORS = ['#a3bffa', '#9ae6b4', '#fed7aa', '#fb923c']; // Adjusted for dark mode

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="3,642"
          change="+12.5%"
          changeType="increase"
          icon={<Users className="text-purple-600 dark:text-purple-400" size={24} />}
        />
        <StatCard
          title="Total Posts"
          value="15,842"
          change="+8.2%"
          changeType="increase"
          icon={<FileText className="text-blue-600 dark:text-blue-400" size={24} />}
        />
        <StatCard
          title="Pending Requests"
          value="24"
          change="-5.8%"
          changeType="decrease"
          icon={<Bell className="text-yellow-600 dark:text-yellow-400" size={24} />}
        />
        <StatCard
          title="Active Subscriptions"
          value="1,253"
          change="+3.1%"
          changeType="increase"
          icon={<CreditCard className="text-green-600 dark:text-green-400" size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Subscription Trends
            </h2>
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <TrendingUp size={16} className="mr-1" />
              <span>+15.3%</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={subscriptionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-300" />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-300" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  wrapperClassName="dark:[&>div]:bg-gray-800 dark:[&>div]:text-white dark:[&>div]:border-gray-700"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  className="dark:stroke-purple-400 dark:fill-purple-400 dark:fill-opacity-30"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Posts Created</h2>
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <TrendingUp size={16} className="mr-1" />
              <span>+8.2%</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                <XAxis dataKey="name" stroke="#6b7280" className="dark:stroke-gray-300" />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-300" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  wrapperClassName="dark:[&>div]:bg-gray-800 dark:[&>div]:text-white dark:[&>div]:border-gray-700"
                />
                <Bar
                  dataKey="value"
                  fill="#82ca9d"
                  className="dark:fill-green-400"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm lg:col-span-1 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            User Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="dark:fill-[var(--dark-color)]"
                      style={{
                        '--dark-color': DARK_COLORS[index % DARK_COLORS.length],
                      } as React.CSSProperties}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    borderColor: '#e5e7eb',
                    color: '#1f2937',
                  }}
                  wrapperClassName="dark:[&>div]:bg-gray-800 dark:[&>div]:text-white dark:[&>div]:border-gray-700"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {userTypeData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{
                    backgroundColor: `rgb(var(--theme-dark))`,
                    '--theme-dark': DARK_COLORS[index % DARK_COLORS.length],
                  } as React.CSSProperties}
                ></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {entry.name} - {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent User Requests
          </h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between">
                  <div className="font-medium text-gray-900 dark:text-white">{request.user}</div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}
                  >
                    {request.status}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">{request.type}</div>
                <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">{request.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Recent Subscriptions
          </h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-3 border border-gray-100 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between">
                  <div className="font-medium text-gray-900 dark:text-white">{sub.user}</div>
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {sub.plan}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  ${sub.amount}/month
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-400 mt-1">{sub.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;