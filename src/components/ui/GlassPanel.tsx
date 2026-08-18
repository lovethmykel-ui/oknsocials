"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "dock" | "panel" | "card" | "subtle";
  glow?: "blue" | "cyan" | "purple" | "none";
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  variant = "card",
  glow = "none",
  className,
  ...props
}) => {
  const variantClass = {
    dock: "liquid-glass-dock rounded-2xl",
    panel: "liquid-glass-panel rounded-xl",
    card: "liquid-glass-card rounded-xl",
    subtle: "bg-[#0D1016]/80 border border-white/[0.06] rounded-xl backdrop-blur-md",
  }[variant];

  const glowClass = {
    blue: "glow-okn-blue",
    cyan: "glow-okn-cyan",
    purple: "glow-ai-purple",
    none: "",
  }[glow];

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        variantClass,
        glowClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
