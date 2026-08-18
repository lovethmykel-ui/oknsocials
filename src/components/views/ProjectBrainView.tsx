"use client";

import React, { useState } from "react";
import { ProjectId, ProjectBrain } from "@/types";
import { mockProjectBrains, mockProjects } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import {
  BrainCircuit,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Plus,
  Hash,
  Link,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectBrainViewProps {
  currentProject: ProjectId;
}

export const ProjectBrainView: React.FC<ProjectBrainViewProps> = ({ currentProject }) => {
  const [brain, setBrain] = useState<ProjectBrain>(
    mockProjectBrains[currentProject] || mockProjectBrains["okn-token"]
  );
  const project = mockProjects.find((p) => p.id === currentProject) || mockProjects[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {brain.name}
            </h2>
            <p className="text-xs text-slate-400">
              Institutional brand guidelines, factual knowledge base, and automated response constraints
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-300">
            Project: {project.name}
          </span>
        </div>
      </div>

      {/* Main Grid: Approved vs Forbidden Claims & Brand Voice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approved Claims */}
        <GlassPanel className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Approved Factual Claims
            </h3>
          </div>
          <div className="space-y-2">
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
        </GlassPanel>

        {/* Forbidden Claims & Zero-Tolerance Rules */}
        <GlassPanel className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Forbidden Statements & High-Risk Guardrails
            </h3>
          </div>
          <div className="space-y-2">
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
        </GlassPanel>
      </div>

      {/* Product Facts & FAQ Knowledge Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassPanel className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Verified Product Facts
            </h3>
          </div>
          <div className="space-y-2.5">
            {brain.productFacts.map((fact, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
                <div className="font-semibold text-white mb-0.5">{fact.question}</div>
                <div className="text-slate-400">{fact.answer}</div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Approved CTA & Links
            </h3>
          </div>
          <div className="space-y-2.5">
            {brain.ctaLibrary.map((cta, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{cta.label}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{cta.url}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-500/20 text-[10px] font-mono">
                  {cta.context}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
