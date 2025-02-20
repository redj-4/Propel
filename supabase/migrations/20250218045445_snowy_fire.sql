/*
  # Add job applications and enhance message tracking

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `company` (text)
      - `position` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `last_follow_up` (timestamptz)
      - `next_follow_up` (timestamptz)
      - `notes` (text)
      - `message_id` (uuid, references generated_messages)

  2. Changes
    - Add `is_starred` column to `generated_messages`
    - Add realtime enabled for job_applications table

  3. Security
    - Enable RLS on job_applications table
    - Add policies for authenticated users
*/

-- Add is_starred to generated_messages if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'generated_messages' AND column_name = 'is_starred'
  ) THEN
    ALTER TABLE generated_messages ADD COLUMN is_starred boolean DEFAULT false;
  END IF;
END $$;

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  company text NOT NULL,
  position text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'awaiting', 'follow-up', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_follow_up timestamptz,
  next_follow_up timestamptz,
  notes text,
  message_id uuid REFERENCES generated_messages(id)
);

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own applications"
  ON job_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON job_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON job_applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE job_applications;