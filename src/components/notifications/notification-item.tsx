"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotificationConfig, formatTimeAgo } from "@/lib/notifications/types"
import {
    markNotificationAsRead,
    deleteNotification
} from "@/lib/actions/notifications"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface NotificationItemProps {
    notification: {
        id: string
        type: string
        title: string
        message: string | null
        data: any
        isRead: boolean
        createdAt: Date
    }
    onClose?: () => void
}

export function NotificationItem({
    notification,
    onClose
}: NotificationItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const queryClient = useQueryClient()
    const config = getNotificationConfig(notification.type)

    const handleClick = async () => {
        // Mark as read if not already read
        if (!notification.isRead) {
            try {
                await markNotificationAsRead(notification.id)
                // Invalidate queries to refresh the UI
                queryClient.invalidateQueries({ queryKey: ["notifications"] })
                queryClient.invalidateQueries({
                    queryKey: ["notifications", "unread-count"]
                })
            } catch (error) {
                console.error("Error marking notification as read:", error)
            }
        }

        // Close dropdown if provided
        if (onClose) onClose()
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setIsDeleting(true)
        try {
            const result = await deleteNotification(notification.id)
            if (result.success) {
                // Invalidate queries to refresh the UI
                queryClient.invalidateQueries({ queryKey: ["notifications"] })
                queryClient.invalidateQueries({
                    queryKey: ["notifications", "unread-count"]
                })
            } else {
                toast.error("Erreur lors de la suppression")
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression")
        } finally {
            setIsDeleting(false)
        }
    }

    const IconComponent = config.icon
    const link = config.getLink(notification.data)
    const title = config.getTitle(notification.data)
    const message = config.getMessage
        ? config.getMessage(notification.data)
        : notification.message

    return (
        <Link
            href={link}
            onClick={handleClick}
            className={cn(
                "group block border-l-2 p-3 transition-colors hover:bg-gray-50",
                !notification.isRead
                    ? "border-l-blue-500 bg-blue-50"
                    : "border-l-transparent bg-white"
            )}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                    className={cn(
                        "flex-shrink-0 rounded-full p-2",
                        config.bgColor
                    )}
                >
                    <IconComponent className={cn("h-4 w-4", config.color)} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <h4
                                className={cn(
                                    "break-words font-medium text-sm",
                                    !notification.isRead
                                        ? "text-gray-900"
                                        : "text-gray-700"
                                )}
                            >
                                {title}
                            </h4>
                            {message && (
                                <p className="mt-1 break-words text-gray-600 text-sm">
                                    {message}
                                </p>
                            )}
                            <p className="mt-1 text-gray-500 text-xs">
                                {formatTimeAgo(notification.createdAt)}
                            </p>
                        </div>

                        {/* Delete button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto flex-shrink-0 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </Button>
                    </div>

                    {/* Unread indicator */}
                    {!notification.isRead && (
                        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-blue-500" />
                    )}
                </div>
            </div>
        </Link>
    )
}
