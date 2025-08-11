"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
    Search, Heart, Trash2, Eye, Share2, 
    MapPin, Calendar, Filter
} from "lucide-react"
import Link from "next/link"
import { SponsoredListingCard } from "@/components/listings/sponsored-listing-card"
import { ShareButton } from "@/components/ui/share-button"
import { FavoriteButton } from "@/components/ui/favorite-button"
import { useFavorites } from "@/hooks/use-favorites"
import { toast } from "sonner"

interface FavoriteListing {
    favoriteId: string
    favoriteCreatedAt: Date
    id: string
    title: string
    description: string | null
    listingType: "transfer" | "replacement" | "collaboration"
    specialty: string | null
    status: string
    isBoostPlus: boolean
    viewsCount: number
    createdAt: Date
    publishedAt: Date | null
    location: {
        city: string | null
        region: string | null
        postalCode: string | null
    } | null
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
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest")
    const { toggleFavorite } = useFavorites()

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

    const handleRemoveFavorite = async (listingId: string, listingTitle: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir retirer "${listingTitle}" de vos favoris ?`)) {
            return
        }

        try {
            await toggleFavorite(listingId)
            setFavorites(prev => prev.filter(f => f.id !== listingId))
            toast.success("Annonce retirée des favoris")
        } catch (error) {
            toast.error("Erreur lors de la suppression")
        }
    }

    const filteredFavorites = favorites
        .filter(favorite => {
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
                    return new Date(a.favoriteCreatedAt).getTime() - new Date(b.favoriteCreatedAt).getTime()
                case "title":
                    return a.title.localeCompare(b.title)
                default: // "newest"
                    return new Date(b.favoriteCreatedAt).getTime() - new Date(a.favoriteCreatedAt).getTime()
            }
        })

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Favoris</h1>
                    <p className="text-muted-foreground">Retrouvez toutes vos annonces favorites</p>
                </div>
                
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
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
                    <h1 className="text-3xl font-bold tracking-tight">Mes Favoris</h1>
                    <p className="text-muted-foreground">
                        {favorites.length === 0 
                            ? "Aucun favori pour le moment"
                            : `${filteredFavorites.length} ${filteredFavorites.length === 1 ? "favori" : "favoris"}`
                        }
                    </p>
                </div>

                {favorites.length > 0 && (
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
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
                                <h3 className="text-xl font-semibold">Aucun favori</h3>
                                <p className="max-w-md text-sm text-muted-foreground">
                                    Vous n'avez pas encore ajouté d'annonces à vos favoris. 
                                    Parcourez les annonces et cliquez sur le cœur pour les sauvegarder ici.
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/listings">Explorer les annonces</Link>
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
                                    <h3 className="text-lg font-semibold">Aucun résultat</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Aucun favori ne correspond à votre recherche "{searchQuery}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Favorites List */}
                    {filteredFavorites.length > 0 && (
                        <div className="space-y-3">
                            {filteredFavorites.map((favorite) => (
                                <div key={favorite.favoriteId} className="group relative">
                                    <SponsoredListingCard 
                                        listing={favorite}
                                        orientation="horizontal"
                                        className="w-full"
                                    />
                                    
                                    {/* Actions Overlay */}
                                    <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                        <ShareButton 
                                            url={`${window.location.origin}/listings/${favorite.id}`}
                                            title={favorite.title}
                                            description={`${favorite.listingType === "transfer" ? "Cession" : favorite.listingType === "replacement" ? "Remplacement" : "Collaboration"} - ${favorite.specialty || "Médical"}`}
                                            size="icon"
                                            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm"
                                        />
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                            onClick={() => handleRemoveFavorite(favorite.id, favorite.title)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Favorite Date */}
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
                                        Ajouté le {new Date(favorite.favoriteCreatedAt).toLocaleDateString("fr-FR")}
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