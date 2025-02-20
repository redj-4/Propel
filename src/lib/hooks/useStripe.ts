import { useState, useCallback } from 'react';
import { StripeService } from '../services/stripe.service';
import { toast } from 'react-hot-toast';

export const useStripe = (userId: string | null) => {
  const [loading, setLoading] = useState(false);

  const startCheckout = useCallback(async (
    priceId: string,
    successUrl: string = `${window.location.origin}/dashboard?success=true`,
    cancelUrl: string = `${window.location.origin}/pricing`
  ) => {
    if (!userId) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setLoading(true);
    try {
      const checkoutUrl = await StripeService.createCheckoutSession(
        userId,
        priceId,
        successUrl,
        cancelUrl
      );
      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error('Failed to start checkout process');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const openBillingPortal = useCallback(async (
    returnUrl: string = `${window.location.origin}/dashboard`
  ) => {
    if (!userId) {
      toast.error('Please sign in to manage your subscription');
      return;
    }

    setLoading(true);
    try {
      const portalUrl = await StripeService.createPortalSession(userId, returnUrl);
      window.location.href = portalUrl;
    } catch (error) {
      toast.error('Failed to open billing portal');
      console.error('Billing portal error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const checkSubscription = useCallback(async () => {
    if (!userId) return false;

    try {
      return await StripeService.hasActiveSubscription(userId);
    } catch (error) {
      console.error('Subscription check error:', error);
      return false;
    }
  }, [userId]);

  return {
    loading,
    startCheckout,
    openBillingPortal,
    checkSubscription
  };
};