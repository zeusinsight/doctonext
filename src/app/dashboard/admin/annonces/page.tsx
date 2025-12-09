"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    RiSearchLine,
    RiFileList3Line,
    RiEyeLine,
    RiDeleteBin7Line,
    RiMoreLine,
    RiExternalLinkLine,
    RiAddLine,
    RiMailLine,
    RiCheckLine
} from "@remixicon/react"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { DeleteListingDialog } from "@/components/admin/delete-listing-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import Link from "next/link"

interface AdminListing {
    id: string
    title: string
    description: string
    listingType: string
    specialty: string
    status: string
    viewsCount: number
    contactsCount: number
    createdAt: string
    updatedAt: string
    publishedAt: string
    expiresAt: string | null
    isBoostPlus: boolean
    userId: string | null
    userName: string | null
    userEmail: string | null
    city: string | null
    region: string | null
    // Admin assignment fields
    assignedEmail: string | null
    createdByAdmin: boolean
}

interface ListingsResponse {
    success: boolean
    data: {
        listings: AdminListing[]
        userInfo?: { name: string; email: string }
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
            hasNext: boolean
            hasPrev: boolean
        }
    }
}

export default function AdminListingsPage() {
    const { data: session } = authClient.useSession()
    const searchParams = useSearchParams()
    const [listings, setListings] = useState<AdminListing[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortOrder, setSortOrder] = useState("desc")
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState<any>(null)
    const [userInfo, setUserInfo] = useState<{
        name: string
        email: string
    } | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean
        listing: AdminListing | null
    }>({ isOpen: false, listing: null })

    const userId = searchParams.get("userId")

    useEffect(() => {
        if (session?.user) {
            fetchUserRole()
        }
    }, [session])

    const fetchUserRole = async () => {
        try {
            const response = await fetch("/api/user/profile")
            if (response.ok) {
                const userData = await response.json()
                if (userData.role !== "admin") {
                    redirect("/dashboard")
                }
            }
        } catch (error) {
            console.error("Error checking user role:", error)
            redirect("/dashboard")
        }
    }

    const fetchListings = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                search,
                sortBy,
                sortOrder,
                ...(statusFilter !== "all" && { status: statusFilter }),
                ...(typeFilter !== "all" && { listingType: typeFilter }),
                ...(userId && { userId })
            })

            const response = await fetch(`/api/admin/listings?${params}`)
            if (response.ok) {
                const data: ListingsResponse = await response.json()
                setListings(data.data.listings)
                setPagination(data.data.pagination)
                setUserInfo(data.data.userInfo || null)
            }
        } catch (error) {
            console.error("Error fetching listings:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session?.user) {
            fetchListings()
        }
    }, [
        session,
        currentPage,
        search,
        statusFilter,
        typeFilter,
        sortBy,
        sortOrder,
        userId
    ])

    const handleSearchChange = (value: string) => {
        setSearch(value)
        setCurrentPage(1)
    }

    const handleDeleteListing = (listing: AdminListing) => {
        setDialogState({ isOpen: true, listing })
    }

    const confirmDelete = async () => {
        if (!dialogState.listing) return

        setDeleteLoading(true)
        try {
            const response = await fetch(
                `/api/admin/listings/${dialogState.listing.id}`,
                {
                    method: "DELETE"
                }
            )

            const result = await response.json()

            if (result.success) {
                toast.success(result.message)
                fetchListings()
                setDialogState({ isOpen: false, listing: null })
            } else {
                toast.error(result.error)
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression de l'annonce")
        } finally {
            setDeleteLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR")
    }

    const getStatusBadge = (status: string) => {
        const statusMap = {
            active: {
                label: "Actif",
                className: "bg-green-100 text-green-800"
            },
            inactive: {
                label: "Inactif",
                className: "bg-gray-100 text-gray-800"
            },
            sold: { label: "Vendu", className: "bg-blue-100 text-blue-800" },
            expired: { label: "Expiré", className: "bg-red-100 text-red-800" }
        }
        const config =
            statusMap[status as keyof typeof statusMap] || statusMap.inactive
        return <Badge className={config.className}>{config.label}</Badge>
    }

    const getTypeBadge = (type: string) => {
        const typeMap = {
            transfer: "Cession",
            replacement: "Remplacement",
            collaboration: "Collaboration"
        }
        return (
            <Badge variant="outline">
                {typeMap[type as keyof typeof typeMap] || type}
            </Badge>
        )
    }

    if (!session?.user) {
        return null
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="mb-2 font-bold text-3xl text-white">
                        Gestion des annonces
                        {userInfo && (
                            <span className="ml-2 text-blue-100 text-xl">
                                - {userInfo.name} ({userInfo.email})
                            </span>
                        )}
                    </h1>
                    <p className="text-blue-100">
                        {userId
                            ? "Annonces de cet utilisateur"
                            : "Administrer toutes les annonces"}
                    </p>
                </div>
                <Button asChild className="bg-amber-500 hover:bg-amber-600">
                    <Link href="/dashboard/admin/annonces/new" className="flex items-center gap-2">
                        <RiAddLine className="h-4 w-4" />
                        Créer une annonce
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RiFileList3Line className="h-5 w-5" />
                        Annonces ({pagination?.total || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row">
                        <div className="relative flex-1">
                            <RiSearchLine className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
                            <Input
                                placeholder="Rechercher par titre, description, utilisateur..."
                                value={search}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="active">Actif</SelectItem>
                                <SelectItem value="inactive">
                                    Inactif
                                </SelectItem>
                                <SelectItem value="sold">Vendu</SelectItem>
                                <SelectItem value="expired">Expiré</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={typeFilter}
                            onValueChange={setTypeFilter}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="transfer">
                                    Cession
                                </SelectItem>
                                <SelectItem value="replacement">
                                    Remplacement
                                </SelectItem>
                                <SelectItem value="collaboration">
                                    Collaboration
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Trier par" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Date</SelectItem>
                                <SelectItem value="title">Titre</SelectItem>
                                <SelectItem value="userName">
                                    Utilisateur
                                </SelectItem>
                                <SelectItem value="viewsCount">Vues</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {loading ? (
                        <div className="py-8 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
                            <p className="mt-2 text-gray-600">Chargement...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-2 py-3 text-left font-medium text-gray-700">
                                                Titre
                                            </th>
                                            <th className="px-2 py-3 text-left font-medium text-gray-700">
                                                Type
                                            </th>
                                            <th className="px-2 py-3 text-left font-medium text-gray-700">
                                                Utilisateur
                                            </th>
                                            <th className="px-2 py-3 text-left font-medium text-gray-700">
                                                Statut
                                            </th>
                                            <th className="px-2 py-3 text-left font-medium text-gray-700">
                                                Vues
                                            </th>
                                            <th className="px-2 py-3 text-left font-medium text-gray-700">
                                                Créé le
                                            </th>
                                            <th className="px-2 py-3 text-left font-medium text-gray-700">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listings.map((listing) => (
                                            <tr
                                                key={listing.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="px-2 py-3">
                                                    <div className="font-medium text-gray-900">
                                                        {listing.title}
                                                        {listing.isBoostPlus && (
                                                            <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                                                                Boost+
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="max-w-xs truncate text-gray-500 text-sm">
                                                        {listing.description}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    {getTypeBadge(
                                                        listing.listingType
                                                    )}
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="text-sm">
                                                        {listing.userId ? (
                                                            // User exists - show their info
                                                            <>
                                                                <div className="flex items-center gap-1 font-medium">
                                                                    {listing.userName}
                                                                    {listing.createdByAdmin && (
                                                                        <Badge className="ml-1 bg-green-100 text-green-800 text-xs">
                                                                            <RiCheckLine className="mr-1 h-3 w-3" />
                                                                            Réclamée
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="text-gray-500">
                                                                    {listing.userEmail}
                                                                </div>
                                                            </>
                                                        ) : listing.assignedEmail ? (
                                                            // No user but assigned email - pending claim
                                                            <>
                                                                <div className="flex items-center gap-1">
                                                                    <RiMailLine className="h-4 w-4 text-amber-500" />
                                                                    <Badge className="bg-amber-100 text-amber-800 text-xs">
                                                                        En attente
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-amber-600">
                                                                    {listing.assignedEmail}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            // No user and no assigned email - orphaned
                                                            <span className="text-gray-400 italic">
                                                                Non assignée
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    {getStatusBadge(
                                                        listing.status
                                                    )}
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <RiEyeLine className="h-4 w-4 text-gray-400" />
                                                        <span>
                                                            {listing.viewsCount}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <div className="text-gray-600">
                                                        {formatDate(
                                                            listing.createdAt
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <RiMoreLine className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={`/annonces/${listing.id}`}
                                                                    target="_blank"
                                                                    className="cursor-pointer"
                                                                >
                                                                    <RiExternalLinkLine className="mr-2 h-4 w-4" />
                                                                    Voir
                                                                    l'annonce
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDeleteListing(
                                                                        listing
                                                                    )
                                                                }
                                                                className="text-red-600"
                                                            >
                                                                <RiDeleteBin7Line className="mr-2 h-4 w-4" />
                                                                Supprimer
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {pagination && pagination.totalPages > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-gray-600 text-sm">
                                        Page {pagination.page} sur{" "}
                                        {pagination.totalPages} (
                                        {pagination.total} annonces)
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage(currentPage - 1)
                                            }
                                            disabled={!pagination.hasPrev}
                                        >
                                            Précédent
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage(currentPage + 1)
                                            }
                                            disabled={!pagination.hasNext}
                                        >
                                            Suivant
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <DeleteListingDialog
                isOpen={dialogState.isOpen}
                onClose={() => setDialogState({ isOpen: false, listing: null })}
                onConfirm={confirmDelete}
                listingTitle={dialogState.listing?.title || ""}
                listingId={dialogState.listing?.id || ""}
                userName={dialogState.listing?.userName || ""}
                loading={deleteLoading}
            />
        </div>
    )
}
