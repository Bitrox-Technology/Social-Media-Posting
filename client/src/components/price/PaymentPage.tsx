import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PaytmPayment from './PaytmPayment';

type Plan = {
  title: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  notIncluded?: string[];
  isPopular?: boolean;
};

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
export const PaymentPage: React.FC = () => {
  const { planTitle } = useParams<{ planTitle: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isAnnual = queryParams.get('billing') === 'annual';

  const selectedPlan = plans.find(
    (plan) => plan.title.toLowerCase() === planTitle?.toLowerCase()
  );

  if (!selectedPlan) {
    return <div className="text-center py-16 text-red-500">Plan not found</div>;
  }

  return <PaytmPayment plan={selectedPlan} isAnnual={isAnnual} />;
};