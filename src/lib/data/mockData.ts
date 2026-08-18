/**
 * OKN Social OS — Fresh / Empty State Data
 * All user-generated data (posts, inbox, campaigns, media, accounts, decisions) starts at zero.
 * System-level configuration (projects, AI agents, project brains) is pre-loaded.
 */

import {
  Project,
  SocialAccount,
  ConversationThread,
  PostItem,
  AIAgent,
  AIDecisionLog,
  Campaign,
  MediaVaultItem,
  NotificationItem,
  ProjectBrain,
} from "@/types";

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────
export const mockProjects: Project[] = [
  {
    id: "okn-token",
    name: "OKN Token",
    codename: "OKN",
    tagline: "The utility token powering the OKN ecosystem.",
    logo: "/assets/brand/OKN_logo_transparent.png",
    coinIcon: "/assets/brand/OKN_coin_transparent.png",
    brandColor: "#3B82F6",
    accentGlow: "rgba(59,130,246,0.25)",
    voiceTone: "Professional, visionary, and trustworthy.",
    stats: {
      totalFollowers: 0,
      engagementRate: 0,
      activeCampaigns: 0,
      sentimentScore: 0,
    },
  },
  {
    id: "oknexus-exchange",
    name: "OKNEXUS Exchange",
    codename: "OKNEXUS",
    tagline: "Institutional-grade perpetual DEX infrastructure.",
    logo: "/assets/brand/OKN_logo_transparent.png",
    coinIcon: "/assets/brand/OKN_coin_transparent.png",
    brandColor: "#06B6D4",
    accentGlow: "rgba(6,182,212,0.25)",
    voiceTone: "Technical, precise, and institution-grade.",
    stats: {
      totalFollowers: 0,
      engagementRate: 0,
      activeCampaigns: 0,
      sentimentScore: 0,
    },
  },
];

// ─────────────────────────────────────────────
// SOCIAL ACCOUNTS — None connected
// ─────────────────────────────────────────────
export const mockSocialAccounts: SocialAccount[] = [];

// ─────────────────────────────────────────────
// POSTS — Empty pipeline
// ─────────────────────────────────────────────
export const mockPosts: PostItem[] = [];

// ─────────────────────────────────────────────
// CONVERSATIONS — No inbox messages
// ─────────────────────────────────────────────
export const mockConversations: ConversationThread[] = [];

// ─────────────────────────────────────────────
// AI AGENTS — 12 system agents, all on standby
// ─────────────────────────────────────────────
export const mockAIAgents: AIAgent[] = [
  {
    id: "agent-01",
    role: "social_director",
    name: "Social Director",
    codename: "DIRECTOR",
    description: "Oversees all autonomous operations, coordinates agents, and enforces brand policy.",
    status: "standby",
    autonomyLevel: "APPROVAL REQUIRED",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-02",
    role: "content_agent",
    name: "Content Architect",
    codename: "WRITER",
    description: "Drafts, adapts, and optimises multi-platform content variations via Gemini AI.",
    status: "standby",
    autonomyLevel: "APPROVAL REQUIRED",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-03",
    role: "inbox_agent",
    name: "Inbox Intelligence",
    codename: "INBOX",
    description: "Monitors, classifies, and triages incoming messages across all connected platforms.",
    status: "standby",
    autonomyLevel: "SUGGEST ONLY",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-04",
    role: "comment_agent",
    name: "Comment Moderator",
    codename: "COMMENT",
    description: "Scans and responds to comments with brand-voice approved replies.",
    status: "standby",
    autonomyLevel: "APPROVAL REQUIRED",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "youtube", "tiktok", "facebook"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-05",
    role: "community_agent",
    name: "Community Liaison",
    codename: "COMMUNITY",
    description: "Fosters engagement, responds to community questions, and escalates issues.",
    status: "standby",
    autonomyLevel: "SUGGEST ONLY",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["telegram", "x", "instagram"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-06",
    role: "moderation_agent",
    name: "Sentinel",
    codename: "SENTINEL",
    description: "Real-time threat detection — scam interception, impersonation alerts, phishing blocks.",
    status: "standby",
    autonomyLevel: "AUTONOMOUS",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-07",
    role: "analytics_agent",
    name: "Analytics Engine",
    codename: "ANALYTICS",
    description: "Aggregates performance data, surfaces insights, and tracks KPIs across platforms.",
    status: "standby",
    autonomyLevel: "APPROVAL REQUIRED",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-08",
    role: "publishing_agent",
    name: "Release Scheduler",
    codename: "SCHEDULER",
    description: "Optimises publish timing based on audience activity windows.",
    status: "standby",
    autonomyLevel: "APPROVAL REQUIRED",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-09",
    role: "campaign_agent",
    name: "Campaign Operations",
    codename: "CAMPAIGNS",
    description: "Executes campaign phases, tracks budgets, and reports on reach milestones.",
    status: "standby",
    autonomyLevel: "APPROVAL REQUIRED",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "linkedin", "telegram"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-10",
    role: "research_agent",
    name: "Trend Scout",
    codename: "TRENDS",
    description: "Identifies trending narratives, hashtags, and topics relevant to the OKN ecosystem.",
    status: "standby",
    autonomyLevel: "SUGGEST ONLY",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "tiktok"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-11",
    role: "trend_agent",
    name: "Influencer Scout",
    codename: "KOL",
    description: "Identifies and tracks key opinion leaders and amplification opportunities.",
    status: "standby",
    autonomyLevel: "SUGGEST ONLY",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "youtube", "tiktok", "instagram"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
  {
    id: "agent-12",
    role: "account_health_agent",
    name: "Account Health Monitor",
    codename: "HEALTH",
    description: "Continuously checks API token validity, rate limits, and connection health.",
    status: "standby",
    autonomyLevel: "AUTONOMOUS",
    projectScope: ["okn-token", "oknexus-exchange"],
    supportedPlatforms: ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"],
    tasksCompleted: 0,
    accuracyRate: 0,
    lastActiveAt: new Date().toISOString(),
  },
];

// ─────────────────────────────────────────────
// AI DECISIONS — No decisions yet
// ─────────────────────────────────────────────
export const mockAIDecisions: AIDecisionLog[] = [];

// ─────────────────────────────────────────────
// CAMPAIGNS — None created
// ─────────────────────────────────────────────
export const mockCampaigns: Campaign[] = [];

// ─────────────────────────────────────────────
// MEDIA VAULT — Empty
// ─────────────────────────────────────────────
export const mockMediaVault: MediaVaultItem[] = [];

// ─────────────────────────────────────────────
// NOTIFICATIONS — None
// ─────────────────────────────────────────────
export const mockNotifications: NotificationItem[] = [];

// ─────────────────────────────────────────────
// PROJECT BRAINS — Pre-configured safety rules, ready to extend
// ─────────────────────────────────────────────
export const mockProjectBrains: Record<string, ProjectBrain> = {
  "okn-token": {
    projectId: "okn-token",
    name: "OKN Token",
    brandVoice: [],
    approvedClaims: [],
    forbiddenClaims: [
      "guaranteed returns",
      "risk-free investment",
      "100x",
      "insider information",
      "seed phrase",
      "private key",
    ],
    productFacts: [],
    faqs: [],
    approvedKeywords: ["OKN", "utility token", "ecosystem", "decentralised"],
    forbiddenKeywords: ["guaranteed", "risk-free", "100x", "pump"],
    ctaLibrary: [],
    hashtags: ["#OKN", "#Web3", "#DeFi"],
    responseRules: [],
  },
  "oknexus-exchange": {
    projectId: "oknexus-exchange",
    name: "OKNEXUS Exchange",
    brandVoice: [],
    approvedClaims: [],
    forbiddenClaims: [
      "guaranteed returns",
      "risk-free investment",
      "100x",
      "insider information",
      "seed phrase",
      "private key",
    ],
    productFacts: [],
    faqs: [],
    approvedKeywords: ["OKNEXUS", "perpetual DEX", "liquidity", "institutional"],
    forbiddenKeywords: ["guaranteed", "risk-free", "100x", "pump"],
    ctaLibrary: [],
    hashtags: ["#OKNEXUS", "#PerpDEX", "#DeFi"],
    responseRules: [],
  },
};
