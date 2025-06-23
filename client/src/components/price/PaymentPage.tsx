import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAlert } from '../hooks/useAlert';
import { Alert } from '../ui/Alert';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { usePhonePeInitiatePaymentMutation, usePhonePeCheckStatusMutation } from '../../store/api';
import { socketURL } from '../../constants/urls';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setCsrfToken } from '../../store/appSlice';
import { useAppDispatch } from '../../store/hooks';

const socket = io(socketURL, { withCredentials: true });

const PaymentPage = () => {
  const dispatch = useAppDispatch()
  const { planTitle } = useParams();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const billing = search.get('billing');
  const subscriptionId = search.get('subscriptionId');
  const [transactionId] = useState(`TXN-${uuidv4()}`);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [subscriptionStatus, setSubscriptionStatus] = useState('PENDING');
  const [initiatePayment, { isLoading, error }] = usePhonePeInitiatePaymentMutation();
  const [checkStatus] = usePhonePeCheckStatusMutation();
  const { isOpen, config, showAlert, closeAlert, handleConfirm, confirm } = useAlert();

  type PlanTitle = 'Starter' | 'Professional' | 'Business';

  const plans: Record<PlanTitle, { monthly: number; annual: number }> = {
    Starter: { monthly: 29, annual: 24 },
    Professional: { monthly: 79, annual: 64 },
    Business: { monthly: 149, annual: 119 },
  };

  const isValidPlanTitle = (title: string | undefined): title is PlanTitle =>
    !!title && ['Starter', 'Professional', 'Business'].includes(title);

  const amount =
    isValidPlanTitle(planTitle)
      ? billing === 'annual'
        ? plans[planTitle].annual * 12
        : plans[planTitle].monthly
      : 0;

  // Formik setup with Yup validation
  const formik = useFormik({
    initialValues: {
      phone: '',
      name: '',
      email: '',
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number')
        .required('Phone number is required'),
      name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: () => {
      // Submission handled in handlePayment
    },
  });

  useEffect(() => {
    socket.emit('joinTransaction', transactionId);

    socket.on('paymentStatus', async (data) => {
      setPaymentStatus(data.status);
      setSubscriptionStatus(data.subscriptionStatus);
      if (data.status === 'COMPLETED') {
        showAlert({
          type: 'success',
          title: 'Payment Successful',
          message: 'Your subscription is now active.',
        });
      } else if (data.status === 'FAILED') {
        showAlert({
          type: 'error',
          title: 'Payment Failed',
          message: 'Please try again or contact support.',
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
  }, [transactionId, checkStatus, showAlert]);

  const handlePayment = async () => {
    // Validate form
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({ phone: true, name: true, email: true });
      showAlert({
        type: 'error',
        title: 'Form Validation Failed',
        message: 'Please correct the errors in the form.',
      });
      return;
    }

    confirm(
      'Confirm Payment',
      `Are you sure you want to pay $${amount} for the ${planTitle} plan (${billing})?`,
      async () => {
        try {
          if (!planTitle) {
            showAlert({
              type: 'error',
              title: 'Invalid Plan',
              message: 'Plan title is missing or invalid.',
            });
            return;
          }
          const response = await initiatePayment({
            amount,
            planTitle,
            billing: billing ?? '',
            phone: formik.values.phone,
            name: formik.values.name,
            email: formik.values.email,
            transactionId,
            subscriptionId: subscriptionId ?? '',
          }).unwrap();

          dispatch(setCsrfToken({token: response.data.csrfToken, expiresAt: response.data.expiresAt}))


          if (response.success) {
            toast.success('Redirecting to payment gateway');
            window.location.href = response.data.result.paymentUrl;
          }
        } catch (err) {
          showAlert({
            type: 'error',
            title: 'Payment Initiation Failed',
            message:
              typeof err === 'object' && err !== null && 'data' in err && typeof (err as any).data?.message === 'string'
                ? (err as any).data.message
                : 'Unable to initiate payment.',
          });
          setPaymentStatus('FAILED');
        }
      }
    );
  };

  return (
    <>
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Payment for {planTitle} Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Amount: ${amount} ({billing === 'annual' ? 'Annual' : 'Monthly'})
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...formik.getFieldProps('name')}
              className={`w-full p-2 border rounded dark:bg-gray-800 dark:text-white ${
                formik.touched.name && formik.errors.name ? 'border-red-500' : ''
              }`}
              placeholder="Enter your name"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className={`w-full p-2 border rounded dark:bg-gray-800 dark:text-white ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : ''
              }`}
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              {...formik.getFieldProps('phone')}
              className={`w-full p-2 border rounded dark:bg-gray-800 dark:text-white ${
                formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''
              }`}
              placeholder="Enter 10-digit phone number"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>
        </form>
        <button
          onClick={handlePayment}
          disabled={isLoading || paymentStatus !== 'PENDING'}
          className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </button>
        {error && (
          <p className="text-red-500 mt-4">
            {'data' in error && typeof error.data === 'object' && error.data && 'message' in error.data
              ? (error.data as { message?: string }).message || 'Payment failed'
              : 'Payment failed'}
          </p>
        )}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Payment Status: {paymentStatus}</h3>
          <h3 className="text-xl font-semibold">Subscription Status: {subscriptionStatus}</h3>
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