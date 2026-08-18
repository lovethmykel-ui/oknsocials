import { PlatformId, SocialAccount, PostVariant } from "@/types";

export interface ProviderCapability {
  canPublish: boolean;
  canSchedule: boolean;
  canReadInbox: boolean;
  canReplyComment: boolean;
  canModerate: boolean;
  canStreamAnalytics: boolean;
  charLimit: number;
  supportedMediaTypes: ("image/jpeg" | "image/png" | "image/gif" | "video/mp4" | "video/quicktime")[];
  maxMediaCount: number;
}

export interface PublishResult {
  success: boolean;
  externalPostId?: string;
  url?: string;
  errorMessage?: string;
  timestamp: string;
}

export interface ISocialProvider {
  platformId: PlatformId;
  platformName: string;
  getCapabilities(): ProviderCapability;
  connect(authCode?: string): Promise<{ success: boolean; account?: Partial<SocialAccount>; error?: string }>;
  disconnect(accountId: string): Promise<boolean>;
  refreshAuth(accountId: string): Promise<{ success: boolean; expiresAt: string }>;
  publishPost(accountId: string, variant: PostVariant): Promise<PublishResult>;
  schedulePost(accountId: string, variant: PostVariant, scheduleTime: string): Promise<PublishResult>;
  deletePost(accountId: string, externalPostId: string): Promise<boolean>;
  replyToComment(accountId: string, commentId: string, text: string): Promise<{ success: boolean; replyId?: string }>;
  moderateComment(accountId: string, commentId: string, action: "hide" | "delete" | "ban_user"): Promise<boolean>;
}
