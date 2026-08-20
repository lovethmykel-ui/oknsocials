/**
 * GET /api/social/oauth/[platform]
 *
 * Sprout Social & Buffer.com style OAuth 2.0 Authorization Endpoint.
 * Supports direct OAuth 2.0 redirection to official platforms when credentials are set,
 * as well as an interactive Authorization & Scope Consent Popup for seamless onboarding.
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
  const isPopup = searchParams.get("popup") === "1";
  const redirectUri = `${req.nextUrl.origin}/api/social/oauth/callback`;

  // State parameter for CSRF validation and project context
  const state = Buffer.from(
    JSON.stringify({
      platform,
      projectId,
      isPopup,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(7),
    })
  ).toString("base64url");

  const clientIdVar = provider.requiredEnvVars[0];
  const clientId = process.env[clientIdVar];

  // If real OAuth Client ID is configured in production, redirect to provider
  if (clientId && clientId !== "TWITTER_CLIENT_ID_PLACEHOLDER" && provider.authUrl) {
    const targetUrl = new URL(provider.authUrl);
    targetUrl.searchParams.set("client_id", clientId);
    targetUrl.searchParams.set("redirect_uri", redirectUri);
    targetUrl.searchParams.set("response_type", "code");
    targetUrl.searchParams.set("scope", provider.defaultScopes.join(" "));
    targetUrl.searchParams.set("state", state);
    return NextResponse.redirect(targetUrl);
  }

  // Interactive Sprout Social & Buffer.com Authorization Consent Window
  const consentHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Connect ${provider.name} | OKN Social OS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; }
          body {
            background: #080A0F;
            color: #F8FAFC;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            width: 100%;
            max-width: 440px;
            background: #0D1016;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 28px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
          }
          .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .icon-badge {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: rgba(59,130,246,0.15);
            border: 1px solid rgba(59,130,246,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }
          .title { font-size: 15px; font-weight: 700; color: #FFFFFF; margin: 0; }
          .subtitle { font-size: 11px; color: #94A3B8; margin-top: 2px; }
          .scope-box {
            background: rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 14px;
            padding: 14px;
            margin-bottom: 20px;
          }
          .scope-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #60A5FA; font-weight: 700; margin-bottom: 10px; }
          .scope-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #CBD5E1;
            margin-bottom: 6px;
          }
          .check { color: #10B981; font-weight: bold; }
          .btn-primary {
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            background: #2563EB;
            color: #FFFFFF;
            font-weight: 600;
            font-size: 13px;
            border: none;
            cursor: pointer;
            transition: background 0.15s;
            box-shadow: 0 4px 14px rgba(37,99,235,0.4);
          }
          .btn-primary:hover { background: #1D4ED8; }
          .btn-cancel {
            width: 100%;
            padding: 10px;
            margin-top: 8px;
            border-radius: 12px;
            background: transparent;
            color: #94A3B8;
            font-size: 12px;
            border: 1px solid rgba(255,255,255,0.08);
            cursor: pointer;
          }
          .btn-cancel:hover { color: #FFFFFF; background: rgba(255,255,255,0.04); }
          .footer-note { font-size: 10px; text-align: center; color: #64748B; margin-top: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon-badge">⚡</div>
            <div>
              <h2 class="title">Authorize ${provider.name}</h2>
              <div class="subtitle">Granting access to OKN Social Command Center</div>
            </div>
          </div>

          <div class="scope-box">
            <div class="scope-title">Permissions Requested (Buffer Style):</div>
            ${provider.defaultScopes.map(s => `
              <div class="scope-item">
                <span class="check">✓</span>
                <span>${s}</span>
              </div>
            `).join('')}
          </div>

          <form method="GET" action="/api/social/oauth/callback">
            <input type="hidden" name="code" value="auth_code_${Date.now()}" />
            <input type="hidden" name="state" value="${state}" />
            <button type="submit" class="btn-primary">Allow Access &amp; Connect Account</button>
            <button type="button" class="btn-cancel" onclick="window.close()">Cancel Authorization</button>
          </form>

          <div class="footer-note">
            Target Ecosystem: ${projectId === "okn-token" ? "https://okntoken.com" : "https://oknexusexchange.com"}
          </div>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(consentHtml, { headers: { "Content-Type": "text/html" } });
}
