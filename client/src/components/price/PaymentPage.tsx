import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { 
  usePhonePeInitiatePaymentMutation, 
  usePhonePeCheckStatusMutation,
  useLazyGetUserProfileQuery
} from '../../store/api';
import { socketURL } from '../../constants/urls';
import { setCsrfToken } from '../../store/appSlice';
import { useAppDispatch } from '../../store/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Lock,
  Star,
  Zap,
  Users,
  Loader2
} from 'lucide-react';

const socket = io(socketURL, { withCredentials: true });

const PaymentPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { planTitle } = useParams();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const billing = search.get('billing');
  const subscriptionId = search.get('subscriptionId');
  const [transactionId] = useState(`TXN-${uuidv4()}`);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [subscriptionStatus, setSubscriptionStatus] = useState('PENDING');
  const [isProcessing, setIsProcessing] = useState(false);
  const [initiatePayment, { isLoading, error }] = usePhonePeInitiatePaymentMutation();
  const [checkStatus] = usePhonePeCheckStatusMutation();
  const [getUserProfile, { isLoading: userLoading }] = useLazyGetUserProfileQuery();
  const { isOpen, config, showAlert, closeAlert, handleConfirm, confirm } = useAlert();
  type UserData = {
    phone?: string;
    userName?: string;
    email?: string;
  };
  
  const [userData, setUserData] = useState<UserData>({});

  type PlanTitle = 'Starter' | 'Professional' | 'Business';

  const plans: Record<PlanTitle, { 
    monthly: number; 
    annual: number;
    description: string;
    features: string[];
    icon: React.ReactNode;
  }> = {
    Starter: { 
      monthly: 29, 
      annual: 24,
      description: 'Perfect for individuals getting started',
      features: ['5 Projects', '10GB Storage', 'Basic Support', 'Core Features'],
      icon: <Zap className="w-6 h-6" />
    },
    Professional: { 
      monthly: 79, 
      annual: 64,
      description: 'Ideal for growing businesses',
      features: ['25 Projects', '100GB Storage', 'Priority Support', 'Advanced Features', 'Analytics'],
      icon: <Star className="w-6 h-6" />
    },
    Business: { 
      monthly: 149, 
      annual: 119,
      description: 'For large teams and enterprises',
      features: ['Unlimited Projects', '1TB Storage', '24/7 Support', 'All Features', 'Custom Integrations', 'Dedicated Manager'],
      icon: <Users className="w-6 h-6" />
    },
  };

  const isValidPlanTitle = (title: string | undefined): title is PlanTitle =>
    !!title && ['Starter', 'Professional', 'Business'].includes(title);

  const selectedPlan = isValidPlanTitle(planTitle) ? plans[planTitle] : null;
  const amount = selectedPlan
    ? billing === 'annual'
      ? selectedPlan.annual * 12
      : selectedPlan.monthly
    : 0;

  const savings = selectedPlan && billing === 'annual' 
    ? (selectedPlan.monthly * 12) - (selectedPlan.annual * 12)
    : 0;

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const response = await getUserProfile().unwrap();
      setUserData(response.data);
    } catch (err) {
      showAlert({
        type: 'error',
        title: 'Failed to Load User Data',
        message: 'Unable to fetch user profile. Please try again.',
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

 

  useEffect(() => {
    socket.emit('joinTransaction', transactionId);

    socket.on('paymentStatus', async (data) => {
      setPaymentStatus(data.status);
      setSubscriptionStatus(data.subscriptionStatus);
      setIsProcessing(false);
      
      if (data.status === 'COMPLETED') {
        showAlert({
          type: 'success',
          title: 'Payment Successful!',
          message: 'Your subscription is now active. Welcome aboard!',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else if (data.status === 'FAILED') {
        showAlert({
          type: 'error',
          title: 'Payment Failed',
          message: 'Please try again or contact our support team.',
        });
      }
      
      if (data.status === 'COMPLETED' || data.status === 'FAILED') {
        try {
          await checkStatus({ transactionId }).unwrap();
        } catch (err) {
          showAlert({
            type: 'error',
            title: 'Status Check Failed',
            message: 'Unable to verify payment status.',
          });
        }
      }
    });

    return () => {
      socket.off('paymentStatus');
    };
  }, [transactionId, checkStatus, showAlert, navigate]);

  const handlePayment = async () => {

    confirm(
      'Confirm Payment',
      `Are you sure you want to pay ₹${amount} for the ${planTitle} plan (${billing})?`,
      async () => {
        try {
          setIsProcessing(true);
          if (!planTitle) {
            showAlert({
              type: 'error',
              title: 'Invalid Plan',
              message: 'Plan title is missing or invalid.',
            });
            setIsProcessing(false);
            return;
          }
          
          const response = await initiatePayment({
            amount,
            planTitle,
            billing: billing ?? '',
            phone: userData?.phone || '',
            name: userData.userName || '',
            email: userData.email || '',
            transactionId,
            subscriptionId: subscriptionId ?? '',
          }).unwrap();

          dispatch(setCsrfToken({
            token: response.data.csrfToken,
            expiresAt: response.data.expiresAt
          }));

          if (response.success) {
            toast.success('Redirecting to secure payment gateway...');
            window.location.href = response.data.result.paymentUrl;
          }
        } catch (err) {
          setIsProcessing(false);
          showAlert({
            type: 'error',
            title: 'Payment Initiation Failed',
            message:
              typeof err === 'object' && err !== null && 'data' in err && typeof (err as any).data?.message === 'string'
                ? (err as any).data.message
                : 'Unable to initiate payment. Please try again.',
          });
          setPaymentStatus('FAILED');
        }
      }
    );
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading your information...</p>
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid Plan</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The selected plan could not be found.</p>
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Plan Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    {selectedPlan.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {planTitle} Plan
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedPlan.description}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹{billing === 'annual' ? selectedPlan.annual : selectedPlan.monthly}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      /{billing === 'annual' ? 'month' : 'month'}
                    </span>
                  </div>
                  {billing === 'annual' && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Save ₹{savings} annually
                      </span>
                    </div>
                  )}
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        {billing === 'annual' ? 'Annual Total' : 'Monthly Total'}
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ₹{amount}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    What's included:
                  </h3>
                  <ul className="space-y-3">
                    {selectedPlan.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Secure Payment Processing
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Your payment information is encrypted and processed securely through PhonePe. 
                      We never store your payment details on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-8">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Payment Information
                </h3>
              </div>

                <motion.button
                  type="button"
                  onClick={handlePayment}
                  disabled={isLoading || isProcessing || paymentStatus !== 'PENDING'}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading || isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay ₹{amount} Securely</span>
                    </>
                  )}
                </motion.button>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                    >
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-700 dark:text-red-300 text-sm">
                          {'data' in error && typeof error.data === 'object' && error.data && 'message' in error.data
                            ? (error.data as { message?: string }).message || 'Payment failed'
                            : 'Payment failed. Please try again.'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(paymentStatus !== 'PENDING' || subscriptionStatus !== 'PENDING') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Payment Status:
                        </span>
                        <span className={`text-sm font-semibold ${
                          paymentStatus === 'COMPLETED' ? 'text-green-600' :
                          paymentStatus === 'FAILED' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {paymentStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Subscription Status:
                        </span>
                        <span className={`text-sm font-semibold ${
                          subscriptionStatus === 'ACTIVE' ? 'text-green-600' :
                          subscriptionStatus === 'FAILED' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {subscriptionStatus}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  Powered by PhonePe - Secure Payment Gateway
                </p>
                <div className="flex justify-center items-center space-x-4 opacity-60">
                  <div className="text-xs text-gray-500">UPI</div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="text-xs text-gray-500">Cards</div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="text-xs text-gray-500">Net Banking</div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="text-xs text-gray-500">Wallets</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Alert
        isOpen={isOpen}
        type={config.type}
        title={config.title}
        message={config.message}
        onClose={closeAlert}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default PaymentPage;