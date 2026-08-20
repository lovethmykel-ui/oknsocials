/**
 * POST /api/webhooks/[platform]
 *
 * Real-time Webhook Ingestion Endpoint (Buffer.com Style).
 * Listens for incoming mentions, replies, DMs, and community events
 * from Twitter Account Activity API, Telegram Webhook, Meta Graph Webhook, etc.
 */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;
  const searchParams = req.nextUrl.searchParams;

  // Meta Graph Webhook verification challenge (hub.challenge)
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  // Twitter CRC Challenge (crc_token)
  const crcToken = searchParams.get("crc_token");
  if (crcToken) {
    return NextResponse.json({ response_token: `sha256=${crcToken}` });
  }

  return NextResponse.json({ status: "active", platform, message: "Webhook listener active." });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform } = await params;

  try {
    const payload = await req.json();
    console.log(`[OKN Webhook] Ingested incoming event from ${platform}:`, JSON.stringify(payload).slice(0, 120));

    return NextResponse.json({
      received: true,
      platform,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json({ received: false, error: "Invalid webhook payload" }, { status: 400 });
  }
}
