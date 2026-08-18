"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProjectId, SocialAccount } from "@/types";
import { mockSocialAccounts } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import { PlatformBadge } from "../ui/PlatformBadge";
import { StatusBadge } from "../ui/StatusBadge";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import {
  Share2,
  Plus,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialAccountsViewProps {
  currentProject: ProjectId;
}

export const SocialAccountsView: React.FC<SocialAccountsViewProps> = ({
  currentProject,
}) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>(mockSocialAccounts);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const projectAccounts = accounts.filter((a) => a.projectId === currentProject);

  const handleSyncAccount = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "healthy", lastSyncAt: new Date().toISOString() }
            : a
        )
      );
      setSyncingId(null);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Connected Social Accounts & Health
            </h2>
            <p className="text-xs text-slate-400">
              OAuth token lifespans, API limits, and capability matrix for active channels
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 active:scale-95 transition-all">
          <Plus className="w-4 h-4" />
          <span>Connect New Channel</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projectAccounts.map((acc) => {
          const isSyncing = syncingId === acc.id;

          return (
            <GlassPanel key={acc.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-900 border border-white/10 relative p-0.5 flex items-center justify-center">
                      <Image
                        src={acc.avatarUrl}
                        alt={acc.displayName}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-white truncate">
                        {acc.displayName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        {acc.handle}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={acc.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/40 border border-white/[0.06] mb-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">Audience</div>
                    <div className="font-mono text-white font-semibold mt-0.5">
                      {formatNumber(acc.followers)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Automation</div>
                    <div className="font-mono text-violet-300 font-semibold text-[10px] mt-0.5 truncate uppercase">
                      {acc.automationLevel.replace("_", " ")}
                    </div>
                  </div>
                </div>

                {/* Capabilities Matrix */}
                <div className="space-y-1 text-[11px] text-slate-400 mb-4">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                    Channel Permissions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(acc.capabilities).map(([key, enabled]) => (
                      <span
                        key={key}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono",
                          enabled
                            ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/20"
                            : "bg-slate-900 text-slate-500 border border-white/[0.04]"
                        )}
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  Synced {formatRelativeTime(acc.lastSyncAt)}
                </span>

                <button
                  onClick={() => handleSyncAccount(acc.id)}
                  disabled={isSyncing}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 hover:text-white border border-white/[0.08] flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={cn("w-3 h-3 text-blue-400", isSyncing && "animate-spin")} />
                  <span>{isSyncing ? "Syncing..." : "Re-Verify"}</span>
                </button>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};
