"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import {
    RiLoader4Line,
    RiComputerLine,
    RiSmartphoneLine,
    RiTabletLine,
    RiGlobalLine,
    RiCheckLine,
    RiCloseLine
} from "@remixicon/react"
import { cn } from "@/lib/utils"

interface Session {
    id: string
    token: string
    userId: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    ipAddress?: string | null
    userAgent?: string | null
    isCurrent?: boolean
}

interface SessionsCardProps {
    className?: string
}

export function SessionsCard({ className }: SessionsCardProps) {
    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [revokingIds, setRevokingIds] = useState<Set<string>>(new Set())

    const loadSessions = async () => {
        try {
            const sessionsList = await authClient.listSessions()
            // Ensure we have an array
            const sessionsArray = Array.isArray(sessionsList)
                ? sessionsList
                : sessionsList?.data
                  ? Array.isArray(sessionsList.data)
                      ? sessionsList.data
                      : []
                  : []
            setSessions(sessionsArray)
        } catch (error) {
            console.error("Error loading sessions:", error)
            toast.error("Erreur lors du chargement des sessions")
            setSessions([]) // Set empty array on error
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadSessions()
    }, [])

    const revokeSession = async (sessionToken: string) => {
        setRevokingIds((prev) => new Set(prev).add(sessionToken))

        try {
            await authClient.revokeSession({ token: sessionToken })
            setSessions((prev) => prev.filter((s) => s.token !== sessionToken))
            toast.success("Session révoquée avec succès")
        } catch (error) {
            console.error("Error revoking session:", error)
            toast.error("Erreur lors de la révocation de la session")
        } finally {
            setRevokingIds((prev) => {
                const newSet = new Set(prev)
                newSet.delete(sessionToken)
                return newSet
            })
        }
    }

    const revokeAllOtherSessions = async () => {
        setIsLoading(true)

        try {
            await authClient.revokeOtherSessions()
            await loadSessions() // Reload to show only current session
            toast.success("Toutes les autres sessions ont été révoquées")
        } catch (error) {
            console.error("Error revoking other sessions:", error)
            toast.error("Erreur lors de la révocation des sessions")
        } finally {
            setIsLoading(false)
        }
    }

    const getDeviceIcon = (userAgent?: string | null) => {
        if (!userAgent) return <RiComputerLine className="h-4 w-4" />

        const ua = userAgent.toLowerCase()
        if (
            ua.includes("mobile") ||
            ua.includes("android") ||
            ua.includes("iphone")
        ) {
            return <RiSmartphoneLine className="h-4 w-4" />
        }
        if (ua.includes("tablet") || ua.includes("ipad")) {
            return <RiTabletLine className="h-4 w-4" />
        }
        return <RiComputerLine className="h-4 w-4" />
    }

    const getBrowserName = (userAgent?: string | null) => {
        if (!userAgent) return "Navigateur inconnu"

        const ua = userAgent.toLowerCase()
        if (ua.includes("chrome")) return "Chrome"
        if (ua.includes("firefox")) return "Firefox"
        if (ua.includes("safari") && !ua.includes("chrome")) return "Safari"
        if (ua.includes("edge")) return "Edge"
        if (ua.includes("opera")) return "Opera"

        return "Navigateur inconnu"
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("fr-FR", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(date))
    }

    const isSessionExpired = (expiresAt: Date) => {
        return new Date() > new Date(expiresAt)
    }

    const activeSessions = Array.isArray(sessions)
        ? sessions.filter((session) => !isSessionExpired(session.expiresAt))
        : []
    const currentSession = activeSessions.find((session) => session.isCurrent)
    const otherSessions = activeSessions.filter((session) => !session.isCurrent)

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Sessions actives</CardTitle>
                        <CardDescription>
                            Gérez vos sessions de connexion sur tous vos
                            appareils
                        </CardDescription>
                    </div>
                    {otherSessions.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={revokeAllOtherSessions}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Révoquer toutes
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 rounded bg-gray-200" />
                                        <div className="h-3 w-48 rounded bg-gray-200" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeSessions.length === 0 ? (
                            <p className="py-4 text-gray-500 text-sm">
                                Aucune session active trouvée
                            </p>
                        ) : (
                            <>
                                {/* Current Session */}
                                {currentSession && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="text-green-600">
                                                    {getDeviceIcon(
                                                        currentSession.userAgent
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <span className="font-medium text-sm">
                                                            {getBrowserName(
                                                                currentSession.userAgent
                                                            )}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-green-100 text-green-700"
                                                        >
                                                            <RiCheckLine className="mr-1 h-3 w-3" />
                                                            Session actuelle
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1 text-gray-600 text-xs">
                                                        {currentSession.ipAddress && (
                                                            <div className="flex items-center gap-1">
                                                                <RiGlobalLine className="h-3 w-3" />
                                                                {
                                                                    currentSession.ipAddress
                                                                }
                                                            </div>
                                                        )}
                                                        <div>
                                                            Dernière activité :{" "}
                                                            {formatDate(
                                                                currentSession.updatedAt
                                                            )}
                                                        </div>
                                                        <div>
                                                            Expire le :{" "}
                                                            {formatDate(
                                                                currentSession.expiresAt
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Other Sessions */}
                                {otherSessions.length > 0 && (
                                    <>
                                        {currentSession && <Separator />}
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-gray-900 text-sm">
                                                Autres sessions (
                                                {otherSessions.length})
                                            </h4>
                                            {otherSessions.map((session) => (
                                                <div
                                                    key={session.id}
                                                    className="flex items-center justify-between rounded-lg border p-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-gray-400">
                                                            {getDeviceIcon(
                                                                session.userAgent
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="mb-1 font-medium text-sm">
                                                                {getBrowserName(
                                                                    session.userAgent
                                                                )}
                                                            </div>
                                                            <div className="space-y-1 text-gray-600 text-xs">
                                                                {session.ipAddress && (
                                                                    <div className="flex items-center gap-1">
                                                                        <RiGlobalLine className="h-3 w-3" />
                                                                        {
                                                                            session.ipAddress
                                                                        }
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    Dernière
                                                                    activité :{" "}
                                                                    {formatDate(
                                                                        session.updatedAt
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    Expire le :{" "}
                                                                    {formatDate(
                                                                        session.expiresAt
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            revokeSession(
                                                                session.token
                                                            )
                                                        }
                                                        disabled={revokingIds.has(
                                                            session.token
                                                        )}
                                                    >
                                                        {revokingIds.has(
                                                            session.token
                                                        ) ? (
                                                            <RiLoader4Line className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <RiCloseLine className="h-4 w-4" />
                                                        )}
                                                        <span className="sr-only">
                                                            Révoquer
                                                        </span>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
