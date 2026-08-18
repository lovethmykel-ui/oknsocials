"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, ShieldCheck } from "lucide-react";

interface AIIndicatorProps {
  confidence?: number;
  label?: string;
  variant?: "badge" | "pill" | "banner";
  className?: string;
}

export const AIIndicator: React.FC<AIIndicatorProps> = ({
  confidence,
  label = "AI DIRECTED",
  variant = "badge",
  className,
}) => {
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex items-center justify-between px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-950/40 to-blue-950/30 border border-violet-500/20 text-xs text-violet-300",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          <span className="font-medium tracking-wide uppercase">{label}</span>
        </div>
        {confidence !== undefined && (
          <span className="mono-metric font-semibold text-violet-200">
            {confidence}% confidence
          </span>
        )}
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-violet-950/50 text-violet-300 border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
        className
      )}
    >
      <Sparkles className="w-3 h-3 text-violet-400" />
      <span>{label}</span>
      {confidence !== undefined && (
        <span className="mono-metric text-violet-200 pl-0.5 border-l border-violet-500/30">
          {confidence}%
        </span>
      )}
    </span>
  );
};
