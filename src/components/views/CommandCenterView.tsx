"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectId } from "@/types";
import {
  mockProjects,
  mockPosts,
  mockConversations,
  mockAIAgents,
  mockAIDecisions,
  mockCampaigns,
  mockSocialAccounts,
} from "@/lib/data/mockData";
import { MetricBlock } from "../ui/MetricBlock";
import { GlassPanel } from "../ui/GlassPanel";
import { PlatformBadge } from "../ui/PlatformBadge";
import { StatusBadge } from "../ui/StatusBadge";
import { AIIndicator } from "../ui/AIIndicator";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { NavViewId } from "../shell/Sidebar";
import {
  Sparkles,
  Share2,
  Users,
  Activity,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";

interface CommandCenterViewProps {
  currentProject: ProjectId;
  onNavigate: (view: NavViewId) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  currentProject,
  onNavigate,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const project = mockProjects.find((p) => p.id === currentProject) || mockProjects[0];
  const projectPosts = mockPosts.filter((p) => p.projectId === currentProject);
  const projectCampaign = mockCampaigns.find((c) => c.projectId === currentProject) || mockCampaigns[0];
  const projectConvs = mockConversations.filter((c) => c.projectId === currentProject);

  const sparklineReach = [142, 156, 189, 174, 210, 248, 284, 312];
  const sparklineEng = [9.8, 11.2, 14.6, 13.1, 18.2, 22.4, 26.8, 31.2];
  const sparklineFollowers = [512, 515, 519, 522, 526, 531, 536, 543];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* 1. Dynamic Contextual Greeting & Operational Status Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#0D1016] via-[#11151C] to-[#080A0F] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                SYSTEM EXECUTIVE BRIEF
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-xs text-slate-400">{project.name}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              OKN Social Command Center
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              Autonomous Social Operations Platform. All 12 AI agents nominal. Sentinel risk gating active.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">AI SOCIAL DIRECTOR</div>
                <div className="text-[10px] text-emerald-400 font-mono">AUTONOMOUS ONLINE</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate("content_studio")}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Executive Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricBlock
          label="Total Reach (7d)"
          value="312,400"
          delta={{ value: "14.2", positive: true }}
          sparklineData={sparklineReach}
          sparklineColor="#38BDF8"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricBlock
          label="Engagement Rate"
          value={`${project.stats.engagementRate}%`}
          delta={{ value: "0.8", positive: true }}
          sparklineData={sparklineEng}
          sparklineColor="#3B82F6"
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricBlock
          label="Total Community"
          value={formatNumber(project.stats.totalFollowers)}
          delta={{ value: "5.6", positive: true }}
          sparklineData={sparklineFollowers}
          sparklineColor="#10B981"
          icon={<Share2 className="w-4 h-4" />}
        />
        <MetricBlock
          label="AI Decisions & Actions"
          value="1,420"
          delta={{ value: "22.4", positive: true }}
          sparklineData={[40, 65, 80, 110, 140, 190, 240, 290]}
          sparklineColor="#8B5CF6"
          icon={<Sparkles className="w-4 h-4" />}
        />
      </div>

      {/* 3. Main Dashboard 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Director Feed & Upcoming Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Executive Briefing Card */}
          <GlassPanel className="p-5" glow="purple">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AIIndicator label="AI EXECUTIVE BRIEF" confidence={98} />
              </div>
              <button
                onClick={() => onNavigate("ai_director")}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
              >
                Inspect Director Logs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-slate-300 leading-relaxed mb-4">
              <p className="mb-2">
                <strong className="text-white">Summary:</strong> Cross-platform sentiment is trending at <span className="text-emerald-400 font-mono font-bold">94% positive</span> following the Liquidity Vaults preview. 18 incoming inquiries were classified; 12 resolved autonomously, 2 escalated for staff review.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-2 border-t border-violet-500/20">
                <span>⏱️ Avg Response Time: <strong className="text-violet-200">54s</strong></span>
                <span>🛡️ Risk Score: <strong className="text-emerald-400">LOW (0.02)</strong></span>
                <span>⚡ Scheduled Posts: <strong className="text-blue-300">4 Ready</strong></span>
              </div>
            </div>

            {/* Live Decisions Feed */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Recent Autonomous Actions
              </div>
              {mockAIDecisions.slice(0, 3).map((dec) => (
                <div
                  key={dec.id}
                  className="p-3 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3 text-xs hover:border-violet-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <PlatformBadge platform={dec.platform} size="sm" showLabel={false} />
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">{dec.action}</div>
                      <div className="text-[11px] text-slate-400 truncate">{dec.summary}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="mono-metric text-[10px] text-violet-300">{dec.confidence}%</span>
                    <StatusBadge status={dec.status} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Upcoming Schedule & Content Studio Pipeline */}
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Content Release Pipeline</h3>
                <p className="text-xs text-slate-400">Scheduled publications across ecosystem channels</p>
              </div>
              <button
                onClick={() => onNavigate("calendar")}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                Open Calendar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {mockPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-xl bg-[#080A0F] border border-white/[0.06] hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {post.primaryMediaUrl && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-white/10 relative">
                        <Image
                          src={post.primaryMediaUrl}
                          alt={post.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-white truncate">{post.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-400 capitalize">{post.type} Post</span>
                        <span className="text-slate-600">·</span>
                        <div className="flex items-center gap-1">
                          {Object.keys(post.variants).map((plat) => (
                            <PlatformBadge key={plat} platform={plat} size="sm" showLabel={false} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.06]">
                    <div className="text-right">
                      <div
                        className="text-[11px] font-mono text-slate-300"
                        suppressHydrationWarning
                      >
                        {post.scheduledAt
                          ? mounted
                            ? new Date(post.scheduledAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "16:00 UTC"
                          : "Published"}
                      </div>
                      <StatusBadge status={post.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right Col: Active Campaign & Unified Inbox Snapshot */}
        <div className="space-y-6">
          {/* Active Campaign Widget */}
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Active Campaign
                </span>
              </div>
              <StatusBadge status={projectCampaign.status} />
            </div>

            <div className="text-sm font-bold text-white mb-1">
              {projectCampaign.name}
            </div>
            <p className="text-xs text-slate-400 mb-4 line-clamp-2">
              {projectCampaign.objective}
            </p>

            <div className="space-y-3 p-3.5 rounded-xl bg-black/40 border border-white/[0.06] mb-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Target Reach Progress</span>
                  <span className="font-mono text-cyan-300">
                    {formatNumber(projectCampaign.actualReach)} / {formatNumber(projectCampaign.targetReach)}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    style={{
                      width: `${Math.min(100, (projectCampaign.actualReach / projectCampaign.targetReach) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                <span className="text-slate-400">Budget:</span>
                <span className="font-mono text-white font-semibold">{projectCampaign.budget}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate("campaigns")}
              className="w-full py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
            >
              Open Campaign Workspace
            </button>
          </GlassPanel>

          {/* Unified Inbox Intelligence Snapshot */}
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-white uppercase tracking-wide">
                Inbox Intelligence
              </div>
              <button
                onClick={() => onNavigate("inbox")}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {projectConvs.slice(0, 3).map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onNavigate("inbox")}
                  className="p-3 rounded-xl bg-[#080A0F] border border-white/[0.06] hover:border-blue-500/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={conv.platform} size="sm" showLabel={false} />
                      <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                        {conv.authorName}
                      </span>
                    </div>
                    <span
                      className="text-[10px] text-slate-500 font-mono"
                      suppressHydrationWarning
                    >
                      {mounted ? formatRelativeTime(conv.updatedAt) : "12m ago"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                    {conv.previewText}
                  </p>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 font-medium">
                      {conv.intent}
                    </span>
                    <AIIndicator confidence={conv.aiConfidence} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
