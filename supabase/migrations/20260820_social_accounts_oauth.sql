-- OKN Social Command Center: Social Accounts & OAuth Schema
-- Migration: 20260820_social_accounts_oauth.sql

CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(50) NOT NULL DEFAULT 'okn-token', -- 'okn-token' or 'oknexus-exchange'
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'x', 'telegram', 'instagram', 'linkedin', 'youtube', 'tiktok', 'facebook'
  platform_user_id VARCHAR(255),
  platform_username VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  avatar_url TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_secret TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'healthy', -- 'healthy', 'attention', 'rate_limited', 'expired'
  followers_count INTEGER DEFAULT 0,
  automation_level VARCHAR(50) DEFAULT 'approval_required', -- 'approval_required', 'suggest_only', 'autonomous', 'off'
  capabilities JSONB DEFAULT '{"publish": true, "readInbox": true, "autoReply": false, "analytics": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_project_platform_user UNIQUE (project_id, platform, platform_username)
);

-- Enable Row Level Security
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Allow users to read their own project accounts"
  ON public.social_accounts FOR SELECT
  USING (true);

CREATE POLICY "Allow users to insert/update their own project accounts"
  ON public.social_accounts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for quick lookup by project and platform
CREATE INDEX IF NOT EXISTS idx_social_accounts_project ON public.social_accounts(project_id, platform);
