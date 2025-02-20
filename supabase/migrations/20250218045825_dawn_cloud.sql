/*
  # Add account activity and prompt history tracking

  1. New Tables
    - `user_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `activity_type` (text)
      - `details` (jsonb)
      - `created_at` (timestamptz)
      - `status` (text)
      - `version` (text)

    - `prompt_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `prompt` (text)
      - `response` (text)
      - `created_at` (timestamptz)
      - `category` (text)
      - `tags` (text[])
      - `version` (text)

  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  activity_type text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'completed',
  version text
);

-- Create prompt_history table
CREATE TABLE IF NOT EXISTS prompt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  prompt text NOT NULL,
  response text,
  created_at timestamptz DEFAULT now(),
  category text,
  tags text[] DEFAULT ARRAY[]::text[],
  version text
);

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;

-- Create policies with safety checks
DO $$ 
BEGIN
  -- Policies for user_activities
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_activities' AND policyname = 'Users can view own activities'
  ) THEN
    CREATE POLICY "Users can view own activities"
      ON user_activities
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_activities' AND policyname = 'Users can insert own activities'
  ) THEN
    CREATE POLICY "Users can insert own activities"
      ON user_activities
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Policies for prompt_history
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prompt_history' AND policyname = 'Users can view own prompts'
  ) THEN
    CREATE POLICY "Users can view own prompts"
      ON prompt_history
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prompt_history' AND policyname = 'Users can insert own prompts'
  ) THEN
    CREATE POLICY "Users can insert own prompts"
      ON prompt_history
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Enable realtime for both tables
DO $$ 
BEGIN
  -- Check if tables are already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE tablename = 'user_activities' AND pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_activities;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE tablename = 'prompt_history' AND pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE prompt_history;
  END IF;
END $$;