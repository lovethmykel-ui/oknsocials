export type ProjectId = "okn-token" | "oknexus-exchange";

export interface Project {
  id: ProjectId;
  name: string;
  codename: string;
  tagline: string;
  logo: string;
  coinIcon: string;
  brandColor: string;
  accentGlow: string;
  voiceTone: string;
  stats: {
    totalFollowers: number;
    engagementRate: number;
    activeCampaigns: number;
    sentimentScore: number;
  };
}

export type PlatformId =
  | "instagram"
  | "x"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "telegram"
  | "facebook";

export interface SocialAccount {
  id: string;
  projectId: ProjectId;
  platform: PlatformId;
  handle: string;
  displayName: string;
  avatarUrl: string;
  status:
    | "healthy"
    | "needs_attention"
    | "auth_expired"
    | "rate_limited"
    | "api_error"
    | "disconnected";
  followers: number;
  lastSyncAt: string;
  automationLevel: "autonomous" | "approval_required" | "suggest_only" | "off";
  capabilities: {
    publish: boolean;
    readInbox: boolean;
    autoReply: boolean;
    analytics: boolean;
  };
}

export type PostStatus =
  | "draft"
  | "review"
  | "approved"
  | "scheduled"
  | "published"
  | "failed";

export type PostType =
  | "single"
  | "multi"
  | "thread"
  | "carousel"
  | "video"
  | "short"
  | "announcement";

export interface PostVariant {
  platform: PlatformId;
  text: string;
  mediaUrls: string[];
  hashtags: string[];
  charLimit: number;
  estimatedReach: number;
}

export interface PostItem {
  id: string;
  projectId: ProjectId;
  title: string;
  type: PostType;
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  author: string;
  campaignId?: string;
  variants: Record<PlatformId, PostVariant>;
  primaryMediaUrl?: string;
  engagement?: {
    likes: number;
    reposts: number;
    comments: number;
    impressions: number;
    clicks: number;
  };
  aiGenerated?: boolean;
  aiSafetyScore?: number;
}

export type IntentCategory =
  | "Product Question"
  | "Community"
  | "Praise"
  | "Complaint"
  | "Partnership"
  | "Potential Lead"
  | "Spam"
  | "Security Concern"
  | "Financial Question"
  | "Influencer"
  | "Media"
  | "Scam Alert";

export type SentimentType = "positive" | "neutral" | "negative" | "critical";

export type ConversationStatus =
  | "unread"
  | "needs_approval"
  | "ai_handled"
  | "resolved"
  | "escalated"
  | "flagged"
  | "spam";

export interface ConversationMessage {
  id: string;
  sender: "user" | "agent" | "system";
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  mediaUrl?: string;
  isAiGenerated?: boolean;
}

export interface ConversationThread {
  id: string;
  projectId: ProjectId;
  platform: PlatformId;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  previewText: string;
  messages: ConversationMessage[];
  status: ConversationStatus;
  intent: IntentCategory;
  sentiment: SentimentType;
  priority: "low" | "normal" | "high" | "critical";
  aiConfidence: number;
  suggestedResponse?: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  assignedAgent: string;
  updatedAt: string;
  unread: boolean;
}

export type AgentRole =
  | "social_director"
  | "inbox_agent"
  | "comment_agent"
  | "community_agent"
  | "content_agent"
  | "campaign_agent"
  | "analytics_agent"
  | "moderation_agent"
  | "research_agent"
  | "trend_agent"
  | "publishing_agent"
  | "account_health_agent";

export interface AIAgent {
  id: string;
  role: AgentRole;
  name: string;
  codename: string;
  description: string;
  status: "active" | "standby" | "processing" | "throttled" | "paused";
  autonomyLevel:
    | "OFF"
    | "SUGGEST ONLY"
    | "APPROVAL REQUIRED"
    | "AUTO-RESPOND LOW-RISK"
    | "AUTONOMOUS";
  projectScope: ProjectId[];
  supportedPlatforms: PlatformId[];
  tasksCompleted: number;
  accuracyRate: number;
  lastActiveAt: string;
  currentTask?: string;
}

export interface AIDecisionLog {
  id: string;
  agentName: string;
  agentRole: AgentRole;
  projectId: ProjectId;
  platform: PlatformId;
  action: string;
  summary: string;
  confidence: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  policyTriggered: string;
  status: "completed" | "approved" | "pending_approval" | "escalated" | "rejected";
  timestamp: string;
  inputSnippet: string;
  outputSnippet: string;
}

export interface Campaign {
  id: string;
  projectId: ProjectId;
  name: string;
  tagline: string;
  objective: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed" | "paused";
  budget: string;
  targetReach: number;
  actualReach: number;
  targetEngagement: number;
  actualEngagement: number;
  postsCount: number;
  stages: {
    id: string;
    title: string;
    description: string;
    phase: "teaser" | "educational" | "launch" | "community" | "followup";
    status: "done" | "in_progress" | "upcoming";
    postsCount: number;
  }[];
}

export interface MediaVaultItem {
  id: string;
  projectId: ProjectId;
  title: string;
  filename: string;
  url: string;
  category: "logos" | "3d_renders" | "videos" | "flyers" | "social_graphics" | "campaigns";
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:5";
  dimensions: string;
  size: string;
  tags: string[];
  createdAt: string;
  usageCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  type: "ai_escalation" | "failed_post" | "account_problem" | "security_event" | "milestone" | "lead";
  projectId: ProjectId;
  platform?: PlatformId;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export interface ProjectBrain {
  projectId: ProjectId;
  name: string;
  brandVoice: string[];
  approvedClaims: string[];
  forbiddenClaims: string[];
  productFacts: { question: string; answer: string }[];
  faqs: { q: string; a: string }[];
  approvedKeywords: string[];
  forbiddenKeywords: string[];
  ctaLibrary: { label: string; url: string; context: string }[];
  hashtags: string[];
  responseRules: string[];
}

export interface AnalyticsMetric {
  date: string;
  reach: number;
  impressions: number;
  engagement: number;
  engagementRate: number;
  followers: number;
  aiActions: number;
  responseSpeedMinutes: number;
}
