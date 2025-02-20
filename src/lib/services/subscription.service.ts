import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../supabase';
import { ERROR_MESSAGES } from '../constants';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export class SubscriptionService {
  /**
   * Check if user has reached their daily message limit
   */
  static async checkMessageLimit(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('usage_tracking')
      .select('message_count, last_reset')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record doesn't exist, create it
        await supabase
          .from('usage_tracking')
          .insert({
            user_id: userId,
            message_count: 0,
            last_reset: today
          });
        return false;
      }
      throw error;
    }

    // Reset count if it's a new day
    if (data.last_reset !== today) {
      await supabase
        .from('usage_tracking')
        .update({ message_count: 0, last_reset: today })
        .eq('user_id', userId);
      return false;
    }

    return data.message_count >= 5;
  }

  /**
   * Increment user's message count
   */
  static async incrementMessageCount(userId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_message_count', {
      user_id: userId
    });

    if (error) throw error;
  }

  /**
   * Create a Stripe checkout session
   */
  static async createCheckoutSession(userId: string): Promise<string> {
    const { data, error } = await supabase
      .functions.invoke('create-checkout-session', {
        body: { userId }
      });

    if (error) throw new Error(ERROR_MESSAGES.PAYMENT.CHECKOUT_FAILED);
    return data.url;
  }

  /**
   * Get user's subscription status
   */
  static async getSubscriptionStatus(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
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
   * Handle successful subscription
   */
  static async handleSubscriptionSuccess(sessionId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('handle-subscription-success', {
      body: { sessionId }
    });

    if (error) throw error;
  }
}