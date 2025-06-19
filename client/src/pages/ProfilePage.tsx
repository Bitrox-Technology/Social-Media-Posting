import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  Box,
  Target,
  Edit2,
  Camera,
  Indent,
} from 'lucide-react';
import { useLazyGetUserProfileQuery } from '../store/api';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [getUserProfile, { isFetching }] = useLazyGetUserProfileQuery();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await getUserProfile().unwrap();
        if (response.success && response.data) {
          setUserDetails(response.data);
          localStorage.setItem('userDetails', JSON.stringify(response.data));
        } else {
          throw new Error(response.message || 'Failed to fetch user profile');
        }
      } catch (error) {
        const savedData = localStorage.getItem('userDetails');
        if (savedData) {
          setUserDetails(JSON.parse(savedData));
        } else {
          setUserDetails({
            userName: 'User Not Set',
            email: 'email@example.com',
            countryCode: '+1',
            phone: '123-456-7890',
            location: 'Location Not Set',
            logo: null,
            companyName: 'Company Not Set',
            productCategories: [
              { category: 'Category Not Set', productName: 'Product Not Set', image: null },
            ],
            services: ['Service Not Set'],
            keyProducts: ['Product Not Set'],
            targetMarket: 'Market Not Set',
            websiteUrl: 'https://example.com',
            uniqueIdentifier: '@example.com'
          });
        }
        toast.error(
          (error instanceof Error ? error.message : String(error)) || 'Failed to load user profile',
          {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [getUserProfile]);

  const handleEdit = () => {
    navigate('/user-details', { state: { email: userDetails.email } });
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`w-10 h-10 border-4 border-t-4 border-blue-500 rounded-full ${
            theme === 'dark' ? 'border-gray-400' : 'border-gray-300'
          }`}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 lg:col-span-1`}
          >
            <div className="relative">
              <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
                <img
                  src={userDetails.logo || 'https://via.placeholder.com/128'}
                  alt="Profile Logo"
                  className="max-w-full max-h-full rounded-full object-cover shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                  style={{ filter: theme === 'dark' ? 'brightness(0.8)' : 'none' }}
                  onError={(e) => {
                    console.error('Failed to load logo:', userDetails.logo);
                    e.currentTarget.src = 'https://via.placeholder.com/128';
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <h2
                  className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  {userDetails.userName}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {userDetails.companyName}
                </p>
              </div>
              <motion.button
                onClick={handleEdit}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </motion.button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <Mail
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-3`}
                />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {userDetails.email}
                </span>
              </div>
              {userDetails.phone && (
                <div className="flex items-center">
                  <Phone
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-3`}
                  />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {userDetails.countryCode} {userDetails.phone}
                  </span>
                </div>
              )}
              {userDetails.location && (
                <div className="flex items-center">
                  <MapPin
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-3`}
                  />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {userDetails.location}
                  </span>
                </div>
              )}
              {userDetails.uniqueIdentifier && (
                <div className="flex items-center">
                  <Indent
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-3`}
                  />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    @{userDetails.uniqueIdentifier}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <Globe
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-3`}
                />
                <a
                  href={userDetails.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  {userDetails.websiteUrl}
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Information */}
            <div
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}
            >
              <div className="flex items-center mb-6">
                <Building2 className="w-6 h-6 text-blue-500 mr-3" />
                <h3
                  className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  Company Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4
                    className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Company Name
                  </h4>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {userDetails.companyName}
                  </p>
                </div>
                <div>
                  <h4
                    className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Target Market
                  </h4>
                  <p className={`mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {userDetails.targetMarket}
                  </p>
                </div>
              </div>
            </div>

            {/* Products & Services */}
            <div
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}
            >
              <div className="flex items-center mb-6">
                <Box className="w-6 h-6 text-blue-500 mr-3" />
                <h3
                  className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  Products & Services
                </h3>
              </div>
              <div className="space-y-6">
                {/* Product Categories */}
                <div>
                  <h4
                    className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-3`}
                  >
                    Product Categories
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(userDetails.productCategories || []).map((item: any, index: number) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg flex items-start space-x-4 ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        {item.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={`${item.productName} Image`}
                              className="w-16 h-16 rounded-lg object-cover shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105"
                              style={{ filter: theme === 'dark' ? 'brightness(0.8)' : 'none' }}
                              onError={(e) => {
                                console.error('Failed to load product image:', item.image);
                                e.currentTarget.src = 'https://via.placeholder.com/64';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h5
                            className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                          >
                            {item.category || 'Category Not Set'}
                          </h5>
                          <p
                            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                          >
                            {item.productName || 'Product Not Set'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4
                    className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-3`}
                  >
                    Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(userDetails.services || []).map((service: string, index: number) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          theme === 'dark'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {service || 'Service Not Set'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Products */}
                <div>
                  <h4
                    className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-3`}
                  >
                    Key Products
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(userDetails.keyProducts || []).map((product: string, index: number) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                        }`}
                      >
                        <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          {product || 'Product Not Set'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;