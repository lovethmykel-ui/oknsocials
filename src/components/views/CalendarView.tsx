"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProjectId, PostItem } from "@/types";
import { mockPosts } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import { PlatformBadge } from "../ui/PlatformBadge";
import { StatusBadge } from "../ui/StatusBadge";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Clock,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  currentProject: ProjectId;
  onNavigateToStudio?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentProject,
  onNavigateToStudio,
}) => {
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("month");
  const [currentMonth, setCurrentMonth] = useState("August 2026");
  const [posts, setPosts] = useState<PostItem[]>(mockPosts);

  // Generate calendar days for August 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{currentMonth}</h2>
            <p className="text-xs text-slate-400">Scheduled releases across ecosystem channels</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Month / Week / List Toggle */}
          <div className="p-1 rounded-xl bg-black/60 border border-white/[0.08] flex items-center gap-1">
            <button
              onClick={() => setViewMode("month")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                viewMode === "month"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                viewMode === "week"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                viewMode === "list"
                  ? "bg-blue-600 text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              List
            </button>
          </div>

          <button
            onClick={onNavigateToStudio}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid for Month View */}
      {viewMode === "month" && (
        <div className="p-4 rounded-2xl bg-[#080A0F] border border-white/[0.08] overflow-hidden">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank offset for Sat Aug 1 */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-28 rounded-xl bg-white/[0.01] border border-white/[0.02] opacity-30"
              />
            ))}

            {daysInMonth.map((day) => {
              const isToday = day === 18;
              const dayPosts = posts.filter((p) => {
                if (!p.scheduledAt && !p.publishedAt) return false;
                const d = new Date(p.scheduledAt || p.publishedAt || "");
                return d.getDate() === day;
              });

              return (
                <div
                  key={day}
                  className={cn(
                    "h-28 p-2 rounded-xl border flex flex-col justify-between transition-all group hover:border-blue-500/40",
                    isToday
                      ? "bg-blue-950/20 border-blue-500/40 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]"
                      : "bg-[#0D1016] border-white/[0.06]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-xs font-mono font-semibold",
                        isToday ? "text-blue-400 font-bold" : "text-slate-400"
                      )}
                    >
                      {day}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#38BDF8]" />
                    )}
                  </div>

                  {/* Scheduled Items Preview */}
                  <div className="space-y-1 overflow-y-auto">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-1 rounded bg-black/60 border border-white/10 text-[10px] text-white truncate flex items-center gap-1 hover:border-blue-400 transition-colors"
                        title={post.title}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span className="truncate">{post.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08] space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            All Scheduled & Published Releases
          </div>
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                {post.primaryMediaUrl && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-white/10 relative">
                    <Image src={post.primaryMediaUrl} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-white truncate">{post.title}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={post.status} />
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400 capitalize">{post.type} post</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  {Object.keys(post.variants).map((plat) => (
                    <PlatformBadge key={plat} platform={plat} size="sm" showLabel={false} />
                  ))}
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  {post.scheduledAt
                    ? new Date(post.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "Published"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
