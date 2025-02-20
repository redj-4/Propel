/*
  # Update RLS Policies and Triggers

  1. Changes
    - Drop and recreate user management functions with SECURITY DEFINER
    - Update RLS policies with safety checks
    - Improve user creation and prompt history triggers
  
  2. Security
    - Enable RLS on all tables
    - Add proper policies for user data access
    - Add security definer functions for triggers
*/

-- Drop and recreate functions with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (new.id, new.email, now())
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_user_exists()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.user_id, (SELECT email FROM auth.users WHERE id = NEW.user_id), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Safely recreate triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS ensure_user_exists_before_prompt ON prompt_history;
CREATE TRIGGER ensure_user_exists_before_prompt
  BEFORE INSERT ON prompt_history
  FOR EACH ROW EXECUTE FUNCTION public.ensure_user_exists();

-- Update RLS policies with safety checks
DO $$ 
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Users can insert their own record" ON users;
  DROP POLICY IF EXISTS "Users can view own record" ON users;
  DROP POLICY IF EXISTS "Users can view own data" ON users;
  DROP POLICY IF EXISTS "Allow user creation from trigger" ON users;
  DROP POLICY IF EXISTS "Users can update own data" ON users;
  
  -- Enable RLS
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;

  -- Create new policies
  CREATE POLICY "allow_user_management"
    ON users
    FOR ALL
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

  CREATE POLICY "allow_system_user_creation"
    ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
END $$;

-- Update prompt_history policies
DO $$ 
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Users can insert own prompts" ON prompt_history;
  DROP POLICY IF EXISTS "Users can view own prompts" ON prompt_history;

  -- Create new policies
  CREATE POLICY "prompt_history_access"
    ON prompt_history
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
END $$;