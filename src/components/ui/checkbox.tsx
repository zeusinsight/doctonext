"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onCheckedChange?.(e.target.checked)
            onChange?.(e)
        }

        return (
            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    ref={ref}
                    className="sr-only"
                    checked={checked}
                    onChange={handleChange}
                    {...props}
                />
                <div
                    className={cn(
                        "flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-gray-300 transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        checked && "border-blue-600 bg-blue-600 text-white",
                        className
                    )}
                    onClick={() => onCheckedChange?.(!checked)}
                >
                    {checked && <Check className="h-3 w-3" />}
                </div>
            </div>
        )
    }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
