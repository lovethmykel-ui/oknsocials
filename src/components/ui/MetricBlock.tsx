"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricBlockProps {
  label: string;
  value: string | number;
  delta?: {
    value: string | number;
    positive: boolean;
    period?: string;
  };
  sparklineData?: number[];
  sparklineColor?: string;
  icon?: React.ReactNode;
  subtext?: string;
  className?: string;
}

export const MetricBlock: React.FC<MetricBlockProps> = ({
  label,
  value,
  delta,
  sparklineData,
  sparklineColor = "#3B82F6",
  icon,
  subtext,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative p-4 rounded-xl bg-[#0D1016]/90 border border-white/[0.08] hover:border-blue-500/30 transition-all duration-200 backdrop-blur-md group",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="p-1.5 rounded-lg bg-white/[0.04] text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-950/30 transition-colors">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-2xl font-bold tracking-tight text-white mono-metric">
            {value}
          </div>

          {delta && (
            <div className="flex items-center gap-1 mt-1 text-xs">
              {delta.positive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span
                className={cn(
                  "font-semibold mono-metric",
                  delta.positive ? "text-emerald-400" : "text-rose-400"
                )}
              >
                {delta.positive ? "+" : ""}
                {delta.value}%
              </span>
              <span className="text-slate-500 text-[11px]">
                {delta.period || "vs last week"}
              </span>
            </div>
          )}

          {subtext && !delta && (
            <div className="text-xs text-slate-500 mt-1">{subtext}</div>
          )}
        </div>

        {sparklineData && (
          <div className="shrink-0 pt-2">
            <Sparkline
              data={sparklineData}
              width={90}
              height={32}
              color={sparklineColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};
