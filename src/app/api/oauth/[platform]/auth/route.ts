/**
 * GET /api/oauth/[platform]/auth
 *
 * Initiates the OAuth 2.0 / 1.0a authorization flow for the requested platform.
 * Generates CSRF state, constructs the platform authorization URL with scopes & client ID,
 * and returns { authUrl } for the frontend to redirect (window.location.href).
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
  const redirectUri = `${req.nextUrl.origin}/api/oauth/callback/${platform}`;

  // Generate secure state parameter containing project and CSRF nonce
  const state = Buffer.from(
    JSON.stringify({
      platform,
      projectId,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(7),
    })
  ).toString("base64url");

  const clientIdVar = provider.requiredEnvVars[0];
  const clientId = process.env[clientIdVar];

  // If live credentials exist and provider has authUrl, construct direct OAuth URL
  if (clientId && clientId !== "TWITTER_CLIENT_ID_PLACEHOLDER" && provider.authUrl) {
    const authUrl = new URL(provider.authUrl);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", provider.defaultScopes.join(" "));
    authUrl.searchParams.set("state", state);

    if (platform === "youtube") {
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");
    }

    return NextResponse.json({
      authUrl: authUrl.toString(),
      platform,
      scopes: provider.defaultScopes,
      redirectUri,
      status: "live_oauth",
    });
  }

  // Developer / Interactive Consent Authorization URL (Buffer / Sprout Social style)
  const fallbackAuthUrl = `${req.nextUrl.origin}/api/social/oauth/${platform}?projectId=${projectId}&state=${state}`;

  return NextResponse.json({
    authUrl: fallbackAuthUrl,
    platform,
    scopes: provider.defaultScopes,
    redirectUri,
    status: "interactive_consent",
  });
}
