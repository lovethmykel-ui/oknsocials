/**
 * POST /api/ai/director-brief
 *
 * AI Social Director briefing endpoint — uses Gemini to analyze current
 * project state and produce an executive intelligence brief for the dashboard.
 *
 * Body: { projectId, stats }
 * Response: { brief, recommendations, riskScore, sentiment }
 */

import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai/geminiClient";
import { ProjectId } from "@/types";
import { mockProjectBrains, mockSocialAccounts, mockConversations } from "@/lib/data/mockData";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId } = body as { projectId: ProjectId };

    const brain = mockProjectBrains[projectId];
    const accounts = mockSocialAccounts.filter((a) => a.projectId === projectId);
    const convs = mockConversations.filter((c) => c.projectId === projectId);

    const positiveSentiment = convs.filter((c) => c.sentiment === "positive").length;
    const sentimentPct = convs.length > 0 ? Math.round((positiveSentiment / convs.length) * 100) : 94;
    const totalFollowers = accounts.reduce((s, a) => s + a.followers, 0);
    const platforms = accounts.map((a) => a.platform).join(", ");

    const model = getGeminiModel("gemini-2.0-flash", { temperature: 0.7, maxOutputTokens: 512 });

    const prompt = `You are the AI Social Director for ${brain?.name || "OKN Token"}, a high-stakes Web3 brand.

Current snapshot:
- Active platforms: ${platforms}
- Total community: ${totalFollowers.toLocaleString()} followers
- Incoming conversations analyzed: ${convs.length}
- Positive sentiment: ${sentimentPct}%
- Pending content pieces: 4 ready for publish
- Active campaigns: 1 (Phase 2 of 5)

Your task: Write a concise 3-sentence executive intelligence brief for the team. Include:
1. Current community sentiment status
2. One key risk or opportunity detected
3. One concrete autonomous action recommendation

Tone: Professional, data-driven, decisive. No bullet points — flowing prose only. Max 80 words.`;

    const result = await model.generateContent(prompt);
    const brief = result.response.text().trim();

    return NextResponse.json({
      brief,
      sentiment: sentimentPct,
      totalFollowers,
      activePlatforms: accounts.length,
      pendingPosts: 4,
      riskScore: 0.02,
      riskTier: "low",
      model: "gemini-2.0-flash",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Director brief generation failed";
    console.error("[OKN AI] /api/ai/director-brief error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
