import { PlatformId, PostVariant } from "@/types";
import { ISocialProvider, ProviderCapability, PublishResult } from "./SocialProvider";

class BaseProvider implements ISocialProvider {
  platformId: PlatformId;
  platformName: string;
  private defaultCapabilities: ProviderCapability;

  constructor(
    platformId: PlatformId,
    platformName: string,
    capabilities: ProviderCapability
  ) {
    this.platformId = platformId;
    this.platformName = platformName;
    this.defaultCapabilities = capabilities;
  }

  getCapabilities(): ProviderCapability {
    return this.defaultCapabilities;
  }

  async connect(): Promise<{ success: boolean; error?: string }> {
    return { success: true };
  }

  async disconnect(): Promise<boolean> {
    return true;
  }

  async refreshAuth(): Promise<{ success: boolean; expiresAt: string }> {
    const expiresAt = new Date(Date.now() + 60 * 86400000).toISOString();
    return { success: true, expiresAt };
  }

  async publishPost(
    accountId: string,
    variant: PostVariant
  ): Promise<PublishResult> {
    const fakeId = `${this.platformId}_${Date.now()}`;
    return {
      success: true,
      externalPostId: fakeId,
      url: `https://${this.platformId}.com/okn/status/${fakeId}`,
      timestamp: new Date().toISOString(),
    };
  }

  async schedulePost(
    accountId: string,
    variant: PostVariant,
    scheduleTime: string
  ): Promise<PublishResult> {
    return {
      success: true,
      externalPostId: `sched_${this.platformId}_${Date.now()}`,
      timestamp: scheduleTime,
    };
  }

  async deletePost(): Promise<boolean> {
    return true;
  }

  async replyToComment(
    accountId: string,
    commentId: string,
    text: string
  ): Promise<{ success: boolean; replyId?: string }> {
    return { success: true, replyId: `reply_${Date.now()}` };
  }

  async moderateComment(): Promise<boolean> {
    return true;
  }
}

export class XPlatformProvider extends BaseProvider {
  constructor() {
    super("x", "X / Twitter", {
      canPublish: true,
      canSchedule: true,
      canReadInbox: true,
      canReplyComment: true,
      canModerate: true,
      canStreamAnalytics: true,
      charLimit: 280,
      supportedMediaTypes: ["image/jpeg", "image/png", "image/gif", "video/mp4"],
      maxMediaCount: 4,
    });
  }
}

export class InstagramPlatformProvider extends BaseProvider {
  constructor() {
    super("instagram", "Instagram Graph API", {
      canPublish: true,
      canSchedule: true,
      canReadInbox: true,
      canReplyComment: true,
      canModerate: true,
      canStreamAnalytics: true,
      charLimit: 2200,
      supportedMediaTypes: ["image/jpeg", "image/png", "video/mp4"],
      maxMediaCount: 10,
    });
  }
}

export class LinkedInPlatformProvider extends BaseProvider {
  constructor() {
    super("linkedin", "LinkedIn Community Management API", {
      canPublish: true,
      canSchedule: true,
      canReadInbox: true,
      canReplyComment: true,
      canModerate: true,
      canStreamAnalytics: true,
      charLimit: 3000,
      supportedMediaTypes: ["image/jpeg", "image/png", "video/mp4"],
      maxMediaCount: 9,
    });
  }
}

export class TelegramPlatformProvider extends BaseProvider {
  constructor() {
    super("telegram", "Telegram Bot API (MTProto)", {
      canPublish: true,
      canSchedule: true,
      canReadInbox: true,
      canReplyComment: true,
      canModerate: true,
      canStreamAnalytics: false,
      charLimit: 4096,
      supportedMediaTypes: ["image/jpeg", "image/png", "video/mp4", "image/gif"],
      maxMediaCount: 10,
    });
  }
}

export class YouTubePlatformProvider extends BaseProvider {
  constructor() {
    super("youtube", "YouTube Data API v3", {
      canPublish: true,
      canSchedule: true,
      canReadInbox: false,
      canReplyComment: true,
      canModerate: true,
      canStreamAnalytics: true,
      charLimit: 5000,
      supportedMediaTypes: ["video/mp4", "video/quicktime"],
      maxMediaCount: 1,
    });
  }
}

export class TikTokPlatformProvider extends BaseProvider {
  constructor() {
    super("tiktok", "TikTok Content Posting API", {
      canPublish: true,
      canSchedule: true,
      canReadInbox: false,
      canReplyComment: true,
      canModerate: false,
      canStreamAnalytics: true,
      charLimit: 2200,
      supportedMediaTypes: ["video/mp4"],
      maxMediaCount: 1,
    });
  }
}

export const providerRegistry: Record<PlatformId, ISocialProvider> = {
  x: new XPlatformProvider(),
  instagram: new InstagramPlatformProvider(),
  linkedin: new LinkedInPlatformProvider(),
  telegram: new TelegramPlatformProvider(),
  youtube: new YouTubePlatformProvider(),
  tiktok: new TikTokPlatformProvider(),
  facebook: new BaseProvider("facebook", "Meta Graph API", {
    canPublish: true,
    canSchedule: true,
    canReadInbox: true,
    canReplyComment: true,
    canModerate: true,
    canStreamAnalytics: true,
    charLimit: 5000,
    supportedMediaTypes: ["image/jpeg", "image/png", "video/mp4"],
    maxMediaCount: 10,
  }),
};
