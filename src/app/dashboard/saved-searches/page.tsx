"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { 
    getUserSavedSearches, 
    deleteSavedSearch, 
    toggleEmailAlerts 
} from "@/lib/actions/saved-searches"
import { toast } from "sonner"
import { 
    Bell, 
    BellOff, 
    Trash2, 
    Search,
    MapPin,
    Briefcase,
    Users,
    ExternalLink,
    AlertCircle
} from "lucide-react"
import Link from "next/link"
import { ListingFilters } from "@/components/listings/listings-filter-modal"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SavedSearch {
    id: string
    name: string
    searchCriteria: ListingFilters
    isActive: boolean
    emailAlertsEnabled: boolean
    lastAlertSent: Date | null
    createdAt: Date
    updatedAt: Date
}

export default function SavedSearchesPage() {
    const [searches, setSearches] = useState<SavedSearch[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [searchToDelete, setSearchToDelete] = useState<string | null>(null)

    useEffect(() => {
        loadSearches()
    }, [])

    const loadSearches = async () => {
        setLoading(true)
        try {
            const result = await getUserSavedSearches()
            if (result.success) {
                setSearches(result.data as SavedSearch[])
            } else {
                toast.error(result.error || "Erreur lors du chargement")
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des recherches")
        } finally {
            setLoading(false)
        }
    }

    const handleToggleAlerts = async (id: string) => {
        try {
            const result = await toggleEmailAlerts(id)
            if (result.success) {
                toast.success("Alertes mises à jour")
                loadSearches()
            } else {
                toast.error(result.error || "Erreur lors de la mise à jour")
            }
        } catch (error) {
            toast.error("Erreur lors de la mise à jour des alertes")
        }
    }

    const handleDelete = async () => {
        if (!searchToDelete) return

        try {
            const result = await deleteSavedSearch(searchToDelete)
            if (result.success) {
                toast.success("Recherche supprimée")
                loadSearches()
            } else {
                toast.error(result.error || "Erreur lors de la suppression")
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression")
        } finally {
            setDeleteDialogOpen(false)
            setSearchToDelete(null)
        }
    }

    const buildSearchUrl = (criteria: ListingFilters) => {
        const params = new URLSearchParams()
        
        if (criteria.specialties?.length > 0) {
            params.append("specialties", criteria.specialties.join(","))
        }
        if (criteria.regions?.length > 0) {
            params.append("regions", criteria.regions.join(","))
        }
        if (criteria.listingTypes?.length > 0) {
            params.append("types", criteria.listingTypes.join(","))
        }
        if (criteria.collaborationTypes?.length > 0) {
            params.append("collabTypes", criteria.collaborationTypes.join(","))
        }
        if (criteria.isBoostPlus) {
            params.append("boostPlus", "true")
        }

        return `/listings?${params.toString()}`
    }

    const formatCriteria = (criteria: ListingFilters) => {
        const parts = []
        
        if (criteria.listingTypes?.length > 0) {
            const typeLabels = criteria.listingTypes.map(t => {
                switch(t) {
                    case "transfer": return "Cession"
                    case "replacement": return "Remplacement"
                    case "collaboration": return "Collaboration"
                    default: return t
                }
            })
            parts.push({ icon: Briefcase, label: typeLabels.join(", ") })
        }
        
        if (criteria.specialties?.length > 0) {
            parts.push({ 
                icon: Users, 
                label: criteria.specialties.length === 1 
                    ? criteria.specialties[0] 
                    : `${criteria.specialties.length} spécialités`
            })
        }
        
        if (criteria.regions?.length > 0) {
            parts.push({ 
                icon: MapPin, 
                label: criteria.regions.length === 1 
                    ? criteria.regions[0] 
                    : `${criteria.regions.length} régions`
            })
        }

        if (criteria.isBoostPlus) {
            parts.push({ icon: AlertCircle, label: "Boost+ uniquement" })
        }

        return parts
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="mb-6">
                    <Skeleton className="h-9 w-80 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>

                <div className="grid gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <Skeleton className="h-7 w-64 mb-2" />
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <Skeleton className="h-5 w-24" />
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-5 w-20" />
                                        </div>
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                    <Skeleton className="h-6 w-32" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-32" />
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-6 w-12" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-10 w-10" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-white">Mes recherches sauvegardées</h1>
                <p className="text-white">
                    Gérez vos recherches et recevez des alertes pour les nouvelles annonces correspondantes
                </p>
            </div>

            {searches.length === 0 ? (
                <Card className="p-12 text-center">
                    <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Aucune recherche sauvegardée</h3>
                    <p className="text-muted-foreground mb-4">
                        Sauvegardez vos recherches pour recevoir des alertes par email
                    </p>
                    <Link href="/listings">
                        <Button>Parcourir les annonces</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {searches.map((search) => (
                        <Card key={search.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{search.name}</CardTitle>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formatCriteria(search.searchCriteria).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <item.icon className="w-4 h-4" />
                                                    <span>{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Créée le {new Date(search.createdAt).toLocaleDateString("fr-FR")}
                                            {search.lastAlertSent && (
                                                <span className="ml-2">
                                                    • Dernière alerte le {new Date(search.lastAlertSent).toLocaleDateString("fr-FR")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Badge variant={search.emailAlertsEnabled ? "default" : "secondary"}>
                                        {search.emailAlertsEnabled ? (
                                            <>
                                                <Bell className="w-3 h-3 mr-1" />
                                                Alertes actives
                                            </>
                                        ) : (
                                            <>
                                                <BellOff className="w-3 h-3 mr-1" />
                                                Alertes désactivées
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Link href={buildSearchUrl(search.searchCriteria)}>
                                            <Button variant="outline">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Voir les annonces
                                            </Button>
                                        </Link>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                Alertes email
                                            </span>
                                            <Switch
                                                checked={search.emailAlertsEnabled}
                                                onCheckedChange={() => handleToggleAlerts(search.id)}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setSearchToDelete(search.id)
                                            setDeleteDialogOpen(true)
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action supprimera définitivement cette recherche sauvegardée et ses alertes associées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}