import { useState, useEffect, useCallback } from 'react';
import { StripeService } from '../services/stripe.service';
import { toast } from 'react-hot-toast';

export const useSubscription = (userId: string | null) => {
  const [isProMember, setIsProMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProModal, setShowProModal] = useState(false);
  const [billingHistory, setBillingHistory] = useState([]);

  useEffect(() => {
    if (userId) {
      loadSubscriptionStatus();
      loadBillingHistory();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadSubscriptionStatus = async () => {
    if (!userId) return;

    try {
      const status = await StripeService.getSubscriptionStatus(userId);
      setIsProMember(status.status === 'active');
    } catch (error) {
      console.error('Failed to load subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBillingHistory = async () => {
    if (!userId) return;

    try {
      const history = await StripeService.getBillingHistory(userId);
      setBillingHistory(history);
    } catch (error) {
      console.error('Failed to load billing history:', error);
    }
  };

  const handleUpgrade = useCallback(async () => {
    if (!userId) {
      toast.error('Please sign in to upgrade');
      return;
    }

    try {
      const checkoutUrl = await StripeService.createCheckoutSession(userId, 'price_pro');
      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error('Failed to start checkout process');
    }
  }, [userId]);

  const handleManageBilling = useCallback(async () => {
    if (!userId) {
      toast.error('Please sign in to manage billing');
      return;
    }

    try {
      const portalUrl = await StripeService.createPortalSession(userId);
      window.location.href = portalUrl;
    } catch (error) {
      toast.error('Failed to open billing portal');
    }
  }, [userId]);

  return {
    isProMember,
    loading,
    showProModal,
    setShowProModal,
    billingHistory,
    handleUpgrade,
    handleManageBilling
  };
};