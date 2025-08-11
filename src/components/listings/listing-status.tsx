"use client"

import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export type ListingStatusType = "active" | "inactive" | "sold" | "expired"

interface ListingStatusProps {
    status: ListingStatusType
    listingId?: string
    editable?: boolean
    onStatusChange?: (newStatus: ListingStatusType) => void | Promise<void>
    className?: string
}

const statusConfig: Record<ListingStatusType, {
    label: string
    variant: "default" | "secondary" | "outline" | "destructive"
    className?: string
}> = {
    active: { 
        label: "Actif", 
        variant: "default",
        className: "bg-green-500 hover:bg-green-600 text-white border-green-500"
    },
    inactive: { 
        label: "Inactif", 
        variant: "secondary" 
    },
    sold: { 
        label: "Vendu", 
        variant: "outline",
        className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    },
    expired: { 
        label: "Expiré", 
        variant: "destructive"
    }
}

export function ListingStatus({ 
    status, 
    listingId, 
    editable = false, 
    onStatusChange,
    className 
}: ListingStatusProps) {
    const [currentStatus, setCurrentStatus] = useState<ListingStatusType>(status)
    const [isUpdating, setIsUpdating] = useState(false)

    const config = statusConfig[currentStatus]

    const handleStatusChange = async (newStatus: ListingStatusType) => {
        if (newStatus === currentStatus) return

        setIsUpdating(true)

        try {
            if (onStatusChange) {
                await onStatusChange(newStatus)
            } else if (listingId) {
                // Default API call if no custom handler provided
                const response = await fetch(`/api/listings/${listingId}/status`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                })

                const data = await response.json()
                
                if (!data.success) {
                    throw new Error(data.error || "Erreur lors de la mise à jour du statut")
                }
            }

            setCurrentStatus(newStatus)
            toast.success("Statut mis à jour avec succès")
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Erreur lors de la mise à jour du statut")
        } finally {
            setIsUpdating(false)
        }
    }

    if (!editable) {
        return (
            <Badge 
                variant={config.variant} 
                className={cn(config.className, className)}
            >
                {config.label}
            </Badge>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-7 gap-1", className)}
                    disabled={isUpdating}
                >
                    <Badge 
                        variant={config.variant} 
                        className={cn("pointer-events-none", config.className)}
                    >
                        {config.label}
                    </Badge>
                    <ChevronDown className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.entries(statusConfig).map(([key, value]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => handleStatusChange(key as ListingStatusType)}
                        disabled={key === currentStatus}
                        className={key === currentStatus ? "opacity-50" : ""}
                    >
                        <Badge 
                            variant={value.variant} 
                            className={cn("pointer-events-none", value.className)}
                        >
                            {value.label}
                        </Badge>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Export a read-only version for use in cards and lists
export function ListingStatusBadge({ 
    status, 
    className 
}: { 
    status: ListingStatusType
    className?: string 
}) {
    const config = statusConfig[status]
    
    return (
        <Badge 
            variant={config.variant} 
            className={cn(config.className, className)}
        >
            {config.label}
        </Badge>
    )
}