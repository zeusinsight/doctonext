"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getUserNotifications,
    markAllNotificationsAsRead
} from "@/lib/actions/notifications"
import { NotificationItem } from "./notification-item"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, CheckCheck } from "lucide-react"
import { toast } from "sonner"

interface NotificationDropdownProps {
    onClose: () => void
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
    const queryClient = useQueryClient()

    const {
        data: response,
        isLoading,
        error
    } = useQuery({
        queryKey: ["notifications"],
        queryFn: getUserNotifications,
        refetchOnWindowFocus: true,
        staleTime: 30 * 1000 // 30 seconds
    })

    const notifications = response?.data || []
    const hasUnread = notifications.some((n: any) => !n.isRead)

    const handleMarkAllAsRead = async () => {
        try {
            const result = await markAllNotificationsAsRead()
            if (result.success) {
                // Invalidate queries to refresh the UI
                queryClient.invalidateQueries({ queryKey: ["notifications"] })
                queryClient.invalidateQueries({
                    queryKey: ["notifications", "unread-count"]
                })
                toast.success("Toutes les notifications marquées comme lues")
            } else {
                toast.error("Erreur lors de la mise à jour")
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour")
        }
    }

    if (error) {
        return (
            <div className="w-80 rounded-lg border bg-white p-4 shadow-lg">
                <div className="text-center text-red-600">
                    Erreur lors du chargement des notifications
                </div>
            </div>
        )
    }

    return (
        <div className="w-96 overflow-hidden rounded-lg border bg-white shadow-lg">
            {/* Header */}
            <div className="border-b bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                        Notifications
                    </h3>
                    {hasUnread && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-blue-600 text-sm hover:text-blue-800"
                        >
                            <CheckCheck className="mr-1 h-4 w-4" />
                            Tout marquer comme lu
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="divide-y divide-gray-100">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="animate-pulse p-4">
                            <div className="flex items-start gap-3">
                                {/* Icon skeleton */}
                                <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            {/* Title skeleton */}
                                            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />

                                            {/* Description skeleton */}
                                            <div className="space-y-1">
                                                <div className="h-3 w-full rounded bg-gray-200" />
                                                <div className="h-3 w-2/3 rounded bg-gray-200" />
                                            </div>
                                        </div>

                                        {/* Timestamp skeleton */}
                                        <div className="h-3 w-16 shrink-0 rounded bg-gray-200" />
                                    </div>

                                    {/* Read indicator skeleton */}
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="h-2 w-2 rounded-full bg-gray-200" />
                                        <div className="h-3 w-20 rounded bg-gray-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                    <Bell className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                    <p className="text-gray-500 text-sm">Aucune notification</p>
                </div>
            ) : (
                <ScrollArea className="max-h-96">
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification: any) => (
                            <NotificationItem
                                key={notification.id}
                                notification={{
                                    ...notification,
                                    createdAt: new Date(notification.createdAt)
                                }}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    )
}
