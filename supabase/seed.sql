-- OKN SOCIAL OS — SEED DATA FOR OKN TOKEN & OKNEXUS EXCHANGE

INSERT INTO public.workspaces (id, name, slug)
VALUES ('a0000000-0000-0000-0000-000000000001', 'OKN Core Systems Workspace', 'okn-core')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.projects (id, workspace_id, name, codename, tagline, brand_color, logo_url, coin_icon_url)
VALUES 
('okn-token', 'a0000000-0000-0000-0000-000000000001', 'OKN Token', 'OKN-CORE', 'The Native Utility & Governance Engine for Next-Gen DeFi', '#2563EB', '/assets/brand/OKN_logo_transparent.png', '/assets/brand/OKN_coin_transparent.png'),
('oknexus-exchange', 'a0000000-0000-0000-0000-000000000001', 'OKNEXUS Exchange', 'OKNEXUS-DEX', 'High-Frequency Decentralized Liquidity & Perpetual Architecture', '#06B6D4', '/assets/brand/OKN_logo_mark_transparent.png', '/assets/brand/icon_okn_glass.png')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, brand_color = EXCLUDED.brand_color;

INSERT INTO public.ai_agents (id, role, name, codename, description, status, autonomy_level, tasks_completed, accuracy_rate)
VALUES
('agent-1', 'social_director', 'AI Social Director', 'DIRECTOR-PRIME', 'Master autonomous coordinator across content generation, risk gating, and scheduling.', 'active', 'AUTONOMOUS', 1420, 98.40),
('agent-2', 'inbox_agent', 'Inbox Intelligence Agent', 'INBOX-SENTINEL', 'Classifies incoming DMs, mentions, and inquiries with intent detection.', 'active', 'AUTO-RESPOND LOW-RISK', 3890, 97.20),
('agent-3', 'comment_agent', 'Comment Engagement Agent', 'ENGAGE-PULSE', 'Evaluates post comments, filters spam, and deploys contextual factual answers.', 'active', 'AUTONOMOUS', 6420, 99.10),
('agent-8', 'moderation_agent', 'Safety & Moderation Agent', 'SHIELD-SENTINEL', 'Instant scam link detection, impersonation flagging, and threat isolation.', 'active', 'AUTONOMOUS', 9820, 99.90)
ON CONFLICT (id) DO NOTHING;
