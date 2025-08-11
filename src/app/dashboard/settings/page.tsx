"use client";

import { useState } from "react";
import { SettingsContent } from "./settings-content";
import { cn } from "@/lib/utils";
import {
  RiUser3Line,
  RiShieldLine,
  RiAlarmWarningLine,
  RiAccountCircleLine,
} from "@remixicon/react";

type SettingsTab = "profile" | "account" | "security" | "danger";

interface TabItem {
  id: SettingsTab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: TabItem[] = [
  {
    id: "profile",
    label: "Profil",
    icon: <RiUser3Line className="w-4 h-4" />,
    description: "Gérez vos informations personnelles",
  },
  {
    id: "account",
    label: "Compte",
    icon: <RiAccountCircleLine className="w-4 h-4" />,
    description: "Email et identifiants",
  },
  {
    id: "security",
    label: "Sécurité",
    icon: <RiShieldLine className="w-4 h-4" />,
    description: "Mot de passe et sessions",
  },
  {
    id: "danger",
    label: "Zone dangereuse",
    icon: <RiAlarmWarningLine className="w-4 h-4" />,
    description: "Actions irréversibles",
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-white/80 mt-1">
          Gérez votre compte et vos préférences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-white hover:bg-white/10",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5",
                    activeTab === tab.id ? "text-blue-600" : "text-white/70",
                  )}
                >
                  {tab.icon}
                </span>
                <div className="flex-1">
                  <div
                    className={cn(
                      "font-medium",
                      activeTab === tab.id ? "text-gray-900" : "text-white",
                    )}
                  >
                    {tab.label}
                  </div>
                  <div
                    className={cn(
                      "text-sm",
                      activeTab === tab.id ? "text-gray-600" : "text-white/60",
                    )}
                  >
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[500px]">
            <SettingsContent activeTab={activeTab} />
          </div>
        </main>
      </div>

      {/* Mobile Tab Bar (visible on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg flex-1",
                activeTab === tab.id ? "text-blue-600" : "text-gray-500",
              )}
            >
              {tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
