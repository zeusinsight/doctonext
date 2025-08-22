"use client";

import { useEffect, useState } from "react";
import { requireAuth } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiSearchLine, RiUserLine, RiCheckLine, RiCloseLine, RiShieldStarLine, RiShieldLine, RiMoreLine, RiFileList3Line } from "@remixicon/react";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { RoleChangeDialog } from "@/components/admin/role-change-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { ShareIcon } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isVerifiedProfessional: boolean;
  role: string;
  listingsCount: number;
}

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
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

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    user: User | null;
    targetRole: string;
  }>({ isOpen: false, user: null, targetRole: "" });
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);

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
        setCurrentUserId(userData.id);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      redirect("/dashboard");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search,
        sortBy,
        sortOrder,
        ...(verificationFilter !== "all" && { verified: verificationFilter }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data: UsersResponse = await response.json();
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchUsers();
    }
  }, [session, currentPage, search, verificationFilter, sortBy, sortOrder]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const handleRoleChange = (user: User, targetRole: string) => {
    setDialogState({ isOpen: true, user, targetRole });
  };

  const confirmRoleChange = async () => {
    if (!dialogState.user) return;

    setRoleUpdateLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${dialogState.user.id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: dialogState.targetRole }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchUsers();
        setDialogState({ isOpen: false, user: null, targetRole: "" });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du rôle");
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Gestion des utilisateurs</h1>
        <p className="text-blue-100">Administrer tous les comptes utilisateurs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RiUserLine className="w-5 h-5" />
            Utilisateurs ({pagination?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Vérification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="true">Vérifiés</SelectItem>
                <SelectItem value="false">Non vérifiés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date</SelectItem>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="email">Email</SelectItem>
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
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Nom</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Annonces</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Inscription</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Professionnel</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Rôle</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-gray-600">{user.email}</div>
                        </td>
                        <td className="py-3 px-2">
                          {user.listingsCount > 0 ? (
                            <Link href={`/dashboard/admin/listings?userId=${user.id}`}>
                              <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">
                                {user.listingsCount}
                                <ShareIcon   className="w-4 h-4 ml-2" />
                              </Badge>
                            </Link>
                          ) : (
                            <Badge variant="outline">{user.listingsCount}</Badge>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-gray-600">{formatDate(user.createdAt)}</div>
                        </td>
                        <td className="py-3 px-2">
                          {user.isVerifiedProfessional ? (
                            <Badge className="bg-green-100 text-green-800">
                              <RiCheckLine className="w-3 h-3 mr-1" />
                              Vérifié
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600">
                              <RiCloseLine className="w-3 h-3 mr-1" />
                              Non vérifié
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <Badge 
                            variant={user.role === "admin" ? "destructive" : "secondary"}
                            className={user.role === "admin" ? "bg-red-100 text-red-800" : ""}
                          >
                            {user.role === "admin" ? "Admin" : "Utilisateur"}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          {user.id !== currentUserId && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <RiMoreLine className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {user.listingsCount > 0 && (
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/admin/listings?userId=${user.id}`} className="cursor-pointer">
                                      <RiFileList3Line className="w-4 h-4 mr-2" />
                                      Voir annonces ({user.listingsCount})
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                                {user.role === "admin" ? (
                                  <DropdownMenuItem
                                    onClick={() => handleRoleChange(user, "user")}
                                    className="text-orange-600"
                                  >
                                    <RiShieldLine className="w-4 h-4 mr-2" />
                                    Retirer admin
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleRoleChange(user, "admin")}
                                    className="text-blue-600"
                                  >
                                    <RiShieldStarLine className="w-4 h-4 mr-2" />
                                    Promouvoir admin
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Page {pagination.page} sur {pagination.totalPages} ({pagination.total} utilisateurs)
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

      <RoleChangeDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, user: null, targetRole: "" })}
        onConfirm={confirmRoleChange}
        userName={dialogState.user?.name || ""}
        userEmail={dialogState.user?.email || ""}
        currentRole={dialogState.user?.role || ""}
        targetRole={dialogState.targetRole}
        loading={roleUpdateLoading}
      />
    </div>
  );
}