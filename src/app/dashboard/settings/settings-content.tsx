"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ChangeEmailCard,
    ChangePasswordCard,
    DeleteAccountCard,
    SessionsCard,
    UpdateNameCard,
    UpdateAvatarCard,
} from "./components";
import { RiAlarmWarningLine } from "@remixicon/react";

interface SettingsContentProps {
    activeTab: string;
}

const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
};

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
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                Informations du profil
                            </h2>
                            <p className="text-sm text-gray-600">
                                Mettez à jour votre photo et vos informations personnelles
                            </p>
                        </div>
                        <div className="space-y-4">
                            <UpdateAvatarCard className="border-0 shadow-none p-0" />
                            <div className="border-t pt-4">
                                <UpdateNameCard className="border-0 shadow-none p-0" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Account Tab */}
                {activeTab === "account" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                Paramètres du compte
                            </h2>
                            <p className="text-sm text-gray-600">
                                Gérez votre adresse email et vos méthodes de connexion
                            </p>
                        </div>
                        <div className="space-y-4">
                            <ChangeEmailCard className="border-0 shadow-none p-0" />
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                Sécurité du compte
                            </h2>
                            <p className="text-sm text-gray-600">
                                Renforcez la sécurité de votre compte
                            </p>
                        </div>
                        <div className="space-y-4">
                            <ChangePasswordCard className="border-0 shadow-none p-0" />
                            <div className="border-t pt-4">
                                <SessionsCard className="border-0 shadow-none p-0" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Danger Zone Tab */}
                {activeTab === "danger" && (
                    <div className="space-y-6">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex gap-3">
                                <RiAlarmWarningLine className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h2 className="text-lg font-semibold text-red-900 mb-1">
                                        Zone dangereuse
                                    </h2>
                                    <p className="text-sm text-red-700">
                                        Ces actions sont irréversibles. Veuillez procéder avec prudence.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <DeleteAccountCard className="border-0 shadow-none p-0" />
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}