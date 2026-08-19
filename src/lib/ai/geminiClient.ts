/**
 * OKN Social OS — Gemini AI Client with Multi-Model Fallback & Auto-Retry
 * Server-side only. Uses GEMINI_API_KEY environment variable.
 */

import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey && process.env.NODE_ENV === "production") {
  console.warn("[OKN AI] GEMINI_API_KEY is not set. AI generation will be unavailable.");
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Primary and secondary models in order of preference
export const MODEL_CANDIDATES = [
  "gemini-flash-latest",
  "gemini-pro-latest",
  "gemini-3.5-flash",
];

export const CONTENT_MODEL = MODEL_CANDIDATES[0];

export const defaultGenerationConfig: GenerationConfig = {
  temperature: 0.85,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2500,
};

/**
 * Executes a prompt with automatic multi-model fallback and retry
 */
export async function generateWithFallback(
  prompt: string,
  config: Partial<GenerationConfig> = {}
): Promise<{ text: string; modelUsed: string }> {
  if (!genAI) {
    throw new Error("Gemini API key is not configured. Set GEMINI_API_KEY in your .env.local file.");
  }

  let lastError: Error | null = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { ...defaultGenerationConfig, ...config },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      return { text, modelUsed: modelName };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[OKN AI] Model ${modelName} failed, trying next candidate... (${lastError.message.slice(0, 80)})`);
    }
  }

  throw lastError || new Error("All Gemini model candidates failed.");
}

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
