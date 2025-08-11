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
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Chargement...</p>
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

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t bg-gray-50 text-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm text-gray-600 hover:text-gray-800"
                        onClick={() => {
                            onClose()
                            // Could navigate to a full notifications page in the future
                        }}
                    >
                        Voir toutes les notifications
                    </Button>
                </div>
            )}
        </div>
    )
}