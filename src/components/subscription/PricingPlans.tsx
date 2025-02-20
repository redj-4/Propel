import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStripe } from '../../lib/hooks/useStripe';
import Button from '../common/Button';
import { CheckCircle2, Star } from 'lucide-react';

const plans = [
  {
    name: 'Free Trial',
    description: 'Perfect for exploring Propel\'s capabilities',
    price: '$0',
    period: '',
    features: [
      '2 AI-generated messages',
      'Basic resume analysis',
      'Standard response time',
      'Email & cover letter templates',
    ],
    priceId: null,
    highlighted: false
  },
  {
    name: 'Pro',
    description: 'Unlock your full career potential',
    price: '$9',
    period: '/month',
    features: [
      'Unlimited AI messages',
      'Advanced resume analysis',
      'Priority response time',
      'Save & edit message history',
      'Premium templates',
      'Advanced AI customization',
      'Industry-specific optimization',
      'LinkedIn outreach tools'
    ],
    priceId: 'price_pro', // Replace with your actual Stripe price ID
    highlighted: true
  },
  {
    name: 'Enterprise',
    description: 'For career centers & universities',
    price: 'Custom',
    period: '',
    features: [
      'Bulk student access',
      'Admin dashboard',
      'Usage analytics',
      'Custom AI training',
      'Career coach tools',
      'API access',
      'Priority support',
      'Custom integrations'
    ],
    priceId: null,
    highlighted: false
  }
];

const PricingPlans: React.FC = () => {
  const { user } = useAuth();
  const { startCheckout, loading } = useStripe(user?.id || null);

  const handleUpgrade = async (priceId: string | null) => {
    if (!priceId) return;
    await startCheckout(priceId);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan, index) => (
        <div
          key={index}
          className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
            plan.highlighted
              ? 'ring-2 ring-secondary-500 scale-105 md:scale-110'
              : ''
          }`}
        >
          {plan.highlighted && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
          )}

          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <p className="text-gray-600 mb-6">
              {plan.description}
            </p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-gray-600 ml-1">
                  {plan.period}
                </span>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-secondary-500 mr-3 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.highlighted ? 'primary' : 'secondary'}
              className="w-full"
              onClick={() => handleUpgrade(plan.priceId)}
              disabled={loading || !plan.priceId}
              isLoading={loading}
            >
              {plan.priceId ? 'Upgrade Now' : 'Contact Sales'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingPlans;