"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProjectId } from "@/types";
import { mockProjects } from "@/lib/data/mockData";
import { NavViewId } from "./Sidebar";
import {
  Search,
  Bell,
  Plus,
  Sparkles,
  Command,
  Shield,
  Layers,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  currentView: NavViewId;
  currentProject: ProjectId;
  onSelectProject: (projectId: ProjectId) => void;
  onOpenCommandPalette: () => void;
  onOpenNotifications: () => void;
  onQuickCreate: () => void;
  unreadNotificationsCount?: number;
  onToggleMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentView,
  currentProject,
  onSelectProject,
  onOpenCommandPalette,
  onOpenNotifications,
  onQuickCreate,
  unreadNotificationsCount = 2,
  onToggleMobileMenu,
}) => {
  const [timeString, setTimeString] = useState<string>("");
  const activeProj = mockProjects.find((p) => p.id === currentProject) || mockProjects[0];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "UTC",
        }) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getViewTitle = () => {
    switch (currentView) {
      case "command_center":
        return "Command Center";
      case "ai_director":
        return "AI Social Director";
      case "inbox":
        return "Unified Inbox";
      case "content_studio":
        return "Content Studio";
      case "calendar":
        return "Content Calendar";
      case "campaigns":
        return "Campaign Builder";
      case "media_vault":
        return "Media Vault";
      case "analytics":
        return "Executive Analytics";
      case "social_accounts":
        return "Connected Accounts";
      case "ai_agents":
        return "AI Agent Matrix";
      case "project_brain":
        return "Project AI Brain";
      case "settings":
        return "System Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-[#080A0F]/90 border-b border-white/[0.07] backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Trigger + Breadcrumb + Dynamic Greeting */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-950/40 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            OKN OS
          </div>
          <span className="hidden sm:inline text-slate-600">/</span>
          <h1 className="text-sm md:text-base font-semibold text-white truncate">
            {getViewTitle()}
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-white/[0.08]">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>AI DIRECTOR ONLINE</span>
          </div>
        </div>
      </div>

      {/* Right Actions: Clock, Search Cmd+K, Create, Notifications, Profile */}
      <div className="flex items-center gap-2.5">
        {/* UTC Clock */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          {timeString || "00:00:00 UTC"}
        </div>

        {/* Global Search / Cmd+K Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1016] hover:bg-white/[0.06] border border-white/[0.08] text-xs text-slate-400 hover:text-slate-200 transition-colors shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search or command...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white/[0.06] rounded border border-white/[0.08]">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Quick Post Button */}
        <button
          onClick={onQuickCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_16px_rgba(37,99,235,0.4)] transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Create Post</span>
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-[#0D1016] hover:bg-white/[0.06] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#080A0F]">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Profile / Workspace Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-900 border border-blue-400/40 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            OK
          </div>
        </div>
      </div>
    </header>
  );
};
