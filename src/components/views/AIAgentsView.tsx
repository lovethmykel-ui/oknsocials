"use client";

import React, { useState } from "react";
import { ProjectId, AIAgent } from "@/types";
import { mockAIAgents } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import { StatusBadge } from "../ui/StatusBadge";
import { PlatformBadge } from "../ui/PlatformBadge";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import {
  Cpu,
  Sparkles,
  Shield,
  Activity,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAgentsViewProps {
  currentProject: ProjectId;
}

export const AIAgentsView: React.FC<AIAgentsViewProps> = ({ currentProject }) => {
  const [agents, setAgents] = useState<AIAgent[]>(mockAIAgents);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(mockAIAgents[0]);

  const autonomyOptions = [
    "OFF",
    "SUGGEST ONLY",
    "APPROVAL REQUIRED",
    "AUTO-RESPOND LOW-RISK",
    "AUTONOMOUS",
  ];

  const handleUpdateAutonomy = (agentId: string, level: any) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, autonomyLevel: level } : a))
    );
    if (selectedAgent?.id === agentId) {
      setSelectedAgent((prev) => (prev ? { ...prev, autonomyLevel: level } : null));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              12-Agent Autonomous Intelligence Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Operational parameters, accuracy ratings, and real-time execution scopes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ALL 12 AGENTS ONLINE</span>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const isSelected = selectedAgent?.id === agent.id;

          return (
            <GlassPanel
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={cn(
                "p-5 cursor-pointer transition-all flex flex-col justify-between",
                isSelected
                  ? "border-violet-500/40 ring-1 ring-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                  : "hover:border-white/15"
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <h3 className="font-bold text-xs text-white">{agent.name}</h3>
                    </div>
                    <div className="text-[10px] font-mono text-violet-400 uppercase mt-0.5">
                      {agent.codename}
                    </div>
                  </div>
                  <StatusBadge status={agent.status} />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                  {agent.description}
                </p>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] mb-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">Tasks Completed</div>
                    <div className="font-mono text-white font-semibold mt-0.5">
                      {formatNumber(agent.tasksCompleted)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Accuracy Rate</div>
                    <div className="font-mono text-emerald-400 font-semibold mt-0.5">
                      {agent.accuracyRate}%
                    </div>
                  </div>
                </div>

                {agent.currentTask && (
                  <div className="p-2 rounded-lg bg-violet-950/20 border border-violet-500/20 text-[11px] text-violet-200 mb-3 line-clamp-2">
                    <span className="font-semibold text-violet-300">Live Task:</span>{" "}
                    {agent.currentTask}
                  </div>
                )}
              </div>

              {/* Autonomy Selector */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                  Autonomy Level
                </div>
                <select
                  value={agent.autonomyLevel}
                  onChange={(e) => handleUpdateAutonomy(agent.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-1 px-2 rounded-lg bg-[#080A0F] border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-violet-500/50"
                >
                  {autonomyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};
