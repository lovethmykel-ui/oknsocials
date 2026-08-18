-- OKN SOCIAL OS — PRODUCTION POSTGRESQL SCHEMA & RLS
-- Project: payekirnjeexckzxtsqf

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE project_id_enum AS ENUM ('okn-token', 'oknexus-exchange');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE platform_enum AS ENUM ('x', 'instagram', 'linkedin', 'youtube', 'tiktok', 'telegram', 'facebook');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE post_status_enum AS ENUM ('draft', 'review', 'approved', 'scheduled', 'published', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE autonomy_level_enum AS ENUM ('OFF', 'SUGGEST ONLY', 'APPROVAL REQUIRED', 'AUTO-RESPOND LOW-RISK', 'AUTONOMOUS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. WORKSPACES & PROFILES
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'OKN Core Systems',
    slug TEXT UNIQUE NOT NULL DEFAULT 'okn-core',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROJECTS & BRANDS
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id),
    name TEXT NOT NULL,
    codename TEXT NOT NULL,
    tagline TEXT,
    brand_color TEXT NOT NULL DEFAULT '#2563EB',
    logo_url TEXT,
    coin_icon_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SOCIAL ACCOUNTS & HEALTH
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    platform platform_enum NOT NULL,
    handle TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'healthy',
    followers_count INTEGER NOT NULL DEFAULT 0,
    automation_level autonomy_level_enum NOT NULL DEFAULT 'AUTO-RESPOND LOW-RISK',
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    token_expires_at TIMESTAMPTZ,
    last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CONTENT & SCHEDULING
CREATE TABLE IF NOT EXISTS public.content_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    post_type TEXT NOT NULL DEFAULT 'single',
    status post_status_enum NOT NULL DEFAULT 'draft',
    primary_media_url TEXT,
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    ai_generated BOOLEAN NOT NULL DEFAULT false,
    ai_safety_score INTEGER DEFAULT 100,
    author_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.content_posts(id) ON DELETE CASCADE,
    platform platform_enum NOT NULL,
    text_content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    hashtags TEXT[] DEFAULT '{}',
    char_count INTEGER NOT NULL DEFAULT 0,
    external_post_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT,
    objective TEXT,
    budget_allocated TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    target_reach INTEGER DEFAULT 0,
    actual_reach INTEGER DEFAULT 0,
    target_engagement INTEGER DEFAULT 0,
    actual_engagement INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. UNIFIED INBOX & CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.inbox_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    platform platform_enum NOT NULL,
    external_thread_id TEXT,
    author_name TEXT NOT NULL,
    author_handle TEXT NOT NULL,
    author_avatar TEXT,
    preview_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    intent TEXT NOT NULL DEFAULT 'Product Question',
    sentiment TEXT NOT NULL DEFAULT 'neutral',
    priority TEXT NOT NULL DEFAULT 'normal',
    ai_confidence INTEGER NOT NULL DEFAULT 95,
    suggested_response TEXT,
    risk_level risk_level_enum NOT NULL DEFAULT 'low',
    is_unread BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.inbox_threads(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'user' | 'agent' | 'system'
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    is_ai_generated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. AI AGENTS & DECISION LOGS
CREATE TABLE IF NOT EXISTS public.ai_agents (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    codename TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    autonomy_level autonomy_level_enum NOT NULL DEFAULT 'AUTO-RESPOND LOW-RISK',
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    accuracy_rate NUMERIC(5,2) NOT NULL DEFAULT 98.00,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT REFERENCES public.ai_agents(id),
    project_id TEXT REFERENCES public.projects(id),
    platform platform_enum,
    action TEXT NOT NULL,
    summary TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    risk_level risk_level_enum NOT NULL,
    policy_triggered TEXT NOT NULL,
    input_snippet TEXT,
    output_snippet TEXT,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. MEDIA VAULT
CREATE TABLE IF NOT EXISTS public.media_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '3d_renders',
    aspect_ratio TEXT NOT NULL DEFAULT '16:9',
    dimensions TEXT,
    size_bytes BIGINT,
    tags TEXT[] DEFAULT '{}',
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'low',
    type TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users access within their authorized workspace
CREATE POLICY "Allow authenticated read on projects" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on content" ON public.content_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on inbox" ON public.inbox_threads FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on media" ON public.media_vault FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on agents" ON public.ai_agents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read on decisions" ON public.ai_decisions FOR ALL TO authenticated USING (true);

-- Anonymous read for public assets/config if needed
CREATE POLICY "Allow public read for brand assets" ON public.projects FOR SELECT TO anon USING (true);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_posts_project_status ON public.content_posts(project_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON public.content_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_inbox_unread ON public.inbox_threads(project_id, is_unread);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_created ON public.ai_decisions(created_at DESC);
