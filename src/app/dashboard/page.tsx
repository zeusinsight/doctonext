"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RiFileList3Line,
  RiMessage3Line,
  RiAlarmWarningLine,
  RiSettings4Line,
  RiBarChartLine,
  RiTeamLine,
  RiArticleLine,
  RiShieldStarLine,
} from "@remixicon/react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const displayName = user?.name || "Thomas";

  // Fetch user role from the API
  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user) {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const userData = await response.json();
            setUserRole(userData.role || "user");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("user");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [session]);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const isAdmin = userRole === "admin";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Section */}
          <div className="mb-6">
            {/* User Profile Card */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/dashboard/settings" className="relative group">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={user?.image || undefined}
                        alt={displayName}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 group-hover:scale-110 transition-transform">
                      <span className="text-sm">+</span>
                    </button>
                  </Link>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {displayName}
                    </h2>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    router.push("/dashboard/settings");
                  }}
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Modifier
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Annonces Card */}
            <Link href="/dashboard/annonces">
              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <RiFileList3Line className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                        Annonces
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Gérer mes annonces déposées
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Messages Card */}
            <Link href="/dashboard/messages">
              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <RiMessage3Line className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                        Messages
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Gérer mes conversations
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Alertes Card */}
            <Link href="/dashboard/saved-searches">
              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <RiAlarmWarningLine className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                        Alertes
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Gérer mes recherches alertes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Paramètres Card (Bottom Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              onClick={() => router.push("/dashboard/settings")}
              className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <CardContent className="p-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <RiSettings4Line className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                      Paramètres
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Compléter et modifier vos informations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Panel Cards - Only show if user is admin */}
          {isAdmin && (
            <>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  Administration
                </h2>
              </div>

              {/* Admin Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Admin Stats Card */}
                <Link href="/dashboard/admin/stats">
                  <Card className="p-6 bg-white border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                          <RiBarChartLine className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                            Statistiques
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Voir les stats du site
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Admin Users Card */}
                <Link href="/dashboard/admin/users">
                  <Card className="p-6 bg-white border border-red-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                          <RiTeamLine className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                            Utilisateurs
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Gérer les utilisateurs
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Admin Listings Card */}
                <Link href="/dashboard/admin/annonces">
                  <Card className="p-6 bg-white border border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <RiFileList3Line className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                            Annonces Admin
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Modérer les annonces
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Admin Blog Card */}
                <Link href="/dashboard/blog">
                  <Card className="p-6 bg-white border border-teal-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <RiArticleLine className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                            Blog
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Gérer les articles
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </>
          )}

          {/* Logout Button */}
          <div className="flex mt-8">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              Me déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
