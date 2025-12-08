"use client"

import { cn } from "@/lib/utils"
import { isToday, isYesterday, format } from "date-fns"
import { fr } from "date-fns/locale"

interface DateSeparatorProps {
    date: Date | string
    className?: string
}

function formatSeparatorDate(date: Date): string {
    if (isToday(date)) {
        return "Aujourd'hui"
    }
    if (isYesterday(date)) {
        return "Hier"
    }
    // Check if same year
    const now = new Date()
    if (date.getFullYear() === now.getFullYear()) {
        return format(date, "d MMMM", { locale: fr })
    }
    return format(date, "d MMMM yyyy", { locale: fr })
}

export function DateSeparator({ date, className }: DateSeparatorProps) {
    const dateObj = typeof date === "string" ? new Date(date) : date
    const formattedDate = formatSeparatorDate(dateObj)

    return (
        <div
            className={cn(
                "relative flex items-center justify-center py-4",
                className
            )}
            role="separator"
            aria-label={`Messages du ${formattedDate}`}
        >
            {/* Left line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Date badge */}
            <span className="relative z-10 bg-white px-4 py-1 text-xs font-medium text-gray-500 rounded-full border border-gray-100 shadow-sm">
                {formattedDate}
            </span>
        </div>
    )
}
