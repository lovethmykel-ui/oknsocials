"use client";

import React, { useState } from "react";
import { ProjectId } from "@/types";
import { mockAnalyticsTimeseries, mockProjects } from "@/lib/data/mockData";
import { MetricBlock } from "../ui/MetricBlock";
import { GlassPanel } from "../ui/GlassPanel";
import { PlatformBadge } from "../ui/PlatformBadge";
import { formatNumber } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Zap,
  Sparkles,
  Calendar,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsViewProps {
  currentProject: ProjectId;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ currentProject }) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const data = mockAnalyticsTimeseries;
  const project = mockProjects.find((p) => p.id === currentProject) || mockProjects[0];

  // Calculate SVG dimensions for Reach & Impressions Area Chart
  const chartWidth = 700;
  const chartHeight = 220;
  const padding = 30;

  const maxReach = Math.max(...data.map((d) => d.impressions)) * 1.1;

  const pointsImpressions = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
      const y = chartHeight - padding - (d.impressions / maxReach) * (chartHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const pointsReach = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
      const y = chartHeight - padding - (d.reach / maxReach) * (chartHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const areaReach = `${padding},${chartHeight - padding} ${pointsReach} ${chartWidth - padding},${chartHeight - padding}`;
  const areaImpressions = `${padding},${chartHeight - padding} ${pointsImpressions} ${chartWidth - padding},${chartHeight - padding}`;

  const platformBreakdown = [
    { platform: "x", percentage: 48, followers: "182.4k", color: "#F8FAFC" },
    { platform: "telegram", percentage: 24, followers: "68.9k", color: "#38BDF8" },
    { platform: "youtube", percentage: 14, followers: "41.2k", color: "#EF4444" },
    { platform: "instagram", percentage: 8, followers: "38.2k", color: "#EC4899" },
    { platform: "linkedin", percentage: 6, followers: "24.5k", color: "#3B82F6" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Executive Cross-Channel Analytics
            </h2>
            <p className="text-xs text-slate-400">
              High-resolution performance metrics for {project.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/[0.08]">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium uppercase font-mono transition-colors",
                timeRange === r
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricBlock
          label="Total Impressions (7d)"
          value="510,000"
          delta={{ value: "18.4", positive: true }}
          sparklineData={[220, 245, 298, 275, 340, 395, 460, 510]}
          sparklineColor="#38BDF8"
          icon={<Users className="w-4 h-4" />}
        />
        <MetricBlock
          label="Engagement Velocity"
          value="31,200"
          delta={{ value: "24.1", positive: true }}
          sparklineData={[9.8, 11.2, 14.6, 13.1, 18.2, 22.4, 26.8, 31.2]}
          sparklineColor="#3B82F6"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <MetricBlock
          label="AI Action Volume"
          value="480 / day"
          delta={{ value: "32.0", positive: true }}
          sparklineData={[184, 210, 260, 242, 310, 390, 440, 480]}
          sparklineColor="#8B5CF6"
          icon={<Sparkles className="w-4 h-4" />}
        />
        <MetricBlock
          label="Avg Response Latency"
          value="0.9 min"
          delta={{ value: "45.0", positive: true, period: "speedup" }}
          sparklineData={[2.4, 2.1, 1.8, 1.9, 1.5, 1.2, 1.1, 0.9]}
          sparklineColor="#10B981"
          icon={<Activity className="w-4 h-4" />}
        />
      </div>

      {/* Main Charts: Impressions Velocity Area Chart & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart (8 cols): Reach vs Impressions Velocity */}
        <div className="lg:col-span-8">
          <GlassPanel className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Impression & Reach Velocity</h3>
                <p className="text-xs text-slate-400">Total cross-channel exposure over the last 8 days</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Impressions
                </span>
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Unique Reach
                </span>
              </div>
            </div>

            <div className="relative w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="grad-impressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="grad-reach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle Grid Lines */}
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

                {/* Polygons */}
                <polygon points={areaImpressions} fill="url(#grad-impressions)" />
                <polygon points={areaReach} fill="url(#grad-reach)" />

                {/* Polylines */}
                <polyline points={pointsImpressions} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={pointsReach} fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* Labels along X Axis */}
                {data.map((d, i) => {
                  const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
                  return (
                    <text
                      key={d.date}
                      x={x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {d.date}
                    </text>
                  );
                })}
              </svg>
            </div>
          </GlassPanel>
        </div>

        {/* Right Chart (4 cols): Cross-Platform Share */}
        <div className="lg:col-span-4 space-y-4">
          <GlassPanel className="p-5">
            <h3 className="text-sm font-bold text-white mb-1">Community Share</h3>
            <p className="text-xs text-slate-400 mb-4">Audience distribution across channels</p>

            <div className="space-y-3.5">
              {platformBreakdown.map((item) => (
                <div key={item.platform} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <PlatformBadge platform={item.platform} size="sm" />
                    <span className="font-mono text-slate-300 font-semibold">
                      {item.followers} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${item.percentage}%` }}
                    />
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
