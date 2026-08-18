import { IntentCategory, ProjectId } from "@/types";
import { mockProjectBrains } from "../data/mockData";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface RiskEvaluationResult {
  riskLevel: RiskLevel;
  requiresHumanApproval: boolean;
  blocked: boolean;
  policyTriggered: string;
  violations: string[];
  reason: string;
}

const HIGH_RISK_KEYWORDS = [
  "guaranteed profit",
  "100x",
  "insider trading",
  "private key",
  "seed phrase",
  "security token",
  "unregistered securities",
  "lawsuit",
  "fbi",
  "sec investigation",
  "guaranteed return",
  "deposit now to double",
];

const MEDIUM_RISK_KEYWORDS = [
  "when listing",
  "binance listing",
  "coinbase listing",
  "price prediction",
  "financial advice",
  "target price",
  "airdrop link",
];

export function evaluateSafetyAndRisk(
  text: string,
  projectId: ProjectId,
  intent?: IntentCategory
): RiskEvaluationResult {
  const lowerText = text.toLowerCase();
  const brain = mockProjectBrains[projectId];
  const violations: string[] = [];

  // Check Critical Keywords (Impersonation, Phishing, Keys)
  if (
    lowerText.includes("seed phrase") ||
    lowerText.includes("private key") ||
    lowerText.includes("okn-claim") ||
    lowerText.includes("airdrop-claim")
  ) {
    return {
      riskLevel: "critical",
      requiresHumanApproval: true,
      blocked: true,
      policyTriggered: "POLICY-CRITICAL-SECURITY-ISOLATION",
      violations: ["Potential credential phishing / scam vector"],
      reason: "Attempt to solicit keys or unauthorized claim link detected.",
    };
  }

  // Check Forbidden Claims from Project Brain
  if (brain) {
    for (const forbidden of brain.forbiddenClaims) {
      if (lowerText.includes(forbidden.toLowerCase())) {
        violations.push(`Forbidden Claim Triggered: "${forbidden}"`);
      }
    }
  }

  // High Risk Flags
  for (const kw of HIGH_RISK_KEYWORDS) {
    if (lowerText.includes(kw)) {
      violations.push(`High-Risk Financial Keyword: "${kw}"`);
    }
  }

  if (violations.length > 0) {
    return {
      riskLevel: "high",
      requiresHumanApproval: true,
      blocked: false,
      policyTriggered: "POLICY-FINANCIAL-PROMISES-BLOCKED",
      violations,
      reason: "Content involves speculative financial promises or unapproved statements.",
    };
  }

  // Medium Risk Flags
  for (const kw of MEDIUM_RISK_KEYWORDS) {
    if (lowerText.includes(kw)) {
      return {
        riskLevel: "medium",
        requiresHumanApproval: true,
        blocked: false,
        policyTriggered: "POLICY-LISTING-SPECULATION-GUARD",
        violations: [`Medium-risk speculative phrase: "${kw}"`],
        reason: "Speculative listing or price query requires human verification.",
      };
    }
  }

  // Intent Specific Risk
  if (intent === "Security Concern" || intent === "Scam Alert") {
    return {
      riskLevel: "high",
      requiresHumanApproval: true,
      blocked: false,
      policyTriggered: "POLICY-SECURITY-ALERT-TRIAGE",
      violations: ["Security alert requires priority triage"],
      reason: "Security concerns automatically escalate to staff.",
    };
  }

  return {
    riskLevel: "low",
    requiresHumanApproval: false,
    blocked: false,
    policyTriggered: "POLICY-STANDARD-AUTONOMOUS-ENGAGEMENT",
    violations: [],
    reason: "Passed all safety rules, approved for assisted or autonomous response.",
  };
}
