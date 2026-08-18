"use client";

import React, { useState } from "react";
import { ProjectId } from "@/types";
import { Sidebar, NavViewId } from "@/components/shell/Sidebar";
import { TopHeader } from "@/components/shell/TopHeader";
import { LiquidGlassNav } from "@/components/shell/LiquidGlassNav";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { NotificationDrawer } from "@/components/shell/NotificationDrawer";

// Views
import { CommandCenterView } from "@/components/views/CommandCenterView";
import { AIDirectorView } from "@/components/views/AIDirectorView";
import { UnifiedInboxView } from "@/components/views/UnifiedInboxView";
import { ContentStudioView } from "@/components/views/ContentStudioView";
import { CalendarView } from "@/components/views/CalendarView";
import { CampaignBuilderView } from "@/components/views/CampaignBuilderView";
import { MediaVaultView } from "@/components/views/MediaVaultView";
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { SocialAccountsView } from "@/components/views/SocialAccountsView";
import { AIAgentsView } from "@/components/views/AIAgentsView";
import { ProjectBrainView } from "@/components/views/ProjectBrainView";
import { SettingsView } from "@/components/views/SettingsView";

export default function Home() {
  const [currentProject, setCurrentProject] = useState<ProjectId>("oknexus-exchange");
  const [currentView, setCurrentView] = useState<NavViewId>("command_center");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050609] text-slate-100 flex flex-col antialiased bg-grid-pattern selection:bg-blue-600/30 selection:text-white">
      <div className="flex flex-1 min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            setCurrentView(v);
            setIsMobileMenuOpen(false);
          }}
          currentProject={currentProject}
          onSelectProject={setCurrentProject}
          unreadCount={3}
        />

        {/* Mobile Slide-in Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex">
            <div className="w-72 bg-[#080A0F] border-r border-white/10 h-full flex flex-col">
              <Sidebar
                currentView={currentView}
                onSelectView={(v) => {
                  setCurrentView(v);
                  setIsMobileMenuOpen(false);
                }}
                currentProject={currentProject}
                onSelectProject={setCurrentProject}
                unreadCount={3}
              />
            </div>
            <div
              className="flex-1"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <TopHeader
            currentView={currentView}
            currentProject={currentProject}
            onSelectProject={setCurrentProject}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
            onQuickCreate={() => setCurrentView("content_studio")}
            unreadNotificationsCount={2}
            onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          />

          {/* View Container */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {currentView === "command_center" && (
              <CommandCenterView
                currentProject={currentProject}
                onNavigate={setCurrentView}
              />
            )}
            {currentView === "ai_director" && (
              <AIDirectorView currentProject={currentProject} />
            )}
            {currentView === "inbox" && (
              <UnifiedInboxView currentProject={currentProject} />
            )}
            {currentView === "content_studio" && (
              <ContentStudioView currentProject={currentProject} />
            )}
            {currentView === "calendar" && (
              <CalendarView
                currentProject={currentProject}
                onNavigateToStudio={() => setCurrentView("content_studio")}
              />
            )}
            {currentView === "campaigns" && (
              <CampaignBuilderView currentProject={currentProject} />
            )}
            {currentView === "media_vault" && (
              <MediaVaultView currentProject={currentProject} />
            )}
            {currentView === "analytics" && (
              <AnalyticsView currentProject={currentProject} />
            )}
            {currentView === "social_accounts" && (
              <SocialAccountsView currentProject={currentProject} />
            )}
            {currentView === "ai_agents" && (
              <AIAgentsView currentProject={currentProject} />
            )}
            {currentView === "project_brain" && (
              <ProjectBrainView currentProject={currentProject} />
            )}
            {currentView === "settings" && (
              <SettingsView currentProject={currentProject} />
            )}
          </div>
        </main>
      </div>

      {/* Apple Liquid Glass Mobile Floating Dock */}
      <LiquidGlassNav
        currentView={currentView}
        onSelectView={setCurrentView}
        unreadInboxCount={3}
      />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={setCurrentView}
        onSelectProject={setCurrentProject}
        currentProject={currentProject}
      />

      {/* Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </div>
  );
}
