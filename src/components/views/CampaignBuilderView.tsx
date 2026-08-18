"use client";

import React, { useState } from "react";
import { ProjectId, Campaign } from "@/types";
import { mockCampaigns } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import { StatusBadge } from "../ui/StatusBadge";
import { formatNumber } from "@/lib/utils";
import {
  Target,
  Plus,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignBuilderViewProps {
  currentProject: ProjectId;
}

export const CampaignBuilderView: React.FC<CampaignBuilderViewProps> = ({
  currentProject,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(mockCampaigns[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Ecosystem Campaign Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Multi-stage release orchestration for major announcements and liquidity launches.
            </p>
          </div>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 active:scale-95 transition-all">
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid & Selected Campaign Stage Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Campaign List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Campaigns ({campaigns.length})
          </div>
          {campaigns.map((camp) => {
            const isSelected = selectedCampaign.id === camp.id;
            const progress = Math.min(100, (camp.actualReach / camp.targetReach) * 100);

            return (
              <div
                key={camp.id}
                onClick={() => setSelectedCampaign(camp)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all",
                  isSelected
                    ? "bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.12)]"
                    : "bg-[#0D1016] border-white/[0.06] hover:border-white/15"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                    {camp.projectId}
                  </span>
                  <StatusBadge status={camp.status} />
                </div>

                <div className="text-sm font-bold text-white mb-1">{camp.name}</div>
                <div className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {camp.objective}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Reach Progress</span>
                    <span className="font-mono text-cyan-300 font-semibold">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Campaign Detailed Overview & Stage Progression (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <GlassPanel className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    CAMPAIGN OVERVIEW
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedCampaign.startDate} to {selectedCampaign.endDate}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedCampaign.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{selectedCampaign.tagline}</p>
              </div>

              <StatusBadge status={selectedCampaign.status} />
            </div>

            {/* Campaign Key Performance Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] uppercase font-mono text-slate-400">Budget</div>
                <div className="text-lg font-bold text-white mono-metric mt-0.5">
                  {selectedCampaign.budget}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] uppercase font-mono text-slate-400">Target Reach</div>
                <div className="text-lg font-bold text-cyan-300 mono-metric mt-0.5">
                  {formatNumber(selectedCampaign.targetReach)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] uppercase font-mono text-slate-400">Actual Reach</div>
                <div className="text-lg font-bold text-emerald-400 mono-metric mt-0.5">
                  {formatNumber(selectedCampaign.actualReach)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[10px] uppercase font-mono text-slate-400">Total Posts</div>
                <div className="text-lg font-bold text-violet-300 mono-metric mt-0.5">
                  {selectedCampaign.postsCount} Items
                </div>
              </div>
            </div>

            {/* Multi-Stage Progression Timeline */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Campaign Timeline & Phase Breakdown
              </div>

              <div className="space-y-3">
                {selectedCampaign.stages.map((stage, idx) => {
                  const isDone = stage.status === "done";
                  const isInProgress = stage.status === "in_progress";

                  return (
                    <div
                      key={stage.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all flex items-start gap-4",
                        isInProgress
                          ? "bg-blue-950/20 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                          : isDone
                          ? "bg-emerald-950/15 border-emerald-500/30"
                          : "bg-black/30 border-white/[0.06] opacity-75"
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5",
                          isDone
                            ? "bg-emerald-500 text-black"
                            : isInProgress
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-slate-800 text-slate-400"
                        )}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="font-semibold text-xs text-white truncate">
                            {stage.title}
                          </div>
                          <StatusBadge status={stage.status} />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-2">
                          {stage.description}
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                          <span>Phase: <strong className="text-slate-400 capitalize">{stage.phase}</strong></span>
                          <span>·</span>
                          <span>{stage.postsCount} Content Assets Linked</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
