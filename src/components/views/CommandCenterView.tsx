"use client";

import React from "react";
import { ProjectId } from "@/types";
import { mockProjects, mockAIAgents } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import { MetricBlock } from "../ui/MetricBlock";
import { NavViewId } from "../shell/Sidebar";
import {
  Users,
  Activity,
  Share2,
  Sparkles,
  Zap,
  ArrowRight,
  PlusCircle,
  Link2,
  BarChart3,
  Bot,
} from "lucide-react";

interface CommandCenterViewProps {
  currentProject: ProjectId;
  onNavigate: (view: NavViewId) => void;
}

const EmptyStateCard = ({
  icon,
  title,
  description,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  onAction: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-10 px-6 text-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:border-blue-500/30 transition-colors">
    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
      {icon}
    </div>
    <div className="text-sm font-semibold text-white mb-1">{title}</div>
    <p className="text-xs text-slate-400 mb-4 max-w-xs leading-relaxed">{description}</p>
    <button
      onClick={onAction}
      className="px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5"
    >
      <PlusCircle className="w-3.5 h-3.5" />
      {action}
    </button>
  </div>
);

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  currentProject,
  onNavigate,
}) => {
  const project = mockProjects.find((p) => p.id === currentProject) || mockProjects[0];
  const activeAgents = mockAIAgents.filter((a) => a.projectScope.includes(currentProject));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Welcome / Status Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-[#0D1016] via-[#11151C] to-[#080A0F] border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                COMMAND CENTER
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-xs text-slate-400">{project.name}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Welcome to OKN Social OS
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
              Your command center is live. Connect social accounts and launch your first campaign to get started.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">AI DIRECTOR</div>
                <div className="text-[10px] text-amber-400 font-mono">AWAITING SETUP</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate("content_studio")}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              Create First Post
            </button>
          </div>
        </div>
      </div>

      {/* Zero-state Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricBlock label="Total Reach (7d)" value="0" sparklineData={[0, 0, 0, 0, 0, 0, 0, 0]} sparklineColor="#38BDF8" icon={<Users className="w-4 h-4" />} />
        <MetricBlock label="Engagement Rate" value="0%" sparklineData={[0, 0, 0, 0, 0, 0, 0, 0]} sparklineColor="#3B82F6" icon={<Activity className="w-4 h-4" />} />
        <MetricBlock label="Total Community" value="0" sparklineData={[0, 0, 0, 0, 0, 0, 0, 0]} sparklineColor="#10B981" icon={<Share2 className="w-4 h-4" />} />
        <MetricBlock label="AI Actions" value="0" sparklineData={[0, 0, 0, 0, 0, 0, 0, 0]} sparklineColor="#8B5CF6" icon={<Sparkles className="w-4 h-4" />} />
      </div>

      {/* 3-Col Setup Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Setup Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <GlassPanel className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <span className="text-[11px] font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-sm font-bold text-white">Get Started — Setup Checklist</h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: "Connect Social Accounts",
                  detail: "Link X, Instagram, LinkedIn, Telegram, YouTube, TikTok, or Facebook.",
                  view: "social_accounts" as NavViewId,
                  icon: <Link2 className="w-4 h-4" />,
                  done: false,
                },
                {
                  step: "Create Your First Post",
                  detail: "Use the AI Content Studio to generate platform-optimised copy via Gemini.",
                  view: "content_studio" as NavViewId,
                  icon: <Zap className="w-4 h-4" />,
                  done: false,
                },
                {
                  step: "Configure Project Brain",
                  detail: "Define your brand voice, approved claims, and response rules for the AI.",
                  view: "project_brain" as NavViewId,
                  icon: <Bot className="w-4 h-4" />,
                  done: false,
                },
                {
                  step: "Launch a Campaign",
                  detail: "Build a multi-phase content campaign with budget tracking and reach goals.",
                  view: "campaigns" as NavViewId,
                  icon: <BarChart3 className="w-4 h-4" />,
                  done: false,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  onClick={() => onNavigate(item.view)}
                  className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] hover:border-blue-500/30 cursor-pointer transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{item.step}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Content Pipeline — empty */}
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Content Release Pipeline</h3>
              <button
                onClick={() => onNavigate("content_studio")}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                Create Post <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <EmptyStateCard
              icon={<Zap className="w-5 h-5" />}
              title="No posts scheduled"
              description="Create your first content piece in the AI Studio and schedule it across all platforms."
              action="Open Content Studio"
              onAction={() => onNavigate("content_studio")}
            />
          </GlassPanel>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* AI Director status */}
          <GlassPanel className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">AI Director</span>
            </div>
            <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-slate-400 mb-4 leading-relaxed">
              The AI Social Director is standing by. Connect at least one social account and configure the Project Brain to activate autonomous operations.
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Agents on standby</span>
              <span className="mono-metric font-bold text-white">{activeAgents.length}</span>
            </div>
            <button
              onClick={() => onNavigate("ai_director")}
              className="mt-3 w-full py-2 rounded-lg bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 text-xs font-medium border border-violet-500/20 transition-colors"
            >
              Open AI Director
            </button>
          </GlassPanel>

          {/* Inbox snapshot — empty */}
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wide">Inbox Intelligence</span>
              <button onClick={() => onNavigate("inbox")} className="text-xs text-blue-400 hover:text-blue-300 font-medium">View All</button>
            </div>
            <div className="flex flex-col items-center py-8 text-center text-xs text-slate-500">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                <Share2 className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-[11px] text-slate-500">No incoming messages yet.<br />Connect social accounts to start monitoring.</p>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
