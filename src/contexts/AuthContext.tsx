import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isGuest: boolean;
  setIsGuest: (value: boolean) => void;
  guestMessagesLeft: number;
  decrementGuestMessages: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_MESSAGE_LIMIT = 2;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [guestMessagesLeft, setGuestMessagesLeft] = useState(GUEST_MESSAGE_LIMIT);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setIsGuest(false);
      navigate('/app');
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;

      // Wait a moment for the trigger to create the user record
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsGuest(false);
      navigate('/app');
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsGuest(false);
      setGuestMessagesLeft(GUEST_MESSAGE_LIMIT);
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const decrementGuestMessages = () => {
    if (isGuest) {
      setGuestMessagesLeft(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        signIn, 
        signUp, 
        signOut, 
        loading,
        isGuest,
        setIsGuest,
        guestMessagesLeft,
        decrementGuestMessages
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}