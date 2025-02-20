/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text)
      - `created_at` (timestamp)
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `file_path` (text)
      - `content` (text)
      - `created_at` (timestamp)
    - `generated_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `resume_id` (uuid) - References resumes.id
      - `recipient_url` (text)
      - `message_type` (text)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create resumes table
CREATE TABLE resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  file_path text,
  content text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create generated_messages table
CREATE TABLE generated_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  resume_id uuid REFERENCES resumes(id) NOT NULL,
  recipient_url text,
  message_type text,
  content text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generated_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON generated_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON generated_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);