"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
                className
            )}
            {...props}
        >
            <div
                className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
            />
        </div>
    )
)
Progress.displayName = "Progress"

export { Progress }
