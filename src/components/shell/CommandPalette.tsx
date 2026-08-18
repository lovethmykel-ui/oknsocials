"use client";

import React, { useEffect, useState } from "react";
import { NavViewId } from "./Sidebar";
import { ProjectId } from "@/types";
import {
  Search,
  PenTool,
  Inbox,
  Sparkles,
  Target,
  BarChart3,
  CalendarDays,
  Share2,
  Cpu,
  BrainCircuit,
  Layers,
  ArrowRight,
  X,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: NavViewId) => void;
  onSelectProject: (projectId: ProjectId) => void;
  currentProject: ProjectId;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onSelectProject,
  currentProject,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "create_post",
      title: "Create Multi-Platform Post",
      category: "Actions",
      icon: PenTool,
      shortcut: "C",
      run: () => {
        onSelectView("content_studio");
        onClose();
      },
    },
    {
      id: "ai_analysis",
      title: "Run AI Social Performance Briefing",
      category: "AI Director",
      icon: Sparkles,
      shortcut: "A",
      run: () => {
        onSelectView("ai_director");
        onClose();
      },
    },
    {
      id: "triage_inbox",
      title: "Triage Unified Inbox & DMs",
      category: "Inbox",
      icon: Inbox,
      shortcut: "I",
      run: () => {
        onSelectView("inbox");
        onClose();
      },
    },
    {
      id: "open_calendar",
      title: "View Content Calendar",
      category: "Planning",
      icon: CalendarDays,
      shortcut: "K",
      run: () => {
        onSelectView("calendar");
        onClose();
      },
    },
    {
      id: "open_campaigns",
      title: "Manage Active Campaigns",
      category: "Campaigns",
      icon: Target,
      shortcut: "M",
      run: () => {
        onSelectView("campaigns");
        onClose();
      },
    },
    {
      id: "open_analytics",
      title: "Inspect Cross-Platform Analytics",
      category: "Analytics",
      icon: BarChart3,
      shortcut: "N",
      run: () => {
        onSelectView("analytics");
        onClose();
      },
    },
    {
      id: "open_agents",
      title: "Inspect 12 AI Agent Matrix",
      category: "AI Director",
      icon: Cpu,
      run: () => {
        onSelectView("ai_agents");
        onClose();
      },
    },
    {
      id: "switch_token",
      title: "Switch to OKN Token Project",
      category: "Projects",
      icon: Layers,
      run: () => {
        onSelectProject("okn-token");
        onClose();
      },
    },
    {
      id: "switch_nexus",
      title: "Switch to OKNEXUS Exchange Project",
      category: "Projects",
      icon: Layers,
      run: () => {
        onSelectProject("oknexus-exchange");
        onClose();
      },
    },
  ];

  const filtered = actions.filter((act) =>
    act.title.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md">
      <div
        className="w-full max-w-xl liquid-glass-panel rounded-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-white/[0.08] bg-[#0D1016]/80">
          <Search className="w-4 h-4 text-blue-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, search projects, or jump to view..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full py-4 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-300 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or navigation routes found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.run}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs text-slate-300 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-white/[0.04] group-hover:bg-blue-600/30 text-slate-400 group-hover:text-blue-300 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 group-hover:text-white">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500">{item.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-slate-400 border border-white/[0.08]">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#050609]/80 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
          <span>Current project: <strong className="text-slate-300 uppercase">{currentProject}</strong></span>
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <Command className="w-3 h-3" /> + K to toggle
          </span>
        </div>
      </div>
    </div>
  );
};
