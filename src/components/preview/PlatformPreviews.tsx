"use client";

import React from "react";
import Image from "next/image";
import { PlatformId, PostVariant } from "@/types";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share,
  Send,
  Eye,
  MoreHorizontal,
  ThumbsUp,
  Play,
  Music,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewProps {
  variant: PostVariant;
  authorName?: string;
  authorHandle?: string;
  avatarUrl?: string;
  className?: string;
}

export const XPreview: React.FC<PreviewProps> = ({
  variant,
  authorName = "OKNEXUS Official",
  authorHandle = "@OKNEXUS_HQ",
  avatarUrl = "/assets/brand/icon_okn_glass.png",
  className,
}) => {
  return (
    <div className={cn("p-4 rounded-xl bg-black border border-white/10 text-white font-sans max-w-lg w-full shadow-xl", className)}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-blue-950 border border-white/10 flex items-center justify-center p-1">
          <Image src={avatarUrl} alt={authorName} width={40} height={40} className="object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-sm truncate">{authorName}</span>
              <svg className="w-4 h-4 text-blue-400 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span className="text-xs text-slate-500 font-mono">{authorHandle}</span>
              <span className="text-xs text-slate-500">· 1m</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-500" />
          </div>

          <div className="mt-2 text-sm text-slate-100 whitespace-pre-line leading-relaxed">
            {variant.text || "Your post text will appear here..."}
          </div>

          {variant.mediaUrls && variant.mediaUrls.length > 0 && (
            <div className="mt-3 rounded-xl overflow-hidden border border-white/10 relative max-h-64 bg-slate-950 flex items-center justify-center">
              <Image
                src={variant.mediaUrls[0]}
                alt="Post Media"
                width={600}
                height={340}
                className="object-cover w-full h-auto"
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-4 text-slate-500 text-xs pt-2 border-t border-white/[0.06]">
            <span className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <MessageCircle className="w-4 h-4" /> 42
            </span>
            <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <Repeat2 className="w-4 h-4" /> 18
            </span>
            <span className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
              <Heart className="w-4 h-4" /> 238
            </span>
            <span className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <Eye className="w-4 h-4" /> {variant.estimatedReach ? `${(variant.estimatedReach / 1000).toFixed(1)}k` : "4.8k"}
            </span>
            <span className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <Share className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InstagramPreview: React.FC<PreviewProps> = ({
  variant,
  authorName = "oknexus.exchange",
  avatarUrl = "/assets/brand/icon_okn_glass.png",
  className,
}) => {
  return (
    <div className={cn("rounded-xl bg-[#080A0F] border border-white/10 text-white font-sans max-w-sm w-full overflow-hidden shadow-xl", className)}>
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600">
            <div className="w-full h-full rounded-full bg-black p-0.5 overflow-hidden flex items-center justify-center">
              <Image src={avatarUrl} alt={authorName} width={32} height={32} className="object-contain" />
            </div>
          </div>
          <div className="text-xs font-semibold">{authorName}</div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-slate-400" />
      </div>

      {/* Media Frame */}
      <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
        {variant.mediaUrls && variant.mediaUrls.length > 0 ? (
          <Image src={variant.mediaUrls[0]} alt="Instagram Media" fill className="object-cover" />
        ) : (
          <div className="text-xs text-slate-500">Image Asset Frame (1:1 / 4:5)</div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-white hover:text-pink-500 cursor-pointer" />
            <MessageCircle className="w-5 h-5 text-white hover:text-blue-400 cursor-pointer" />
            <Send className="w-5 h-5 text-white cursor-pointer" />
          </div>
          <Bookmark className="w-5 h-5 text-white cursor-pointer" />
        </div>

        <div className="text-xs font-semibold mb-1">1,482 likes</div>
        <div className="text-xs text-slate-200 leading-relaxed line-clamp-3">
          <strong className="text-white mr-1.5">{authorName}</strong>
          {variant.text}
        </div>
        <div className="text-[10px] text-slate-500 uppercase mt-2">12 MINUTES AGO</div>
      </div>
    </div>
  );
};

export const LinkedInPreview: React.FC<PreviewProps> = ({
  variant,
  authorName = "OKN Ecosystem Labs",
  avatarUrl = "/assets/brand/OKN_logo_transparent.png",
  className,
}) => {
  return (
    <div className={cn("p-4 rounded-xl bg-[#0D1016] border border-white/10 text-white font-sans max-w-lg w-full shadow-xl", className)}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-blue-950 border border-white/10 flex items-center justify-center p-1">
          <Image src={avatarUrl} alt={authorName} width={40} height={40} className="object-contain" />
        </div>
        <div>
          <div className="font-semibold text-sm text-white flex items-center gap-1.5">
            {authorName}
            <span className="text-[10px] text-slate-400 font-normal">· 1st</span>
          </div>
          <div className="text-[11px] text-slate-400">Institutional DeFi & Liquidity Architecture</div>
          <div className="text-[10px] text-slate-500 font-mono">1h · Edited · 🌐</div>
        </div>
      </div>

      <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed mb-3">
        {variant.text}
      </div>

      {variant.mediaUrls && variant.mediaUrls.length > 0 && (
        <div className="rounded-lg overflow-hidden border border-white/10 max-h-56 relative bg-black mb-3">
          <Image src={variant.mediaUrls[0]} alt="Media" width={600} height={300} className="object-cover w-full h-auto" />
        </div>
      )}

      <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
        <button className="flex items-center gap-1.5 hover:text-blue-400 py-1 px-2 rounded">
          <ThumbsUp className="w-4 h-4" /> Like
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400 py-1 px-2 rounded">
          <MessageCircle className="w-4 h-4" /> Comment
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400 py-1 px-2 rounded">
          <Repeat2 className="w-4 h-4" /> Repost
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-400 py-1 px-2 rounded">
          <Send className="w-4 h-4" /> Send
        </button>
      </div>
    </div>
  );
};

export const TelegramPreview: React.FC<PreviewProps> = ({
  variant,
  authorName = "OKN Global Community",
  avatarUrl = "/assets/brand/OKN_logo_mark_transparent.png",
  className,
}) => {
  return (
    <div className={cn("p-4 rounded-xl bg-[#11151C] border border-sky-500/20 text-white font-sans max-w-md w-full shadow-xl", className)}>
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.06]">
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-sky-950 p-1">
          <Image src={avatarUrl} alt={authorName} width={28} height={28} className="object-contain" />
        </div>
        <span className="text-xs font-semibold text-sky-400">{authorName}</span>
      </div>

      {variant.mediaUrls && variant.mediaUrls.length > 0 && (
        <div className="rounded-lg overflow-hidden mb-2 max-h-48 relative bg-black">
          <Image src={variant.mediaUrls[0]} alt="Media" width={500} height={250} className="object-cover w-full h-auto" />
        </div>
      )}

      <div className="text-xs text-slate-100 whitespace-pre-line leading-relaxed">
        {variant.text}
      </div>

      <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-slate-400 font-mono">
        <Eye className="w-3 h-3" /> 14.8k · 12:45 UTC
      </div>
    </div>
  );
};
