"use client";

import React from "react";
import { NotificationItem } from "@/types";
import { mockNotifications } from "@/lib/data/mockData";
import { StatusBadge } from "../ui/StatusBadge";
import { formatRelativeTime } from "@/lib/utils";
import { Bell, X, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
  onMarkAllRead?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications = mockNotifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#080A0F] border-l border-white/[0.1] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0D1016]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Notifications & Alerts</h2>
            </div>
            <div className="flex items-center gap-2">
              {onMarkAllRead && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No active notifications or alerts.
              </div>
            ) : (
              notifications.map((notif) => {
                const isCritical = notif.severity === "critical";
                const isHigh = notif.severity === "high";

                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all relative",
                      isCritical
                        ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                        : isHigh
                        ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                        : "bg-[#0D1016] border-white/[0.06] text-slate-300",
                      !notif.read && "ring-1 ring-blue-500/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-white">
                        {notif.title}
                      </span>
                      <StatusBadge status={notif.severity} />
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-2.5">
                      {notif.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{notif.projectId.toUpperCase()}</span>
                      <span>{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#050609] flex items-center justify-between text-xs text-slate-400">
            <span>Real-time Sentinel v2.4</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Monitoring Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
