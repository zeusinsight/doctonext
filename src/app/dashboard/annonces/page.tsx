"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Plus,
    Eye,
    EyeOff,
    MessageCircle,
    Edit,
    Trash2,
    MoreHorizontal,
    Search,
    Check
} from "lucide-react"
import { getDefaultListingImage } from "@/lib/utils/default-images"
import Link from "next/link"
import Image from "next/image"
import type { UserListing } from "@/types/listing"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function ListingsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [listings, setListings] = useState<UserListing[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<
        "all" | "active" | "inactive" | "sold" | "expired"
    >("all")
    const [query, setQuery] = useState("")

    // Handle boost payment redirects from Stripe
    useEffect(() => {
        const boostSuccess = searchParams.get("boost_success")
        const sessionId = searchParams.get("session_id")
        const boostCancelled = searchParams.get("boost_cancelled")

        if (boostSuccess && sessionId) {
            toast.success(
                "Paiement effectué avec succès ! Votre annonce est maintenant mise en avant."
            )
            // Clean up URL parameters
            router.replace("/dashboard/annonces", { scroll: false })
        }

        if (boostCancelled) {
            toast.error(
                "Paiement annulé. Votre annonce n'a pas été publiée."
            )
            // Clean up URL parameters
            router.replace("/dashboard/annonces", { scroll: false })
        }
    }, [searchParams, router])

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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            })

            const data = await response.json()

            if (data.success) {
                toast.success("Statut mis à jour avec succès")
                // Update the specific listing in state instead of refetching all
                setListings((prev) =>
                    prev.map((listing) =>
                        listing.id === listingId
                            ? {
                                  ...listing,
                                  status: newStatus as
                                      | "active"
                                      | "inactive"
                                      | "sold"
                                      | "expired"
                              }
                            : listing
                    )
                )
            } else {
                toast.error(
                    data.error || "Erreur lors de la mise à jour du statut"
                )
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
                method: "DELETE"
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

        return (
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.inactive
        )
    }

    const getListingTypeBadge = (type: string) => {
        const typeConfig = {
            transfer: { label: "Cession", variant: "default" as const },
            replacement: {
                label: "Remplacement",
                variant: "secondary" as const
            },
            collaboration: {
                label: "Collaboration",
                variant: "outline" as const
            }
        }

        return (
            typeConfig[type as keyof typeof typeConfig] || typeConfig.transfer
        )
    }

    const filteredListings = listings
        .filter((l) =>
            statusFilter === "all" ? true : l.status === statusFilter
        )
        .filter((l) => {
            if (!query.trim()) return true
            const q = query.toLowerCase()
            return (
                l.title.toLowerCase().includes(q) ||
                (l.specialty?.toLowerCase() || "").includes(q) ||
                (l.listingType?.toLowerCase() || "").includes(q)
            )
        })

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="font-bold text-3xl text-white tracking-tight">
                            Mes Annonces
                        </h1>
                        <p className="text-white">
                            Gérez vos annonces de cession et de remplacement
                        </p>
                    </div>
                    <div className="flex w-full gap-2 md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                        </div>
                        <Button disabled>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle annonce
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-8 w-20 animate-pulse rounded-full bg-muted"
                        />
                    ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                            <div className="relative">
                                {/* Image skeleton */}
                                <div className="relative aspect-[16/10] w-full animate-pulse bg-muted" />
                                {/* Badge skeletons */}
                                <div className="absolute top-2 left-2 flex gap-2">
                                    <div className="h-5 w-20 animate-pulse rounded bg-muted-foreground/20" />
                                </div>
                                {/* Menu button skeleton */}
                                <div className="absolute top-2 right-2">
                                    <div className="h-8 w-8 animate-pulse rounded-full bg-muted-foreground/20" />
                                </div>
                            </div>
                            <div className="border-t" />
                            <CardContent className="space-y-3 p-4">
                                {/* Title and status */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 space-y-2">
                                        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                                        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                                    </div>
                                    <div className="h-5 w-16 shrink-0 animate-pulse rounded bg-muted" />
                                </div>
                                {/* Stats */}
                                <div className="grid grid-cols-3 items-center gap-3">
                                    <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                                    <div className="h-3 w-14 animate-pulse rounded bg-muted" />
                                    <div className="ml-auto h-3 w-16 animate-pulse rounded bg-muted" />
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="font-bold text-3xl text-white tracking-tight">
                        Mes Annonces
                    </h1>
                    <p className="text-white">
                        Gérez vos annonces de cession et de remplacement
                    </p>
                </div>
                <div className="flex w-full gap-2 md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher par titre, spécialité, type..."
                            className="w-full rounded-md border bg-background py-2 pr-3 pl-9 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/annonces/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle annonce
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {(
                    [
                        { key: "all", label: "Toutes" },
                        { key: "active", label: "Actives" },
                        { key: "inactive", label: "Inactives" },
                        { key: "sold", label: "Vendues" },
                        { key: "expired", label: "Expirées" }
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                            statusFilter === tab.key
                                ? "border-primary bg-primary text-white"
                                : "text-white hover:bg-muted"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
                <div className="ml-auto text-sm text-white">
                    {filteredListings.length} résultat(s)
                </div>
            </div>

            {listings.length === 0 ? (
                <Card>
                    <CardContent className="pt-8">
                        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <Plus className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg">
                                Aucune annonce
                            </h3>
                            <p className="max-w-md text-muted-foreground text-sm">
                                Créez votre première annonce pour commencer à
                                recevoir des vues et des contacts.
                            </p>
                            <Button asChild>
                                <Link href="/dashboard/annonces/new">
                                    Créer ma première annonce
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredListings.map((listing) => {
                        const statusBadge = getStatusBadge(listing.status)
                        const typeBadge = getListingTypeBadge(
                            listing.listingType
                        )
                        return (
                            <Card
                                key={listing.id}
                                className="group overflow-hidden border py-safe-offset-0 transition-shadow hover:shadow-md"
                            >
                                <div className="relative">
                                    <div className="relative m-0 aspect-[16/10] w-full bg-muted">
                                        <Image
                                            src={
                                                listing.firstImage?.fileUrl ||
                                                getDefaultListingImage(
                                                    listing.listingType as "transfer" | "replacement" | "collaboration",
                                                    listing.specialty
                                                )
                                            }
                                            alt={
                                                listing.firstImage?.fileName ||
                                                listing.title
                                            }
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 transition-opacity group-hover:opacity-60" />
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        <Badge variant={typeBadge.variant}>
                                            {typeBadge.label}
                                        </Badge>
                                        {listing.isBoostPlus && (
                                            <Badge
                                                variant="outline"
                                                className="border-amber-500/60 bg-amber-50 text-amber-600"
                                            >
                                                Boost+
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full bg-background/20 shadow-sm backdrop-blur hover:bg-background/30"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/annonces/${listing.id}`}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Voir
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/dashboard/annonces/${listing.id}/edit`}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Modifier
                                                    </Link>
                                                </DropdownMenuItem>
                                                {listing.status === "active" ? (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                listing.id,
                                                                "inactive"
                                                            )
                                                        }
                                                    >
                                                        <EyeOff className="mr-2 h-4 w-4" />
                                                        Désactiver
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                listing.id,
                                                                "active"
                                                            )
                                                        }
                                                    >
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Activer
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        handleDelete(listing.id)
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <div className="border-t" />
                                <CardContent className="space-y-3 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-h-[3.25rem] min-w-0">
                                            <h3 className="truncate font-semibold text-base leading-snug">
                                                {listing.title}
                                            </h3>
                                            <p className="truncate text-muted-foreground text-sm">
                                                {listing.specialty ||
                                                    "Spécialité non précisée"}
                                            </p>
                                        </div>
                                        <Badge
                                            className="shrink-0 self-start"
                                            variant={statusBadge.variant}
                                        >
                                            {statusBadge.label}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-3 text-muted-foreground text-xs">
                                        <div className="flex items-center gap-1 leading-none">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>{listing.viewsCount}</span>
                                            <span>vues</span>
                                        </div>
                                        <div className="flex items-center gap-1 leading-none">
                                            <MessageCircle className="h-3.5 w-3.5" />
                                            <span>{listing.contactsCount}</span>
                                            <span>contacts</span>
                                        </div>
                                        <div className="text-right leading-none">
                                            Créé le{" "}
                                            {new Date(
                                                listing.createdAt
                                            ).toLocaleDateString()}
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
