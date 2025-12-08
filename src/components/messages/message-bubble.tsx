"use client"

import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Check, CheckCheck } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"

interface MessageBubbleProps {
    content: string
    timestamp: Date | string
    isOwn: boolean
    isRead?: boolean
    sender?: {
        name: string
        avatar?: string | null
        avatarUrl?: string | null
    } | null
    showAvatar?: boolean
    isFirstInGroup?: boolean
    isLastInGroup?: boolean
    className?: string
}

export function MessageBubble({
    content,
    timestamp,
    isOwn,
    isRead = false,
    sender,
    showAvatar = true,
    isFirstInGroup = true,
    isLastInGroup = true,
    className
}: MessageBubbleProps) {
    const [showTimestamp, setShowTimestamp] = useState(false)
    const dateObj = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    const formattedTime = format(dateObj, "HH:mm", { locale: fr })

    const avatarUrl = sender?.avatarUrl || sender?.avatar ||
        (sender?.name ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sender.name)}` : null)

    // Dynamic border radius based on position in group
    const getBorderRadius = () => {
        if (isOwn) {
            return cn(
                "rounded-2xl",
                isFirstInGroup && "rounded-tr-md",
                isLastInGroup && "rounded-br-md",
                !isFirstInGroup && !isLastInGroup && "rounded-r-md"
            )
        }
        return cn(
            "rounded-2xl",
            isFirstInGroup && "rounded-tl-md",
            isLastInGroup && "rounded-bl-md",
            !isFirstInGroup && !isLastInGroup && "rounded-l-md"
        )
    }

    return (
        <div
            className={cn(
                "group flex gap-2",
                isOwn ? "justify-end" : "justify-start",
                !isLastInGroup ? "mb-0.5" : "mb-3",
                className
            )}
        >
            {/* Avatar - only for received messages, only on first in group */}
            {!isOwn && showAvatar && (
                <div className="w-8 flex-shrink-0">
                    {isFirstInGroup ? (
                        <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={sender?.name || "Avatar"}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 font-semibold text-blue-700 text-xs">
                                    {sender?.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                            )}
                        </Avatar>
                    ) : null}
                </div>
            )}

            {/* Message bubble */}
            <div
                className={cn(
                    "relative max-w-[70%] md:max-w-[60%] px-4 py-2.5 transition-all duration-200",
                    getBorderRadius(),
                    isOwn
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
                        : "bg-white text-gray-900 shadow-sm border border-gray-100",
                    "hover:shadow-md"
                )}
                onMouseEnter={() => setShowTimestamp(true)}
                onMouseLeave={() => setShowTimestamp(false)}
                role="article"
                aria-label={`Message ${isOwn ? "envoyé" : "reçu"}: ${content}`}
            >
                {/* Sender name - only for received messages, first in group */}
                {!isOwn && isFirstInGroup && sender?.name && (
                    <p className="mb-1 text-xs font-semibold text-blue-600">
                        {sender.name}
                    </p>
                )}

                {/* Message content */}
                <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                    {content}
                </p>

                {/* Footer with timestamp and read status */}
                <div
                    className={cn(
                        "mt-1.5 flex items-center justify-end gap-1.5 text-[10px] transition-opacity duration-200",
                        isOwn ? "text-blue-200" : "text-gray-400",
                        !isLastInGroup && !showTimestamp ? "opacity-0" : "opacity-100"
                    )}
                >
                    <span>{formattedTime}</span>
                    {isOwn && (
                        <span
                            className={cn(
                                "transition-colors duration-300",
                                isRead ? "text-blue-200" : "text-blue-300/60"
                            )}
                            aria-label={isRead ? "Lu" : "Envoyé"}
                        >
                            {isRead ? (
                                <CheckCheck className="h-3.5 w-3.5" />
                            ) : (
                                <Check className="h-3.5 w-3.5" />
                            )}
                        </span>
                    )}
                </div>
            </div>

            {/* Spacer for own messages alignment */}
            {isOwn && <div className="w-8 flex-shrink-0" />}
        </div>
    )
}
