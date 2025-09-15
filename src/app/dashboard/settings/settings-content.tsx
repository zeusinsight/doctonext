"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
    ChangeEmailCard,
    ChangePasswordCard,
    DeleteAccountCard,
    SessionsCard,
    UpdateNameCard,
    UpdateAvatarCard
} from "./components"
import { RiAlarmWarningLine } from "@remixicon/react"

interface SettingsContentProps {
    activeTab: string
}

const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
}

export function SettingsContent({ activeTab }: SettingsContentProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
                transition={{ duration: 0.2 }}
            >
                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="mb-1 font-semibold text-gray-900 text-lg">
                                Informations du profil
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Mettez à jour votre photo et vos informations
                                personnelles
                            </p>
                        </div>
                        <div className="space-y-4">
                            <UpdateAvatarCard className="border-0 p-0 shadow-none" />
                            <div className="border-t pt-4">
                                <UpdateNameCard className="border-0 p-0 shadow-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Account Tab */}
                {activeTab === "account" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="mb-1 font-semibold text-gray-900 text-lg">
                                Paramètres du compte
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Gérez votre adresse email et vos méthodes de
                                connexion
                            </p>
                        </div>
                        <div className="space-y-4">
                            <ChangeEmailCard className="border-0 p-0 shadow-none" />
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="mb-1 font-semibold text-gray-900 text-lg">
                                Sécurité du compte
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Renforcez la sécurité de votre compte
                            </p>
                        </div>
                        <div className="space-y-4">
                            <ChangePasswordCard className="border-0 p-0 shadow-none" />
                            <div className="border-t pt-4">
                                <SessionsCard className="border-0 p-0 shadow-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Danger Zone Tab */}
                {activeTab === "danger" && (
                    <div className="space-y-6">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                            <div className="flex gap-3">
                                <RiAlarmWarningLine className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                                <div>
                                    <h2 className="mb-1 font-semibold text-lg text-red-900">
                                        Zone dangereuse
                                    </h2>
                                    <p className="text-red-700 text-sm">
                                        Ces actions sont irréversibles. Veuillez
                                        procéder avec prudence.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <DeleteAccountCard className="border-0 p-0 shadow-none" />
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
