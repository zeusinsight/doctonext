"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Heart, Trash2 } from "lucide-react"
import Link from "next/link"
import { SponsoredListingCard } from "@/components/listings/sponsored-listing-card"
import { ShareButton } from "@/components/ui/share-button"
import { useFavoritesContext } from "@/contexts/favorites-context"
import { toast } from "sonner"
import type { PublicListing } from "@/types/listing"

type FavoriteListing = PublicListing & {
    favoriteId: string
    favoriteCreatedAt: Date
    status: string
    media: Array<{
        id: string
        fileUrl: string
        fileName: string | null
    }>
}

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteListing[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">(
        "newest"
    )
    const { toggleFavorite } = useFavoritesContext()

    useEffect(() => {
        fetchFavorites()
    }, [])

    const fetchFavorites = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/favorites/details")
            const data = await response.json()

            if (data.success) {
                setFavorites(data.favorites || [])
            } else {
                toast.error("Erreur lors du chargement des favoris")
            }
        } catch (error) {
            console.error("Error fetching favorites:", error)
            toast.error("Erreur lors du chargement des favoris")
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveFavorite = async (
        listingId: string,
        listingTitle: string
    ) => {
        if (
            !confirm(
                `Êtes-vous sûr de vouloir retirer "${listingTitle}" de vos favoris ?`
            )
        ) {
            return
        }

        try {
            await toggleFavorite(listingId)
            setFavorites((prev) => prev.filter((f) => f.id !== listingId))
            toast.success("Annonce retirée des favoris")
        } catch (error) {
            toast.error("Erreur lors de la suppression")
        }
    }

    const filteredFavorites = favorites
        .filter((favorite) => {
            if (!searchQuery.trim()) return true
            const query = searchQuery.toLowerCase()
            return (
                favorite.title.toLowerCase().includes(query) ||
                favorite.description?.toLowerCase().includes(query) ||
                favorite.specialty?.toLowerCase().includes(query) ||
                favorite.location?.city?.toLowerCase().includes(query)
            )
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return (
                        new Date(a.favoriteCreatedAt).getTime() -
                        new Date(b.favoriteCreatedAt).getTime()
                    )
                case "title":
                    return a.title.localeCompare(b.title)
                default: // "newest"
                    return (
                        new Date(b.favoriteCreatedAt).getTime() -
                        new Date(a.favoriteCreatedAt).getTime()
                    )
            }
        })

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="font-bold text-3xl text-white tracking-tight">
                        Mes Favoris
                    </h1>
                    <p className="text-white">
                        Retrouvez toutes vos annonces favorites
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-64 animate-pulse rounded-xl bg-gray-100"
                        />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-bold text-3xl text-white tracking-tight">
                        Mes Favoris
                    </h1>
                    <p className="text-white">
                        {favorites.length === 0
                            ? "Aucun favori pour le moment"
                            : `${filteredFavorites.length} ${filteredFavorites.length === 1 ? "favori" : "favoris"}`}
                    </p>
                </div>

                {favorites.length > 0 && (
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 md:w-80">
                            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher dans vos favoris..."
                                className="pl-9"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(
                                    e.target.value as
                                        | "newest"
                                        | "oldest"
                                        | "title"
                                )
                            }
                            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="newest">Plus récents</option>
                            <option value="oldest">Plus anciens</option>
                            <option value="title">Par titre</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Empty State */}
            {favorites.length === 0 ? (
                <Card>
                    <CardContent className="pt-8">
                        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                            <div className="rounded-full bg-muted p-6">
                                <Heart className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-xl">
                                    Aucun favori
                                </h3>
                                <p className="max-w-md text-muted-foreground text-sm">
                                    Vous n'avez pas encore ajouté d'annonces à
                                    vos favoris. Parcourez les annonces et
                                    cliquez sur le cœur pour les sauvegarder
                                    ici.
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/listings">
                                    Explorer les annonces
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* No Results */}
                    {filteredFavorites.length === 0 && searchQuery && (
                        <Card>
                            <CardContent className="pt-8">
                                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                    <h3 className="font-semibold text-lg">
                                        Aucun résultat
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                        Aucun favori ne correspond à votre
                                        recherche "{searchQuery}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Favorites Grid */}
                    {filteredFavorites.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                            {filteredFavorites.map((favorite) => (
                                <div
                                    key={favorite.favoriteId}
                                    className="group relative"
                                >
                                    <SponsoredListingCard
                                        listing={favorite}
                                        orientation="vertical"
                                        className="h-full"
                                    />

                                    {/* Actions Overlay */}
                                    <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                        <ShareButton
                                            url={`${window.location.origin}/listings/${favorite.id}`}
                                            title={favorite.title}
                                            description={`${favorite.listingType === "transfer" ? "Cession" : favorite.listingType === "replacement" ? "Remplacement" : "Collaboration"} - ${favorite.specialty || "Médical"}`}
                                            size="icon"
                                            className="h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                            onClick={() =>
                                                handleRemoveFavorite(
                                                    favorite.id,
                                                    favorite.title
                                                )
                                            }
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* Favorite Date */}
                                    <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-white text-xs opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                        Ajouté le{" "}
                                        {new Date(
                                            favorite.favoriteCreatedAt
                                        ).toLocaleDateString("fr-FR")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
