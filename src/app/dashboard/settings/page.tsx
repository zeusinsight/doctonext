import {
    ChangeEmailCard,
    ChangePasswordCard,
    DeleteAccountCard,
    SessionsCard,
    UpdateNameCard,
    UpdateAvatarCard,
    ProvidersCard
} from "./components"
import { Card, CardContent } from "@/components/ui/card"
import { RiUser3Line, RiShieldLine, RiAlarmWarningLine } from "@remixicon/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Paramètres"
}

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <RiUser3Line className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-medium text-gray-900">Profil</h2>
                </div>
                <div className="space-y-4">
                    <UpdateAvatarCard className="bg-white" />
                    <UpdateNameCard className="bg-white" />
                    <ChangeEmailCard className="bg-white" />
                </div>
            </div>

            {/* Security Section */}
            <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <RiShieldLine className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-medium text-gray-900">Paramètres de sécurité</h2>
                    </div>
                <div className="space-y-4">
                    <ChangePasswordCard className="bg-white" />
                    <SessionsCard className="bg-white" />
                </div>
            </div>

            {/* Danger Zone Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <RiAlarmWarningLine className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-medium text-gray-900">Zone dangereuse</h2>
                </div>
                <DeleteAccountCard className="bg-white" />
            </div>
        </div>
    )
}
