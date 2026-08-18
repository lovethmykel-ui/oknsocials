"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const norm = status.toLowerCase();

  const getStyle = () => {
    switch (norm) {
      case "healthy":
      case "active":
      case "published":
      case "approved":
      case "completed":
        return {
          dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
          badge: "bg-emerald-950/40 text-emerald-300 border-emerald-500/20",
          label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
        };
      case "scheduled":
      case "processing":
      case "in_progress":
        return {
          dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]",
          badge: "bg-blue-950/40 text-blue-300 border-blue-500/20",
          label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
        };
      case "needs_attention":
      case "review":
      case "pending_approval":
      case "draft":
      case "standby":
        return {
          dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
          badge: "bg-amber-950/40 text-amber-300 border-amber-500/20",
          label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
        };
      case "critical":
      case "failed":
      case "auth_expired":
      case "rate_limited":
      case "api_error":
      case "disconnected":
      case "flagged":
      case "quarantined":
        return {
          dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse",
          badge: "bg-rose-950/40 text-rose-300 border-rose-500/30",
          label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
        };
      default:
        return {
          dot: "bg-slate-400",
          badge: "bg-slate-900/60 text-slate-300 border-slate-700/40",
          label: status.replace("_", " "),
        };
    }
  };

  const current = getStyle();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md",
        current.badge,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", current.dot)} />
      <span>{current.label}</span>
    </span>
  );
};
