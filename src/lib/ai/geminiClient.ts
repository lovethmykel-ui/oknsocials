/**
 * OKN Social OS — Gemini AI Client
 * Server-side only. Never import this from client components.
 * Uses the GEMINI_API_KEY environment variable (not prefixed NEXT_PUBLIC_).
 */

import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && process.env.NODE_ENV === "production") {
  console.warn("[OKN AI] GEMINI_API_KEY is not set. AI generation will be unavailable.");
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Default working model for this API key
export const CONTENT_MODEL = "gemini-flash-latest";

// Default generation config — balanced for social content
export const defaultGenerationConfig: GenerationConfig = {
  temperature: 0.85,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
};

/**
 * Get a Gemini model instance with optional custom config
 */
export function getGeminiModel(
  modelName: string = CONTENT_MODEL,
  config: Partial<GenerationConfig> = {}
) {
  if (!genAI) {
    throw new Error("Gemini API key is not configured. Set GEMINI_API_KEY in your .env.local file.");
  }

  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { ...defaultGenerationConfig, ...config },
  });
}
