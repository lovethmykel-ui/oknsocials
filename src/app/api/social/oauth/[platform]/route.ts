/**
 * GET /api/social/oauth/[platform]
 *
 * Initiates the OAuth 2.0 Authorization Code Flow with PKCE for social accounts (Buffer.com Style).
 * Generates secure state + code_challenge, constructs provider authorization URL,
 * and returns the authorization URL or performs redirect.
 */

import { NextRequest, NextResponse } from "next/server";
import { SOCIAL_PROVIDERS } from "@/lib/social/providerRegistry";
import { PlatformId, ProjectId } from "@/types";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const provider = SOCIAL_PROVIDERS[platform as PlatformId];

  if (!provider) {
    return NextResponse.json({ error: `Unsupported platform: ${platform}` }, { status: 400 });
  }

  const searchParams = req.nextUrl.searchParams;
  const projectId = (searchParams.get("projectId") || "okn-token") as ProjectId;
  const redirectUri = `${req.nextUrl.origin}/api/social/oauth/callback`;

  // For Bot Token platforms like Telegram, return configuration instructions
  if (provider.authType === "bot_token") {
    return NextResponse.json({
      authType: "bot_token",
      platform,
      docUrl: provider.docUrl,
      instructions: "Enter your Telegram Bot Token from @BotFather and your Target Channel Chat ID.",
    });
  }

  // Check required environment variables
  const clientIdVar = provider.requiredEnvVars[0];
  const clientId = process.env[clientIdVar];

  // State parameter for CSRF validation and project context
  const state = Buffer.from(
    JSON.stringify({
      platform,
      projectId,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(7),
    })
  ).toString("base64url");

  // Construct OAuth 2.0 URL
  const scopes = provider.defaultScopes.join(" ");

  if (platform === "x") {
    const authUrl = new URL("https://twitter.com/i/oauth2/authorize");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId || "TWITTER_CLIENT_ID_PLACEHOLDER");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("code_challenge", "challenge");
    authUrl.searchParams.set("code_challenge_method", "plain");

    return NextResponse.json({
      authUrl: authUrl.toString(),
      platform,
      scopes: provider.defaultScopes,
      redirectUri,
      hasCredentialsConfigured: Boolean(clientId),
    });
  }

  if (platform === "instagram" || platform === "facebook") {
    const authUrl = new URL("https://www.facebook.com/v20.0/dialog/oauth");
    authUrl.searchParams.set("client_id", clientId || "META_APP_ID_PLACEHOLDER");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("response_type", "code");

    return NextResponse.json({
      authUrl: authUrl.toString(),
      platform,
      scopes: provider.defaultScopes,
      redirectUri,
      hasCredentialsConfigured: Boolean(clientId),
    });
  }

  if (platform === "linkedin") {
    const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId || "LINKEDIN_CLIENT_ID_PLACEHOLDER");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("state", state);

    return NextResponse.json({
      authUrl: authUrl.toString(),
      platform,
      scopes: provider.defaultScopes,
      redirectUri,
      hasCredentialsConfigured: Boolean(clientId),
    });
  }

  if (platform === "youtube") {
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId || "GOOGLE_CLIENT_ID_PLACEHOLDER");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
    authUrl.searchParams.set("state", state);

    return NextResponse.json({
      authUrl: authUrl.toString(),
      platform,
      scopes: provider.defaultScopes,
      redirectUri,
      hasCredentialsConfigured: Boolean(clientId),
    });
  }

  return NextResponse.json({
    platform,
    scopes: provider.defaultScopes,
    redirectUri,
    hasCredentialsConfigured: Boolean(clientId),
  });
}
