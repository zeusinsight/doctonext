"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, MessageCircle, Edit, Trash2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { UserListing } from "@/types/listing"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function ListingsPage() {
    const [listings, setListings] = useState<UserListing[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUserListings()
    }, [])

    const fetchUserListings = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/user/listings")
            const data = await response.json()
            
            if (data.success) {
                setListings(data.data.listings)
            } else {
                toast.error("Erreur lors du chargement des annonces")
            }
        } catch (error) {
            console.error("Error fetching listings:", error)
            toast.error("Erreur lors du chargement des annonces")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (listingId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/listings/${listingId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            })

            const data = await response.json()
            
            if (data.success) {
                toast.success("Statut mis à jour avec succès")
                // Update the specific listing in state instead of refetching all
                setListings(prev => prev.map(listing => 
                    listing.id === listingId 
                        ? { ...listing, status: newStatus as "active" | "inactive" | "sold" | "expired" }
                        : listing
                ))
            } else {
                toast.error(data.error || "Erreur lors de la mise à jour du statut")
            }
        } catch (error) {
            console.error("Error updating status:", error)
            toast.error("Erreur lors de la mise à jour du statut")
        }
    }

    const handleDelete = async (listingId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
            return
        }

        try {
            const response = await fetch(`/api/listings/${listingId}`, {
                method: "DELETE",
            })

            const data = await response.json()
            
            if (data.success) {
                toast.success("Annonce supprimée avec succès")
                fetchUserListings() // Refresh the list
            } else {
                toast.error(data.error || "Erreur lors de la suppression")
            }
        } catch (error) {
            console.error("Error deleting listing:", error)
            toast.error("Erreur lors de la suppression")
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { label: "Actif", variant: "default" as const },
            inactive: { label: "Inactif", variant: "secondary" as const },
            sold: { label: "Vendu", variant: "outline" as const },
            expired: { label: "Expiré", variant: "destructive" as const }
        }
        
        return statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    }

    const getListingTypeBadge = (type: string) => {
        const typeConfig = {
            transfer: { label: "Cession", variant: "default" as const },
            replacement: { label: "Remplacement", variant: "secondary" as const },
            collaboration: { label: "Collaboration", variant: "outline" as const }
        }
        
        return typeConfig[type as keyof typeof typeConfig] || typeConfig.transfer
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mes Annonces</h1>
                        <p className="text-muted-foreground">
                            Gérez vos annonces de cession et de remplacement
                        </p>
                    </div>
                    <Button disabled>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle annonce
                    </Button>
                </div>
                
                <div className="grid gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="h-5 bg-muted rounded animate-pulse w-64" />
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 bg-muted rounded animate-pulse w-20" />
                                            <div className="h-4 bg-muted rounded animate-pulse w-24" />
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-4 bg-muted rounded animate-pulse w-16" />
                                        <div className="h-4 bg-muted rounded animate-pulse w-20" />
                                        <div className="h-4 bg-muted rounded animate-pulse w-24" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-5 bg-muted rounded animate-pulse w-16" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Annonces</h1>
                    <p className="text-muted-foreground">
                        Gérez vos annonces de cession et de remplacement
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/listings/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle annonce
                    </Link>
                </Button>
            </div>

            {listings.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <div className="mx-auto mb-4 h-12 w-12 text-muted-foreground">
                                <Plus className="h-full w-full" />
                            </div>
                            <h3 className="text-lg font-semibold">Aucune annonce</h3>
                            <p className="text-muted-foreground mb-4">
                                Vous n'avez pas encore créé d'annonce.
                            </p>
                            <Button asChild>
                                <Link href="/dashboard/listings/new">
                                    Créer ma première annonce
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {listings.map((listing) => {
                        const statusBadge = getStatusBadge(listing.status)
                        const typeBadge = getListingTypeBadge(listing.listingType)
                        
                        return (
                            <Card key={listing.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">
                                                {listing.title}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2">
                                                <Badge variant={typeBadge.variant}>
                                                    {typeBadge.label}
                                                </Badge>
                                                {listing.specialty && (
                                                    <span className="text-sm text-muted-foreground">
                                                        • {listing.specialty}
                                                    </span>
                                                )}
                                            </CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/listings/${listing.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Voir
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/listings/${listing.id}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Modifier
                                                    </Link>
                                                </DropdownMenuItem>
                                                {listing.status === "active" ? (
                                                    <DropdownMenuItem 
                                                        onClick={() => handleStatusChange(listing.id, "inactive")}
                                                    >
                                                        Désactiver
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem 
                                                        onClick={() => handleStatusChange(listing.id, "active")}
                                                    >
                                                        Activer
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem 
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(listing.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {listing.viewsCount} vues
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="h-4 w-4" />
                                                {listing.contactsCount} contacts
                                            </div>
                                            <div className="text-xs">
                                                Créé le {new Date(listing.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={statusBadge.variant}>
                                                {statusBadge.label}
                                            </Badge>
                                            {listing.isPremium && (
                                                <Badge variant="outline" className="text-amber-600">
                                                    Premium
                                                </Badge>
                                            )}
                                            {listing.isUrgent && (
                                                <Badge variant="outline" className="text-red-600">
                                                    Urgent
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}