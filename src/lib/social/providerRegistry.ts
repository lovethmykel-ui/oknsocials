/**
 * OKN Social OS — Social Media Provider Registry & Integration Architecture (Buffer.com Style)
 *
 * Defines OAuth 2.0 scopes, authorization URLs, token endpoints, API endpoints,
 * and webhook specifications for each supported social platform in the OKN ecosystem.
 */

import { PlatformId } from "@/types";

export interface SocialProviderConfig {
  id: PlatformId;
  name: string;
  authType: "oauth2" | "bot_token" | "hybrid";
  authUrl?: string;
  tokenUrl?: string;
  apiBaseUrl: string;
  defaultScopes: string[];
  requiredEnvVars: string[];
  docUrl: string;
  description: string;
  features: {
    publishing: boolean;
    inboxRead: boolean;
    autoReply: boolean;
    analytics: boolean;
    webhooks: boolean;
    mediaUpload: boolean;
  };
}

export const SOCIAL_PROVIDERS: Record<PlatformId, SocialProviderConfig> = {
  x: {
    id: "x",
    name: "X / Twitter",
    authType: "oauth2",
    authUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.twitter.com/2/oauth2/token",
    apiBaseUrl: "https://api.twitter.com/2",
    defaultScopes: [
      "tweet.read",
      "tweet.write",
      "users.read",
      "offline.access",
      "dm.read",
      "dm.write",
    ],
    requiredEnvVars: ["TWITTER_CLIENT_ID", "TWITTER_CLIENT_SECRET"],
    docUrl: "https://developer.twitter.com/en/docs/authentication/oauth-2-0",
    description: "Connect via Twitter Developer Portal OAuth 2.0 PKCE for post publishing, thread scheduling, and DM triage.",
    features: {
      publishing: true,
      inboxRead: true,
      autoReply: true,
      analytics: true,
      webhooks: true,
      mediaUpload: true,
    },
  },
  telegram: {
    id: "telegram",
    name: "Telegram",
    authType: "bot_token",
    apiBaseUrl: "https://api.telegram.org",
    defaultScopes: ["sendMessage", "sendPhoto", "getUpdates", "setWebhook", "pinChatMessage"],
    requiredEnvVars: ["TELEGRAM_BOT_TOKEN"],
    docUrl: "https://core.telegram.org/bots/api",
    description: "Connect your official Telegram Community Bot via BotFather API Token + Chat ID for instant broadcast and channel management.",
    features: {
      publishing: true,
      inboxRead: true,
      autoReply: true,
      analytics: true,
      webhooks: true,
      mediaUpload: true,
    },
  },
  instagram: {
    id: "instagram",
    name: "Instagram Professional",
    authType: "oauth2",
    authUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
    apiBaseUrl: "https://graph.facebook.com/v20.0",
    defaultScopes: [
      "instagram_basic",
      "instagram_content_publish",
      "instagram_manage_comments",
      "instagram_manage_messages",
      "pages_show_list",
      "pages_read_engagement",
    ],
    requiredEnvVars: ["META_APP_ID", "META_APP_SECRET"],
    docUrl: "https://developers.facebook.com/docs/instagram-platform",
    description: "Connect Instagram Business / Creator account via Meta Graph API OAuth 2.0 for carousel publishing, comments, and DM webhooks.",
    features: {
      publishing: true,
      inboxRead: true,
      autoReply: true,
      analytics: true,
      webhooks: true,
      mediaUpload: true,
    },
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn Organization & Profile",
    authType: "oauth2",
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    apiBaseUrl: "https://api.linkedin.com/v2",
    defaultScopes: [
      "w_member_social",
      "r_basicprofile",
      "w_organization_social",
      "r_organization_social",
      "rw_organization_admin",
    ],
    requiredEnvVars: ["LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET"],
    docUrl: "https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow",
    description: "Connect LinkedIn Company Page or Executive Profile for thought leadership broadcasts and corporate reach analytics.",
    features: {
      publishing: true,
      inboxRead: true,
      autoReply: false,
      analytics: true,
      webhooks: false,
      mediaUpload: true,
    },
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    authType: "oauth2",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    apiBaseUrl: "https://www.googleapis.com/youtube/v3",
    defaultScopes: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
    requiredEnvVars: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    docUrl: "https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps",
    description: "Connect YouTube Channel via Google OAuth 2.0 to upload Shorts/Videos, manage descriptions, and parse video comment streams.",
    features: {
      publishing: true,
      inboxRead: true,
      autoReply: true,
      analytics: true,
      webhooks: true,
      mediaUpload: true,
    },
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok for Business",
    authType: "oauth2",
    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    apiBaseUrl: "https://open.tiktokapis.com/v2",
    defaultScopes: ["user.info.basic", "video.upload", "video.publish", "comment.list", "comment.list.manage"],
    requiredEnvVars: ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"],
    docUrl: "https://developers.tiktok.com/doc/login-kit-web",
    description: "Connect TikTok Creator or Business account via TikTok for Developers OAuth for short-form video dispatch and engagement tracking.",
    features: {
      publishing: true,
      inboxRead: true,
      autoReply: false,
      analytics: true,
      webhooks: false,
      mediaUpload: true,
    },
  },
  facebook: {
    id: "facebook",
    name: "Facebook Page",
    authType: "oauth2",
    authUrl: "https://www.facebook.com/v20.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v20.0/oauth/access_token",
    apiBaseUrl: "https://graph.facebook.com/v20.0",
    defaultScopes: [
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_posts",
      "pages_messaging",
    ],
    requiredEnvVars: ["META_APP_ID", "META_APP_SECRET"],
    docUrl: "https://developers.facebook.com/docs/pages-api",
    description: "Connect Official Facebook Page for community posts and messenger bot integration.",
    features: {
      publishing: true,
      inboxRead: true,
      autoReply: true,
      analytics: true,
      webhooks: true,
      mediaUpload: true,
    },
  },
};
