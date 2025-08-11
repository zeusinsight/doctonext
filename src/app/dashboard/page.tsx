"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RiFileList3Line,
  RiExchangeFundsLine,
  RiAlarmWarningLine,
  RiSettings4Line,
} from "@remixicon/react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const displayName = user?.name || "Thomas";

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

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
            <Link href="/dashboard/listings">
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

            {/* Transactions Card */}
            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <RiExchangeFundsLine className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                      Transactions
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Suivre mes achats et ventes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alertes Card */}
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
                    <p className="text-gray-600 text-sm">Gérer vos alertes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

          {/* Logout Button */}
          <div className="flex mt-8">
            <button
              onClick={handleLogout}
              className="text-white underline hover:text-red-600 transition-colors duration-200 text-sm"
            >
              Me déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
