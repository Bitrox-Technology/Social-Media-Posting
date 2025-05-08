import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Clock, Activity, Calendar, Plus, Bell,
  Instagram, Twitter, Facebook, Linkedin, Users,
  TrendingUp, BarChart2, Globe, Search, Filter, MoreVertical,
  ChevronDown, ArrowUpRight, ArrowDownRight, Zap, Target,
  MessageSquare, Share2, UserPlus, Eye
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSelect = () => {
    navigate('/content-type');
  };

  const stats = [
    {
      label: 'Total Posts',
      value: 156,
      target: 200,
      icon: FileText,
      change: '+12%',
      trend: 'up',
      color: 'blue',
      progress: 78
    },
    {
      label: 'Engagement',
      value: 24.8,
      target: 30,
      icon: Activity,
      change: '+3.2%',
      trend: 'up',
      color: 'green',
      progress: 82.6
    },
    {
      label: 'Time Saved',
      value: 127,
      target: 150,
      icon: Clock,
      change: '+18%',
      trend: 'up',
      color: 'purple',
      progress: 84.6
    },
    {
      label: 'AI Generated',
      value: 1234,
      target: 1500,
      icon: Zap,
      change: '+25%',
      trend: 'up',
      color: 'yellow',
      progress: 82.2
    }
  ];

  const platformStats = [
    {
      platform: 'Instagram',
      icon: Instagram,
      followers: '125.4K',
      engagement: '5.2%',
      growth: '+2.1%',
      color: 'pink'
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      followers: '89.2K',
      engagement: '3.8%',
      growth: '+1.5%',
      color: 'blue'
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      followers: '234.8K',
      engagement: '4.1%',
      growth: '+1.8%',
      color: 'indigo'
    },
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      followers: '45.6K',
      engagement: '6.3%',
      growth: '+3.2%',
      color: 'sky'
    }
  ];

  const recentActivity = [
    {
      type: 'post',
      title: 'New Product Launch',
      time: '2 hours ago',
      platform: 'Instagram',
      engagement: 1234,
      trend: 'up'
    },
    {
      type: 'follower',
      title: 'New Followers',
      time: '4 hours ago',
      count: 156,
      platform: 'Twitter',
      trend: 'up'
    },
    {
      type: 'engagement',
      title: 'High Engagement',
      time: '6 hours ago',
      platform: 'Facebook',
      engagement: 2345,
      trend: 'up'
    }
  ];

  const performanceMetrics = {
    reach: {
      current: 245678,
      previous: 234567,
      change: '+4.7%',
      trend: 'up'
    },
    impressions: {
      current: 789012,
      previous: 756789,
      change: '+4.2%',
      trend: 'up'
    },
    clicks: {
      current: 34567,
      previous: 32123,
      change: '+7.6%',
      trend: 'up'
    }
  };

  const audienceData = [
    { name: '18-24', value: 30, color: '#3B82F6' },
    { name: '25-34', value: 40, color: '#10B981' },
    { name: '35-44', value: 20, color: '#8B5CF6' },
    { name: '45+', value: 10, color: '#F59E0B' }
  ];

  const engagementData = [
    { name: 'Mon', Instagram: 4000, Twitter: 2400, Facebook: 2400 },
    { name: 'Tue', Instagram: 3000, Twitter: 1398, Facebook: 2210 },
    { name: 'Wed', Instagram: 2000, Twitter: 9800, Facebook: 2290 },
    { name: 'Thu', Instagram: 2780, Twitter: 3908, Facebook: 2000 },
    { name: 'Fri', Instagram: 1890, Twitter: 4800, Facebook: 2181 },
    { name: 'Sat', Instagram: 2390, Twitter: 3800, Facebook: 2500 },
    { name: 'Sun', Instagram: 3490, Twitter: 4300, Facebook: 2100 }
  ];

  const trendData = [
    { name: 'Mon', value: 1200 },
    { name: 'Tue', value: 1500 },
    { name: 'Wed', value: 1800 },
    { name: 'Thu', value: 1600 },
    { name: 'Fri', value: 2000 },
    { name: 'Sat', value: 2200 },
    { name: 'Sun', value: 2500 }
  ];

  const scheduledPosts = [
    {
      title: 'Product Launch Post',
      date: '2025-04-20',
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      status: 'scheduled',
      engagement: 1234,
      trend: 'up'
    },
    {
      title: 'Weekly Update',
      date: '2025-04-21',
      platforms: ['LinkedIn', 'Twitter'],
      status: 'draft',
      engagement: 856,
      trend: 'down'
    },
    {
      title: 'Customer Story',
      date: '2025-04-22',
      platforms: ['Instagram', 'Facebook'],
      status: 'scheduled',
      engagement: 2145,
      trend: 'up'
    }
  ];

  const platformIcons = {
    Instagram: <Instagram className="w-4 h-4" />,
    Facebook: <Facebook className="w-4 h-4" />,
    Twitter: <Twitter className="w-4 h-4" />,
    LinkedIn: <Linkedin className="w-4 h-4" />
  };

  const platformColors = {
    Instagram: 'text-pink-500',
    Facebook: 'text-blue-600',
    Twitter: 'text-blue-400',
    LinkedIn: 'text-blue-700'
  };

  const chartColors = {
    grid: theme === 'dark' ? '#374151' : '#E5E7EB',
    text: theme === 'dark' ? '#D1D5DB' : '#4B5563',
    instagram: '#E1306C',
    twitter: '#1DA1F2',
    facebook: '#4267B2'
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
     <style>
        {`
          .fc {
            --fc-bg: ${theme === 'dark' ? 'linear-gradient(135deg, #1F2937, #374151)' : 'linear-gradient(135deg, #FFFFFF, #F9FAFB)'};
            --fc-text: ${theme === 'dark' ? '#D1D5DB' : '#1F2937'};
            --fc-border: ${theme === 'dark' ? '#4B5563' : '#E5E7EB'};
            --fc-event-bg-scheduled: ${theme === 'dark' ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #D1FAE5, #A7F3D0)'};
            --fc-event-bg-draft: ${theme === 'dark' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'linear-gradient(135deg, #FEF3C7, #FDE68A)'};
            --fc-event-text: ${theme === 'dark' ? '#FFFFFF' : '#1F2937'};
            --fc-button-bg: ${theme === 'dark' ? 'linear-gradient(135deg, #374151, #4B5563)' : 'linear-gradient(135deg, #F3F4F6, #E5E7EB)'};
            --fc-button-text: ${theme === 'dark' ? '#D1D5DB' : '#1F2937'};
            --fc-button-hover: ${theme === 'dark' ? '#6B7280' : '#D1D5DB'};
            --fc-highlight: ${theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'};
            --fc-shadow: ${theme === 'dark' ? '0 4px 6px rgba(0, 0, 0, 0.4)' : '0 4px 6px rgba(0, 0, 0, 0.1)'};
          }

          .fc-theme-standard .fc-scrollgrid {
            border: 1px solid var(--fc-border);
            border-radius: 12px;
            background: var(--fc-bg);
            box-shadow: var(--fc-shadow);
            padding: 8px;
            overflow: hidden;
          }

          .fc .fc-col-header-cell {
            background: ${theme === 'dark' ? 'linear-gradient(135deg, #1F2937, #374151)' : 'linear-gradient(135deg, #F9FAFB, #F3F4F6)'};
            color: var(--fc-text);
            padding: 12px;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--fc-border);
          }

          .fc .fc-daygrid-day {
            background: transparent;
            color: var(--fc-text);
            transition: all 0.2s ease;
            border-radius: 8px;
          }

          .fc .fc-daygrid-day:hover,
          .fc .fc-daygrid-day.fc-day-today {
            background: var(--fc-highlight);
            cursor: pointer;
            transform: scale(1.02);
          }

          .fc .fc-daygrid-day-number {
            font-size: 12px;
            font-weight: 500;
            padding: 8px;
            color: var(--fc-text);
          }

          .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
            background: ${theme === 'dark' ? '#3B82F6' : '#DBEAFE'};
            color: ${theme === 'dark' ? '#FFFFFF' : '#1F2937'};
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 4px;
          }

          .fc .fc-button {
            background: var(--fc-button-bg);
            color: var(--fc-button-text);
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: 600;
            text-transform: capitalize;
            transition: all 0.2s ease;
            box-shadow: var(--fc-shadow);
          }

          .fc .fc-button:hover {
            background: var(--fc-button-hover);
            transform: translateY(-1px);
          }

          .fc .fc-button:active {
            transform: translateY(0);
          }

          .fc .fc-toolbar-title {
            font-size: 18px;
            font-weight: 700;
            color: var(--fc-text);
            letter-spacing: 0.02em;
          }

          .fc .fc-event {
            background: var(--fc-event-bg-scheduled);
            color: var(--fc-event-text);
            border: none;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: var(--fc-shadow);
            position: relative;
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .fc .fc-event.status-draft {
            background: var(--fc-event-bg-draft);
          }

          .fc .fc-event:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          }

          .fc .fc-event .event-tooltip {
            visibility: hidden;
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: ${theme === 'dark' ? '#1F2937' : '#FFFFFF'};
            color: ${theme === 'dark' ? '#D1D5DB' : '#1F2937'};
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            white-space: nowrap;
            box-shadow: var(--fc-shadow);
            z-index: 10;
            opacity: 0;
            transition: opacity 0.2s ease, visibility 0.2s ease;
          }

          .fc .fc-event:hover .event-tooltip {
            visibility: visible;
            opacity: 1;
          }

          .fc .fc-event .event-platforms {
            display: flex;
            gap: 4px;
            align-items: center;
          }

          .fc .fc-timegrid-slot {
            background: transparent;
            border-color: var(--fc-border);
          }

          .fc .fc-timegrid-col {
            background: transparent;
          }

          .fc .fc-timegrid-event {
            border-radius: 6px;
            padding: 6px;
            box-shadow: var(--fc-shadow);
          }

          @media (max-width: 640px) {
            .fc .fc-toolbar-title {
              font-size: 16px;
            }
            .fc .fc-button {
              padding: 6px 12px;
              font-size: 12px;
            }
            .fc .fc-event {
              font-size: 10px;
              padding: 4px 8px;
            }
            .fc .fc-daygrid-day-number {
              font-size: 10px;
            }
          }
        `}
      </style>
      <div className="max-w-[1920px] mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Analytics Dashboard
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Track and analyze your social media performance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className={`pl-9 pr-4 py-2 rounded-lg text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-200'
                } border focus:ring-2 focus:ring-blue-500 w-48 lg:w-64`}
              />
              <Search className={`absolute left-3 top-2.5 w-4 h-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>

            <div className="relative">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                } border border-gray-200 dark:border-gray-700`}
                whileHover={{ scale: 1.05 }}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filters</span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    } border border-gray-200 dark:border-gray-700 z-10`}
                  >
                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        By Platform
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        By Date
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        By Engagement
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={handleSelect}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </motion.button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Stats Row */}
          <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } p-4 rounded-xl shadow-sm hover:shadow-md transition-all`}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      <CountUp
                        end={stat.value}
                        duration={2}
                        separator=","
                        suffix={stat.label === 'Engagement' ? '%' : ''}
                      />
                    </h3>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </p>
                  </div>

                  <div className="w-12 h-12">
                    <CircularProgressbar
                      value={stat.progress}
                      text={`${stat.progress}%`}
                      styles={buildStyles({
                        pathColor: `var(--${stat.color}-500)`,
                        textColor: theme === 'dark' ? '#fff' : '#374151',
                        trailColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                        textSize: '24px'
                      })}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Platform Performance */}
            <div className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } p-4 rounded-xl shadow-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Platform Performance
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className={`${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    } rounded-lg px-3 py-1 text-sm`}
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <BarChart2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {platformStats.map((platform, index) => (
                  <motion.div
                    key={index}
                    className={`p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <platform.icon className={`w-4 h-4 text-${platform.color}-500`} />
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {platform.platform}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Followers
                        </span>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {platform.followers}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Engagement
                        </span>
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {platform.engagement}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Growth
                        </span>
                        <span className="text-sm font-medium text-green-500">
                          {platform.growth}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis dataKey="name" stroke={chartColors.text} />
                    <YAxis stroke={chartColors.text} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value, name) => [
                        `${value} engagements`,
                        name,
                        <Globe className="w-4 h-4 inline-block ml-2" />
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="Instagram"
                      stroke={chartColors.instagram}
                      fill={chartColors.instagram}
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="Twitter"
                      stroke={chartColors.twitter}
                      fill={chartColors.twitter}
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="Facebook"
                      stroke={chartColors.facebook}
                      fill={chartColors.facebook}
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity & Scheduled Posts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } p-4 rounded-xl shadow-sm`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-start gap-3 ${
                        index !== recentActivity.length - 1 ? 'pb-4 border-b border-gray-700' : ''
                      }`}
                      whileHover={{ backgroundColor: theme === 'dark' ? '#374151' : '#F9FAFB' }}
                    >
                      <div className={`p-2 rounded-lg bg-${
                        activity.type === 'post' ? 'blue' :
                        activity.type === 'follower' ? 'green' : 'purple'
                      }-500/10`}>
                        {activity.type === 'post' ? (
                          <MessageSquare className={`w-4 h-4 text-blue-500`} />
                        ) : activity.type === 'follower' ? (
                          <UserPlus className={`w-4 h-4 text-green-500`} />
                        ) : (
                          <Target className={`w-4 h-4 text-purple-500`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {activity.title}
                          </h4>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {activity.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${platformColors[activity.platform as keyof typeof platformColors]}`}>
                            {platformIcons[activity.platform as keyof typeof platformIcons]}
                          </span>
                          {activity.engagement && (
                            <span className={`text-xs ${
                              activity.trend === 'up' ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {activity.trend === 'up' ? '+' : '-'}{activity.engagement} engagements
                              <Eye className="w-3 h-3 inline-block ml-1" />
                            </span>
                          )}
                          {activity.count && (
                            <span className="text-xs text-green-500">
                              +{activity.count} new followers
                              <Users className="w-3 h-3 inline-block ml-1" />
                            </span>
                          )}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-1"
                      >
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scheduled Posts */}
              <div className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } p-4 rounded-xl shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Scheduled Posts
                  </h3>
                  <button className={`text-sm ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  } hover:underline`}>
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {scheduledPosts.map((post, index) => (
                    <motion.div
                      key={index}
                      className={`${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      } p-3 rounded-lg`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {post.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {format(new Date(post.date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {post.platforms.map((platform) => (
                            <span
                              key={platform}
                              className={platformColors[platform as keyof typeof platformColors]}
                            >
                              {platformIcons[platform as keyof typeof platformIcons]}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.status === 'scheduled'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {post.status}
                        </span>
                        <div className="flex items-center gap-1">
                          {post.trend === 'up' ? (
                            <ArrowUpRight className="w-3 h-3 text-green-500" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-xs ${
                            post.trend === 'up' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {post.engagement}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Engagement Trend */}
            <div className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } p-4 rounded-xl shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Engagement Trend
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                    <XAxis dataKey="name" stroke={chartColors.text} />
                    <YAxis stroke={chartColors.text} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Performance Overview */}
            <div className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } p-4 rounded-xl shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Performance Overview
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <motion.div whileHover={{ y: -2 }}>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Reach
                  </div>
                  <div className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <CountUp
                      end={performanceMetrics.reach.current}
                      duration={2}
                      separator=","
                    />
                  </div>
                  <div className="text-xs text-green-500 flex items-center gap-1">
                    {performanceMetrics.reach.change}
                    <TrendingUp className="w-3 h-3" />
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -2 }}>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Impressions
                  </div>
                  <div className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <CountUp
                      end={performanceMetrics.impressions.current}
                      duration={2}
                      separator=","
                    />
                  </div>
                  <div className="text-xs text-green-500 flex items-center gap-1">
                    {performanceMetrics.impressions.change}
                    <Eye className="w-3 h-3" />
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -2 }}>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Clicks
                  </div>
                  <div className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <CountUp
                      end={performanceMetrics.clicks.current}
                      duration={2}
                      separator=","
                    />
                  </div>
                  <div className="text-xs text-green-500 flex items-center gap-1">
                    {performanceMetrics.clicks.change}
                    <Target className="w-3 h-3" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Audience Demographics */}
            <div className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } p-4 rounded-xl shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Audience Demographics
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={audienceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {audienceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                      formatter={(value, name) => [
                        `${value}%`,
                        name,
                        <Users className="w-4 h-4 inline-block ml-2" />
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {audienceData.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {item.name} ({item.value}%)
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } p-4 rounded-xl shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Content Calendar
              </h3>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek'
                }}
                height={350}
                events={scheduledPosts.map(post => ({
                  title: post.title,
                  date: post.date,
                  className: `status-${post.status}`,
                  extendedProps: { platforms: post.platforms }
                }))}
                selectable={true}
                select={(info) => setSelectedDate(info.start)}
                eventContent={(eventInfo) => (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{eventInfo.event.title}</span>
                    <div className="flex gap-1">
                      {eventInfo.event.extendedProps.platforms.map((platform: string) => (
                        <span key={platform} className={platformColors[platform as keyof typeof platformColors]}>
                          {platformIcons[platform as keyof typeof platformIcons]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                eventClick={(info) => alert(`Clicked: ${info.event.title}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;