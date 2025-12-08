"use client"

import { cn } from "@/lib/utils"

interface OnlineStatusProps {
    isOnline?: boolean
    lastSeen?: Date | string | null
    showText?: boolean
    size?: "sm" | "md" | "lg"
    className?: string
}

function formatLastSeen(lastSeen: Date | string): string {
    const date = typeof lastSeen === "string" ? new Date(lastSeen) : lastSeen
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "En ligne"
    if (diffMins < 60) return `Vu il y a ${diffMins} min`
    if (diffHours < 24) return `Vu il y a ${diffHours}h`
    if (diffDays === 1) return "Vu hier"
    if (diffDays < 7) return `Vu il y a ${diffDays} jours`

    return `Vu le ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`
}

export function OnlineStatus({
    isOnline = false,
    lastSeen,
    showText = true,
    size = "md",
    className
}: OnlineStatusProps) {
    const sizeClasses = {
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3"
    }

    const textSizeClasses = {
        sm: "text-[10px]",
        md: "text-xs",
        lg: "text-sm"
    }

    const statusText = isOnline
        ? "En ligne"
        : lastSeen
            ? formatLastSeen(lastSeen)
            : "Hors ligne"

    return (
        <div
            className={cn("flex items-center gap-1.5", className)}
            role="status"
            aria-label={statusText}
        >
            <span className="relative flex">
                <span
                    className={cn(
                        "rounded-full transition-colors duration-300",
                        sizeClasses[size],
                        isOnline
                            ? "bg-emerald-500"
                            : "bg-gray-300"
                    )}
                />
                {isOnline && (
                    <span
                        className={cn(
                            "absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75",
                            sizeClasses[size]
                        )}
                        style={{ animationDuration: "2s" }}
                    />
                )}
            </span>
            {showText && (
                <span
                    className={cn(
                        "text-gray-500 font-medium transition-colors duration-200",
                        textSizeClasses[size],
                        isOnline && "text-emerald-600"
                    )}
                >
                    {statusText}
                </span>
            )}
        </div>
    )
}
