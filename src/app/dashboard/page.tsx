"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    RiFileList3Line,
    RiMessage3Line,
    RiAlarmWarningLine,
    RiSettings4Line,
    RiBarChartLine,
    RiTeamLine,
    RiArticleLine
} from "@remixicon/react"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
    const { data: session } = authClient.useSession()
    const user = session?.user
    const router = useRouter()
    const [userRole, setUserRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const displayName = user?.name || "Thomas"

    // Fetch user role from the API
    useEffect(() => {
        const fetchUserRole = async () => {
            if (session?.user) {
                try {
                    const response = await fetch("/api/user/profile")
                    if (response.ok) {
                        const userData = await response.json()
                        setUserRole(userData.role || "user")
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error)
                    setUserRole("user")
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        fetchUserRole()
    }, [session])

    const handleLogout = async () => {
        await authClient.signOut()
        window.location.href = "/"
    }

    const isAdmin = userRole === "admin"

    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="container relative z-10 mx-auto px-4 py-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Top Section */}
                    <div className="mb-6">
                        {/* User Profile Card */}
                        <Card className="border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                            <CardContent className="flex items-center justify-between p-0">
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/dashboard/settings"
                                        className="group relative"
                                    >
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage
                                                src={user?.image || undefined}
                                                alt={displayName}
                                            />
                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                                                {displayName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <button className="-bottom-1 -right-1 absolute flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-600 transition-transform hover:bg-gray-50 group-hover:scale-110">
                                            <span className="text-sm">+</span>
                                        </button>
                                    </Link>
                                    <div>
                                        <h2 className="font-semibold text-2xl text-gray-900">
                                            {displayName}
                                        </h2>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => {
                                        router.push("/dashboard/settings")
                                    }}
                                    variant="outline"
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                >
                                    Modifier
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Annonces Card */}
                        <Link href="/dashboard/annonces">
                            <Card className="hover:-translate-y-1 cursor-pointer border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                                <CardContent className="p-0">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                                            <RiFileList3Line className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-gray-900 text-lg">
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
                            <Card className="hover:-translate-y-1 cursor-pointer border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                                <CardContent className="p-0">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                                            <RiMessage3Line className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-gray-900 text-lg">
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
                            <Card className="hover:-translate-y-1 cursor-pointer border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                                <CardContent className="p-0">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                                            <RiAlarmWarningLine className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-semibold text-gray-900 text-lg">
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
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card
                            onClick={() => router.push("/dashboard/settings")}
                            className="hover:-translate-y-1 cursor-pointer border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                            <CardContent className="p-0">
                                <div className="flex items-center space-x-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                                        <RiSettings4Line className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-gray-900 text-lg">
                                            Paramètres
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Compléter et modifier vos
                                            informations
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
                                <h2 className="mb-4 flex items-center gap-2 font-semibold text-white text-xl">
                                    Administration
                                </h2>
                            </div>

                            {/* Admin Cards */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {/* Admin Stats Card */}
                                <Link href="/dashboard/admin/stats">
                                    <Card className="hover:-translate-y-1 cursor-pointer border border-yellow-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                                        <CardContent className="p-0">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600">
                                                    <RiBarChartLine className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="mb-1 font-semibold text-gray-900 text-lg">
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
                                    <Card className="hover:-translate-y-1 cursor-pointer border border-red-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                                        <CardContent className="p-0">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600">
                                                    <RiTeamLine className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="mb-1 font-semibold text-gray-900 text-lg">
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
                                    <Card className="hover:-translate-y-1 cursor-pointer border border-indigo-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                                        <CardContent className="p-0">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
                                                    <RiFileList3Line className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="mb-1 font-semibold text-gray-900 text-lg">
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
                                    <Card className="hover:-translate-y-1 cursor-pointer border border-teal-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                                        <CardContent className="p-0">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600">
                                                    <RiArticleLine className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="mb-1 font-semibold text-gray-900 text-lg">
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
                    <div className="mt-8 flex">
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                        >
                            Me déconnecter
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
