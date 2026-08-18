"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProjectId, MediaVaultItem } from "@/types";
import { mockMediaVault } from "@/lib/data/mockData";
import { GlassPanel } from "../ui/GlassPanel";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Tag,
  Eye,
  Download,
  Copy,
  Check,
  Film,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaVaultViewProps {
  currentProject: ProjectId;
}

export const MediaVaultView: React.FC<MediaVaultViewProps> = ({ currentProject }) => {
  const [items, setItems] = useState<MediaVaultItem[]>(mockMediaVault);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MediaVaultItem | null>(mockMediaVault[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Assets", count: items.length },
    { id: "3d_renders", label: "3D Renders", count: items.filter((i) => i.category === "3d_renders").length },
    { id: "logos", label: "Logos & Emblems", count: items.filter((i) => i.category === "logos").length },
    { id: "social_graphics", label: "Social Graphics", count: items.filter((i) => i.category === "social_graphics").length },
    { id: "videos", label: "Video Cuts", count: items.filter((i) => i.category === "videos").length },
  ];

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.filename.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1016] border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Media Vault</h2>
            <p className="text-xs text-slate-400">High-resolution brand assets, 3D renders, and campaign media</p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5 active:scale-95 transition-all">
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5",
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white font-semibold shadow-sm"
                  : "bg-[#0D1016] text-slate-400 hover:text-slate-200 border border-white/[0.06]"
              )}
            >
              <span>{cat.label}</span>
              <span className="mono-metric text-[10px] opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tags or filenames..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0D1016] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Media Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gallery Grid (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={cn(
                  "group relative rounded-xl overflow-hidden border cursor-pointer transition-all bg-black/60 flex flex-col justify-between",
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    : "border-white/[0.08] hover:border-white/20"
                )}
              >
                <div className="relative aspect-video w-full bg-black flex items-center justify-center p-2 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-2.5 bg-[#0D1016]/90 border-t border-white/[0.06]">
                  <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>{item.dimensions}</span>
                    <span>{item.size}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Asset Inspector (4 cols) */}
        <div className="lg:col-span-4">
          {selectedItem ? (
            <GlassPanel className="p-5 sticky top-20" glow="blue">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Asset Metadata Inspector
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 mb-4 p-2 flex items-center justify-center">
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-bold text-sm text-white">{selectedItem.title}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{selectedItem.filename}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                  <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] text-slate-500">Dimensions</div>
                    <div className="font-mono text-white font-semibold mt-0.5">{selectedItem.dimensions}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] text-slate-500">Aspect Ratio</div>
                    <div className="font-mono text-cyan-300 font-semibold mt-0.5">{selectedItem.aspectRatio}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] text-slate-500">File Size</div>
                    <div className="font-mono text-white font-semibold mt-0.5">{selectedItem.size}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06]">
                    <div className="text-[10px] text-slate-500">Usage Count</div>
                    <div className="font-mono text-emerald-400 font-semibold mt-0.5">{selectedItem.usageCount} times</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono mb-1.5">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-slate-300 border border-white/[0.08]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(selectedItem.url, selectedItem.id)}
                    className="flex-1 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === selectedItem.id ? "Copied Asset URI" : "Copy Asset URI"}</span>
                  </button>
                </div>
              </div>
            </GlassPanel>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">Select an asset to view metadata.</div>
          )}
        </div>
      </div>
    </div>
  );
};
