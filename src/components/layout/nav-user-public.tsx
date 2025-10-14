"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import {
    RiHeartLine,
    RiMessage3Line,
    RiNotification3Line,
    RiLoginBoxLine
} from "@remixicon/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { NotificationButton } from "../notifications/notification-button"

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

export function NavUserPublic() {
    const router = useRouter()
    const pathname = usePathname()
    // Use Better Auth session hook to get real user data
    const { data: session, isPending } = authClient.useSession()

    const isFavoritesActive = pathname === "/dashboard/favorites"

    // If user is not authenticated
    if (!session?.user && !isPending) {
        return (
            <div className="flex items-center gap-4 rounded-lg  px-3 py-2">
                <Link
                    href="/login"
                    className="group relative flex cursor-pointer flex-col items-center gap-1 p-2"
                >
                    <RiHeartLine className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                    <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                        Favoris
                    </span>
                    <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
                <Link
                    href="/login"
                    className="group relative flex cursor-pointer flex-col items-center gap-1 p-2"
                >
                    <RiMessage3Line className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                    <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                        Messages
                    </span>
                    <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
                <Link
                    href="/login"
                    className="group relative flex cursor-pointer flex-col items-center gap-1 p-2"
                >
                    <RiNotification3Line className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                    <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                        Notifications
                    </span>
                    <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
                <Link
                    href="/login"
                    className="group relative flex cursor-pointer flex-col items-center gap-1 p-2"
                >
                    <RiLoginBoxLine className="h-6 w-6 text-blue-600 transition-colors group-hover:text-blue-700" />
                    <span className="font-medium text-blue-600 text-xs transition-colors group-hover:text-blue-700">
                        Se connecter
                    </span>
                    <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
            </div>
        )
    }

    // Show loading state
    if (isPending) {
        return (
            <div className="flex items-center gap-4 rounded-lg px-3 py-2">
                <div className="relative flex flex-col items-center gap-1 p-2">
                    <RiHeartLine className="h-6 w-6 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">
                        Favoris
                    </span>
                </div>
                <div className="relative flex flex-col items-center gap-1 p-2">
                    <RiMessage3Line className="h-6 w-6 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">
                        Messages
                    </span>
                </div>
                <div className="relative flex flex-col items-center gap-1 p-2">
                    <RiNotification3Line className="h-6 w-6 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">
                        Notifications
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>...</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        )
    }

    // User is authenticated
    const user = session?.user as Profile

    // Get user's display name with fallbacks
    const displayName =
        user?.displayName ||
        user?.fullName ||
        user?.name ||
        user?.firstName ||
        "Invité"

    // Get user's avatar with fallbacks
    const avatarSrc = user?.avatarUrl || user?.avatar || user?.image

    // Generate initials for fallback
    const initials =
        displayName
            .split(" ")
            .map((name) => name.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2) || "Inv"

    return (
        <div className="flex items-center gap-4 rounded-lg  px-3 py-2">
            <Link
                href="/dashboard/favorites"
                className="group relative flex cursor-pointer flex-col items-center gap-1 p-2"
            >
                <RiHeartLine
                    className={`h-6 w-6 transition-colors ${
                        isFavoritesActive
                            ? "text-blue-600"
                            : "text-muted-foreground group-hover:text-foreground"
                    }`}
                />
                <span
                    className={`text-sm transition-colors ${
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
                className="group relative flex cursor-pointer flex-col items-center gap-1 p-2"
            >
                <RiMessage3Line className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span className="text-muted-foreground text-sm transition-colors group-hover:text-foreground">
                    Messages
                </span>
                <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
            <NotificationButton />
            <Link
                href="/dashboard"
                className="group relative flex cursor-pointer flex-col items-center gap-1 p-2"
            >
                <Avatar className="h-6 w-6">
                    <AvatarImage
                        src={avatarSrc || undefined}
                        alt={displayName}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-muted-foreground text-xs transition-colors group-hover:text-foreground">
                    {displayName}
                </span>
                <div className="group-hover:-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
        </div>
    )
}
