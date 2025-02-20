/**
 * Core type definitions for the application
 */

export interface User {
  id: string;
  email: string | null;
  created_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_path: string | null;
  content: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  resume_id: string;
  content: string;
  message_type: MessageType;
  recipient_url?: string;
  created_at: string;
  is_starred: boolean;
}

export type MessageType = 'email' | 'cover-letter' | 'linkedin';

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  notes?: string;
  next_follow_up?: string;
  message?: {
    content: string;
    type: string;
  };
}

export type ApplicationStatus = 'sent' | 'awaiting' | 'follow-up' | 'rejected';