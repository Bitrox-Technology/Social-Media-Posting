import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Plan {
  title: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  notIncluded?: string[];
  isPopular?: boolean;
}

const PricingToggle: React.FC<{
  isAnnual: boolean;
  setIsAnnual: (value: boolean) => void;
}> = ({ isAnnual, setIsAnnual }) => {
  return (
    <div className="flex items-center justify-center space-x-3 mb-10">
      <span
        className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
          }`}
      >
        Monthly
      </span>
      <button
        onClick={() => setIsAnnual(!isAnnual)}
        className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none"
      >
        <span className="sr-only">Toggle billing period</span>
        <span
          className={`${isAnnual ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-primary-600 transition-transform duration-200`}
        />
      </button>
      <span
        className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
          }`}
      >
        Annual <span className="text-secondary-500 ml-1">Save 20%</span>
      </span>
    </div>
  );
};

const PricingSection: React.FC = () => {
  const navigate = useNavigate()
  const [isAnnual, setIsAnnual] = useState(true);

  const plans: Plan[] = [
    {
      title: 'Starter',
      price: { monthly: 29, annual: 24 },
      description: 'Perfect for individuals and small creators',
      features: [
        'AI content generation (20/month)',
        'Basic analytics',
        'Single platform support',
        'Content calendar',
        'Email support',
      ],
      notIncluded: ['Image generation', 'Auto responses', 'Team collaboration'],
    },
    {
      title: 'Professional',
      price: { monthly: 79, annual: 64 },
      description: 'Ideal for growing creators and small businesses',
      features: [
        'AI content generation (100/month)',
        'AI image generation (50/month)',
        'Advanced analytics',
        'Multi-platform support (3)',
        'Content calendar',
        'Auto responses',
        'Priority support',
      ],
      notIncluded: ['Team collaboration'],
      isPopular: true,
    },
    {
      title: 'Business',
      price: { monthly: 149, annual: 119 },
      description: 'For established businesses and agencies',
      features: [
        'Unlimited AI content generation',
        'Unlimited AI image generation',
        'Premium analytics with reports',
        'Multi-platform support (unlimited)',
        'Content calendar',
        'Auto responses',
        'Team collaboration (5 members)',
        'Dedicated account manager',
      ],
    },
  ];

  interface HandleClickPlan {
    title: string;
    price: { monthly: number; annual: number };
    description: string;
    features: string[];
    notIncluded?: string[];
    isPopular?: boolean;
  }

  console.log("Plans ============", plans, isAnnual)

  const handleClick = (plan: HandleClickPlan): void => {
    console.log(plan.title, isAnnual);
    navigate(`/payment/${plan.title}?billing=${isAnnual ? 'annual' : 'monthly'}`);
  };

  return (
    <section id="pricing" className="py-16 bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent <span className="text-primary-600 dark:text-primary-400">Pricing</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that best fits your needs. All plans include core features to help you grow your social media presence.
          </p>
        </div>

        <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${plan.isPopular
                ? 'border-2 border-secondary-500 dark:border-secondary-400 relative'
                : 'border border-gray-200 dark:border-gray-700'
                }`}
            >
              {plan.isPopular && (
                <div className="bg-secondary-500 text-white text-xs uppercase font-bold py-1 px-4 absolute top-0 right-0 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 h-12">{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
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
                  onClick={() => handleClick(plan)}
                  className={`w-full block text-center py-3 px-4 rounded-lg transition-colors duration-200 font-medium ${plan.isPopular
                    ? 'bg-secondary-500 hover:bg-secondary-600 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                >
                  Get Started
                </button>
                <div className="space-y-3 mt-6">
                  {plan.features.map((feature, index) => (
                    <div className="flex items-center" key={index}>
                      <Check className="h-5 w-5 text-accent-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded?.map((feature, index) => (
                    <div className="flex items-center" key={index}>
                      <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Need a custom solution?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Contact us for enterprise plans and custom solutions tailored to your specific needs.
          </p>
          <Link
            to="#contact"
            className="inline-flex items-center py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;