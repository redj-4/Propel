/**
 * Authentication service for managing user sessions
 */

import { supabase } from '../supabase';
import { User } from '../types';
import { ERROR_MESSAGES } from '../constants';

export class AuthService {
  /**
   * Sign in with email and password
   * @throws {Error} If authentication fails
   */
  static async signIn(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
      }
      throw error;
    }
  }

  /**
   * Sign up with email and password
   * @throws {Error} If registration fails
   */
  static async signUp(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error(ERROR_MESSAGES.AUTH.EMAIL_IN_USE);
      }
      throw error;
    }
  }

  /**
   * Sign out current user
   * @throws {Error} If sign out fails
   */
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get current session
   */
  static async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Subscribe to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}