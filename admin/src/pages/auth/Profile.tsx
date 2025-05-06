import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyGetAdminProfileQuery } from '../../store/authApi';
import { useTheme } from '../../context/ThemeContext';
import { Camera, Edit } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AdminData {
  _id?: string; // Added _id property
  username?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  location?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  profileImage?: string;
  role?: string;
}

const Profile: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [getAdminProfile, { data, isLoading, error }] = useLazyGetAdminProfileQuery();

  // Default values if admin data is incomplete
  const profileData = {
    username: adminData?.username || 'Admin User',
    email: adminData?.email || 'Not set',
    countryCode: adminData?.countryCode || 'Not set',
    phone: adminData?.phone || 'Not set',
    location: adminData?.location || 'Not set',
    bio: adminData?.bio || 'No bio provided',
    website: adminData?.website || 'Not set',
    twitter: adminData?.twitter || 'Not set',
    linkedin: adminData?.linkedin || 'Not set',
    profileImage:
      adminData?.profileImage ||
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await getAdminProfile().unwrap();
        if (response.success && response.data) {
          console.log('Admin Profile:', response.data); // Log the fetched data
          setAdminData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch admin profile');
        }
      } catch (err: any) {
        console.error('Fetch Error:', err); // Log the error
        toast.error(err?.data?.message || 'Failed to load admin profile', {
          position: 'bottom-right',
          autoClose: 3000,
          theme: isDarkMode ? 'dark' : 'light',
        });
      }
    };

    fetchAdminProfile();
  }, [getAdminProfile, isDarkMode]);

  const handleEdit = () => {
    navigate(`/admin-details/${adminData?._id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View your account details
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-8">
            {/* Profile Image Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-purple-600 dark:bg-purple-500 p-2 rounded-full text-white hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Photo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Edit your profile photo on the details page.
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country Code
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.countryCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.phone}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.location}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.bio}</p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.website}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Twitter
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.twitter}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    LinkedIn
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{profileData.linkedin}</p>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </div>
  );
};

export default Profile;