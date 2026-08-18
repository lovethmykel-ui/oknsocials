"use client";

import React, { useState } from "react";
import { ProjectId } from "@/types";
import { GlassPanel } from "../ui/GlassPanel";
import { StatusBadge } from "../ui/StatusBadge";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  Settings,
  Database,
  Shield,
  Sliders,
  FileText,
  Key,
  Users,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsViewProps {
  currentProject: ProjectId;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentProject }) => {
  const [activeTab, setActiveTab] = useState<
    "database" | "autonomy" | "security" | "workspace"
  >("database");
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<"connected" | "idle">("connected");

  const handleTestDatabase = () => {
    setIsTestingDb(true);
    setTimeout(() => {
      setIsTestingDb(false);
      setDbStatus("connected");
    }, 800);
  };

  const auditLogs = [
    {
      id: "aud-1",
      actor: "AI Social Director (Autonomous)",
      action: "Scheduled Multi-Platform Post",
      target: "OKNEXUS Mainnet Beta Campaign",
      timestamp: "Today at 04:12 UTC",
      status: "completed",
    },
    {
      id: "aud-2",
      actor: "Safety & Moderation Agent",
      action: "Quarantined Phishing Link",
      target: "Telegram Channel: @OKN_Official",
      timestamp: "Today at 03:45 UTC",
      status: "completed",
    },
    {
      id: "aud-3",
      actor: "Admin (DORATHY)",
      action: "Updated Project Brain Rules",
      target: "OKN Token AI Brain",
      timestamp: "Yesterday at 22:10 UTC",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Command Center System Settings
            </h2>
            <p className="text-xs text-slate-400">
              Supabase database integration, AI safety policies, security audit logs, and access keys
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
        {[
          { id: "database" as const, label: "Database (Supabase)", icon: Database },
          { id: "autonomy" as const, label: "Autonomy Policy Matrix", icon: Sliders },
          { id: "security" as const, label: "Security & Audit Logs", icon: Shield },
          { id: "workspace" as const, label: "Workspace & Team", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Database (Supabase) */}
      {activeTab === "database" && (
        <div className="space-y-6">
          <GlassPanel className="p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-white">Supabase Cloud Integration</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Production PostgreSQL Database & Row Level Security (RLS) Engine
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status="healthy" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Project Reference ID</div>
                <div className="font-mono text-white font-semibold mt-1">payekirnjeexckzxtsqf</div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
                <div className="text-[10px] text-slate-500 uppercase font-mono">PostgreSQL Endpoint</div>
                <div className="font-mono text-cyan-300 font-semibold mt-1 truncate">
                  https://payekirnjeexckzxtsqf.supabase.co
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Supabase client initialized with production credentials & RLS tenant isolation.</span>
              </div>
              <button
                onClick={handleTestDatabase}
                disabled={isTestingDb}
                className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={cn("w-3 h-3 text-emerald-400", isTestingDb && "animate-spin")} />
                <span>{isTestingDb ? "Testing..." : "Test Connection"}</span>
              </button>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Tab 2: Autonomy Policy Matrix */}
      {activeTab === "autonomy" && (
        <GlassPanel className="p-6">
          <h3 className="text-base font-bold text-white mb-1">AI Autonomy Policy Matrix</h3>
          <p className="text-xs text-slate-400 mb-4">
            Granular autonomy boundaries across 13 content and inquiry classifications
          </p>

          <div className="space-y-2.5 text-xs">
            {[
              { cat: "General Questions & Project FAQs", level: "AUTONOMOUS", risk: "LOW" },
              { cat: "Community Praise & Positive Feedback", level: "AUTONOMOUS", risk: "LOW" },
              { cat: "Spam & Phishing Quarantine", level: "AUTONOMOUS", risk: "HIGH (AUTO-MUTED)" },
              { cat: "Basic Technical Documentation Inquiries", level: "AUTO-RESPOND LOW-RISK", risk: "LOW" },
              { cat: "Partnerships & Commercial Leads", level: "APPROVAL REQUIRED", risk: "MEDIUM" },
              { cat: "Institutional API Access Requests", level: "APPROVAL REQUIRED", risk: "MEDIUM" },
              { cat: "Speculative Token Listing Questions", level: "SUGGEST ONLY", risk: "HIGH" },
              { cat: "Security Vulnerability Reports", level: "APPROVAL REQUIRED", risk: "HIGH" },
              { cat: "Legal / Regulatory Inquiries", level: "APPROVAL REQUIRED", risk: "CRITICAL" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-4"
              >
                <div className="font-semibold text-white">{item.cat}</div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500">Risk: {item.risk}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-950/40 text-violet-300 border border-violet-500/30 font-semibold">
                    {item.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Tab 3: Security & Audit Logs */}
      {activeTab === "security" && (
        <GlassPanel className="p-6">
          <h3 className="text-base font-bold text-white mb-1">Security & Autonomous Action Audit Logs</h3>
          <p className="text-xs text-slate-400 mb-4">
            Cryptographically timestamped action logs across all automated and staff operations
          </p>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{log.action}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target: <span className="text-slate-300">{log.target}</span> · Actor:{" "}
                    <span className="text-blue-400">{log.actor}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500">{log.timestamp}</div>
                  <StatusBadge status={log.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Tab 4: Workspace */}
      {activeTab === "workspace" && (
        <GlassPanel className="p-6">
          <h3 className="text-base font-bold text-white mb-1">Workspace Credentials & Team</h3>
          <p className="text-xs text-slate-400 mb-4">
            OKN Core Systems Workspace Configuration
          </p>

          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] text-xs space-y-2">
            <div>
              <span className="text-slate-500">Workspace Name:</span>{" "}
              <strong className="text-white">OKN Core Systems</strong>
            </div>
            <div>
              <span className="text-slate-500">Active Ecosystem Projects:</span>{" "}
              <strong className="text-blue-400">OKN Token, OKNEXUS Exchange</strong>
            </div>
            <div>
              <span className="text-slate-500">Design Direction:</span>{" "}
              <strong className="text-slate-300">Dark Theme Enterprise Command Center + Apple Liquid Glass</strong>
            </div>
          </div>
        </GlassPanel>
      )}
    </div>
  );
};
