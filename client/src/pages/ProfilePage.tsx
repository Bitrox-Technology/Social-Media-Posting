import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  CreditCard,
  Calendar,
  DollarSign,
  Shield,
  CheckCircle,
  User,
  Briefcase,
  Tag,
  FileText,
} from 'lucide-react';
import { useLazyGetUserProfileQuery } from '../store/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

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
          setUserDetails({
            ...response.data,
            // Ensure subscription is always defined
            subscription: response.data.subscription || {
              planTitle: 'None',
              billing: 'None',
              status: 'INACTIVE',
              startDate: null,
            },
          });
          localStorage.setItem('userDetails', JSON.stringify({
            ...response.data,
            subscription: response.data.subscription || {
              planTitle: 'None',
              billing: 'None',
              status: 'INACTIVE',
              startDate: null,
            },
          }));
        } else {
          throw new Error(response.message || 'Failed to fetch user profile');
        }
      } catch (error) {
        const savedData = localStorage.getItem('userDetails');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setUserDetails({
            ...parsedData,
            subscription: parsedData.subscription || {
              planTitle: 'None',
              billing: 'None',
              status: 'INACTIVE',
              startDate: null,
            },
          });
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
            uniqueIdentifier: '@example.com',
            subscription: {
              planTitle: 'None',
              billing: 'None',
              status: 'INACTIVE',
              startDate: null,
            },
            payments: [],
            paymentSummary: { totalPayments: 0, totalAmountPaid: 0, successfulPayments: 0 },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'ACTIVE':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'FAILED':
      case 'CANCELLED':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'INACTIVE':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-t-4 border-blue-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Back
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Secure Profile</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="w-32 h-32 mx-auto relative flex items-center justify-center">
                  <img
                    src={userDetails.logo || 'https://via.placeholder.com/128'}
                    alt="Profile Logo"
                    className="w-full h-full rounded-full object-cover shadow-lg"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/128')}
                  />
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userDetails.userName}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{userDetails.companyName}</p>
                  {userDetails.bio && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{userDetails.bio}</p>
                  )}
                </div>
                <motion.button
                  onClick={handleEdit}
                  className="mt-6 w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </motion.button>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{userDetails.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {userDetails.countryCode} {userDetails.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{userDetails.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Indent className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">@{userDetails.uniqueIdentifier}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <a
                    href={userDetails.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    {userDetails.websiteUrl}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{userDetails.role}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Company Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                  Company Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Company Name</h4>
                  <p className="mt-1 text-gray-900 dark:text-white">{userDetails.companyName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Target Market</h4>
                  <p className="mt-1 text-gray-900 dark:text-white">{userDetails.targetMarket}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Services</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userDetails.services.map((service: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Key Products</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userDetails.keyProducts.map((product: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <Box className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                  Product Categories
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userDetails.productCategories.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg flex items-start space-x-4 bg-gray-50 dark:bg-gray-700"
                  >
                    {item.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={`${item.productName} Image`}
                          className="w-16 h-16 rounded-lg object-cover shadow-md"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64')}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white">{item.category}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.productName}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Subscription Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <Tag className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                  Subscription Details
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Plan:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                      {userDetails.subscription.planTitle}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Billing:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1 capitalize">
                      {userDetails.subscription.billing}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ml-1 ${getStatusColor(
                        userDetails.subscription.status
                      )}`}
                    >
                      {userDetails.subscription.status}
                    </span>
                  </div>
                </div>
                {userDetails.subscription.startDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date:</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                        {format(new Date(userDetails.subscription.startDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                  Payment Summary
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payments:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                      {userDetails.paymentSummary.totalPayments}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount Paid:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                      ₹{userDetails.paymentSummary.totalAmountPaid}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Successful Payments:
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                      {userDetails.paymentSummary.successfulPayments}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                  Payment History
                </h3>
              </div>
              <div className="space-y-4">
                {userDetails.payments.slice(0, 3).map((payment: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {payment.planTitle} ({payment.billing})
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Transaction ID: {payment.transactionId}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{payment.amount}
                        </span>
                        <span
                          className={`block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {userDetails.payments.length > 3 && (
                  <motion.button
                    onClick={() => navigate('/payment-history')}
                    className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View All Payments
                  </motion.button>
                )}
                {userDetails.payments.length === 0 && (
                  <p className="text-gray-600 dark:text-gray-400 text-center">No payments found.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;