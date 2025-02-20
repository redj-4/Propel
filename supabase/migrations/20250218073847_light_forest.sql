/*
  # Stripe Integration Schema

  1. New Tables
    - `stripe_customers`
      - Links Supabase users to Stripe customers
      - Stores customer-specific metadata
    
    - `stripe_subscriptions`
      - Tracks subscription status and details
      - Stores subscription metadata and billing periods
    
    - `stripe_invoices`
      - Records payment history
      - Stores invoice metadata and status

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add indexes for performance
*/

-- Create stripe_customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL UNIQUE,
  stripe_customer_id text UNIQUE NOT NULL,
  email text,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create stripe_subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_price_id text NOT NULL,
  status text NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(user_id, stripe_subscription_id)
);

-- Create stripe_invoices table
CREATE TABLE IF NOT EXISTS stripe_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  stripe_invoice_id text UNIQUE NOT NULL,
  stripe_subscription_id text REFERENCES stripe_subscriptions(stripe_subscription_id),
  amount_paid bigint NOT NULL,
  currency text NOT NULL,
  status text NOT NULL,
  invoice_pdf text,
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_invoices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own stripe customer"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions"
  ON stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own invoices"
  ON stripe_invoices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_user_id ON stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_stripe_id ON stripe_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_stripe_invoices_user_id ON stripe_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_invoices_subscription_id ON stripe_invoices(stripe_subscription_id);

-- Add subscription_id to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'active_subscription_id'
  ) THEN
    ALTER TABLE users ADD COLUMN active_subscription_id uuid REFERENCES stripe_subscriptions(id);
  END IF;
END $$;

-- Create function to update subscription status
CREATE OR REPLACE FUNCTION handle_subscription_updated()
RETURNS trigger AS $$
BEGIN
  -- Update user's active subscription
  UPDATE users
  SET active_subscription_id = NEW.id
  WHERE id = NEW.user_id
  AND (
    NEW.status = 'active' 
    OR NEW.status = 'trialing'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for subscription updates
CREATE TRIGGER on_subscription_updated
  AFTER INSERT OR UPDATE ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_subscription_updated();