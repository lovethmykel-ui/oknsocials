import { PlatformId, PostVariant, ProjectId } from "@/types";
import { mockProjectBrains } from "../data/mockData";

export interface GenerateVariantsOptions {
  projectId: ProjectId;
  rawConcept: string;
  tone?: string;
  primaryMediaUrl?: string;
  includeCTA?: boolean;
}

export function generatePlatformVariants({
  projectId,
  rawConcept,
  primaryMediaUrl = "/assets/3d/01_master_3d_atlas.png",
  includeCTA = true,
}: GenerateVariantsOptions): Record<PlatformId, PostVariant> {
  const brain = mockProjectBrains[projectId];
  const hashtags = brain ? brain.hashtags.slice(0, 3) : ["#OKN", "#Web3"];
  const cta = brain?.ctaLibrary[0]?.label || "Learn more at okn.io";

  // Platform specific adaptations
  const xText = `⚡ ${rawConcept.trim()}\n\nKey takeaways:\n• Engineered for institutional throughput\n• Zero-counterparty settlement\n\n${includeCTA ? `Explore details 👇` : ""}\n${hashtags.join(" ")}`;

  const igText = `${rawConcept.trim()}\n\nDesigned for scale. Built for the next era of decentralized infrastructure.\n\n${includeCTA ? `🔗 Tap link in bio to read full architecture briefing.` : ""}\n\n${hashtags.concat(["#CryptoDesign", "#Fintech"]).join(" ")}`;

  const linkedinText = `We are pleased to share an important ecosystem milestone:\n\n${rawConcept.trim()}\n\nArchitectural Highlights:\n1. Sub-millisecond execution pipeline\n2. Real-time deterministic risk engine\n3. Institutional liquidity aggregation\n\n${includeCTA ? `Review documentation: https://okn.io/arch` : ""}\n\n#Fintech #DeFi #InstitutionalCrypto #OKN`;

  const ytText = `${rawConcept.trim()} — Official Architecture & Operations Briefing\n\nIn this technical breakdown, we explore the mechanical foundations, security audits, and deployment timeline.\n\nTimestamps:\n0:00 Introduction\n1:24 Engine Architecture\n3:45 Safety Protocols\n\nOfficial website: https://okn.io`;

  const tiktokText = `How the OKN ecosystem is solving sub-millisecond on-chain execution ⚡\n\n${rawConcept.slice(0, 100)}...\n\n#cryptotips #okn #tradinghacks #web3`;

  const tgText = `📢 **${brain?.name || "OKN Ecosystem"} Announcement**\n\n${rawConcept.trim()}\n\n${includeCTA ? `👉 Portal: https://okn.io` : ""}\n${hashtags.join(" ")}`;

  const fbText = `${rawConcept.trim()}\n\nStay connected with official OKN ecosystem developments.`;

  return {
    x: {
      platform: "x",
      text: xText,
      mediaUrls: [primaryMediaUrl],
      hashtags,
      charLimit: 280,
      estimatedReach: projectId === "okn-token" ? 54000 : 42000,
    },
    instagram: {
      platform: "instagram",
      text: igText,
      mediaUrls: [primaryMediaUrl],
      hashtags: hashtags.concat(["#CryptoDesign"]),
      charLimit: 2200,
      estimatedReach: projectId === "okn-token" ? 22000 : 28000,
    },
    linkedin: {
      platform: "linkedin",
      text: linkedinText,
      mediaUrls: [primaryMediaUrl],
      hashtags: ["#Fintech", "#DeFi"],
      charLimit: 3000,
      estimatedReach: 16000,
    },
    youtube: {
      platform: "youtube",
      text: ytText,
      mediaUrls: [primaryMediaUrl],
      hashtags: ["#OKN", "#DeFi"],
      charLimit: 5000,
      estimatedReach: 11000,
    },
    tiktok: {
      platform: "tiktok",
      text: tiktokText,
      mediaUrls: [primaryMediaUrl],
      hashtags: ["#cryptotips", "#okn"],
      charLimit: 2200,
      estimatedReach: 32000,
    },
    telegram: {
      platform: "telegram",
      text: tgText,
      mediaUrls: [primaryMediaUrl],
      hashtags,
      charLimit: 4096,
      estimatedReach: 61000,
    },
    facebook: {
      platform: "facebook",
      text: fbText,
      mediaUrls: [primaryMediaUrl],
      hashtags,
      charLimit: 5000,
      estimatedReach: 14000,
    },
  };
}
