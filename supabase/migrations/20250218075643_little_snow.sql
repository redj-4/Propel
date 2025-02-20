/*
  # Enhanced Chat System Schema Update

  1. New Tables
    - `chat_sessions`
      - Tracks ongoing chat conversations
      - Stores context and state
    - `chat_messages`
      - Stores all messages in a chat session
      - Includes message type and content
    - `chat_context`
      - Stores persistent context for personalization
      - Includes resume data, preferences, etc.

  2. Changes
    - Add new columns to existing tables
    - Update RLS policies

  3. Security
    - Enable RLS on all new tables
    - Add appropriate access policies
*/

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  status text NOT NULL DEFAULT 'active',
  resume_id uuid REFERENCES resumes(id),
  current_step text,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  message_type text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create chat_context table
CREATE TABLE IF NOT EXISTS chat_context (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  context_type text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, context_type)
);

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_context ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own chat sessions"
  ON chat_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat messages"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat context"
  ON chat_context
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_context_user_id ON chat_context(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_context_type ON chat_context(context_type);

-- Create function to update session timestamp
CREATE OR REPLACE FUNCTION update_chat_session_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating session timestamp
CREATE TRIGGER update_chat_session_timestamp
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_session_timestamp();

-- Create function to handle chat context updates
CREATE OR REPLACE FUNCTION merge_chat_context()
RETURNS trigger AS $$
BEGIN
  -- Merge new data with existing data
  NEW.data = COALESCE(
    jsonb_strip_nulls(
      NEW.data || (
        SELECT data 
        FROM chat_context 
        WHERE user_id = NEW.user_id 
        AND context_type = NEW.context_type
      )
    ),
    NEW.data
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for merging chat context
CREATE TRIGGER merge_chat_context
  BEFORE INSERT OR UPDATE ON chat_context
  FOR EACH ROW
  EXECUTE FUNCTION merge_chat_context();

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_context;