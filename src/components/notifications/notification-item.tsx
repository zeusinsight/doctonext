"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotificationConfig, formatTimeAgo } from "@/lib/notifications/types"
import { markNotificationAsRead, deleteNotification } from "@/lib/actions/notifications"
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

export function NotificationItem({ notification, onClose }: NotificationItemProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const queryClient = useQueryClient()
    const config = getNotificationConfig(notification.type)

    const handleClick = async () => {
        // Mark as read if not already read
        if (!notification.isRead) {
            try {
                await markNotificationAsRead(notification.id)
                // Invalidate queries to refresh the UI
                queryClient.invalidateQueries({ queryKey: ['notifications'] })
                queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
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
                queryClient.invalidateQueries({ queryKey: ['notifications'] })
                queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
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
    const message = config.getMessage ? config.getMessage(notification.data) : notification.message

    return (
        <Link
            href={link}
            onClick={handleClick}
            className={cn(
                "block p-3 hover:bg-gray-50 transition-colors border-l-2 group",
                !notification.isRead 
                    ? "bg-blue-50 border-l-blue-500" 
                    : "bg-white border-l-transparent"
            )}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn("p-2 rounded-full flex-shrink-0", config.bgColor)}>
                    <IconComponent className={cn("w-4 h-4", config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className={cn(
                                "text-sm font-medium break-words",
                                !notification.isRead ? "text-gray-900" : "text-gray-700"
                            )}>
                                {title}
                            </h4>
                            {message && (
                                <p className="text-sm text-gray-600 mt-1 break-words">
                                    {message}
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {formatTimeAgo(notification.createdAt)}
                            </p>
                        </div>

                        {/* Delete button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto flex-shrink-0"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </Button>
                    </div>

                    {/* Unread indicator */}
                    {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-3 right-3" />
                    )}
                </div>
            </div>
        </Link>
    )
}