/*
  # Add Subscription and Usage Tracking Tables

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `stripe_subscription_id` (text, unique)
      - `status` (text)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `usage_tracking`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `message_count` (int)
      - `last_reset` (date)
      - `created_at` (timestamptz)

  2. Functions
    - `increment_message_count`: Safely increments a user's message count
    - `reset_daily_message_counts`: Resets message counts at midnight

  3. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  stripe_subscription_id text UNIQUE,
  status text NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  message_count int DEFAULT 0,
  last_reset date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage"
  ON usage_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to increment message count
CREATE OR REPLACE FUNCTION increment_message_count(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today date := CURRENT_DATE;
BEGIN
  INSERT INTO usage_tracking (user_id, message_count, last_reset)
  VALUES (user_id, 1, today)
  ON CONFLICT (user_id) DO UPDATE
  SET message_count = 
    CASE 
      WHEN usage_tracking.last_reset = today THEN usage_tracking.message_count + 1
      ELSE 1
    END,
    last_reset = today;
END;
$$;

-- Create function to reset message counts daily
CREATE OR REPLACE FUNCTION reset_daily_message_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE usage_tracking
  SET message_count = 0,
      last_reset = CURRENT_DATE
  WHERE last_reset < CURRENT_DATE;
END;
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_last_reset ON usage_tracking(last_reset);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON subscriptions TO authenticated;
GRANT ALL ON usage_tracking TO authenticated;
GRANT EXECUTE ON FUNCTION increment_message_count TO authenticated;