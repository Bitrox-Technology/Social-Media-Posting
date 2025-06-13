import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInitiatePaymentMutation } from '../../store/api';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/appSlice';
import { Check, X } from 'lucide-react';

declare global {
  interface Window {
    Paytm?: any;
  }
}

interface Plan {
  title: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  notIncluded?: string[];
  isPopular?: boolean;
}

interface PaytmPaymentProps {
  plan: Plan;
  isAnnual: boolean;
}

const PaytmPayment: React.FC<PaytmPaymentProps> = ({ plan, isAnnual }) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [initiatePayment, { data, isLoading, error }] = useInitiatePaymentMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!user) {
      setErrorMessage('Please sign in to proceed with payment.');
      navigate('/signin');
      return;
    }

    const paymentData = {
      orderId: `Order_${new Date().getTime()}`,
      amount: isAnnual ? plan.price.annual : plan.price.monthly,
      customerId: 'CUST_001',
      email: user?.email || 'user@example.com',
      mobileNumber:  '7777777777',
    };

    try {
      await initiatePayment(paymentData).unwrap();
    } catch (err: any) {
      setErrorMessage(err.data?.message || 'Failed to initiate payment. Please try again.');
    }
  };

  useEffect(() => {
    if (error) {
      const message = 'data' in error ? (error as any).data.message : 'An error occurred';
      setErrorMessage(message);
    }
  }, [error]);

  useEffect(() => {
    if (data && window.Paytm) {
      const config = {
        root: '',
        flow: 'DEFAULT',
        data: {
          orderId: data.data.result.orderId,
          token: data.data.result.txnToken,
          tokenType: 'TXN_TOKEN',
          amount: data.data.result.amount.toString(),
        },
        merchant: {
          mid: data.data.result.mid,
          redirect: false,
        },
        handler: {
          notifyMerchant: (eventName: string, data: any) => {
            console.log('notifyMerchant:', eventName, data);
            if (eventName === 'APP_CLOSED') {
              setErrorMessage(null);
            }
          },
          transactionStatus: (data: any) => {
            console.log('transactionStatus:', data);
            if (data.STATUS === 'TXN_SUCCESS') {
              alert('Payment Successful!');
              navigate('/payment/success', { state: { orderId: data.ORDERID } });
            } else {
              alert('Payment Failed or Pending!');
              navigate('/payment/failed');
            }
          },
        },
      };

      window.Paytm.CheckoutJS.init(config)
        .then(() => {
          window.Paytm.CheckoutJS.invoke();
        })
        .catch((error: any) => {
          console.error('Paytm Checkout Error:', error);
          setErrorMessage('Failed to load Paytm checkout. Please try again.');
        });
    } else if (data && !window.Paytm) {
      setErrorMessage('Paytm Checkout script not loaded. Please refresh the page or contact support.');
    }
  }, [data, navigate]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${isAnnual ? plan.price.annual : plan.price.monthly}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
        </div>
        {isAnnual && (
          <p className="text-sm text-secondary-500 mt-1">
            Billed annually (${plan.price.annual * 12}/year)
          </p>
        )}
      </div>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 font-medium ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
      <div className="mt-4 space-y-2">
        {plan.features.map((feature, index) => (
          <div className="flex items-center" key={index}>
            <Check className="h-5 w-5 text-accent-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
          </div>
        ))}
        {plan.notIncluded?.map((feature, index) => (
          <div className="flex items-center" key={index}>
            <X className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaytmPayment;