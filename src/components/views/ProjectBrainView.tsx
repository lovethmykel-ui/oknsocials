"use client";

import React, { useState } from "react";
import { ProjectId, ProjectBrain } from "@/types";
import { mockProjectBrains, mockProjects } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import {
  BrainCircuit,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Hash,
  Link as LinkIcon,
  ExternalLink,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectBrainViewProps {
  currentProject: ProjectId;
}

export const ProjectBrainView: React.FC<ProjectBrainViewProps> = ({ currentProject }) => {
  const project = mockProjects.find((p) => p.id === currentProject) || mockProjects[0];
  const initialBrain = mockProjectBrains[currentProject] || mockProjectBrains["okn-token"];
  
  const officialUrl = currentProject === "okn-token" ? "https://okntoken.com" : "https://oknexusexchange.com";

  const [brain, setBrain] = useState<ProjectBrain>({
    ...initialBrain,
    approvedClaims: initialBrain.approvedClaims?.length
      ? initialBrain.approvedClaims
      : currentProject === "okn-token"
      ? [
          "OKN Token is the foundational ecosystem utility and community token.",
          "Official domain is https://okntoken.com with non-custodial smart contracts.",
          "Zero-counterparty execution and decentralized token governance.",
        ]
      : [
          "OKNEXUS Exchange is the premier perpetual DEX at https://oknexusexchange.com.",
          "Sub-millisecond on-chain order routing with deep institutional liquidity.",
          "Self-custodial perpetuals trading with zero counterparty settlement drag.",
        ],
    ctaLibrary: initialBrain.ctaLibrary?.length
      ? initialBrain.ctaLibrary
      : [
          {
            label: `Explore ${project.name}`,
            url: officialUrl,
            context: "General ecosystem portal CTA",
          },
        ],
  });

  const [newClaim, setNewClaim] = useState("");
  const [newForbidden, setNewForbidden] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddApprovedClaim = () => {
    if (!newClaim.trim()) return;
    setBrain((prev) => ({
      ...prev,
      approvedClaims: [...prev.approvedClaims, newClaim.trim()],
    }));
    setNewClaim("");
  };

  const handleAddForbiddenClaim = () => {
    if (!newForbidden.trim()) return;
    setBrain((prev) => ({
      ...prev,
      forbiddenClaims: [...prev.forbiddenClaims, newForbidden.trim()],
    }));
    setNewForbidden("");
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    setBrain((prev) => ({
      ...prev,
      approvedKeywords: [...prev.approvedKeywords, newKeyword.trim()],
    }));
    setNewKeyword("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {brain.name} AI Brain & Guidelines
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Knowledge base and safety guardrails enforced across Gemini generation and AI agent actions
            </p>
          </div>
        </div>

        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <span>{officialUrl}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Grid: Approved vs Forbidden Claims */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approved Claims */}
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Approved Factual Claims
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {brain.approvedClaims.length} Active
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {brain.approvedClaims.map((claim, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed flex items-start gap-2"
              >
                <span className="text-emerald-400 font-bold">•</span>
                <span>{claim}</span>
              </div>
            ))}
          </div>

          {/* Add Claim Input */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
            <input
              type="text"
              value={newClaim}
              onChange={(e) => setNewClaim(e.target.value)}
              placeholder="Add approved value claim..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAddApprovedClaim}
              disabled={!newClaim.trim()}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </GlassPanel>

        {/* Forbidden Claims & Zero-Tolerance Rules */}
        <GlassPanel className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Forbidden Statements & Blacklist
              </h3>
            </div>
            <span className="text-[10px] font-mono text-rose-400 font-bold">
              {brain.forbiddenClaims.length} Guardrails
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {brain.forbiddenClaims.map((claim, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200 leading-relaxed flex items-start gap-2"
              >
                <span className="text-rose-400 font-bold">✕</span>
                <span>{claim}</span>
              </div>
            ))}
          </div>

          {/* Add Forbidden Claim Input */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
            <input
              type="text"
              value={newForbidden}
              onChange={(e) => setNewForbidden(e.target.value)}
              placeholder="Add forbidden keyword or phrase..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={handleAddForbiddenClaim}
              disabled={!newForbidden.trim()}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Block
            </button>
          </div>
        </GlassPanel>
      </div>

      {/* Keywords & CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassPanel className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Approved Ecosystem Hashtags & Keywords
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {brain.approvedKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-blue-950/30 border border-blue-500/20 text-blue-300 text-xs font-mono"
              >
                #{kw}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddKeyword}
              disabled={!newKeyword.trim()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold transition-all"
            >
              Add
            </button>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <LinkIcon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Official Ecosystem Portals
            </h3>
          </div>
          <div className="space-y-2">
            {brain.ctaLibrary.map((cta, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{cta.label}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{cta.url}</div>
                </div>
                <a
                  href={cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
