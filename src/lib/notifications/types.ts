import { Bell, MessageCircle, Eye, Heart, AlertCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { NotificationData } from "@/lib/actions/notifications"

export interface NotificationConfig {
    icon: LucideIcon
    color: string
    bgColor: string
    getTitle: (data?: NotificationData) => string
    getMessage?: (data?: NotificationData) => string
    getLink: (data?: NotificationData) => string
}

export const notificationTypes: Record<string, NotificationConfig> = {
    saved_search_alert: {
        icon: Bell,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        getTitle: (data) => `Nouvelle annonce: ${data?.listingTitle || "Annonce"}`,
        getMessage: (data) => `Une nouvelle annonce correspond à votre recherche "${data?.searchName}"`,
        getLink: (data) => `/annonces/${data?.listingId || ""}`
    },
    new_message: {
        icon: MessageCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        getTitle: (data) => `Message de ${data?.senderName || "Utilisateur"}`,
        getMessage: (data) => data?.messagePreview || "Vous avez reçu un nouveau message",
        getLink: (data) => `/dashboard/messages/${data?.conversationId || ""}`
    },
    listing_view: {
        icon: Eye,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        getTitle: () => "Votre annonce a été consultée",
        getMessage: (data) => `Votre annonce "${data?.listingTitle}" a reçu une nouvelle consultation`,
        getLink: (data) => `/dashboard/annonces/${data?.listingId || ""}`
    },
    listing_favorite: {
        icon: Heart,
        color: "text-red-600",
        bgColor: "bg-red-50",
        getTitle: () => "Votre annonce a été ajoutée aux favoris",
        getMessage: (data) => `Votre annonce "${data?.listingTitle}" a été ajoutée aux favoris`,
        getLink: (data) => `/dashboard/annonces/${data?.listingId || ""}`
    },
    system_alert: {
        icon: AlertCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        getTitle: (data) => data?.title || "Notification système",
        getMessage: (data) => data?.message || "",
        getLink: () => "/dashboard"
    }
}

export function getNotificationConfig(type: string): NotificationConfig {
    return notificationTypes[type] || notificationTypes.system_alert
}

// Helper function to format relative time
export function formatTimeAgo(date: Date | string): string {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000)

    if (diffInSeconds < 60) {
        return "À l'instant"
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
        return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
        return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
        return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
    }

    // For older notifications, show the actual date
    return notificationDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: diffInDays > 365 ? 'numeric' : undefined
    })
}