import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../supabase';
import { ERROR_MESSAGES } from '../constants/stripe';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export class StripeService {
  /**
   * Create a checkout session for subscription
   */
  static async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string = `${window.location.origin}/dashboard?success=true`,
    cancelUrl: string = `${window.location.origin}/pricing`
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          userId,
          priceId,
          successUrl,
          cancelUrl
        }
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Checkout session creation failed:', error);
      throw new Error(ERROR_MESSAGES.PAYMENT.CHECKOUT_FAILED);
    }
  }

  /**
   * Create a billing portal session
   */
  static async createPortalSession(
    userId: string,
    returnUrl: string = `${window.location.origin}/dashboard`
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          userId,
          returnUrl
        }
      });

      if (error) throw error;
      return data.url;
    } catch (error) {
      console.error('Portal session creation failed:', error);
      throw new Error(ERROR_MESSAGES.PAYMENT.PORTAL_FAILED);
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscription(userId: string) {
    const { data, error } = await supabase
      .from('stripe_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  }

  /**
   * Check if user has active subscription
   */
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getSubscription(userId);
    if (!subscription) return false;

    return (
      subscription.status === 'active' &&
      new Date(subscription.current_period_end) > new Date()
    );
  }

  /**
   * Get subscription status
   */
  static async getSubscriptionStatus(userId: string) {
    const { data, error } = await supabase
      .from('stripe_subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { status: 'free' };
      }
      throw error;
    }

    return data;
  }

  /**
   * Get billing history
   */
  static async getBillingHistory(userId: string) {
    const { data, error } = await supabase
      .from('stripe_invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}