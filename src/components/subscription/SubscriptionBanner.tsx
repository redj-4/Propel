import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStripe } from '../../lib/hooks/useStripe';
import Button from '../common/Button';
import { Zap } from 'lucide-react';

interface SubscriptionBannerProps {
  messagesLeft?: number;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ messagesLeft }) => {
  const { user } = useAuth();
  const { startCheckout, loading } = useStripe(user?.id || null);

  const handleUpgrade = async () => {
    await startCheckout('price_pro'); // Replace with your actual Stripe price ID
  };

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            {messagesLeft !== undefined ? (
              <>
                {messagesLeft} message{messagesLeft !== 1 ? 's' : ''} remaining today
              </>
            ) : (
              'Upgrade to Pro'
            )}
          </h3>
          <p className="text-primary-600">
            Get unlimited AI-powered messages and advanced features
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleUpgrade}
          isLoading={loading}
          icon={Zap}
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionBanner;