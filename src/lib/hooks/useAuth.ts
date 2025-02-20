/**
 * Custom hook for authentication state and operations
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth.service';
import { GUEST_MESSAGE_LIMIT } from '../constants';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [guestMessagesLeft, setGuestMessagesLeft] = useState(GUEST_MESSAGE_LIMIT);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    AuthService.getSession().then(session => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await AuthService.signIn(email, password);
    setIsGuest(false);
    navigate('/app');
  };

  const signUp = async (email: string, password: string) => {
    await AuthService.signUp(email, password);
    setIsGuest(false);
    navigate('/app');
  };

  const signOut = async () => {
    await AuthService.signOut();
    setIsGuest(false);
    setGuestMessagesLeft(GUEST_MESSAGE_LIMIT);
    navigate('/');
  };

  const decrementGuestMessages = () => {
    if (isGuest) {
      setGuestMessagesLeft(prev => Math.max(0, prev - 1));
    }
  };

  return {
    user,
    loading,
    isGuest,
    setIsGuest,
    guestMessagesLeft,
    decrementGuestMessages,
    signIn,
    signUp,
    signOut
  };
};