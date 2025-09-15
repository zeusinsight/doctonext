"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFavoritesContext } from "@/contexts/favorites-context"
import { toast } from "sonner"

interface FavoriteButtonProps {
    listingId: string
    listingTitle?: string
    className?: string
    variant?: "default" | "outline" | "ghost" | "secondary"
    size?: "default" | "sm" | "lg" | "icon"
    showToast?: boolean
    onToggle?: (isFavorite: boolean) => void
}

export function FavoriteButton({
    listingId,
    listingTitle = "cette annonce",
    className,
    variant = "outline",
    size = "icon",
    showToast = true,
    onToggle
}: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite, isLoaded } = useFavoritesContext()
    const [isAnimating, setIsAnimating] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            setIsFavorited(isFavorite(listingId))
        }
    }, [isLoaded, isFavorite, listingId])

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const wasAlreadyFavorite = isFavorited
        setIsAnimating(true)

        try {
            // Update favorites via database
            const result = await toggleFavorite(listingId)

            if (result.success) {
                const newFavoriteState = result.isFavorite!

                // Show toast notification
                if (showToast) {
                    if (newFavoriteState) {
                        toast.success(`${listingTitle} ajoutée aux favoris`, {
                            duration: 2000,
                            action: {
                                label: "Annuler",
                                onClick: () => {
                                    toggleFavorite(listingId)
                                }
                            }
                        })
                    } else {
                        toast.info(`${listingTitle} retirée des favoris`, {
                            duration: 2000,
                            action: {
                                label: "Annuler",
                                onClick: () => {
                                    toggleFavorite(listingId)
                                }
                            }
                        })
                    }
                }

                // Call optional callback
                onToggle?.(newFavoriteState)
            } else {
                // Show error toast
                if (showToast) {
                    toast.error(
                        result.error ||
                            "Erreur lors de la mise à jour des favoris"
                    )
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error)
            if (showToast) {
                toast.error("Erreur lors de la mise à jour des favoris")
            }
        } finally {
            // Reset animation
            setTimeout(() => setIsAnimating(false), 300)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={cn(
                "transition-all",
                isAnimating && "scale-110",
                isFavorited && variant === "ghost"
                    ? "border-red-200 bg-red-50 hover:bg-red-100"
                    : "",
                className
            )}
            onClick={handleClick}
            aria-label={
                isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"
            }
        >
            <Heart
                className={cn(
                    "h-4 w-4 transition-all",
                    isFavorited
                        ? "fill-red-500 text-red-500"
                        : "fill-none text-gray-600 hover:text-red-400",
                    isAnimating && "animate-pulse"
                )}
            />
            {size !== "icon" && (
                <span className="ml-2">
                    {isFavorited ? "Favori" : "Ajouter aux favoris"}
                </span>
            )}
        </Button>
    )
}
