"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ScrollToBottomProps {
    visible: boolean
    onClick: () => void
    unreadCount?: number
    className?: string
}

export function ScrollToBottom({
    visible,
    onClick,
    unreadCount = 0,
    className
}: ScrollToBottomProps) {
    return (
        <div
            className={cn(
                "absolute bottom-20 left-1/2 -translate-x-1/2 z-10 transition-all duration-300",
                visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none",
                className
            )}
        >
            <Button
                onClick={onClick}
                size="sm"
                className={cn(
                    "rounded-full shadow-lg shadow-black/10 gap-1.5",
                    "bg-white text-gray-700 border border-gray-200",
                    "hover:bg-gray-50 hover:shadow-xl",
                    "transition-all duration-200"
                )}
                aria-label={
                    unreadCount > 0
                        ? `${unreadCount} nouveaux messages, défiler vers le bas`
                        : "Défiler vers le bas"
                }
            >
                {unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Défiler vers le bas</span>
            </Button>
        </div>
    )
}
