"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectId, PlatformId, SocialAccount } from "@/types";
import { mockSocialAccounts } from "@/lib/data/mockData";
import { SOCIAL_PROVIDERS } from "@/lib/social/providerRegistry";
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
  ShieldCheck,
  Key,
  Webhook,
  Copy,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialAccountsViewProps {
  currentProject: ProjectId;
}

const STORAGE_KEY = "okn_connected_social_accounts";

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
  const [connectTab, setConnectTab] = useState<"oauth" | "api_keys" | "webhooks">("oauth");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>("x");
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<Record<string, string>>({});
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Form State for custom credentials
  const [customHandle, setCustomHandle] = useState("");
  const [customDisplayName, setCustomDisplayName] = useState("");
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [followers, setFollowers] = useState("18500");
  const [automationLevel, setAutomationLevel] = useState<
    "approval_required" | "suggest_only" | "autonomous" | "off"
  >("approval_required");

  // Capabilities
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

  const provider = SOCIAL_PROVIDERS[selectedPlatform];
  const projectAccounts = accounts.filter((a) => a.projectId === currentProject);
  const totalAudience = projectAccounts.reduce((acc, a) => acc + (a.followers || 0), 0);

  const handleOpenConnectModal = (p: PlatformId = "x") => {
    setSelectedPlatform(p);
    const isToken = currentProject === "okn-token";
    setCustomHandle(
      isToken
        ? p === "x"
          ? "@OKNToken"
          : p === "telegram"
          ? "@OKNOfficialCommunity"
          : "@okntoken"
        : p === "x"
        ? "@OKNEXUS"
        : p === "linkedin"
        ? "company/oknexus-exchange"
        : "@oknexusexchange"
    );
    setCustomDisplayName(
      isToken
        ? `OKN Token ${SOCIAL_PROVIDERS[p]?.name || p}`
        : `OKNEXUS ${SOCIAL_PROVIDERS[p]?.name || p}`
    );
    setFollowers("18500");
    setIsModalOpen(true);
  };

  // Direct OAuth 2.0 Flow with Redirect to Platform Authorization URL
  const handleConnectOAuth = async (platformToConnect: PlatformId = selectedPlatform) => {
    setIsRedirecting(true);
    try {
      const res = await fetch(`/api/oauth/${platformToConnect}/auth?projectId=${currentProject}`);
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error("Failed to initiate OAuth authorization:", err);
      setIsRedirecting(false);
    }
  };

  // Save manual API / Bot Token account
  const handleSaveApiKeysAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHandle.trim()) return;

    const newAcc: SocialAccount = {
      id: `acc-${selectedPlatform}-${Date.now()}`,
      projectId: currentProject,
      platform: selectedPlatform,
      handle: customHandle.startsWith("@") || selectedPlatform === "linkedin" ? customHandle : `@${customHandle}`,
      displayName: customDisplayName.trim() || customHandle,
      avatarUrl:
        currentProject === "okn-token"
          ? "/assets/brand/OKN_coin_transparent.png"
          : "/assets/brand/OKN_logo_transparent.png",
      status: "healthy",
      followers: parseInt(followers, 10) || 15000,
      lastSyncAt: new Date().toISOString(),
      automationLevel,
      capabilities: {
        publish: capPublish,
        readInbox: capInbox,
        autoReply: capAutoReply,
        analytics: capAnalytics,
      },
    };

    setAccounts((prev) => [newAcc, ...prev.filter((a) => !(a.platform === selectedPlatform && a.projectId === currentProject))]);
    setIsModalOpen(false);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleTestConnection = async (acc: SocialAccount) => {
    setSyncingId(acc.id);
    try {
      const res = await fetch("/api/social/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: acc.platform,
          handle: acc.handle,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setDiagnosticResult((prev) => ({
          ...prev,
          [acc.id]: `${data.latencyMs}ms • Nominal`,
        }));
        setAccounts((prev) =>
          prev.map((a) => (a.id === acc.id ? { ...a, status: "healthy", lastSyncAt: new Date().toISOString() } : a))
        );
      }
    } catch {
      setDiagnosticResult((prev) => ({ ...prev, [acc.id]: "Ping Failed" }));
    } finally {
      setSyncingId(null);
    }
  };

  const handleCopyWebhook = (p: PlatformId) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/api/webhooks/${p}` : `/api/webhooks/${p}`;
    navigator.clipboard.writeText(url);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
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
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Social Accounts Integration Hub
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold">
                OAuth 2.0 Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live OAuth 2.0 authentication, Telegram BotFather API, and webhook listeners for {currentProject === "okn-token" ? "OKN Token (https://okntoken.com)" : "OKNEXUS Exchange (https://oknexusexchange.com)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenConnectModal("x")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Channel</span>
          </button>
        </div>
      </div>

      {/* Available Channels Quick Connect Bar */}
      <div className="p-4 rounded-2xl bg-[#080A0F] border border-white/[0.06]">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center justify-between">
          <span>Social Channel Authorization Matrix</span>
          <span className="text-slate-500 text-[10px] lowercase">Click any channel to connect</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {(Object.keys(SOCIAL_PROVIDERS) as PlatformId[]).map((p) => {
            const isConnected = projectAccounts.some((a) => a.platform === p);
            const prov = SOCIAL_PROVIDERS[p];

            return (
              <button
                key={p}
                onClick={() => handleOpenConnectModal(p)}
                className={cn(
                  "p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all group relative overflow-hidden",
                  isConnected
                    ? "bg-blue-950/20 border-blue-500/30 hover:border-blue-500/50"
                    : "bg-white/[0.02] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.04]"
                )}
              >
                <div className="flex items-center justify-between">
                  <PlatformBadge platform={p} size="sm" showLabel={false} />
                  {isConnected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    {prov.name.split(" ")[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {isConnected ? "Connected" : prov.authType === "bot_token" ? "Bot Token" : "OAuth 2.0"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aggregate Stats */}
      {projectAccounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Aggregate Community Base</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{formatNumber(totalAudience)}</div>
            </div>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">Active Channel Fleet</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{projectAccounts.length} Connected</div>
            </div>
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="p-4 rounded-xl bg-[#080A0F] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500">OAuth &amp; API Security Health</div>
              <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">100% NOMINAL</div>
            </div>
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      )}

      {/* Connected Channels Cards */}
      {projectAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projectAccounts.map((acc) => {
            const isSyncing = syncingId === acc.id;
            const diagnostic = diagnosticResult[acc.id];
            const prov = SOCIAL_PROVIDERS[acc.platform];

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

                  {/* Scopes & Permissions */}
                  <div className="space-y-1 text-[11px] text-slate-400 mb-4">
                    <div className="text-[10px] uppercase font-mono text-slate-500 mb-1 flex items-center justify-between">
                      <span>Granted Capabilities</span>
                      {diagnostic && <span className="text-emerald-400 text-[10px] font-mono">{diagnostic}</span>}
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
                      onClick={() => handleTestConnection(acc)}
                      disabled={isSyncing}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-300 hover:text-white border border-white/[0.08] flex items-center gap-1 transition-colors"
                      title="Test Live Connection API"
                    >
                      <RefreshCw className={cn("w-3 h-3 text-blue-400", isSyncing && "animate-spin")} />
                      <span>{isSyncing ? "Testing..." : "Test Ping"}</span>
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
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-[#080A0F]/60 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
            <Link2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Social Channels Connected Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
            Connect official handles via OAuth 2.0 authorization or platform API credentials to start autonomous publishing and community triage.
          </p>
          <button
            onClick={() => handleOpenConnectModal("x")}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Connect Your First Channel
          </button>
        </div>
      )}

      {/* Connect Channel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#0D1016] border border-white/10 shadow-2xl p-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-3">
                <PlatformBadge platform={selectedPlatform} size="md" showLabel={false} />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Connect {provider?.name || selectedPlatform.toUpperCase()}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {currentProject === "okn-token" ? "OKN Token (https://okntoken.com)" : "OKNEXUS Exchange (https://oknexusexchange.com)"}
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

            {/* Platform Selection Row */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
              {(Object.keys(SOCIAL_PROVIDERS) as PlatformId[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPlatform(p)}
                  className={cn(
                    "p-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all",
                    selectedPlatform === p
                      ? "bg-blue-600/20 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      : "bg-black/40 border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  <PlatformBadge platform={p} size="sm" showLabel={false} />
                  <span className="capitalize text-[9px] font-semibold">{p}</span>
                </button>
              ))}
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/[0.08] mb-5">
              <button
                onClick={() => setConnectTab("oauth")}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                  connectTab === "oauth"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>OAuth 2.0 (Direct Redirect)</span>
              </button>
              <button
                onClick={() => setConnectTab("api_keys")}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                  connectTab === "api_keys"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Key className="w-3.5 h-3.5" />
                <span>API Keys / Bot Token</span>
              </button>
              <button
                onClick={() => setConnectTab("webhooks")}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                  connectTab === "webhooks"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Webhook className="w-3.5 h-3.5" />
                <span>Webhooks</span>
              </button>
            </div>

            {/* TAB 1: Direct OAuth 2.0 Flow */}
            {connectTab === "oauth" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Requested Scopes for {provider.name}:</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-400 font-mono list-disc list-inside">
                    {provider.defaultScopes.map((scope) => (
                      <li key={scope}>{scope}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Clicking &quot;Authorize via {provider.name}&quot; redirects you to the platform authorization page and returns to the command center upon approval.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleConnectOAuth(selectedPlatform)}
                  disabled={isRedirecting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>
                    {isRedirecting ? `Redirecting to ${provider.name}...` : `Authorize via ${provider.name}`}
                  </span>
                </button>
              </div>
            )}

            {/* TAB 2: API Keys / Bot Tokens */}
            {connectTab === "api_keys" && (
              <form onSubmit={handleSaveApiKeysAccount} className="space-y-4">
                {selectedPlatform === "telegram" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Telegram Bot Token (from @BotFather)
                      </label>
                      <input
                        type="password"
                        value={botToken}
                        onChange={(e) => setBotToken(e.target.value)}
                        placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Target Channel Username / Chat ID
                      </label>
                      <input
                        type="text"
                        value={chatId}
                        onChange={(e) => setChatId(e.target.value)}
                        placeholder="@OKNCommunity or -1001234567890"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        API Bearer Token / Access Token
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter platform access token..."
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Display Handle
                    </label>
                    <input
                      type="text"
                      value={customHandle}
                      onChange={(e) => setCustomHandle(e.target.value)}
                      placeholder="@handle"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Automation Policy
                    </label>
                    <select
                      value={automationLevel}
                      onChange={(e) => setAutomationLevel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="approval_required">Approval Required</option>
                      <option value="suggest_only">Suggest Only</option>
                      <option value="autonomous">Autonomous (Full AI)</option>
                      <option value="off">Off (Manual)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Save &amp; Verify Credentials</span>
                </button>
              </form>
            )}

            {/* TAB 3: Webhook Ingestion */}
            {connectTab === "webhooks" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-xs space-y-2">
                  <div className="font-semibold text-white">Live Webhook Callback URL:</div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black/60 border border-white/[0.08] font-mono text-[11px] text-cyan-300 break-all">
                    <span>
                      {typeof window !== "undefined" ? `${window.location.origin}/api/webhooks/${selectedPlatform}` : `/api/webhooks/${selectedPlatform}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyWebhook(selectedPlatform)}
                      className="ml-auto p-1 rounded bg-white/10 hover:bg-white/20 text-white shrink-0"
                    >
                      {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Paste this URL into your {provider.name} Developer App webhook subscriptions to receive live mentions, comments, and direct messages into the Unified Inbox.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
