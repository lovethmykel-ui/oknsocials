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
import { getGeminiModel } from "@/lib/ai/geminiClient";
import { mockProjectBrains } from "@/lib/data/mockData";
import { evaluateSafetyAndRisk } from "@/lib/ai/safetyEngine";
import { ProjectId } from "@/types";

export const runtime = "nodejs";

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  x: "Twitter/X post: max 280 characters. Punchy, attention-grabbing opening. Include 2-3 hashtags at end. Add 1 CTA emoji and link signal. No markdown.",
  instagram: "Instagram caption: 150-300 words. Inspirational + technical. Use line breaks for readability. Add 8-10 hashtags at end. Include CTA to link in bio.",
  linkedin: "LinkedIn post: 200-400 words. Professional tone. Lead with insight, use numbered lists for key points. Add 3-5 hashtags. End with a thought-provoking question.",
  telegram: "Telegram community message: conversational and warm. Use **bold** for key terms. Include an update emoji prefix. Add community call-to-action. 100-200 words.",
  youtube: "YouTube video description: 200-300 words. Include timestamps placeholder, official links, and SEO-friendly keywords. Friendly but authoritative tone.",
  tiktok: "TikTok caption: max 150 characters + 4-5 trending hashtags. Casual, energetic, hook-first. Use Gen Z-adjacent tone without being cringy.",
  facebook: "Facebook post: 100-200 words. Community-focused. Clear and accessible. Add a question to drive comments.",
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
    const projectName = brain?.name || "OKN Token";
    const brandVoice = brain?.brandVoice || "Professional, visionary, trustworthy";
    const approvedClaims = brain?.approvedClaims?.slice(0, 3).join(", ") || "";
    const forbiddenClaims = brain?.forbiddenClaims?.slice(0, 3).join(", ") || "";
    const hashtags = brain?.hashtags?.join(", ") || "#OKN #Web3 #DeFi";
    const effectiveTone = tone || brandVoice;

    const model = getGeminiModel("gemini-2.0-flash", { temperature: 0.82 });

    // Run all 7 platform generations in parallel for speed
    const platformIds = ["x", "instagram", "linkedin", "telegram", "youtube", "tiktok", "facebook"] as const;

    const results = await Promise.allSettled(
      platformIds.map(async (platform) => {
        const instruction = PLATFORM_INSTRUCTIONS[platform];

        const prompt = `You are the AI Social Director for ${projectName}, a premier crypto/Web3 ecosystem brand.

Brand Voice: ${effectiveTone}
Approved claims you CAN make: ${approvedClaims}
Claims you MUST NEVER make: ${forbiddenClaims} (no guaranteed returns, no "risk-free", no pump language)
Official hashtags: ${hashtags}

Raw content concept to adapt:
"""
${concept.trim()}
"""

Task: Write a ${platform.toUpperCase()} social post following these exact instructions:
${instruction}

Return ONLY the post text — no explanations, no quotes, no labels. Just the final post copy.`;

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
        // Extract hashtags from generated text
        const extracted = (text.match(/#\w+/g) || []).slice(0, 8);
        variants[platform] = {
          text,
          hashtags: extracted.length ? extracted : ["#OKN", "#Web3"],
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
      model: "gemini-2.0-flash",
      projectId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI generation failed";
    console.error("[OKN AI] /api/ai/generate-variants error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
