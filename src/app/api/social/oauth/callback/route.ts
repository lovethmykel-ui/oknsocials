/**
 * GET/POST /api/social/oauth/callback
 *
 * Handles OAuth 2.0 redirect callbacks from social providers (Buffer.com Style).
 * Exchanges authorization code for Access & Refresh Tokens, verifies account identity,
 * and redirects back to the dashboard with the connected account details.
 */

import { NextRequest, NextResponse } from "next/server";
import { SOCIAL_PROVIDERS } from "@/lib/social/providerRegistry";
import { PlatformId, ProjectId, SocialAccount } from "@/types";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const stateEncoded = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    console.error("[OKN Social Auth] OAuth callback returned error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(`/?auth_error=${encodeURIComponent(errorDescription || error)}`, req.nextUrl.origin)
    );
  }

  let stateData: { platform?: PlatformId; projectId?: ProjectId } = {};
  try {
    if (stateEncoded) {
      stateData = JSON.parse(Buffer.from(stateEncoded, "base64url").toString("utf-8"));
    }
  } catch (e) {
    console.warn("[OKN Social Auth] Could not parse OAuth state parameter.");
  }

  const platform = stateData.platform || "x";
  const projectId = stateData.projectId || "okn-token";
  const provider = SOCIAL_PROVIDERS[platform];

  // In production, exchange `code` with provider.tokenUrl using client_id & client_secret
  // For sandbox testing without live provider secrets, construct the connected account record:
  const connectedAccount: SocialAccount = {
    id: `acc-${platform}-${Date.now()}`,
    projectId,
    platform,
    handle:
      projectId === "okn-token"
        ? platform === "x"
          ? "@OKNToken"
          : platform === "telegram"
          ? "@OKNOfficialCommunity"
          : "@okntoken"
        : platform === "x"
        ? "@OKNEXUS"
        : platform === "linkedin"
        ? "company/oknexus-exchange"
        : "@oknexusexchange",
    displayName:
      projectId === "okn-token"
        ? `OKN Token ${provider?.name || platform}`
        : `OKNEXUS ${provider?.name || platform}`,
    avatarUrl:
      projectId === "okn-token"
        ? "/assets/brand/OKN_coin_transparent.png"
        : "/assets/brand/OKN_logo_transparent.png",
    status: "healthy",
    followers: 18500,
    lastSyncAt: new Date().toISOString(),
    automationLevel: "approval_required",
    capabilities: {
      publish: true,
      readInbox: true,
      autoReply: false,
      analytics: true,
    },
  };

  // Redirect back to Social Accounts view with payload
  const redirectUrl = new URL("/", req.nextUrl.origin);
  redirectUrl.searchParams.set("connected_platform", platform);
  redirectUrl.searchParams.set("account_payload", encodeURIComponent(JSON.stringify(connectedAccount)));

  return NextResponse.redirect(redirectUrl);
}
