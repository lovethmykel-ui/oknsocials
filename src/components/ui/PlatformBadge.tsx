"use client";

import React from "react";
import { PlatformId } from "@/types";
import { cn } from "@/lib/utils";

interface PlatformBadgeProps {
  platform: PlatformId | string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  size = "md",
  showLabel = true,
  className,
}) => {
  const norm = platform.toLowerCase();

  const getPlatformDetails = () => {
    switch (norm) {
      case "x":
      case "twitter":
        return {
          name: "X",
          bg: "bg-black/60 text-white border-white/20",
          icon: (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          ),
        };
      case "instagram":
        return {
          name: "Instagram",
          bg: "bg-pink-950/40 text-pink-300 border-pink-500/30",
          icon: (
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          ),
        };
      case "linkedin":
        return {
          name: "LinkedIn",
          bg: "bg-blue-950/40 text-blue-300 border-blue-500/30",
          icon: (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74v-8.37H5.06v8.37h2.8z" />
            </svg>
          ),
        };
      case "telegram":
        return {
          name: "Telegram",
          bg: "bg-sky-950/40 text-sky-300 border-sky-500/30",
          icon: (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .36z" />
            </svg>
          ),
        };
      case "youtube":
        return {
          name: "YouTube",
          bg: "bg-red-950/40 text-red-300 border-red-500/30",
          icon: (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          ),
        };
      case "tiktok":
        return {
          name: "TikTok",
          bg: "bg-cyan-950/40 text-cyan-300 border-cyan-500/30",
          icon: (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23 1.01.09 2.11.83 2.85.8.76 1.96.95 2.98.63.81-.24 1.48-.86 1.77-1.63.13-.37.21-.77.21-1.17V.02z" />
            </svg>
          ),
        };
      default:
        return {
          name: platform,
          bg: "bg-slate-800/60 text-slate-300 border-slate-700/50",
          icon: <span className="w-2 h-2 rounded-full bg-blue-400" />,
        };
    }
  };

  const details = getPlatformDetails();
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px] gap-1",
    md: "px-2 py-1 text-xs gap-1.5",
    lg: "px-2.5 py-1.5 text-sm gap-2",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-md border backdrop-blur-md transition-colors",
        details.bg,
        sizeClasses,
        className
      )}
    >
      {details.icon}
      {showLabel && <span>{details.name}</span>}
    </span>
  );
};
