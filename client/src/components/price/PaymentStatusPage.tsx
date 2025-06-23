import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { usePhonePeCheckStatusMutation } from '../../store/api';
import { socketURL } from '../../constants/urls';

interface PaymentStatusData {
  status: string;
  subscriptionStatus?: string;
}

interface AlertConfig {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

const socket = io(socketURL, { withCredentials: true });

const PaymentStatusPage = () => {
  const { transactionId } = useParams<{ transactionId: string }>(); // Explicitly type transactionId
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [subscriptionStatus, setSubscriptionStatus] = useState('PENDING');
  const [checkStatus] = usePhonePeCheckStatusMutation();
  const { isOpen, config, showAlert, closeAlert } = useAlert();
  const hasShownAlert = useRef(false); // Prevent duplicate alerts
  const hasCheckedStatus = useRef(false); // Prevent multiple status checks

  useEffect(() => {
    if (!transactionId) {
      showAlert({
        type: 'error',
        title: 'Invalid Transaction',
        message: 'Transaction ID is missing. Please try again.',
      });
      setTimeout(() => navigate('/pricing'), 3000); // Redirect to pricing page
      return;
    }

    socket.emit('joinTransaction', transactionId);

    const handlePaymentStatus = async (data: PaymentStatusData) => {
      if (hasShownAlert.current) return; // Avoid duplicate updates

      setPaymentStatus(data.status);
      setSubscriptionStatus(data.subscriptionStatus || 'PENDING');

      if (data.status === 'COMPLETED') {
        hasShownAlert.current = true;
        showAlert({
          type: 'success',
          title: 'Payment Successful',
          message: 'Your subscription is now active. Redirecting to dashboard...',
        });
        setTimeout(() => navigate('/dashboard'), 3000);
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

    const verifyStatus = async () => {
      if (hasCheckedStatus.current || !transactionId) return;
      hasCheckedStatus.current = true;

      try {
        const response = await checkStatus({ transactionId }).unwrap();
        console.log('Response: ', response.data);

        // Adjust based on backend response (likely response.state)
        const status = response.data.result.state  || 'PENDING';
        setPaymentStatus(status);
        setSubscriptionStatus(response.data.result.subscriptionStatus || 'PENDING');

        if (hasShownAlert.current) return;

        if (status === 'COMPLETED') {
          hasShownAlert.current = true;
          showAlert({
            type: 'success',
            title: 'Payment Successful',
            message: 'Your subscription is now active. Redirecting to dashboard...',
          });
          setTimeout(() => navigate('/dashboard'), 3000);
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

    verifyStatus();

    return () => {
      socket.off('paymentStatus', handlePaymentStatus);
      hasShownAlert.current = false;
      hasCheckedStatus.current = false;
    };
  }, [transactionId, checkStatus, navigate]); // Removed showAlert from dependencies

  return (
    <>
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Payment Status</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Transaction ID: {transactionId || 'N/A'}</p>
        <p className="text-xl font-semibold">Payment Status: {paymentStatus}</p>
        <p className="text-xl font-semibold">Subscription Status: {subscriptionStatus}</p>
        {paymentStatus === 'PENDING' && (
          <p className="text-gray-500 mt-4">Processing your payment. Please wait...</p>
        )}
      </div>
      <Alert isOpen={isOpen} type={config.type} title={config.title} message={config.message} onClose={closeAlert} />
    </>
  );
};

export default PaymentStatusPage;