"use server"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { notifications } from "@/database/schema"
import { eq, and, desc } from "drizzle-orm"
import { headers } from "next/headers"

export interface NotificationData {
    [key: string]: any
}

export async function getUserNotifications() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise", data: [] }
        }

        const userNotifications = await db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, session.user.id))
            .orderBy(desc(notifications.createdAt))
            .limit(50) // Limit to prevent performance issues

        return { success: true, data: userNotifications }
    } catch (error) {
        console.error("Error fetching notifications:", error)
        return {
            success: false,
            error: "Erreur lors de la récupération",
            data: []
        }
    }
}

export async function getUnreadNotificationCount() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise", count: 0 }
        }

        const unreadNotifications = await db
            .select()
            .from(notifications)
            .where(
                and(
                    eq(notifications.userId, session.user.id),
                    eq(notifications.isRead, false)
                )
            )

        return { success: true, count: unreadNotifications.length }
    } catch (error) {
        console.error("Error counting unread notifications:", error)
        return { success: false, error: "Erreur lors du comptage", count: 0 }
    }
}

export async function markNotificationAsRead(notificationId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise" }
        }

        // Verify ownership and update
        const [updatedNotification] = await db
            .update(notifications)
            .set({
                isRead: true,
                readAt: new Date()
            })
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, session.user.id)
                )
            )
            .returning()

        if (!updatedNotification) {
            return { success: false, error: "Notification non trouvée" }
        }

        return { success: true, data: updatedNotification }
    } catch (error) {
        console.error("Error marking notification as read:", error)
        return { success: false, error: "Erreur lors de la mise à jour" }
    }
}

export async function markAllNotificationsAsRead() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise" }
        }

        await db
            .update(notifications)
            .set({
                isRead: true,
                readAt: new Date()
            })
            .where(
                and(
                    eq(notifications.userId, session.user.id),
                    eq(notifications.isRead, false)
                )
            )

        return { success: true }
    } catch (error) {
        console.error("Error marking all notifications as read:", error)
        return { success: false, error: "Erreur lors de la mise à jour" }
    }
}

export async function deleteNotification(notificationId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication requise" }
        }

        await db
            .delete(notifications)
            .where(
                and(
                    eq(notifications.id, notificationId),
                    eq(notifications.userId, session.user.id)
                )
            )

        return { success: true }
    } catch (error) {
        console.error("Error deleting notification:", error)
        return { success: false, error: "Erreur lors de la suppression" }
    }
}

export async function createNotification(
    userId: string,
    type: string,
    title: string,
    message?: string,
    data?: NotificationData
) {
    try {
        const [newNotification] = await db
            .insert(notifications)
            .values({
                id: crypto.randomUUID(),
                userId,
                type,
                title,
                message,
                data,
                isRead: false
            })
            .returning()

        return { success: true, data: newNotification }
    } catch (error) {
        console.error("Error creating notification:", error)
        return { success: false, error: "Erreur lors de la création" }
    }
}
