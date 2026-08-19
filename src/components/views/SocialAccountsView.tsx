"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectId, PlatformId, SocialAccount } from "@/types";
import { mockSocialAccounts } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import { PlatformBadge } from "../ui/PlatformBadge";
import { StatusBadge } from "../ui/StatusBadge";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import {
  Share2,
  Plus,
  RefreshCw,
  Trash2,
  Check,
  X,
  Link2,
  Zap,
  Activity,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialAccountsViewProps {
  currentProject: ProjectId;
}

const STORAGE_KEY = "okn_connected_social_accounts";

const PLATFORM_DEFAULTS: Record<
  PlatformId,
  { label: string; defaultAvatar: string; placeholderHandle: string }
> = {
  x: {
    label: "X (Twitter)",
    defaultAvatar: "/assets/brand/OKN_coin_transparent.png",
    placeholderHandle: "@OKNToken",
  },
  telegram: {
    label: "Telegram",
    defaultAvatar: "/assets/brand/OKN_logo_transparent.png",
    placeholderHandle: "@OKN_Official_Community",
  },
  instagram: {
    label: "Instagram",
    defaultAvatar: "/assets/brand/OKN_coin_transparent.png",
    placeholderHandle: "@okn.ecosystem",
  },
  linkedin: {
    label: "LinkedIn",
    defaultAvatar: "/assets/brand/OKN_logo_transparent.png",
    placeholderHandle: "company/oknexus-exchange",
  },
  youtube: {
    label: "YouTube",
    defaultAvatar: "/assets/brand/OKN_coin_transparent.png",
    placeholderHandle: "@OKNEcosystemOfficial",
  },
  tiktok: {
    label: "TikTok",
    defaultAvatar: "/assets/brand/OKN_coin_transparent.png",
    placeholderHandle: "@okntoken",
  },
  facebook: {
    label: "Facebook",
    defaultAvatar: "/assets/brand/OKN_logo_transparent.png",
    placeholderHandle: "OKNEcosystem",
  },
};

export const SocialAccountsView: React.FC<SocialAccountsViewProps> = ({
  currentProject,
}) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return mockSocialAccounts;
        }
      }
    }
    return mockSocialAccounts;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Form State for new account
  const [platform, setPlatform] = useState<PlatformId>("x");
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [followers, setFollowers] = useState("12500");
  const [automationLevel, setAutomationLevel] = useState<
    "approval_required" | "suggest_only" | "autonomous" | "off"
  >("approval_required");
  const [capPublish, setCapPublish] = useState(true);
  const [capInbox, setCapInbox] = useState(true);
  const [capAutoReply, setCapAutoReply] = useState(false);
  const [capAnalytics, setCapAnalytics] = useState(true);

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }
  }, [accounts]);

  const projectAccounts = accounts.filter((a) => a.projectId === currentProject);
  const totalAudience = projectAccounts.reduce((acc, a) => acc + (a.followers || 0), 0);

  const handleOpenModal = () => {
    const isToken = currentProject === "okn-token";
    setPlatform("x");
    setHandle(isToken ? "@OKNToken" : "@OKNEXUS");
    setDisplayName(isToken ? "OKN Token Official" : "OKNEXUS Perpetual DEX");
    setFollowers("15000");
    setIsModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    const newAccount: SocialAccount = {
      id: `acc-${Date.now()}`,
      projectId: currentProject,
      platform,
      handle: handle.startsWith("@") || platform === "linkedin" || platform === "facebook" ? handle : `@${handle}`,
      displayName: displayName.trim() || handle,
      avatarUrl:
        currentProject === "okn-token"
          ? "/assets/brand/OKN_coin_transparent.png"
          : "/assets/brand/OKN_logo_transparent.png",
      status: "healthy",
      followers: parseInt(followers, 10) || 0,
      lastSyncAt: new Date().toISOString(),
      automationLevel,
      capabilities: {
        publish: capPublish,
        readInbox: capInbox,
        autoReply: capAutoReply,
        analytics: capAnalytics,
      },
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setIsModalOpen(false);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

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
    }, 800);
  };

  const handleQuickAddDefaults = () => {
    const isToken = currentProject === "okn-token";
    const defaultList: SocialAccount[] = isToken
      ? [
          {
            id: `acc-x-${Date.now()}`,
            projectId: "okn-token",
            platform: "x",
            handle: "@OKNToken",
            displayName: "OKN Token",
            avatarUrl: "/assets/brand/OKN_coin_transparent.png",
            status: "healthy",
            followers: 48500,
            lastSyncAt: new Date().toISOString(),
            automationLevel: "approval_required",
            capabilities: { publish: true, readInbox: true, autoReply: true, analytics: true },
          },
          {
            id: `acc-tg-${Date.now() + 1}`,
            projectId: "okn-token",
            platform: "telegram",
            handle: "@OKNOfficialCommunity",
            displayName: "OKN Official Community",
            avatarUrl: "/assets/brand/OKN_coin_transparent.png",
            status: "healthy",
            followers: 62400,
            lastSyncAt: new Date().toISOString(),
            automationLevel: "suggest_only",
            capabilities: { publish: true, readInbox: true, autoReply: false, analytics: true },
          },
          {
            id: `acc-ig-${Date.now() + 2}`,
            projectId: "okn-token",
            platform: "instagram",
            handle: "@okntoken",
            displayName: "OKN Token Global",
            avatarUrl: "/assets/brand/OKN_coin_transparent.png",
            status: "healthy",
            followers: 24300,
            lastSyncAt: new Date().toISOString(),
            automationLevel: "approval_required",
            capabilities: { publish: true, readInbox: true, autoReply: false, analytics: true },
          },
        ]
      : [
          {
            id: `acc-x-${Date.now()}`,
            projectId: "oknexus-exchange",
            platform: "x",
            handle: "@OKNEXUS",
            displayName: "OKNEXUS Exchange",
            avatarUrl: "/assets/brand/OKN_logo_transparent.png",
            status: "healthy",
            followers: 38200,
            lastSyncAt: new Date().toISOString(),
            automationLevel: "approval_required",
            capabilities: { publish: true, readInbox: true, autoReply: true, analytics: true },
          },
          {
            id: `acc-li-${Date.now() + 1}`,
            projectId: "oknexus-exchange",
            platform: "linkedin",
            handle: "company/oknexus-exchange",
            displayName: "OKNEXUS Institutional",
            avatarUrl: "/assets/brand/OKN_logo_transparent.png",
            status: "healthy",
            followers: 14800,
            lastSyncAt: new Date().toISOString(),
            automationLevel: "approval_required",
            capabilities: { publish: true, readInbox: true, autoReply: false, analytics: true },
          },
          {
            id: `acc-tg-${Date.now() + 2}`,
            projectId: "oknexus-exchange",
            platform: "telegram",
            handle: "@OKNEXUSTraders",
            displayName: "OKNEXUS VIP Traders",
            avatarUrl: "/assets/brand/OKN_logo_transparent.png",
            status: "healthy",
            followers: 29500,
            lastSyncAt: new Date().toISOString(),
            automationLevel: "suggest_only",
            capabilities: { publish: true, readInbox: true, autoReply: false, analytics: true },
          },
        ];

    setAccounts((prev) => [
      ...defaultList,
      ...prev.filter((a) => a.projectId !== currentProject),
    ]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Connected Social Accounts
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold">
                {projectAccounts.length} Connected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live channels for {currentProject === "okn-token" ? "OKN Token (https://okntoken.com)" : "OKNEXUS Exchange (https://oknexusexchange.com)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {projectAccounts.length === 0 && (
            <button
              onClick={handleQuickAddDefaults}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
            >
              Quick Preset Fleet
            </button>
          )}

          <button
            onClick={handleOpenModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Social Account</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      {projectAccounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Aggregate Community</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{formatNumber(totalAudience)}</div>
            </div>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Active Channel Fleet</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{projectAccounts.length} Platforms</div>
            </div>
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">OAuth Security Health</div>
              <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">100% NOMINAL</div>
            </div>
            <Sliders className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      )}

      {/* Empty State */}
      {projectAccounts.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-[#080A0F]/60 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
            <Link2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Social Channels Connected Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Connect your official handles for X, Telegram, Instagram, LinkedIn, or YouTube to begin publishing and triaging community messages.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Connect Custom Handle
            </button>
            <button
              onClick={handleQuickAddDefaults}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
            >
              Add Standard OKN Fleet
            </button>
          </div>
        </div>
      )}

      {/* Account Cards Grid */}
      {projectAccounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projectAccounts.map((acc) => {
            const isSyncing = syncingId === acc.id;

            return (
              <GlassPanel key={acc.id} className="p-5 flex flex-col justify-between hover:border-blue-500/30 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <PlatformBadge platform={acc.platform} size="lg" showLabel={false} />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-white truncate">
                          {acc.displayName}
                        </div>
                        <div className="text-[11px] text-blue-400 font-mono truncate">
                          {acc.handle}
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={acc.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/40 border border-white/[0.06] mb-3 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500">Audience Base</div>
                      <div className="font-mono text-white font-semibold mt-0.5">
                        {formatNumber(acc.followers)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Automation Policy</div>
                      <div className="font-mono text-violet-300 font-semibold text-[10px] mt-0.5 truncate uppercase">
                        {acc.automationLevel.replace("_", " ")}
                      </div>
                    </div>
                  </div>

                  {/* Capabilities Matrix */}
                  <div className="space-y-1 text-[11px] text-slate-400 mb-4">
                    <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                      Active Permissions
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(acc.capabilities).map(([key, enabled]) => (
                        <span
                          key={key}
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono",
                            enabled
                              ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/20"
                              : "bg-slate-900 text-slate-600 border border-white/[0.02]"
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

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSyncAccount(acc.id)}
                      disabled={isSyncing}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 hover:text-white border border-white/[0.08] flex items-center gap-1 transition-colors"
                      title="Test Connection"
                    >
                      <RefreshCw className={cn("w-3 h-3 text-blue-400", isSyncing && "animate-spin")} />
                      <span>{isSyncing ? "Testing..." : "Verify"}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteAccount(acc.id)}
                      className="p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-950/50 text-rose-400 border border-rose-500/20 transition-colors"
                      title="Disconnect Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}

      {/* Connect Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1016] border border-white/10 shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Connect Social Account</h3>
                  <p className="text-[11px] text-slate-400">
                    {currentProject === "okn-token" ? "OKN Token Ecosystem" : "OKNEXUS Exchange"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="space-y-4">
              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Platform
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(PLATFORM_DEFAULTS) as PlatformId[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={cn(
                        "p-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all",
                        platform === p
                          ? "bg-blue-600/20 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                          : "bg-black/40 border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      <PlatformBadge platform={p} size="sm" showLabel={false} />
                      <span className="capitalize text-[10px]">{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Handle & Display Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Account Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder={PLATFORM_DEFAULTS[platform].placeholderHandle}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. OKN Official"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Followers & Automation Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Follower Baseline
                  </label>
                  <input
                    type="number"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder="10000"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Automation Policy
                  </label>
                  <select
                    value={automationLevel}
                    onChange={(e) =>
                      setAutomationLevel(
                        e.target.value as "approval_required" | "suggest_only" | "autonomous" | "off"
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="approval_required">Approval Required (Safe)</option>
                    <option value="suggest_only">Suggest Only (Drafts)</option>
                    <option value="autonomous">Autonomous (Full AI)</option>
                    <option value="off">Off (Manual Only)</option>
                  </select>
                </div>
              </div>

              {/* Capabilities Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Enabled Agent Capabilities
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/[0.06] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capPublish}
                      onChange={(e) => setCapPublish(e.target.checked)}
                      className="rounded accent-blue-600"
                    />
                    <span className="text-slate-300">Publish Content</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/[0.06] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capInbox}
                      onChange={(e) => setCapInbox(e.target.checked)}
                      className="rounded accent-blue-600"
                    />
                    <span className="text-slate-300">Read Inbox</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/[0.06] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capAutoReply}
                      onChange={(e) => setCapAutoReply(e.target.checked)}
                      className="rounded accent-blue-600"
                    />
                    <span className="text-slate-300">AI Auto-Reply</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/[0.06] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={capAnalytics}
                      onChange={(e) => setCapAnalytics(e.target.checked)}
                      className="rounded accent-blue-600"
                    />
                    <span className="text-slate-300">Sync Analytics</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
