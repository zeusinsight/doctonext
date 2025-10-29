"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Bell } from "lucide-react"
import { getUnreadNotificationCount } from "@/lib/actions/notifications"
import { NotificationDropdown } from "./notification-dropdown"
import { cn } from "@/lib/utils"

interface NotificationButtonProps {
    layout?: "vertical" | "horizontal"
    hideLabelOnSmall?: boolean
    className?: string
    buttonClassName?: string
}

export function NotificationButton({
    layout = "vertical",
    hideLabelOnSmall = false,
    className,
    buttonClassName
}: NotificationButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Fetch unread count with TanStack Query
    const { data: response } = useQuery({
        queryKey: ["notifications", "unread-count"],
        queryFn: getUnreadNotificationCount,
        refetchOnWindowFocus: true,
        staleTime: 30 * 1000 // 30 seconds
    })

    const unreadCount = response?.count || 0

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            return () =>
                document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    // Handle escape key
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            return () => document.removeEventListener("keydown", handleEscape)
        }
    }, [isOpen])

    const orientationClasses =
        layout === "horizontal"
            ? "flex-row items-center gap-2"
            : "flex-col items-center gap-1"

    return (
        <div className={cn("relative", className)}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "group relative flex cursor-pointer p-2 transition-colors",
                    orientationClasses,
                    buttonClassName
                )}
                aria-label="Notifications"
            >
                <div className="relative">
                    <Bell
                        className={cn(
                            "h-6 w-6 transition-colors",
                            isOpen
                                ? "text-blue-600"
                                : "text-muted-foreground group-hover:text-foreground"
                        )}
                    />

                    {/* Unread count badge */}
                    {unreadCount > 0 && (
                        <div className="-top-2 -right-2 absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 font-medium text-white text-xs">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </div>
                    )}
                </div>

                <span
                    className={cn(
                        "text-sm transition-colors",
                        hideLabelOnSmall && "hidden sm:inline",
                        isOpen
                            ? "font-medium text-blue-600"
                            : "text-muted-foreground group-hover:text-foreground"
                    )}
                >
                    Notifications
                </span>

                {/* Active indicator */}
                <div
                    className={cn(
                        "absolute bottom-0 left-1/2 h-0.5 bg-blue-600 transition-all duration-300 ease-out",
                        isOpen
                            ? "-translate-x-1/2 w-full"
                            : "group-hover:-translate-x-1/2 w-0 group-hover:w-full"
                    )}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="fade-in-0 zoom-in-95 absolute top-full right-0 z-50 mt-2 animate-in"
                    style={{ transformOrigin: "top right" }}
                >
                    <NotificationDropdown onClose={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    )
}
