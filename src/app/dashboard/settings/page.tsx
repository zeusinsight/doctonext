"use client"

import { useState } from "react"
import { SettingsContent } from "./settings-content"
import { cn } from "@/lib/utils"
import {
    RiUser3Line,
    RiShieldLine,
    RiAlarmWarningLine,
    RiAccountCircleLine
} from "@remixicon/react"

type SettingsTab = "profile" | "account" | "security" | "danger"

interface TabItem {
    id: SettingsTab
    label: string
    icon: React.ReactNode
    description: string
}

const tabs: TabItem[] = [
    {
        id: "profile",
        label: "Profil",
        icon: <RiUser3Line className="h-4 w-4" />,
        description: "Gérez vos informations personnelles"
    },
    {
        id: "account",
        label: "Compte",
        icon: <RiAccountCircleLine className="h-4 w-4" />,
        description: "Email et identifiants"
    },
    {
        id: "security",
        label: "Sécurité",
        icon: <RiShieldLine className="h-4 w-4" />,
        description: "Mot de passe et sessions"
    },
    {
        id: "danger",
        label: "Zone dangereuse",
        icon: <RiAlarmWarningLine className="h-4 w-4" />,
        description: "Actions irréversibles"
    }
]

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile")

    return (
        <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="font-bold text-2xl text-white">Paramètres</h1>
                <p className="mt-1 text-white/80">
                    Gérez votre compte et vos préférences
                </p>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Sidebar Navigation */}
                <aside className="w-full flex-shrink-0 lg:w-64">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex w-full items-start gap-3 rounded-lg px-4 py-3 text-left transition-colors",
                                    activeTab === tab.id
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-white hover:bg-white/10"
                                )}
                            >
                                <span
                                    className={cn(
                                        "mt-0.5",
                                        activeTab === tab.id
                                            ? "text-blue-600"
                                            : "text-white/70"
                                    )}
                                >
                                    {tab.icon}
                                </span>
                                <div className="flex-1">
                                    <div
                                        className={cn(
                                            "font-medium",
                                            activeTab === tab.id
                                                ? "text-gray-900"
                                                : "text-white"
                                        )}
                                    >
                                        {tab.label}
                                    </div>
                                    <div
                                        className={cn(
                                            "text-sm",
                                            activeTab === tab.id
                                                ? "text-gray-600"
                                                : "text-white/60"
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
                <main className="min-w-0 flex-1 pb-20 lg:pb-0">
                    <div className="min-h-[500px] rounded-lg bg-white p-6 shadow-sm">
                        <SettingsContent activeTab={activeTab} />
                    </div>
                </main>
            </div>

            {/* Mobile Tab Bar (visible on small screens) */}
            <div className="fixed right-0 bottom-0 left-0 z-40 border-gray-200 border-t bg-white lg:hidden">
                <div className="flex justify-around py-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-2",
                                activeTab === tab.id
                                    ? "text-blue-600"
                                    : "text-gray-500"
                            )}
                        >
                            {tab.icon}
                            <span className="font-medium text-xs">
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
