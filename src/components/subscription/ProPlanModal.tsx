import React from 'react';
import { X, Check, Zap } from 'lucide-react';
import Button from '../common/Button';
import { SubscriptionService } from '../../lib/services/subscription.service';
import { toast } from 'react-hot-toast';

interface ProPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ProPlanModal: React.FC<ProPlanModalProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const handleUpgrade = async () => {
    try {
      const checkoutUrl = await SubscriptionService.createCheckoutSession(userId);
      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error('Failed to start checkout process');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-accent-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upgrade to Pro
          </h2>
          <p className="text-gray-600">
            Unlock unlimited AI-powered message generation and advanced features
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {[
            'Unlimited AI message generation',
            'Advanced resume analysis',
            'Priority response time',
            'Save & edit message history',
            'Premium templates',
            'Advanced AI customization',
            'Industry-specific optimization',
            'LinkedIn outreach tools'
          ].map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="w-5 h-5 text-accent-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            $9
            <span className="text-lg text-gray-600 font-normal">/month</span>
          </div>
          <p className="text-sm text-gray-500">
            Cancel anytime • No commitment required
          </p>
        </div>

        <Button
          variant="primary"
          className="w-full"
          onClick={handleUpgrade}
        >
          Upgrade Now
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          By upgrading, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default ProPlanModal;