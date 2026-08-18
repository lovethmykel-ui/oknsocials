"use client";

import React from "react";
import { NavViewId } from "./Sidebar";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Inbox, Plus, CalendarDays, Sparkles } from "lucide-react";

interface LiquidGlassNavProps {
  currentView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  unreadInboxCount?: number;
}

export const LiquidGlassNav: React.FC<LiquidGlassNavProps> = ({
  currentView,
  onSelectView,
  unreadInboxCount = 3,
}) => {
  const items = [
    { id: "command_center" as NavViewId, label: "Home", icon: LayoutDashboard },
    { id: "inbox" as NavViewId, label: "Inbox", icon: Inbox, badge: unreadInboxCount },
    { id: "content_studio" as NavViewId, label: "Create", icon: Plus, isPrimary: true },
    { id: "calendar" as NavViewId, label: "Calendar", icon: CalendarDays },
    { id: "ai_director" as NavViewId, label: "AI", icon: Sparkles },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Mobile Navigation"
        className="pointer-events-auto liquid-glass-dock px-3 py-2 flex items-center justify-between gap-1 max-w-sm w-full transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className="relative -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.7)] border-2 border-white/30 active:scale-95 transition-all duration-200"
                aria-label="Create Post"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "text-blue-400 bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 transition-transform group-active:scale-90", isActive && "text-blue-400")} />
                {item.badge && item.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_6px_#38BDF8]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
