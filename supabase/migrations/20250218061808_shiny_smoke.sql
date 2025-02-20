/*
  # Fix User Policies and Triggers

  1. Changes
    - Add safety checks for existing policies and triggers
    - Update RLS policies with IF NOT EXISTS
    - Ensure proper user record creation
    - Add proper error handling

  2. Security
    - Maintain RLS on all tables
    - Ensure proper user isolation
    - Handle edge cases safely
*/

-- Update users table policies with safety checks
DO $$ 
BEGIN
  -- Only enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can insert their own record'
  ) THEN
    CREATE POLICY "Users can insert their own record"
      ON users
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'users' 
    AND policyname = 'Users can view own record'
  ) THEN
    CREATE POLICY "Users can view own record"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- Create or replace user creation trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (new.id, new.email, now())
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safely recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update prompt_history policies with safety checks
DO $$ 
BEGIN
  -- Only enable RLS if not already enabled
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'prompt_history' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prompt_history' 
    AND policyname = 'Users can insert own prompts'
  ) THEN
    CREATE POLICY "Users can insert own prompts"
      ON prompt_history
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'prompt_history' 
    AND policyname = 'Users can view own prompts'
  ) THEN
    CREATE POLICY "Users can view own prompts"
      ON prompt_history
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create or replace function to ensure user exists
CREATE OR REPLACE FUNCTION ensure_user_exists()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, created_at)
  VALUES (NEW.user_id, auth.email(), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safely recreate trigger for ensuring user exists
DROP TRIGGER IF EXISTS ensure_user_exists_before_prompt ON prompt_history;
CREATE TRIGGER ensure_user_exists_before_prompt
  BEFORE INSERT ON prompt_history
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_exists();