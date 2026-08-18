"use client";

import React from "react";
import Image from "next/image";
import { ProjectId } from "@/types";
import { mockProjects } from "@/lib/data/mockData";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  Inbox,
  PenTool,
  CalendarDays,
  Target,
  Image as ImageIcon,
  BarChart3,
  Share2,
  Cpu,
  BrainCircuit,
  Settings,
  ChevronDown,
  Activity,
  X,
} from "lucide-react";

export type NavViewId =
  | "command_center"
  | "ai_director"
  | "inbox"
  | "content_studio"
  | "calendar"
  | "campaigns"
  | "media_vault"
  | "analytics"
  | "social_accounts"
  | "ai_agents"
  | "project_brain"
  | "settings";

interface SidebarProps {
  currentView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  currentProject: ProjectId;
  onSelectProject: (projectId: ProjectId) => void;
  unreadCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  currentProject,
  onSelectProject,
  unreadCount = 0,
  isCollapsed = false,
  className,
  onCloseMobile,
}) => {
  const [projectMenuOpen, setProjectMenuOpen] = React.useState(false);
  const activeProj = mockProjects.find((p) => p.id === currentProject) || mockProjects[0];

  const navItems = [
    { id: "command_center" as NavViewId, label: "Command Center", icon: LayoutDashboard, badge: undefined },
    { id: "ai_director" as NavViewId, label: "AI Social Director", icon: Sparkles, badge: "LIVE" },
    { id: "inbox" as NavViewId, label: "Unified Inbox", icon: Inbox, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: "content_studio" as NavViewId, label: "Content Studio", icon: PenTool, badge: undefined },
    { id: "calendar" as NavViewId, label: "Content Calendar", icon: CalendarDays, badge: undefined },
    { id: "campaigns" as NavViewId, label: "Campaigns", icon: Target, badge: undefined },
    { id: "media_vault" as NavViewId, label: "Media Vault", icon: ImageIcon, badge: undefined },
    { id: "analytics" as NavViewId, label: "Analytics", icon: BarChart3, badge: undefined },
    { id: "social_accounts" as NavViewId, label: "Social Accounts", icon: Share2, badge: undefined },
    { id: "ai_agents" as NavViewId, label: "AI Agents", icon: Cpu, badge: "12" },
    { id: "project_brain" as NavViewId, label: "Project AI Brain", icon: BrainCircuit, badge: undefined },
    { id: "settings" as NavViewId, label: "Settings", icon: Settings, badge: undefined },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col shrink-0 h-screen bg-[#080A0F] border-r border-white/[0.07] z-30 transition-all duration-200",
        className ? className : cn("hidden md:flex sticky top-0", isCollapsed ? "w-20" : "w-64")
      )}
    >
      {/* Brand Header & Project Switcher */}
      <div className="p-4 border-b border-white/[0.07] relative">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
            className="flex items-center gap-3 text-left flex-1 p-2 -m-2 rounded-xl hover:bg-white/[0.04] transition-colors group"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-blue-950/60 border border-blue-500/30 flex items-center justify-center p-1">
              <Image
                src={activeProj.coinIcon || activeProj.logo}
                alt={activeProj.name}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white tracking-wide truncate">
                    {activeProj.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform ml-1 shrink-0" />
                </div>
                <div className="text-[10px] text-blue-400 font-mono tracking-wider">
                  {activeProj.codename}
                </div>
              </div>
            )}
          </button>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Project Switcher Dropdown */}
        {projectMenuOpen && (
          <div className="absolute top-full left-3 right-3 mt-1 py-1.5 rounded-xl liquid-glass-panel z-50 shadow-2xl border border-white/10 bg-[#0D1016]">
            <div className="px-3 py-1 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
              Switch Project
            </div>
            {mockProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectProject(p.id);
                  setProjectMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left",
                  p.id === currentProject
                    ? "bg-blue-600/20 text-blue-400 font-medium"
                    : "text-slate-300 hover:bg-white/[0.06]"
                )}
              >
                <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 bg-slate-900 border border-white/10 flex items-center justify-center p-0.5">
                  <Image src={p.coinIcon} alt={p.name} width={18} height={18} className="object-contain" />
                </div>
                <span className="truncate">{p.name}</span>
                {p.id === currentProject && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isAI = item.id === "ai_director" || item.id === "ai_agents" || item.id === "project_brain";

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative group text-left",
                isActive
                  ? isAI
                    ? "bg-violet-950/40 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    : "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.12)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive
                    ? isAI
                      ? "text-violet-400"
                      : "text-blue-400"
                    : "text-slate-400 group-hover:text-slate-200"
                )}
              />

              {!isCollapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "ml-auto px-1.5 py-0.5 rounded text-[10px] font-semibold mono-metric",
                        item.badge === "LIVE"
                          ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse"
                          : typeof item.badge === "number"
                          ? "bg-blue-500 text-white rounded-full px-1.5"
                          : "bg-white/10 text-slate-300"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-white/[0.07] bg-[#050609]/60">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            {!isCollapsed && (
              <div>
                <div className="text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                  AI Social Director
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  ONLINE • 12 Agents Active
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Activity className="w-4 h-4 text-emerald-400/80" />
          )}
        </div>
      </div>
    </aside>
  );
};
