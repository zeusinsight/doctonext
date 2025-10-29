"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth-client"
import { RiHeartLine, RiMessage3Line } from "@remixicon/react"
import { useRouter, usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { NotificationButton } from "@/components/notifications/notification-button"

// Better Auth UI Profile types
interface Profile {
    avatarUrl?: string | null
    avatar?: string | null
    image?: string | null
    emailVerified?: boolean | null
    isAnonymous?: boolean | null
    fullName?: string | null
    firstName?: string | null
    displayName?: string | null
    username?: string | null
    displayUsername?: string | null
    name?: string | null
    email?: string | null
    id?: string | number
}

export function NavUser() {
    const router = useRouter()
    const pathname = usePathname()
    // Use Better Auth session hook to get real user data
    const { data: session, isPending } = authClient.useSession()

    // Fetch unread messages count
    const { data: unreadResponse } = useQuery({
        queryKey: ["messages", "unread-count"],
        queryFn: async () => {
            const response = await fetch("/api/messages/unread-count")
            if (!response.ok) throw new Error("Failed to fetch unread count")
            return response.json()
        },
        refetchInterval: 30000, // Check every 30 seconds
        staleTime: 15000, // 15 seconds
        enabled: !!session?.user // Only fetch if user is logged in
    })

    const unreadCount = unreadResponse?.count || 0

    // Show loading state or return null if no session
    if (isPending) {
        return (
            <div className="flex items-center gap-2 sm:gap-4 rounded-lg bg-gray-50 px-2 py-1 sm:px-3 sm:py-2 flex-wrap md:flex-nowrap">
                <Link
                    href="/dashboard/favorites"
                    className="group relative flex cursor-pointer items-center gap-1 p-1 sm:p-2"
                    aria-label="Favoris"
                    title="Favoris"
                >
                    <RiHeartLine className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                    <span className="hidden sm:inline text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                        Favoris
                    </span>
                    <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
                <Link
                    href="/dashboard/messages"
                    className="group relative flex cursor-pointer items-center gap-1 p-1 sm:p-2"
                    aria-label="Messages"
                    title="Messages"
                >
                    <div className="relative">
                        <RiMessage3Line className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </div>
                    <span className="hidden sm:inline text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                        Messages
                    </span>
                    <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
                <div className="hidden sm:block">
                    <NotificationButton layout="horizontal" buttonClassName="p-1 sm:p-2" />
                </div>
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarFallback>...</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        )
    }

    if (!session?.user) {
        return (
            <div className="flex items-center gap-2 sm:gap-4 rounded-lg bg-gray-50 px-2 py-1 sm:px-3 sm:py-2 flex-wrap md:flex-nowrap">
                <Link
                    href="/dashboard/favorites"
                    className="group relative flex cursor-pointer items-center gap-1 p-1 sm:p-2"
                    aria-label="Favoris"
                    title="Favoris"
                >
                    <RiHeartLine className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                    <span className="hidden sm:inline text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                        Favoris
                    </span>
                    <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
                <Link
                    href="/dashboard/messages"
                    className="group relative flex cursor-pointer items-center gap-1 p-1 sm:p-2"
                    aria-label="Messages"
                    title="Messages"
                >
                    <div className="relative">
                        <RiMessage3Line className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </div>
                    <span className="hidden sm:inline text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                        Messages
                    </span>
                    <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
                <div className="hidden sm:block">
                    <NotificationButton layout="horizontal" buttonClassName="p-1 sm:p-2" />
                </div>
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        )
    }

    const user = session.user as Profile

    // Get user's display name with fallbacks
    const displayName =
        user.displayName ||
        user.fullName ||
        user.name ||
        user.firstName ||
        "Invité"

    // Get user's avatar with fallbacks
    const avatarSrc = user.avatarUrl || user.avatar || user.image

    // Generate initials for fallback
    const initials =
        displayName
            .split(" ")
            .map((name) => name.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2) || "Inv"

    const isFavoritesActive = pathname === "/dashboard/favorites"
    const isMessagesActive = pathname.startsWith("/dashboard/messages")

    return (
        <div className="flex items-center gap-2 sm:gap-4 rounded-lg bg-gray-50 px-2 py-1 sm:px-3 sm:py-2 flex-wrap md:flex-nowrap">
            <Link
                href="/dashboard/favorites"
                className="group relative flex cursor-pointer items-center gap-1 p-1 sm:p-2"
                aria-label="Favoris"
                title="Favoris"
            >
                <RiHeartLine
                    className={`h-6 w-6 transition-colors ${
                        isFavoritesActive
                            ? "text-blue-600"
                            : "text-muted-foreground group-hover:text-foreground"
                    }`}
                />
                <span
                    className={`hidden sm:inline text-sm transition-colors ${
                        isFavoritesActive
                            ? "font-medium text-blue-600"
                            : "text-muted-foreground group-hover:text-foreground"
                    }`}
                >
                    Favoris
                </span>
                <div
                    className={`absolute bottom-0 left-1/2 h-0.5 bg-blue-600 transition-all duration-300 ease-out ${
                        isFavoritesActive
                            ? "-translate-x-1/2 w-full"
                            : "group-hover:-translate-x-1/2 w-0 group-hover:w-full"
                    }`}
                />
            </Link>
            <Link
                href="/dashboard/messages"
                className="group relative flex cursor-pointer items-center gap-1 p-1 sm:p-2"
                aria-label="Messages"
                title="Messages"
            >
                <div className="relative">
                    <RiMessage3Line
                        className={`h-6 w-6 transition-colors ${
                            isMessagesActive
                                ? "text-blue-600"
                                : "text-muted-foreground group-hover:text-foreground"
                        }`}
                    />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="-top-2 -right-2 absolute flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 py-0 text-xs"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </div>
                <span
                    className={`hidden sm:inline text-sm transition-colors ${
                        isMessagesActive
                            ? "font-medium text-blue-600"
                            : "text-muted-foreground group-hover:text-foreground"
                    }`}
                >
                    Messages
                </span>
                <div
                    className={`absolute bottom-0 left-1/2 h-0.5 bg-blue-600 transition-all duration-300 ease-out ${
                        isMessagesActive
                            ? "-translate-x-1/2 w-full"
                            : "group-hover:-translate-x-1/2 w-0 group-hover:w-full"
                    }`}
                />
            </Link>
            <div className="hidden sm:block">
                <NotificationButton layout="horizontal" buttonClassName="p-1 sm:p-2" />
            </div>
            <Link
                href="/dashboard"
                className="group relative flex cursor-pointer items-center gap-1 p-1 sm:p-2"
                aria-label="Profil"
                title="Profil"
            >
                <Avatar className="h-6 w-6">
                    <AvatarImage
                        src={avatarSrc || undefined}
                        alt={displayName}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-medium text-muted-foreground text-xs transition-colors group-hover:text-foreground">
                    {displayName}
                </span>
                <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
        </div>
    )
}
