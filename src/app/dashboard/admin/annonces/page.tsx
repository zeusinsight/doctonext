"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RiSearchLine, RiFileList3Line, RiEyeLine, RiDeleteBin7Line, RiMoreLine, RiExternalLinkLine } from "@remixicon/react"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { DeleteListingDialog } from "@/components/admin/delete-listing-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import Link from "next/link"

interface AdminListing {
  id: string;
  title: string;
  description: string;
  listingType: string;
  specialty: string;
  status: string;
  viewsCount: number;
  contactsCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  expiresAt: string | null;
  isBoostPlus: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  city: string | null;
  region: string | null;
}

interface ListingsResponse {
  success: boolean;
  data: {
    listings: AdminListing[];
    userInfo?: { name: string; email: string };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export default function AdminListingsPage() {
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    listing: AdminListing | null;
  }>({ isOpen: false, listing: null });

  const userId = searchParams.get("userId");

  useEffect(() => {
    if (session?.user) {
      fetchUserRole();
    }
  }, [session]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const userData = await response.json();
        if (userData.role !== "admin") {
          redirect("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      redirect("/dashboard");
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search,
        sortBy,
        sortOrder,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "all" && { listingType: typeFilter }),
        ...(userId && { userId }),
      });

      const response = await fetch(`/api/admin/listings?${params}`);
      if (response.ok) {
        const data: ListingsResponse = await response.json();
        setListings(data.data.listings);
        setPagination(data.data.pagination);
        setUserInfo(data.data.userInfo || null);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchListings();
    }
  }, [session, currentPage, search, statusFilter, typeFilter, sortBy, sortOrder, userId]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDeleteListing = (listing: AdminListing) => {
    setDialogState({ isOpen: true, listing });
  };

  const confirmDelete = async () => {
    if (!dialogState.listing) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/listings/${dialogState.listing.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchListings();
        setDialogState({ isOpen: false, listing: null });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'annonce");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "Actif", className: "bg-green-100 text-green-800" },
      inactive: { label: "Inactif", className: "bg-gray-100 text-gray-800" },
      sold: { label: "Vendu", className: "bg-blue-100 text-blue-800" },
      expired: { label: "Expiré", className: "bg-red-100 text-red-800" },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.inactive;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      transfer: "Cession",
      replacement: "Remplacement",
      collaboration: "Collaboration",
    };
    return <Badge variant="outline">{typeMap[type as keyof typeof typeMap] || type}</Badge>;
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Gestion des annonces
          {userInfo && (
            <span className="text-blue-100 text-xl ml-2">
              - {userInfo.name} ({userInfo.email})
            </span>
          )}
        </h1>
        <p className="text-blue-100">
          {userId ? "Annonces de cet utilisateur" : "Administrer toutes les annonces"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RiFileList3Line className="w-5 h-5" />
            Annonces ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par titre, description, utilisateur..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="sold">Vendu</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="transfer">Cession</SelectItem>
                <SelectItem value="replacement">Remplacement</SelectItem>
                <SelectItem value="collaboration">Collaboration</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date</SelectItem>
                <SelectItem value="title">Titre</SelectItem>
                <SelectItem value="userName">Utilisateur</SelectItem>
                <SelectItem value="viewsCount">Vues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Titre</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Utilisateur</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Statut</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Vues</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Créé le</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr key={listing.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="font-medium text-gray-900">
                            {listing.title}
                            {listing.isBoostPlus && (
                              <Badge className="ml-2 bg-yellow-100 text-yellow-800">Boost+</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {listing.description}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {getTypeBadge(listing.listingType)}
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-sm">
                            <div className="font-medium">{listing.userName}</div>
                            <div className="text-gray-500">{listing.userEmail}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(listing.status)}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <RiEyeLine className="w-4 h-4 text-gray-400" />
                            <span>{listing.viewsCount}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-gray-600">{formatDate(listing.createdAt)}</div>
                        </td>
                        <td className="py-3 px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <RiMoreLine className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/annonces/${listing.id}`} target="_blank" className="cursor-pointer">
                                  <RiExternalLinkLine className="w-4 h-4 mr-2" />
                                  Voir l'annonce
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteListing(listing)}
                                className="text-red-600"
                              >
                                <RiDeleteBin7Line className="w-4 h-4 mr-2" />
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
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Page {pagination.page} sur {pagination.totalPages} ({pagination.total} annonces)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
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
  );
}