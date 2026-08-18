"use client";

import React, { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { ProjectId, PlatformId, PostVariant, PostType } from "@/types";
import { mockProjectBrains, mockMediaVault } from "@/lib/data/mockData";
import { generatePlatformVariants } from "@/lib/ai/contentGenerator";
import { evaluateSafetyAndRisk, RiskEvaluationResult } from "@/lib/ai/safetyEngine";
import { GlassPanel } from "../ui/GlassPanel";
import { PlatformBadge } from "../ui/PlatformBadge";
import { AIIndicator } from "../ui/AIIndicator";
import { StatusBadge } from "../ui/StatusBadge";
import {
  XPreview,
  InstagramPreview,
  LinkedInPreview,
  TelegramPreview,
} from "../preview/PlatformPreviews";
import {
  PenTool,
  Sparkles,
  Send,
  Calendar,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Zap,
  CheckCircle2,
  Clock,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentStudioViewProps {
  currentProject: ProjectId;
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({ currentProject }) => {
  const brain = mockProjectBrains[currentProject];
  const [postType, setPostType] = useState<PostType>("multi");
  const [rawConcept, setRawConcept] = useState<string>(
    "OKNEXUS Perpetual DEX Liquidity Vaults are officially opening. Sub-millisecond execution pipeline, institutional depth, zero counterparty drag."
  );
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>("/assets/3d/01_master_3d_atlas.png");
  const [selectedPreviewPlatform, setSelectedPreviewPlatform] = useState<PlatformId>("x");
  const [isGenerating, setIsGenerating] = useState(false);
  const [safetyResult, setSafetyResult] = useState<RiskEvaluationResult | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  // Initialize generated variants
  const [variants, setVariants] = useState<Record<PlatformId, PostVariant>>(() =>
    generatePlatformVariants({
      projectId: currentProject,
      rawConcept,
      primaryMediaUrl: selectedMediaUrl,
    })
  );

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generatePlatformVariants({
        projectId: currentProject,
        rawConcept,
        primaryMediaUrl: selectedMediaUrl,
      });
      setVariants(generated);

      const safety = evaluateSafetyAndRisk(rawConcept, currentProject);
      setSafetyResult(safety);
      setIsGenerating(false);
    }, 400);
  };

  const handlePublishNow = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3B82F6", "#38BDF8", "#8B5CF6", "#10B981"],
    });
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 4000);
  };

  const currentVariant = variants[selectedPreviewPlatform] || variants.x;

  const postTypes: { id: PostType; label: string }[] = [
    { id: "multi", label: "Multi-Platform" },
    { id: "single", label: "Single Post" },
    { id: "thread", label: "Thread" },
    { id: "carousel", label: "Carousel" },
    { id: "video", label: "Short / Video" },
    { id: "announcement", label: "Announcement" },
  ];

  const previewPlatforms: PlatformId[] = [
    "x",
    "instagram",
    "linkedin",
    "telegram",
    "youtube",
    "tiktok",
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PenTool className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono uppercase font-bold text-blue-400 tracking-wider">
              CONTENT STUDIO WORKSPACE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Adaptive Multi-Channel Composer
          </h2>
          <p className="text-xs text-slate-400">
            Intelligent format adaptation governed by {brain?.name || "OKN Brain"} policies.
          </p>
        </div>

        {/* Post Type Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/[0.08]">
          {postTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setPostType(type.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                postType === type.id
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Grid: Composer vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Content Concept & Adaptation Editor */}
        <div className="lg:col-span-7 space-y-5">
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Raw Narrative / Campaign Hook
                </span>
              </div>
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 text-violet-200 text-xs font-semibold shadow-sm transition-colors"
              >
                <Sparkles className={cn("w-3.5 h-3.5 text-violet-400", isGenerating && "animate-spin")} />
                <span>{isGenerating ? "Synthesizing..." : "AI Adapt Across 7 Platforms"}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={rawConcept}
              onChange={(e) => setRawConcept(e.target.value)}
              placeholder="Enter release concept, architectural highlights, or announcement text..."
              className="w-full p-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 leading-relaxed resize-none mb-3"
            />

            {/* Media Vault Quick Selector */}
            <div className="mb-4">
              <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
                <span>Attach Media Vault Asset</span>
                <span className="text-slate-500 font-mono text-[10px]">6 assets available</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {mockMediaVault.map((med) => (
                  <div
                    key={med.id}
                    onClick={() => setSelectedMediaUrl(med.url)}
                    className={cn(
                      "relative aspect-video rounded-lg overflow-hidden border cursor-pointer transition-all bg-black flex items-center justify-center p-0.5",
                      selectedMediaUrl === med.url
                        ? "border-blue-400 ring-2 ring-blue-500/30 scale-105"
                        : "border-white/10 opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={med.url} alt={med.title} fill className="object-contain" />
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Compliance Card */}
            {safetyResult && (
              <div
                className={cn(
                  "p-3.5 rounded-xl border text-xs mb-4 flex items-start gap-2.5",
                  safetyResult.riskLevel === "low"
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                    : "bg-amber-950/20 border-amber-500/30 text-amber-200"
                )}
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">
                    Risk Engine Status: <span className="uppercase">{safetyResult.riskLevel}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{safetyResult.reason}</div>
                </div>
              </div>
            )}

            {/* Active Platform Variant Text Editor */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.07] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={selectedPreviewPlatform} size="sm" />
                  <span className="text-xs font-semibold text-slate-300">
                    Platform Variant Content
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  {currentVariant.text.length} / {currentVariant.charLimit} chars
                </span>
              </div>

              <textarea
                rows={4}
                value={currentVariant.text}
                onChange={(e) => {
                  const val = e.target.value;
                  setVariants((prev) => ({
                    ...prev,
                    [selectedPreviewPlatform]: {
                      ...prev[selectedPreviewPlatform],
                      text: val,
                    },
                  }));
                }}
                className="w-full p-3 rounded-lg bg-[#080A0F] border border-white/[0.08] text-xs text-white font-sans leading-relaxed focus:outline-none focus:border-blue-500/50"
              />

              {/* Hashtag & Variable Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {currentVariant.hashtags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/40 text-blue-300 border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-white/[0.08]">
              <button className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/[0.08] transition-colors">
                Save Draft
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePublishNow}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Schedule Release</span>
                </button>
                <button
                  onClick={handlePublishNow}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish All Now</span>
                </button>
              </div>
            </div>

            {isPublished && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Publication payload dispatched successfully across connected channels!</span>
              </div>
            )}
          </GlassPanel>
        </div>

        {/* Right Column (5 cols): Live Real-Time Platform Previews */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-3 rounded-xl bg-[#0D1016] border border-white/[0.08]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
              Select Preview Platform
            </div>
            <div className="flex flex-wrap gap-1.5">
              {previewPlatforms.map((plat) => (
                <button
                  key={plat}
                  onClick={() => setSelectedPreviewPlatform(plat)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                    selectedPreviewPlatform === plat
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                      : "text-slate-400 hover:text-slate-200 bg-white/[0.02]"
                  )}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            {selectedPreviewPlatform === "x" && (
              <XPreview variant={currentVariant} />
            )}
            {selectedPreviewPlatform === "instagram" && (
              <InstagramPreview variant={currentVariant} />
            )}
            {selectedPreviewPlatform === "linkedin" && (
              <LinkedInPreview variant={currentVariant} />
            )}
            {selectedPreviewPlatform === "telegram" && (
              <TelegramPreview variant={currentVariant} />
            )}
            {(selectedPreviewPlatform === "youtube" || selectedPreviewPlatform === "tiktok") && (
              <XPreview variant={currentVariant} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
