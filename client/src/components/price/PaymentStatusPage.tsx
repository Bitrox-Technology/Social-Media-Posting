import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { usePhonePeCheckStatusMutation, useLazyGetPaymentQuery } from '../../store/api';
import { socketURL } from '../../constants/urls';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  CreditCard,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  Receipt,
  Shield,
  Lock,
} from 'lucide-react';
import { format } from 'date-fns';

interface PaymentStatusData {
  status: string;
  subscriptionStatus?: string;
}

interface Payment {
  _id: string;
  transactionId: string;
  merchantOrderId: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  planTitle: string;
  billing: 'monthly' | 'annual';
  phone: string;
  name: string;
  email: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  paymentDetails?: {
    orderId: string;
    state: string;
    amount: number;
    expireAt: number;
    metaInfo: {
      planTitle: string;
      billing: string;
    };
    paymentDetails: {
      paymentMode: string;
      transactionId: string;
      timestamp: number;
      amount: number;
      state: string;
      splitInstruments: {
        amount: number;
        rail: {
          type: string;
          transactionId: string;
          authorizationCode: string;
          serviceTransactionId: string;
        };
        instrument: {
          type: string;
          bankTransactionId: string;
          bankId: string;
          arn: string;
          brn: string;
        };
      }[];
    }[];
  };
}

const socket = io(socketURL, { withCredentials: true });

const PaymentStatusPage = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [subscriptionStatus, setSubscriptionStatus] = useState('PENDING');
  const [payment, setPayment] = useState<Payment | null>(null);
  const [checkStatus] = usePhonePeCheckStatusMutation();
  const [getPayment, { isLoading: paymentLoading, error: paymentError }] = useLazyGetPaymentQuery();
  const { isOpen, config, showAlert, closeAlert } = useAlert();
  const hasShownAlert = useRef(false);
  const hasCheckedStatus = useRef(false);

  // Fetch payment details
  const fetchPayment = async () => {
    if (!transactionId) return;
    try {
      const response = await getPayment({transactionId}).unwrap();
      setPayment(response.data);
    } catch (err) {
      showAlert({
        type: 'error',
        title: 'Failed to Load Payment',
        message: 'Unable to fetch payment details. Please try again.',
      });
    }
  };
const verifyStatus = async () => {
      if (hasCheckedStatus.current || !transactionId) return;
      hasCheckedStatus.current = true;

      try {
        const response = await checkStatus({ transactionId }).unwrap();
        const status = response.data.result.state || 'PENDING';
        setPaymentStatus(status);
        setSubscriptionStatus(response.data.result.subscriptionStatus || 'PENDING');

        if (hasShownAlert.current) return;

        if (status === 'COMPLETED') {
          hasShownAlert.current = true;
          showAlert({
            type: 'success',
            title: 'Payment Successful!',
            message: 'Your subscription is now active. Redirecting to dashboard...',
          });
        } else if (status === 'FAILED' || status === 'CANCELLED') {
          hasShownAlert.current = true;
          showAlert({
            type: 'error',
            title: 'Payment Failed',
            message: 'Your payment was not successful. Please try again or contact support.',
          });
        }
      } catch (err: any) {
        if (!hasShownAlert.current) {
          hasShownAlert.current = true;
          showAlert({
            type: 'error',
            title: 'Status Check Failed',
            message: err?.data?.message || 'Unable to verify payment status.',
          });
        }
      }
    };
  useEffect(() => {
    if (!transactionId) {
      showAlert({
        type: 'error',
        title: 'Invalid Transaction',
        message: 'Transaction ID is missing. Please try again.',
      });
      setTimeout(() => navigate('/pricing'), 3000);
      return;
    }

    fetchPayment();
    socket.emit('joinTransaction', transactionId);

    const handlePaymentStatus = async (data: PaymentStatusData) => {
      if (hasShownAlert.current) return;

      setPaymentStatus(data.status);
      setSubscriptionStatus(data.subscriptionStatus || 'PENDING');

      if (data.status === 'COMPLETED') {
        hasShownAlert.current = true;
        showAlert({
          type: 'success',
          title: 'Payment Successful!',
          message: 'Your subscription is now active. Redirecting to dashboard...',
        });

      } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
        hasShownAlert.current = true;
        showAlert({
          type: 'error',
          title: 'Payment Failed',
          message: 'Your payment was not successful. Please try again or contact support.',
        });
      }

      try {
        await checkStatus({ transactionId }).unwrap();
        await fetchPayment();
      } catch (err) {
        if (!hasShownAlert.current) {
          hasShownAlert.current = true;
          showAlert({
            type: 'error',
            title: 'Status Check Failed',
            message: 'Unable to verify payment status.',
          });
        }
      }
    };

    socket.on('paymentStatus', handlePaymentStatus);

    

    verifyStatus();

    return () => {
      socket.off('paymentStatus', handlePaymentStatus);
      hasShownAlert.current = false;
      hasCheckedStatus.current = false;
    };
  }, [transactionId, checkStatus, navigate, getPayment]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'PENDING':
        return <Clock className="w-12 h-12 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'FAILED':
      case 'CANCELLED':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

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
                <span className="text-sm text-gray-600 dark:text-gray-300">Secure Transaction</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {paymentLoading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading payment details...</p>
            </div>
          ) : paymentError ? (
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Payment</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Unable to fetch payment details. Please try again.</p>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Pricing
              </button>
            </div>
          ) : !payment ? (
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Payment Found</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">No payment found for this transaction.</p>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Pricing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Payment Status and Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-center mb-6"
                    >
                      {getStatusIcon(paymentStatus)}
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Payment Status
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Transaction ID: {payment.transactionId}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Payment Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(paymentStatus)}`}>
                        {paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Subscription Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionStatus)}`}>
                        {subscriptionStatus}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Amount:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">₹{payment.amount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Plan:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{payment.planTitle} ({payment.billing})</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Name:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{payment.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Email:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{payment.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Phone:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{payment.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Date:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {paymentStatus === 'PENDING' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400 mt-6"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing your payment...</span>
                    </motion.div>
                  )}

                  {paymentStatus === 'COMPLETED' && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Go to Dashboard
                    </motion.button>
                  )}

                  {(paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => navigate('/pricing')}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Try Again
                    </motion.button>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Secure Transaction
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        Your payment was processed securely through PhonePe. All transaction details are encrypted and protected.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Transaction Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <Receipt className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Transaction Details
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Receipt className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Merchant Order ID:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{payment.merchantOrderId}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Updated At:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                          {format(new Date(payment.updatedAt), 'MMM dd, yyyy HH:mm:ss')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {payment.paymentDetails && (
                    <>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-4">
                        <div className="flex items-center space-x-3">
                          <Receipt className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Order ID:</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{payment.paymentDetails.orderId}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">State:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ml-1 ${getStatusColor(payment.paymentDetails.state)}`}>
                              {payment.paymentDetails.state}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Amount:</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">₹{payment.paymentDetails.amount / 100}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Expires At:</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                              {format(new Date(payment.paymentDetails.expireAt), 'MMM dd, yyyy HH:mm:ss')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {payment.paymentDetails.paymentDetails?.map((detail, index) => (
                        <div key={index} className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-4">
                          <h4 className="text-md font-semibold text-gray-900 dark:text-white flex items-center">
                            <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                            Payment Method {index + 1}
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <CreditCard className="w-5 h-5 text-gray-500" />
                              <div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Payment Mode:</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{detail.paymentMode}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Receipt className="w-5 h-5 text-gray-500" />
                              <div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Transaction ID:</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{detail.transactionId}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Calendar className="w-5 h-5 text-gray-500" />
                              <div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Timestamp:</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                                  {format(new Date(detail.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <DollarSign className="w-5 h-5 text-gray-500" />
                              <div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Amount:</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">₹{detail.amount / 100}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">State:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ml-1 ${getStatusColor(detail.state)}`}>
                                  {detail.state}
                                </span>
                              </div>
                            </div>
                          </div>

                          {detail.splitInstruments.map((instrument, idx) => (
                            <div key={idx} className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4 space-y-4">
                              <h5 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                                <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                                Split Instrument {idx + 1}
                              </h5>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                  <DollarSign className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Amount:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">₹{instrument.amount / 100}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Receipt className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Rail Type:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{instrument.rail.type}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Receipt className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Rail Transaction ID:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{instrument.rail.transactionId}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Receipt className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Authorization Code:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{instrument.rail.authorizationCode || 'N/A'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Receipt className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Service Transaction ID:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{instrument.rail.serviceTransactionId}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <CreditCard className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Instrument Type:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{instrument.instrument.type}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Receipt className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Bank Transaction ID:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{instrument.instrument.bankTransactionId || 'N/A'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <CreditCard className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Bank ID:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{instrument.instrument.bankId}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Receipt className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">ARN:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{instrument.instrument.arn || 'N/A'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Receipt className="w-5 h-5 text-gray-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">BRN:</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">{instrument.instrument.brn || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
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
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Alert
        isOpen={isOpen}
        type={config.type}
        title={config.title}
        message={config.message}
        onClose={closeAlert}
      />
    </>
  );
};

export default PaymentStatusPage;