import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Custom error class for Supabase operations
export class SupabaseOperationError extends Error {
  constructor(
    message: string,
    public originalError: any,
    public operation: string
  ) {
    super(message);
    this.name = 'SupabaseOperationError';
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Message Functions
export const saveGeneratedMessage = async (
  userId: string,
  resumeId: string,
  content: string,
  messageType: string,
  recipientUrl?: string
) => {
  try {
    const { data, error } = await supabase
      .from('generated_messages')
      .insert({
        user_id: userId,
        resume_id: resumeId,
        content,
        message_type: messageType,
        recipient_url: recipientUrl,
        is_starred: false
      })
      .select()
      .single();

    if (error) {
      throw new SupabaseOperationError(
        'Failed to save message',
        error,
        'saveGeneratedMessage'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof SupabaseOperationError) {
      throw error;
    }
    throw new SupabaseOperationError(
      'Failed to save message',
      error,
      'saveGeneratedMessage'
    );
  }
};

// Resume Functions
export const createResume = async (
  userId: string,
  content: string,
  filePath?: string
) => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        content,
        file_path: filePath,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new SupabaseOperationError(
        'Failed to create resume',
        error,
        'createResume'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof SupabaseOperationError) {
      throw error;
    }
    throw new SupabaseOperationError(
      'Failed to create resume',
      error,
      'createResume'
    );
  }
};

export const getUserSavedMessages = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('generated_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new SupabaseOperationError(
        'Failed to load messages',
        error,
        'getUserSavedMessages'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof SupabaseOperationError) {
      throw error;
    }
    throw new SupabaseOperationError(
      'Failed to load messages',
      error,
      'getUserSavedMessages'
    );
  }
};

export const toggleMessageStar = async (messageId: string, isStarred: boolean) => {
  try {
    const { error } = await supabase
      .from('generated_messages')
      .update({ is_starred: isStarred })
      .eq('id', messageId);

    if (error) {
      throw new SupabaseOperationError(
        'Failed to update message',
        error,
        'toggleMessageStar'
      );
    }
  } catch (error) {
    if (error instanceof SupabaseOperationError) {
      throw error;
    }
    throw new SupabaseOperationError(
      'Failed to update message',
      error,
      'toggleMessageStar'
    );
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const { error } = await supabase
      .from('generated_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      throw new SupabaseOperationError(
        'Failed to delete message',
        error,
        'deleteMessage'
      );
    }
  } catch (error) {
    if (error instanceof SupabaseOperationError) {
      throw error;
    }
    throw new SupabaseOperationError(
      'Failed to delete message',
      error,
      'deleteMessage'
    );
  }
};

// Job Application Functions
export const getJobApplications = async (userId: string) => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*, generated_messages(*)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addJobApplication = async (
  userId: string,
  application: {
    company: string;
    position: string;
    status: 'sent' | 'awaiting' | 'follow-up' | 'rejected';
    notes?: string;
    message_id?: string;
  }
) => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      user_id: userId,
      ...application,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateJobApplication = async (
  applicationId: string,
  updates: {
    status?: 'sent' | 'awaiting' | 'follow-up' | 'rejected';
    notes?: string;
    last_follow_up?: string;
    next_follow_up?: string;
  }
) => {
  const { data, error } = await supabase
    .from('job_applications')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteJobApplication = async (applicationId: string) => {
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', applicationId);

  if (error) throw error;
};

// Analytics Functions
export const getUserStats = async (userId: string) => {
  const [messages, applications] = await Promise.all([
    supabase
      .from('generated_messages')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
  ]);

  if (messages.error) throw messages.error;
  if (applications.error) throw applications.error;

  const totalMessages = messages.data.length;
  const totalApplications = applications.data.length;
  const responseRate = applications.data.filter(
    app => app.status === 'awaiting' || app.status === 'follow-up'
  ).length / totalApplications * 100;

  return {
    messagesCreated: totalMessages,
    applicationsSent: totalApplications,
    responseRate: responseRate || 0
  };
};

// Real-time subscriptions
export const subscribeToJobApplications = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('job_applications_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'job_applications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToUserActivities = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('user_activities_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_activities',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToPromptHistory = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('prompt_history_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'prompt_history',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

// Activity Tracking Functions
export const logUserActivity = async (
  userId: string,
  activityType: string,
  details: Record<string, any> = {}
) => {
  const { error } = await supabase
    .from('user_activities')
    .insert({
      user_id: userId,
      activity_type: activityType,
      details,
      version: '1.0'
    });

  if (error) throw error;
};

// Prompt History Functions
export const getPromptHistory = async (
  userId: string,
  options: {
    category?: string;
    tags?: string[];
    limit?: number;
  } = {}
) => {
  let query = supabase
    .from('prompt_history')
    .select('*')
    .eq('user_id', userId);

  if (options.category) {
    query = query.eq('category', options.category);
  }

  if (options.tags && options.tags.length > 0) {
    query = query.contains('tags', options.tags);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};