export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          created_at: string;
          last_industry: string | null;
          preferences: {
            tone?: string;
            style?: string;
            length?: string;
          } | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          created_at?: string;
          last_industry?: string | null;
          preferences?: {
            tone?: string;
            style?: string;
            length?: string;
          } | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          created_at?: string;
          last_industry?: string | null;
          preferences?: {
            tone?: string;
            style?: string;
            length?: string;
          } | null;
        };
      };
      user_activities: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          details: Record<string, any>;
          created_at: string;
          status: string;
          version: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          details?: Record<string, any>;
          created_at?: string;
          status?: string;
          version?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          details?: Record<string, any>;
          created_at?: string;
          status?: string;
          version?: string | null;
        };
      };
      prompt_history: {
        Row: {
          id: string;
          user_id: string;
          prompt: string;
          response: string | null;
          created_at: string;
          category: string | null;
          tags: string[];
          version: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt: string;
          response?: string | null;
          created_at?: string;
          category?: string | null;
          tags?: string[];
          version?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt?: string;
          response?: string | null;
          created_at?: string;
          category?: string | null;
          tags?: string[];
          version?: string | null;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          file_path: string | null;
          content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_path?: string | null;
          content?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_path?: string | null;
          content?: string | null;
          created_at?: string;
        };
      };
      generated_messages: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          recipient_url: string | null;
          message_type: string | null;
          content: string | null;
          created_at: string;
          is_starred: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          recipient_url?: string | null;
          message_type?: string | null;
          content?: string | null;
          created_at?: string;
          is_starred?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string;
          recipient_url?: string | null;
          message_type?: string | null;
          content?: string | null;
          created_at?: string;
          is_starred?: boolean;
        };
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          position: string;
          status: 'sent' | 'awaiting' | 'follow-up' | 'rejected';
          created_at: string;
          updated_at: string;
          last_follow_up: string | null;
          next_follow_up: string | null;
          notes: string | null;
          message_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          position: string;
          status: 'sent' | 'awaiting' | 'follow-up' | 'rejected';
          created_at?: string;
          updated_at?: string;
          last_follow_up?: string | null;
          next_follow_up?: string | null;
          notes?: string | null;
          message_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          company?: string;
          position?: string;
          status?: 'sent' | 'awaiting' | 'follow-up' | 'rejected';
          created_at?: string;
          updated_at?: string;
          last_follow_up?: string | null;
          next_follow_up?: string | null;
          notes?: string | null;
          message_id?: string | null;
        };
      };
    };
  };
}