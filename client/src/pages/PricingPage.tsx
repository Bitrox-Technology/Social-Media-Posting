import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from '../components/hooks/useAlert';
import { Alert } from '../components/ui/Alert';
import { toast, ToastContainer } from 'react-toastify';
import { useCreateSubscriptionMutation } from '../store/api';
import { useAppDispatch } from '../store/hooks';
import { setCsrfToken } from '../store/appSlice';

interface Plan {
  title: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  notIncluded: string[];
  popular?: boolean;
}

const PricingToggle: React.FC<{
  isAnnual: boolean;
  setIsAnnual: (value: boolean) => void;
}> = ({ isAnnual, setIsAnnual }) => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-center space-x-3 mb-10">
      <span
        className={`text-sm font-medium ${
          !isAnnual
            ? theme === 'dark'
              ? 'text-white'
              : 'text-gray-900'
            : theme === 'dark'
            ? 'text-gray-400'
            : 'text-gray-500'
        }`}
      >
        Monthly
      </span>
      <button
        onClick={() => setIsAnnual(!isAnnual)}
        className={`relative inline-flex h-6 w-12 items-center rounded-full ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        } transition-colors duration-200 focus:outline-none`}
      >
        <span className="sr-only">Toggle billing period</span>
        <span
          className={`${
            isAnnual ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-blue-500 transition-transform duration-200`}
        />
      </button>
      <span
        className={`text-sm font-medium ${
          isAnnual
            ? theme === 'dark'
              ? 'text-white'
              : 'text-gray-900'
            : theme === 'dark'
            ? 'text-gray-400'
            : 'text-gray-500'
        }`}
      >
        Annual <span className="text-yellow-500 ml-1">Save 20%</span>
      </span>
    </div>
  );
};

export const Pricing = () => {
  const dispatch = useAppDispatch()
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const { isOpen, config, showAlert, closeAlert, handleConfirm, confirm } = useAlert();

  const plans: Plan[] = [
    {
      title: 'Starter',
      price: { monthly: 29, annual: 24 },
      description: 'Perfect for individuals and small creators',
      features: [
        '50 AI-generated posts per month',
        'Basic analytics',
        '2 social media platforms',
        'Standard templates',
        'Email support',
        'Basic scheduling',
      ],
      notIncluded: [
        'Custom templates',
        'Advanced analytics',
        'Priority support',
        'Team collaboration',
      ],
    },
    {
      title: 'Professional',
      price: { monthly: 79, annual: 64 },
      description: 'Ideal for growing creators and small businesses',
      features: [
        '200 AI-generated posts per month',
        'Advanced analytics',
        'All social media platforms',
        'Custom templates',
        'Priority support',
        'Advanced scheduling',
        'Team collaboration (up to 3)',
        'Content calendar',
      ],
      notIncluded: ['White-label reports', 'API access'],
      popular: true,
    },
    {
      title: 'Business',
      price: { monthly: 199, annual: 119 },
      description: 'For large organizations and agencies',
      features: [
        'Unlimited AI-generated posts',
        'Business analytics',
        'All social media platforms',
        'Custom templates',
        '24/7 priority support',
        'Advanced scheduling',
        'Unlimited team members',
        'Content calendar',
        'White-label reports',
        'API access',
        'Dedicated account manager',
      ],
      notIncluded: [],
    },
  ];

  const handleClick = (plan: Plan) => {
    const amount = isAnnual ? plan.price.annual * 12 : plan.price.monthly;
    confirm(
      `Subscribe to ${plan.title} Plan`,
      `Are you sure you want to subscribe to the ${plan.title} plan for ₹${amount} (${isAnnual ? 'annual' : 'monthly'})?`,
      async () => {
        try {
          const response = await createSubscription({
            planTitle: plan.title,
            billing: isAnnual ? 'annual' : 'monthly',
            amount,
          }).unwrap();
          dispatch(setCsrfToken({token: response.data.csrfToken, expiresAt: response.data.expiresAt}))
          if (response.success) {
            toast.success('Plan Selected! Proceeding to payment.');
            navigate(
              `/payment/${plan.title}?billing=${isAnnual ? 'annual' : 'monthly'}&subscriptionId=${response.data.user._id}`
            );
          }
        } catch (error) {
          showAlert({
            type: 'error',
            title: 'Subscription Failed',
            message:
              typeof error === 'object' &&
              error !== null &&
              'data' in error &&
              typeof (error as any).data?.message === 'string'
                ? (error as any).data.message
                : 'Failed to select plan.',
          });
        }
      }
    );
  };

  return (
    <>
      <div
        className={`min-h-screen ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
            : 'bg-gradient-to-br from-gray-100 via-gray-50 to-white text-gray-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-20">
            <motion.h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400'
                  : 'bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600'
              } mb-6`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p
              className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Choose the perfect plan for your social media needs
            </motion.p>
          </div>

          <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.title}
                className={`relative ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/70'
                    : 'bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50/90'
                } border ${
                  plan.popular ? 'border-yellow-400/50' : ''
                } rounded-xl p-6 transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 ${
                      theme === 'dark' ? 'bg-yellow-400 text-black' : 'bg-yellow-500 text-gray-900'
                    } px-4 py-1 rounded-full text-sm font-semibold`}
                  >
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {plan.title}
                  </h3>
                  <div className="flex items-center justify-center mb-2">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>₹</span>
                    <span className="text-4xl font-bold">
                      {isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
                  </div>
                  {isAnnual && (
                    <p className="text-sm text-yellow-500 mt-1">
                      Billed annually (₹{plan.price.annual * 12}/year)
                    </p>
                  )}
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    {plan.description}
                  </p>
                </div>
                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}
                      />
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <X
                        className={`w-5 h-5 flex-shrink-0 ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}
                      />
                      <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={() => handleClick(plan)}
                  disabled={isLoading}
                  className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? `${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400'
                            : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-gray-900 hover:from-yellow-400 hover:to-orange-500'
                        }`
                      : `${
                          theme === 'dark'
                            ? 'bg-blue-600 text-white hover:bg-blue-500'
                            : 'bg-blue-500 text-white hover:bg-blue-400'
                        }`
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Processing...' : 'Get Started'}
                </motion.button>
              </motion.div>
            ))}
          </div>
          <motion.div
            className={`mt-24 text-center ${
              theme === 'dark'
                ? 'bg-gray-800/30 backdrop-blur-sm border-gray-700/50'
                : 'bg-white/30 backdrop-blur-sm border-gray-200/50'
            } rounded-xl p-8 border`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Need a Custom Plan?
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Contact us for custom enterprise solutions tailored to your specific needs
            </p>
            <Link
              to="#contact"
              className={`${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400'
                  : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300'
              } text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center`}
            >
              Contact Sales
            </Link>
          </motion.div>
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
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
};