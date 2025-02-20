import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  message_type?: string;
  created_at: string;
}

interface ChatSession {
  id: string;
  status: string;
  current_step: string;
  context: Record<string, any>;
  resume_id?: string;
}

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadOrCreateSession();
    }
  }, [user]);

  const loadOrCreateSession = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Try to find an active session
      const { data: existingSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle(); // Use maybeSingle instead of single to avoid error

      if (sessionError) throw sessionError;

      if (existingSession) {
        setSession(existingSession);
        await loadMessages(existingSession.id);
      } else {
        // Create new session
        const { data: newSession, error: createError } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            status: 'active',
            current_step: 'intro',
            context: {}
          })
          .select()
          .single();

        if (createError) throw createError;
        setSession(newSession);
      }
    } catch (error) {
      console.error('Session error:', error);
      toast.error('Failed to initialize chat session');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Messages error:', error);
      toast.error('Failed to load chat messages');
    }
  };

  const sendMessage = async (content: string, role: 'user' | 'assistant' = 'user', type?: string) => {
    if (!user || !session) return;

    setLoading(true);
    try {
      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: session.id,
          user_id: user.id,
          role,
          content,
          message_type: type
        })
        .select()
        .single();

      if (error) throw error;
      setMessages(prev => [...prev, message]);

      // Update session context if it's a user message
      if (role === 'user') {
        const { error: updateError } = await supabase
          .from('chat_sessions')
          .update({
            context: {
              ...session.context,
              lastUserMessage: content
            }
          })
          .eq('id', session.id);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const updateContext = async (newContext: Record<string, any>) => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({
          context: {
            ...session.context,
            ...newContext
          }
        })
        .eq('id', session.id);

      if (error) throw error;
      setSession(prev => prev ? {
        ...prev,
        context: {
          ...prev.context,
          ...newContext
        }
      } : null);
    } catch (error) {
      console.error('Context update error:', error);
      toast.error('Failed to update chat context');
    }
  };

  const updateStep = async (step: string) => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ current_step: step })
        .eq('id', session.id);

      if (error) throw error;
      setSession(prev => prev ? { ...prev, current_step: step } : null);
    } catch (error) {
      console.error('Step update error:', error);
      toast.error('Failed to update chat step');
    }
  };

  const resetSession = async () => {
    if (!user) return;

    try {
      // Close current session
      if (session) {
        await supabase
          .from('chat_sessions')
          .update({ status: 'completed' })
          .eq('id', session.id);
      }

      // Create new session
      const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          status: 'active',
          current_step: 'intro',
          context: {}
        })
        .select()
        .single();

      if (error) throw error;
      setSession(newSession);
      setMessages([]);
    } catch (error) {
      console.error('Reset session error:', error);
      toast.error('Failed to reset chat session');
    }
  };

  return {
    messages,
    session,
    loading,
    sendMessage,
    updateContext,
    updateStep,
    resetSession
  };
};