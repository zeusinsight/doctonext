"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

interface FavoritesContextType {
    favorites: string[]
    toggleFavorite: (listingId: string) => Promise<{ success: boolean; isFavorite?: boolean; error?: string }>
    isFavorite: (listingId: string) => boolean
    addFavorite: (listingId: string) => Promise<{ success: boolean; isFavorite?: boolean; error?: string }>
    removeFavorite: (listingId: string) => Promise<{ success: boolean; isFavorite?: boolean; error?: string }>
    getFavoriteCount: () => number
    clearFavorites: () => void
    isLoaded: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

interface FavoritesProviderProps {
    children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [isLoaded, setIsLoaded] = useState(false)

    // Load favorites from database on mount - only once
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const response = await fetch("/api/favorites")
                const data = await response.json()
                
                if (data.success && data.data) {
                    setFavorites(new Set(data.data))
                }
            } catch (error) {
                console.error("Error loading favorites:", error)
            } finally {
                setIsLoaded(true)
            }
        }
        
        loadFavorites()
    }, [])

    const toggleFavorite = useCallback(async (listingId: string) => {
        try {
            // Optimistic update
            const wasAlreadyFavorite = favorites.has(listingId)
            setFavorites(prev => {
                const newFavorites = new Set(prev)
                if (newFavorites.has(listingId)) {
                    newFavorites.delete(listingId)
                } else {
                    newFavorites.add(listingId)
                }
                return newFavorites
            })

            // Make API call
            const response = await fetch("/api/favorites/toggle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ listingId }),
            })

            const data = await response.json()
            
            if (!data.success) {
                // Revert optimistic update on failure
                setFavorites(prev => {
                    const newFavorites = new Set(prev)
                    if (wasAlreadyFavorite) {
                        newFavorites.add(listingId)
                    } else {
                        newFavorites.delete(listingId)
                    }
                    return newFavorites
                })
                throw new Error(data.error || "Failed to toggle favorite")
            }

            return { success: true, isFavorite: data.isFavorite }
        } catch (error) {
            console.error("Error toggling favorite:", error)
            return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
        }
    }, [favorites])

    const isFavorite = useCallback((listingId: string) => {
        return favorites.has(listingId)
    }, [favorites])

    const addFavorite = useCallback(async (listingId: string) => {
        if (!favorites.has(listingId)) {
            return await toggleFavorite(listingId)
        }
        return { success: true, isFavorite: true }
    }, [favorites, toggleFavorite])

    const removeFavorite = useCallback(async (listingId: string) => {
        if (favorites.has(listingId)) {
            return await toggleFavorite(listingId)
        }
        return { success: true, isFavorite: false }
    }, [favorites, toggleFavorite])

    const getFavoriteCount = useCallback(() => {
        return favorites.size
    }, [favorites])

    const clearFavorites = useCallback(() => {
        setFavorites(new Set())
        // TODO: Implement API call to clear all favorites if needed
    }, [])

    const value: FavoritesContextType = {
        favorites: Array.from(favorites),
        toggleFavorite,
        isFavorite,
        addFavorite,
        removeFavorite,
        getFavoriteCount,
        clearFavorites,
        isLoaded
    }

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext)
    if (context === undefined) {
        throw new Error("useFavoritesContext must be used within a FavoritesProvider")
    }
    return context
}