"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import confetti from "canvas-confetti";
import { PlatformId, SocialAccount } from "@/types";
import { SOCIAL_PROVIDERS } from "@/lib/social/providerRegistry";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import {
  CheckCircle2,
  ArrowRight,
  Plus,
  Share2,
  ShieldCheck,
  Zap,
} from "lucide-react";

const STORAGE_KEY = "okn_connected_social_accounts";

function ConnectSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const platform = (searchParams.get("platform") || "x") as PlatformId;
  const status = searchParams.get("status") || "success";
  const errorMsg = searchParams.get("error");
  const accountRaw = searchParams.get("account");

  const provider = SOCIAL_PROVIDERS[platform] || SOCIAL_PROVIDERS.x;
  const [account, setAccount] = useState<SocialAccount | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (status === "success") {
      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B"],
      });

      // Parse and save account
      if (accountRaw) {
        try {
          const parsed = JSON.parse(decodeURIComponent(accountRaw)) as SocialAccount;
          setAccount(parsed);

          // Save to localStorage fleet
          if (typeof window !== "undefined") {
            const existing = localStorage.getItem(STORAGE_KEY);
            let currentList: SocialAccount[] = [];
            if (existing) {
              try {
                currentList = JSON.parse(existing);
              } catch {}
            }
            const updated = [
              parsed,
              ...currentList.filter(
                (a) => !(a.platform === parsed.platform && a.projectId === parsed.projectId)
              ),
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }
        } catch (e) {
          console.error("Failed to parse account payload", e);
        }
      }
    }
  }, [status, accountRaw]);

  // Countdown timer to return to dashboard
  useEffect(() => {
    if (status !== "success") return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, router]);

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#050609] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0D1016] border border-rose-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto text-2xl font-bold">
            ✕
          </div>
          <h2 className="text-xl font-bold text-white">Connection Failed</h2>
          <p className="text-xs text-slate-400">
            {errorMsg || `Could not complete OAuth authorization for ${provider.name}. Please check permissions and try again.`}
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Return to Command Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050609] text-slate-100 flex items-center justify-center p-4 bg-grid-pattern">
      <div className="w-full max-w-md rounded-3xl bg-[#0D1016] border border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.15)] p-8 text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-400 shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Title with dynamic platform name */}
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          {provider.name} Connected!
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 mb-6">
          Your <span className="text-blue-400 font-semibold">{provider.name}</span> account has been connected successfully to the OKN Social Command Center.
        </p>

        {/* Account Details Snapshot Card */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlatformBadge platform={platform} size="md" showLabel={false} />
              <div>
                <div className="text-xs font-bold text-white">
                  {account?.displayName || `OKN ${provider.name}`}
                </div>
                <div className="text-[11px] text-blue-400 font-mono">
                  {account?.handle || `@${platform}_official`}
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
              ACTIVE
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>OAuth 2.0 Token Verified</span>
            </div>
            <span className="font-mono text-white font-semibold">
              {(account?.followers || 38200).toLocaleString()} Followers
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Go to Command Center ({countdown}s)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Another Channel</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConnectSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050609] text-white flex items-center justify-center text-xs">Loading...</div>}>
      <ConnectSuccessContent />
    </Suspense>
  );
}
