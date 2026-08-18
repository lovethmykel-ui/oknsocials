"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectId, PlatformId, ConversationThread } from "@/types";
import { mockConversations, mockProjectBrains } from "@/lib/data/mockData";
import { PlatformBadge } from "../ui/PlatformBadge";
import { StatusBadge } from "../ui/StatusBadge";
import { AIIndicator } from "../ui/AIIndicator";
import { formatRelativeTime } from "@/lib/utils";
import {
  Inbox,
  Search,
  Send,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UnifiedInboxViewProps {
  currentProject: ProjectId;
}

export const UnifiedInboxView: React.FC<UnifiedInboxViewProps> = ({ currentProject }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [threads, setThreads] = useState<ConversationThread[]>(mockConversations);
  const [selectedThreadId, setSelectedThreadId] = useState<string>(mockConversations[0]?.id || "");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [replyText, setReplyText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];
  const brain = mockProjectBrains[currentProject];

  const handleUseSuggested = () => {
    if (selectedThread?.suggestedResponse) {
      setReplyText(selectedThread.suggestedResponse);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedThread) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "agent" as const,
      authorName: "OKN Official",
      authorHandle: "@OKNToken",
      authorAvatar: "/assets/brand/OKN_coin_transparent.png",
      content: replyText,
      createdAt: new Date().toISOString(),
      isAiGenerated: true,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThread.id
          ? {
              ...t,
              status: "resolved",
              unread: false,
              messages: [...t.messages, newMessage],
            }
          : t
      )
    );
    setReplyText("");
  };

  const handleAutoResolve = () => {
    if (!selectedThread) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThread.id ? { ...t, status: "resolved", unread: false } : t
      )
    );
  };

  const handleEscalate = () => {
    if (!selectedThread) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThread.id ? { ...t, status: "escalated", priority: "critical" } : t
      )
    );
  };

  const filteredThreads = threads.filter((t) => {
    if (filterPlatform !== "all" && t.platform !== filterPlatform) return false;
    if (filterCategory === "unread" && !t.unread) return false;
    if (filterCategory === "needs_approval" && t.status !== "needs_approval") return false;
    if (filterCategory === "ai_handled" && t.status !== "ai_handled") return false;
    if (filterCategory === "flagged" && t.status !== "flagged") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.authorName.toLowerCase().includes(q) ||
        t.authorHandle.toLowerCase().includes(q) ||
        t.previewText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filterCategories = [
    { id: "all", label: "All Activity", count: threads.length },
    { id: "unread", label: "Unread Queue", count: threads.filter((t) => t.unread).length },
    { id: "needs_approval", label: "Needs Approval", count: threads.filter((t) => t.status === "needs_approval").length },
    { id: "ai_handled", label: "AI Handled", count: threads.filter((t) => t.status === "ai_handled").length },
    { id: "flagged", label: "Security & Flagged", count: threads.filter((t) => t.status === "flagged").length },
  ];

  const platforms: { id: PlatformId | "all"; label: string }[] = [
    { id: "all", label: "All Platforms" },
    { id: "x", label: "X" },
    { id: "telegram", label: "Telegram" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "instagram", label: "Instagram" },
    { id: "youtube", label: "YouTube" },
    { id: "tiktok", label: "TikTok" },
  ];

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col md:flex-row gap-4 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* 1. Left Channel & Filter Sidebar */}
      <div className="w-full md:w-56 shrink-0 flex flex-col gap-3">
        <div className="p-3.5 rounded-xl bg-[#0D1016] border border-white/[0.08]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
            Inbox Views
          </div>
          <div className="space-y-1">
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  filterCategory === cat.id
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                )}
              >
                <span>{cat.label}</span>
                {cat.count > 0 && (
                  <span className="mono-metric text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400">
                    {cat.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D1016] border border-white/[0.08] flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
            Platforms
          </div>
          <div className="space-y-1">
            {platforms.map((plat) => (
              <button
                key={plat.id}
                onClick={() => setFilterPlatform(plat.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  filterPlatform === plat.id
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                )}
              >
                {plat.id !== "all" ? (
                  <PlatformBadge platform={plat.id} size="sm" showLabel={false} />
                ) : (
                  <Inbox className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{plat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Center Conversation Feed */}
      <div className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col rounded-xl bg-[#080A0F] border border-white/[0.08] overflow-hidden">
        {/* Search Header */}
        <div className="p-3 border-b border-white/[0.08] bg-[#0D1016]/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40"
            />
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {filteredThreads.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching conversation threads found.
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const isSelected = thread.id === selectedThread?.id;

              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={cn(
                    "p-3.5 transition-colors cursor-pointer relative",
                    isSelected
                      ? "bg-blue-600/15 border-l-2 border-blue-500"
                      : "hover:bg-white/[0.03]",
                    thread.unread && !isSelected && "bg-white/[0.02]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <PlatformBadge platform={thread.platform} size="sm" showLabel={false} />
                      <span className="text-xs font-semibold text-white truncate">
                        {thread.authorName}
                      </span>
                    </div>
                    <span
                      className="text-[10px] text-slate-500 font-mono shrink-0"
                      suppressHydrationWarning
                    >
                      {mounted ? formatRelativeTime(thread.updatedAt) : "12m ago"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-2">
                    {thread.previewText}
                  </p>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 font-medium">
                      {thread.intent}
                    </span>
                    <AIIndicator confidence={thread.aiConfidence} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Right Thread Context & AI Response Assistant */}
      <div className="flex-1 flex flex-col rounded-xl bg-[#0D1016] border border-white/[0.08] overflow-hidden min-w-0">
        {selectedThread ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] bg-[#080A0F] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/10 relative">
                  <Image
                    src={selectedThread.authorAvatar}
                    alt={selectedThread.authorName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">
                      {selectedThread.authorName}
                    </h3>
                    <PlatformBadge platform={selectedThread.platform} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {selectedThread.authorHandle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={selectedThread.status} />
                <button
                  onClick={handleEscalate}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-xs font-medium"
                >
                  Escalate
                </button>
                <button
                  onClick={handleAutoResolve}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Resolve
                </button>
              </div>
            </div>

            {/* AI Classification & Risk Bar */}
            <div className="px-4 py-2 bg-[#050609]/80 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">
                  Intent: <strong className="text-white">{selectedThread.intent}</strong>
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">
                  Sentiment: <strong className="text-emerald-400 capitalize">{selectedThread.sentiment}</strong>
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">
                  Assigned: <strong className="text-violet-300">{selectedThread.assignedAgent}</strong>
                </span>
              </div>

              <AIIndicator label="CONFIDENCE" confidence={selectedThread.aiConfidence} />
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedThread.messages.map((msg) => {
                const isUser = msg.sender === "user";

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 max-w-xl",
                      isUser ? "mr-auto" : "ml-auto flex-row-reverse"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-800 border border-white/10 relative">
                      <Image
                        src={msg.authorAvatar}
                        alt={msg.authorName}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>

                    <div
                      className={cn(
                        "p-3.5 rounded-2xl text-xs leading-relaxed",
                        isUser
                          ? "bg-[#171C24] text-slate-200 border border-white/[0.06] rounded-tl-sm"
                          : "bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-tr-sm"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-slate-400 font-mono">
                        <span className="font-semibold text-white">{msg.authorName}</span>
                        <span suppressHydrationWarning>
                          {mounted ? formatRelativeTime(msg.createdAt) : "Just now"}
                        </span>
                      </div>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Suggested Response Box */}
            {selectedThread.suggestedResponse && (
              <div className="p-3 mx-4 mb-2 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-violet-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <span>AI Suggested Brand Response</span>
                  </div>
                  <button
                    onClick={handleUseSuggested}
                    className="text-[11px] font-bold text-violet-300 hover:text-white px-2 py-0.5 rounded bg-violet-500/20 hover:bg-violet-500/40 transition-colors"
                  >
                    Insert into Composer
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {selectedThread.suggestedResponse}
                </p>
              </div>
            )}

            {/* Composer & Action Bar */}
            <div className="p-4 border-t border-white/[0.08] bg-[#080A0F]">
              <div className="flex items-center gap-2">
                <textarea
                  rows={2}
                  placeholder={`Reply as ${brain?.name || "OKN Official"}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
            Select a thread to view message history and AI response tools.
          </div>
        )}
      </div>
    </div>
  );
};
