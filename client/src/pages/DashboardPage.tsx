import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setContentType } from '../store/appSlice';
import { 
  FileText, Clock, Activity, Settings2,
  Calendar, Plus, Bell, 
  Instagram, Twitter, Facebook, Linkedin, Youtube
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSelect = () => {
    navigate('/content-type');
  };

  const stats = [
    { label: 'Total Posts', value: '156', icon: FileText, change: '+12%', trend: 'up' },
    { label: 'Engagement Rate', value: '24.8%', icon: Activity, change: '+3.2%', trend: 'up' },
    { label: 'Time Saved', value: '127hrs', icon: Clock, change: '+18%', trend: 'up' },
    { label: 'AI Generations', value: '1,234', icon: Settings2, change: '+25%', trend: 'up' },
  ];

  const engagementData = [
    { name: 'Mon', Instagram: 4000, Twitter: 2400, Facebook: 2400 },
    { name: 'Tue', Instagram: 3000, Twitter: 1398, Facebook: 2210 },
    { name: 'Wed', Instagram: 2000, Twitter: 9800, Facebook: 2290 },
    { name: 'Thu', Instagram: 2780, Twitter: 3908, Facebook: 2000 },
    { name: 'Fri', Instagram: 1890, Twitter: 4800, Facebook: 2181 },
    { name: 'Sat', Instagram: 2390, Twitter: 3800, Facebook: 2500 },
    { name: 'Sun', Instagram: 3490, Twitter: 4300, Facebook: 2100 },
  ];

  const scheduledPosts = [
    {
      title: 'Product Launch Post',
      date: '2025-04-20',
      platforms: ['Instagram', 'Facebook', 'Twitter'],
      status: 'scheduled'
    },
    {
      title: 'Weekly Update',
      date: '2025-04-21',
      platforms: ['LinkedIn', 'Twitter'],
      status: 'draft'
    },
    {
      title: 'Customer Story',
      date: '2025-04-22',
      platforms: ['Instagram', 'Facebook'],
      status: 'scheduled'
    }
  ];

  const platformIcons = {
    Instagram: <Instagram className="w-5 h-5 text-pink-500" />,
    Facebook: <Facebook className="w-5 h-5 text-blue-600" />,
    Twitter: <Twitter className="w-5 h-5 text-blue-400" />,
    LinkedIn: <Linkedin className="w-5 h-5 text-blue-700" />,
    YouTube: <Youtube className="w-5 h-5 text-red-600" />
  };

  // Log events for debugging
  useEffect(() => {
    console.log('Scheduled Posts:', scheduledPosts);
    console.log('Mapped Events:', scheduledPosts.map(post => ({
      title: post.title,
      date: post.date,
      className: post.status === 'scheduled' ? 'scheduled' : 'draft',
      extendedProps: { status: post.status }
    })));
  }, []);

  // Custom styles for FullCalendar
  const calendarStyles = `
  .fc {
    font-family: 'Inter', sans-serif;
    max-width: 100%; /* Ensure calendar doesn't exceed container */
    overflow: hidden; /* Prevent overflow */
  }
  .fc-theme-standard .fc-scrollgrid {
    border: none;
    background: ${theme === 'dark' ? '#1F2937' : '#FFFFFF'};
    border-radius: 12px;
    padding: 8px; /* Add padding for better spacing */
  }
  .fc .fc-daygrid-day {
    background: ${theme === 'dark' ? '#1F2937' : '#FFFFFF'};
    border: none;
  }
  .fc .fc-daygrid-day-frame {
    padding: 4px;
  }
  .fc .fc-daygrid-day-number {
    color: ${theme === 'dark' ? '#D1D5DB' : '#4B5563'};
    font-size: 14px;
  }
  .fc .fc-daygrid-day.fc-day-today {
    background: #3B82F6;
    border-radius: 8px;
  }
  .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
    color: #FFFFFF;
  }
  .fc .fc-col-header-cell {
    background: ${theme === 'dark' ? '#1F2937' : '#FFFFFF'};
    border: none;
    padding: 8px 0;
  }
  .fc .fc-col-header-cell-cushion {
    color: ${theme === 'dark' ? '#D1D5DB' : '#4B5563'};
    font-weight: 600;
    font-size: 14px;
  }
  .fc .fc-toolbar {
    flex-wrap: wrap; /* Allow toolbar buttons to wrap on smaller screens */
    gap: 8px; /* Add spacing between toolbar elements */
    padding: 8px; /* Add padding to toolbar */
    margin-bottom: 12px; /* Space below toolbar */
  }
  .fc .fc-button {
    background: ${theme === 'dark' ? '#374151' : '#E5E7EB'};
    color: ${theme === 'dark' ? '#FFFFFF' : '#1F2937'};
    border: none;
    border-radius: 8px;
    padding: 6px 12px; /* Smaller padding for buttons */
    text-transform: capitalize;
    font-weight: 500;
    font-size: 12px; /* Smaller font size for buttons */
    line-height: 1.5; /* Improve button text alignment */
    min-width: auto; /* Allow buttons to shrink */
    transition: background 0.3s ease;
  }
  .fc .fc-button:hover {
    background: ${theme === 'dark' ? '#4B5563' : '#D1D5DB'};
  }
  .fc .fc-button.fc-button-primary {
    background: #3B82F6;
    color: #FFFFFF;
  }
  .fc .fc-button.fc-button-primary:hover {
    background: #2563EB;
  }
  .fc .fc-daygrid-event {
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 500;
    margin: 2px 0;
    background: ${theme === 'dark' ? '#3B82F6' : '#60A5FA'};
    color: #FFFFFF;
    border: none;
    width: 100%;
    box-sizing: border-box; /* Ensure padding doesn't cause overflow */
    transition: all 0.2s ease-in-out;
  }
  .fc .fc-daygrid-event:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  .fc .fc-timegrid-slot {
    background: ${theme === 'dark' ? '#1F2937' : '#FFFFFF'};
    border: none;
  }
  .fc .fc-timegrid-col {
    background: ${theme === 'dark' ? '#1F2937' : '#FFFFFF'};
  }
  .fc .fc-timegrid-event {
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    background: ${theme === 'dark' ? '#3B82F6' : '#60A5FA'};
    color: #FFFFFF;
    border: none;
  }
  .fc .fc-daygrid-day-events {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 2px; /* Add padding for events */
  }
  @media (max-width: 640px) {
    .fc .fc-toolbar {
      flex-direction: column; /* Stack toolbar elements vertically on small screens */
      align-items: stretch; /* Stretch buttons to full width */
    }
    .fc .fc-button {
      padding: 6px 8px;
      font-size: 11px; /* Smaller font size for mobile */
      width: 100%; /* Full-width buttons on mobile */
      margin: 2px 0; /* Vertical spacing */
    }
    .fc .fc-daygrid-day-number {
      font-size: 12px;
    }
    .fc .fc-col-header-cell-cushion {
      font-size: 12px;
    }
    .fc .fc-daygrid-event {
      font-size: 10px; /* Smaller event text on mobile */
      padding: 3px 6px; /* Smaller padding for events */
    }
  }
  @media (max-width: 400px) {
    .fc .fc-toolbar-title {
      font-size: 14px; /* Smaller title font on very small screens */
    }
  }
`;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <style>{calendarStyles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Row */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <stat.icon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Engagement Chart */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Social Media Engagement
                </h3>
                <div className="flex items-center space-x-2">
                  <select className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-3 py-1`}>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="Instagram" stackId="1" stroke="#E1306C" fill="#E1306C" />
                    <Area type="monotone" dataKey="Twitter" stackId="1" stroke="#1DA1F2" fill="#1DA1F2" />
                    <Area type="monotone" dataKey="Facebook" stackId="1" stroke="#4267B2" fill="#4267B2" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scheduled Posts */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Upcoming Posts
                </h3>
                <button
                  onClick={() => handleSelect()}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </button>
              </div>
              <div className="space-y-4">
                {scheduledPosts.map((post, index) => (
                  <div
                    key={index}
                    className={`${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    } p-4 rounded-xl flex items-center justify-between`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}>
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {post.title}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {format(new Date(post.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {post.platforms.map((platform) => (
                        <div key={platform} className="tooltip" data-tip={platform}>
                          {platformIcons[platform as keyof typeof platformIcons]}
                        </div>
                      ))}
                      <span className={`ml-4 px-2 py-1 rounded-full text-xs ${
                        post.status === 'scheduled'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Calendar */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Calendar
              </h3>
              <div className="calendar-container" style={{ position: 'relative', overflow: 'hidden' }}>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  initialDate="2025-04-01"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek'
                  }}
                  events={scheduledPosts.map(post => ({
                    title: post.title,
                    date: post.date,
                    className: post.status === 'scheduled' ? 'scheduled' : 'draft',
                    extendedProps: { status: post.status }
                  }))}
                  height="auto"
                  contentHeight="auto" // Adjust height dynamically
                  selectable={true}
                  select={(info) => setSelectedDate(info.start)}
                  dayMaxEvents={2} // Limit number of events shown per day
                  moreLinkClick="popover" // Show a popover for additional events
                  eventContent={(eventInfo) => (
                    <div className="fc-event-main flex flex-col items-start w-full">
                      <span className="block text-xs font-medium truncate">{eventInfo.event.title}</span>
                      <span className="text-xs text-gray-200">{eventInfo.event.extendedProps.status}</span>
                    </div>
                  )}
                  eventDidMount={(info) => {
                    console.log('Event Rendered:', info.event.title, 'on', info.event.start);
                  }}
                />
              </div>
              {selectedDate && (
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Selected: {format(selectedDate, 'MMM dd, yyyy')}
                </p>
              )}
            </div>
            {/* Quick Actions */}
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleSelect()}
                  className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule New Post
                </button>
                <button
                  className={`w-full px-4 py-3 ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } rounded-xl transition-colors flex items-center justify-center`}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  View Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;