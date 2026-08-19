/**
 * POST /api/ai/generate-variants
 *
 * Server Route — accepts a raw content concept + project context,
 * calls Gemini to generate platform-optimized variants for all 7 social platforms,
 * and returns the adapted copies with safety classifications.
 *
 * Body: { projectId, concept, platforms?, tone? }
 * Response: { variants: Record<PlatformId, { text, hashtags, estimatedReach }>, safety }
 */

import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel, CONTENT_MODEL } from "@/lib/ai/geminiClient";
import { mockProjectBrains } from "@/lib/data/mockData";
import { evaluateSafetyAndRisk } from "@/lib/ai/safetyEngine";
import { ProjectId } from "@/types";

export const runtime = "nodejs";

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  x: "Twitter/X post: max 280 characters. Punchy, attention-grabbing opening. Include 2-3 hashtags at end. Add official link and CTA. No markdown.",
  instagram: "Instagram caption: 120-250 words. Engaging, visually descriptive. Use line breaks for readability. Add 6-8 hashtags at end. Include CTA to official website.",
  linkedin: "LinkedIn post: 150-300 words. Professional, executive tone. Lead with an industry/infrastructure insight, use bullet points for key architecture features. End with official link and 3 hashtags.",
  telegram: "Telegram community update: conversational and bold. Use **bold** for key terms. Include official link, launch details, and community call-to-action.",
  youtube: "YouTube video title and description: 150-200 words. Include official website links, clear value proposition, and SEO hashtags.",
  tiktok: "TikTok caption: max 150 characters + 4-5 trending tags. Energetic, direct, hook-first.",
  facebook: "Facebook update: 80-150 words. Community-focused, accessible, with official website link and discussion question.",
};

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

    const model = getGeminiModel(CONTENT_MODEL, { temperature: 0.82 });

    // Run all 7 platform generations in parallel for speed
    const platformIds = ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"] as const;

    const results = await Promise.allSettled(
      platformIds.map(async (platform) => {
        const instruction = PLATFORM_INSTRUCTIONS[platform];

        const prompt = `You are the Senior AI Content Architect for ${projectName} (Official URL: ${officialUrl}), a premier crypto/Web3 ecosystem platform.

Brand Voice: ${effectiveTone}
Official Website: ${officialUrl}
Approved Value Points: ${approvedClaims}
Strictly Forbidden Claims: ${forbiddenClaims} (DO NOT guarantee financial profits or use pump language)
Official Hashtags: ${hashtags}

Raw content concept to adapt:
"""
${concept.trim()}
"""

Task: Write an exceptional ${platform.toUpperCase()} social post following these exact specifications:
${instruction}

Return ONLY the final ready-to-publish post text. Do not wrap in quotes or add meta commentary.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        return { platform, text };
      })
    );

    // Build variants object
    const variants: Record<string, { text: string; hashtags: string[]; estimatedReach: number }> = {};
    const estimatedReach: Record<string, number> = {
      x: 54000, instagram: 28000, linkedin: 16000, telegram: 61000,
      youtube: 11000, tiktok: 32000, facebook: 14000,
    };

    for (const result of results) {
      if (result.status === "fulfilled") {
        const { platform, text } = result.value;
        const extracted = (text.match(/#\w+/g) || []).slice(0, 8);
        variants[platform] = {
          text,
          hashtags: extracted.length ? extracted : (projectId === "okn-token" ? ["#OKN", "#Web3"] : ["#OKNEXUS", "#DeFi"]),
          estimatedReach: estimatedReach[platform] || 10000,
        };
      }
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
      model: CONTENT_MODEL,
      projectId,
      officialUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    console.error("[OKN AI] /api/ai/generate-variants error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
