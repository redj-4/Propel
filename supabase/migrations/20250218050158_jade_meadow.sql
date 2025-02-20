/*
  # Add Activity Tracking and Prompt History Tables

  1. New Tables
    - user_activities
      - Tracks user interactions and system events
      - Includes activity type, details, status, and versioning
    - prompt_history
      - Stores user prompts and AI responses
      - Supports categorization and tagging
  
  2. Security
    - Enable RLS on both tables
    - Add policies for user data access
    - Ensure proper data isolation

  3. Changes
    - Add realtime support for both tables
    - Include version tracking
    - Support JSON storage for activity details
*/

-- Create user_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  activity_type text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'completed',
  version text
);

-- Create prompt_history table if it doesn't exist
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
  -- Only create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_activities' AND policyname = 'users_select_own_activities'
  ) THEN
    CREATE POLICY "users_select_own_activities"
      ON user_activities
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_activities' AND policyname = 'users_insert_own_activities'
  ) THEN
    CREATE POLICY "users_insert_own_activities"
      ON user_activities
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prompt_history' AND policyname = 'users_select_own_prompts'
  ) THEN
    CREATE POLICY "users_select_own_prompts"
      ON prompt_history
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prompt_history' AND policyname = 'users_insert_own_prompts'
  ) THEN
    CREATE POLICY "users_insert_own_prompts"
      ON prompt_history
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Enable realtime for both tables with safety checks
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