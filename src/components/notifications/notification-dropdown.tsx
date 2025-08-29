"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getUserNotifications, markAllNotificationsAsRead } from "@/lib/actions/notifications"
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
    
    const { data: response, isLoading, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: getUserNotifications,
        refetchOnWindowFocus: true,
        staleTime: 30 * 1000, // 30 seconds
    })

    const notifications = response?.data || []
    const hasUnread = notifications.some((n: any) => !n.isRead)

    const handleMarkAllAsRead = async () => {
        try {
            const result = await markAllNotificationsAsRead()
            if (result.success) {
                // Invalidate queries to refresh the UI
                queryClient.invalidateQueries({ queryKey: ['notifications'] })
                queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
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
            <div className="w-80 bg-white rounded-lg shadow-lg border p-4">
                <div className="text-center text-red-600">
                    Erreur lors du chargement des notifications
                </div>
            </div>
        )
    }

    return (
        <div className="w-96 bg-white rounded-lg shadow-lg border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {hasUnread && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            <CheckCheck className="w-4 h-4 mr-1" />
                            Tout marquer comme lu
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="divide-y divide-gray-100">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 animate-pulse">
                            <div className="flex items-start gap-3">
                                {/* Icon skeleton */}
                                <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            {/* Title skeleton */}
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            
                                            {/* Description skeleton */}
                                            <div className="space-y-1">
                                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Timestamp skeleton */}
                                        <div className="h-3 bg-gray-200 rounded w-16 shrink-0"></div>
                                    </div>
                                    
                                    {/* Read indicator skeleton */}
                                    <div className="flex justify-between items-center mt-3">
                                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                    <Bell className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Aucune notification</p>
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