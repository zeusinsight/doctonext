"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { RiHeartLine, RiMessage3Line, RiNotification3Line } from "@remixicon/react"
import { useRouter } from "next/navigation"

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
    // Use Better Auth session hook to get real user data
    const { data: session, isPending } = authClient.useSession()

    // Show loading state or return null if no session
    if (isPending) {
        return (
            <div className="flex items-center gap-4">
                <button className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                    <RiHeartLine className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Favoris</span>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
                </button>
                <button className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                    <RiMessage3Line className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Messages</span>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
                </button>
                <button className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                    <RiNotification3Line className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Notifications</span>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
                </button>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>...</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        )
    }

    if (!session?.user) {
        return (
            <div className="flex items-center gap-4">
                <button className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                    <RiHeartLine className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Favoris</span>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
                </button>
                <button className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                    <RiMessage3Line className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Messages</span>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
                </button>
                <button className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                    <RiNotification3Line className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Notifications</span>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
                </button>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
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
        "Thomas"

    // Get user's avatar with fallbacks
    const avatarSrc = user.avatarUrl || user.avatar || user.image

    // Generate initials for fallback
    const initials =
        displayName
            .split(" ")
            .map((name) => name.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2) || "T"

    return (
        <div className="flex items-center gap-4">
            <button className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                <RiHeartLine className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Favoris</span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
            </button>
            <button className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                <RiMessage3Line className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Messages</span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
            </button>
            <button className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                <RiNotification3Line className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Notifications</span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
            </button>
            <button onClick={() => {router.push("/dashboard/settings")}} className="relative flex flex-col items-center gap-1 p-2 cursor-pointer group">
                <Avatar className="h-6 w-6">
                    <AvatarImage
                        src={avatarSrc || undefined}
                        alt={displayName}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{displayName}</span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out group-hover:w-full group-hover:-translate-x-1/2"></div>
            </button>
        </div>
    )
}
