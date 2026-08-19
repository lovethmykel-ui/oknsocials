/**
 * POST /api/ai/generate-variants
 *
 * Server Route — calls Gemini AI with automatic multi-model fallback to generate platform-tailored copies
 * for X, Instagram, LinkedIn, Telegram, YouTube, TikTok, and Facebook.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, CONTENT_MODEL } from "@/lib/ai/geminiClient";
import { mockProjectBrains } from "@/lib/data/mockData";
import { evaluateSafetyAndRisk } from "@/lib/ai/safetyEngine";
import { ProjectId, PlatformId } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, concept, tone } = body as {
      projectId: ProjectId;
      concept: string;
      tone?: string;
      platforms?: string[];
    };

    if (!concept?.trim()) {
      return NextResponse.json({ error: "Concept text is required." }, { status: 400 });
    }

    const brain = mockProjectBrains[projectId];
    const projectName = brain?.name || (projectId === "okn-token" ? "OKN Token" : "OKNEXUS Exchange");
    const officialUrl = projectId === "okn-token" ? "https://okntoken.com" : "https://oknexusexchange.com";
    const brandVoice = brain?.brandVoice?.length ? brain.brandVoice.join(", ") : (projectId === "okn-token" ? "Professional, visionary, trustworthy" : "Technical, precise, institutional-grade");
    const approvedClaims = brain?.approvedClaims?.slice(0, 3).join(", ") || "";
    const forbiddenClaims = brain?.forbiddenClaims?.slice(0, 4).join(", ") || "guaranteed returns, risk-free, 100x, private key";
    const hashtags = brain?.hashtags?.join(" ") || (projectId === "okn-token" ? "#OKN #Web3 #Crypto" : "#OKNEXUS #PerpDEX #DeFi");
    const effectiveTone = tone || brandVoice;

    const prompt = `You are the Lead Social Media Architect for ${projectName} (Official Website: ${officialUrl}).

Brand Voice: ${effectiveTone}
Official URL: ${officialUrl}
Approved Value Claims: ${approvedClaims}
Strictly Forbidden Claims: ${forbiddenClaims} (DO NOT promise financial profits or use pump language)
Official Hashtags: ${hashtags}

Raw content concept:
"""
${concept.trim()}
"""

Generate 7 platform-tailored social media variations. Respond in strict JSON format with this exact structure:
{
  "x": "Twitter post under 280 chars with punchy hook, official link ${officialUrl}, and 2 hashtags",
  "instagram": "Instagram caption (100-200 words) with storytelling, line breaks, bio link CTA, and 6 hashtags",
  "linkedin": "LinkedIn post (150-250 words) with professional executive tone, bullet points, official link ${officialUrl}, and 3 hashtags",
  "telegram": "Telegram community update with **bold** formatting, update emoji, and official link ${officialUrl}",
  "youtube": "YouTube video description (100-150 words) with official links and SEO tags",
  "tiktok": "TikTok caption under 150 chars with energetic hook and 4 trending tags",
  "facebook": "Facebook community post (80-120 words) with discussion question and link ${officialUrl}"
}

Respond ONLY with valid JSON. No markdown code blocks, no other text.`;

    const { text: rawOutput, modelUsed } = await generateWithFallback(prompt, { temperature: 0.82 });
    
    let rawText = rawOutput;
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    let parsedJson: Record<string, string> = {};
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      console.warn("[OKN AI] JSON parsing fallback triggered.");
    }

    const estimatedReach: Record<PlatformId, number> = {
      x: 54000,
      instagram: 28000,
      linkedin: 16000,
      telegram: 61000,
      youtube: 11000,
      tiktok: 32000,
      facebook: 14000,
    };

    const fallbackTemplates: Record<PlatformId, string> = {
      x: `⚡ ${concept.trim()}\n\nOfficial Portal: ${officialUrl}\n${hashtags}`,
      instagram: `${concept.trim()}\n\nArchitectural milestone for the ${projectName} ecosystem.\n\n🔗 Learn more: ${officialUrl}\n\n${hashtags}`,
      linkedin: `We are pleased to share our latest milestone for ${projectName}:\n\n${concept.trim()}\n\nExplore official documentation: ${officialUrl}\n\n#Fintech #DeFi #InstitutionalCrypto`,
      telegram: `📢 **${projectName} Official Announcement**\n\n${concept.trim()}\n\n👉 Portal: ${officialUrl}\n${hashtags}`,
      youtube: `${projectName} Official Update\n\n${concept.trim()}\n\nVisit: ${officialUrl}\n\n${hashtags}`,
      tiktok: `${concept.trim()} ⚡ Discover more at ${officialUrl} #crypto #web3 #trading`,
      facebook: `${concept.trim()}\n\nStay connected with official ${projectName} ecosystem developments at ${officialUrl}`,
    };

    const platforms: PlatformId[] = ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"];
    const variants: Record<PlatformId, { text: string; hashtags: string[]; estimatedReach: number }> = {} as any;

    for (const p of platforms) {
      const text = parsedJson[p] || fallbackTemplates[p];
      const extracted = (text.match(/#\w+/g) || []).slice(0, 8);
      variants[p] = {
        text,
        hashtags: extracted.length ? extracted : (projectId === "okn-token" ? ["#OKN", "#Web3"] : ["#OKNEXUS", "#DeFi"]),
        estimatedReach: estimatedReach[p] || 10000,
      };
    }

    // Run safety classification on the full combined output
    const combinedText = Object.values(variants).map((v) => v.text).join(" ");
    const safety = evaluateSafetyAndRisk(combinedText, projectId);

    return NextResponse.json({
      variants,
      safety: {
        tier: safety.riskLevel,
        score: safety.riskLevel === "low" ? 0.02 : safety.riskLevel === "medium" ? 0.45 : safety.riskLevel === "high" ? 0.75 : 0.99,
        flags: safety.violations,
        approved: !safety.blocked && !safety.requiresHumanApproval,
      },
      model: modelUsed,
      projectId,
      officialUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    console.error("[OKN AI] /api/ai/generate-variants error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
