"use client";

import React, { useState } from "react";
import { ProjectId, AIDecisionLog } from "@/types";
import { mockAIDecisions, mockProjects, mockAIAgents } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import { AIIndicator } from "../ui/AIIndicator";
import { StatusBadge } from "../ui/StatusBadge";
import { PlatformBadge } from "../ui/PlatformBadge";
import { formatRelativeTime } from "@/lib/utils";
import {
  Sparkles,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Cpu,
  Zap,
  Sliders,
  Eye,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIDirectorViewProps {
  currentProject: ProjectId;
}

export const AIDirectorView: React.FC<AIDirectorViewProps> = ({ currentProject }) => {
  const [decisions, setDecisions] = useState<AIDecisionLog[]>(mockAIDecisions);
  const [selectedDecision, setSelectedDecision] = useState<AIDecisionLog | null>(mockAIDecisions[0]);
  const [autonomyLevel, setAutonomyLevel] = useState<string>("AUTO-RESPOND LOW-RISK");

  const handleApprove = (id: string) => {
    setDecisions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "completed" } : d))
    );
    if (selectedDecision?.id === id) {
      setSelectedDecision((prev) => (prev ? { ...prev, status: "completed" } : null));
    }
  };

  const handleReject = (id: string) => {
    setDecisions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "rejected" } : d))
    );
    if (selectedDecision?.id === id) {
      setSelectedDecision((prev) => (prev ? { ...prev, status: "rejected" } : null));
    }
  };

  const capabilities = [
    { name: "Monitor", desc: "Live event listener across 7 platform webhooks", active: true },
    { name: "Analyze", desc: "Intent, sentiment & algorithmic opportunity detection", active: true },
    { name: "Draft", desc: "Generates project-brain compliant responses & post variants", active: true },
    { name: "Classify", desc: "12-category classification with confidence metrics", active: true },
    { name: "Recommend", desc: "Viral hooks & timing optimization recommendations", active: true },
    { name: "Moderate", desc: "Zero-tolerance scam and phishing neutralization", active: true },
    { name: "Schedule", desc: "Rate-limited synchronized multi-platform dispatch", active: true },
    { name: "Respond", desc: "Autonomous and assisted low-risk community replies", active: true },
    { name: "Escalate", desc: "Automatic staff handoff for high-risk topics", active: true },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Banner: AI Director Engine State */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#0D1016] to-[#080A0F] border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-violet-400 uppercase">
                AI SOCIAL DIRECTOR ENGINE • v4.8
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Operational Intelligence & Governance Layer
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Coordinating 12 specialized agents, enforcing project brain constraints, and executing risk-gated actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Current Autonomy</div>
              <div className="text-violet-300 font-bold">{autonomyLevel}</div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-xs">
              <div className="text-slate-400 text-[10px] uppercase font-mono">24h Actions</div>
              <div className="text-emerald-400 font-bold mono-metric">1,420 (98.4% Acc)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
        {capabilities.map((cap) => (
          <div
            key={cap.name}
            className="p-2.5 rounded-xl bg-[#0D1016] border border-white/[0.06] hover:border-violet-500/30 transition-all text-center group"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">{cap.name}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 group-hover:line-clamp-none">
              {cap.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Main 2-Column: Actions Queue & Decision Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Decisions Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">AI Decision Stream & Approvals</h3>
              <p className="text-xs text-slate-400">Review pending recommendations and inspect completed reasoning</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {decisions.length} Active Records
            </span>
          </div>

          <div className="space-y-3">
            {decisions.map((dec) => {
              const isSelected = selectedDecision?.id === dec.id;
              const isPending = dec.status === "pending_approval";

              return (
                <div
                  key={dec.id}
                  onClick={() => setSelectedDecision(dec)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer",
                    isSelected
                      ? "bg-violet-950/20 border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.12)]"
                      : "bg-[#0D1016] border-white/[0.07] hover:border-white/15"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={dec.platform} size="sm" />
                      <span className="text-xs font-bold text-white">{dec.agentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="mono-metric text-xs text-violet-300 font-semibold">
                        {dec.confidence}% Conf
                      </span>
                      <StatusBadge status={dec.status} />
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-slate-200 mb-1">
                    {dec.action}
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {dec.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/[0.06]">
                    <span className="font-mono text-slate-500 text-[10px]">
                      Policy: <strong className="text-slate-400">{dec.policyTriggered}</strong>
                    </span>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(dec.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(dec.id);
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-colors"
                        >
                          Approve Action
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Detailed Decision Reasoning Inspector */}
        <div>
          {selectedDecision ? (
            <GlassPanel className="p-5 sticky top-20" glow="purple">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Reasoning Inspector
                  </span>
                </div>
                <StatusBadge status={selectedDecision.status} />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                    Triggering Event / Input
                  </div>
                  <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06] text-slate-300 font-mono text-[11px] leading-relaxed">
                    {selectedDecision.inputSnippet}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                    AI Output / Action Payload
                  </div>
                  <div className="p-3 rounded-lg bg-violet-950/30 border border-violet-500/20 text-violet-200 font-mono text-[11px] leading-relaxed">
                    {selectedDecision.outputSnippet}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] text-slate-500">Risk Assessment</div>
                    <div className="font-bold text-emerald-400 uppercase font-mono mt-0.5">
                      {selectedDecision.riskLevel} Risk
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] text-slate-500">Confidence Metric</div>
                    <div className="font-bold text-violet-300 font-mono mt-0.5">
                      {selectedDecision.confidence}% Deterministic
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    Verified against Project Brain claims & rate limits. No regulatory violations detected.
                  </span>
                </div>
              </div>
            </GlassPanel>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Select a decision to inspect reasoning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
