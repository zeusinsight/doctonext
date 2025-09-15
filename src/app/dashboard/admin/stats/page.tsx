"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    RiUserLine,
    RiFileList3Line,
    RiMessage3Line,
    RiBarChart2Line,
    RiArrowUpLine,
    RiArrowDownLine,
    RiEyeLine,
    RiHeartLine,
    RiBookmarkLine,
    RiNotification3Line,
    RiArticleLine,
    RiRefreshLine
} from "@remixicon/react"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { toast } from "sonner"

interface StatsSummary {
    totalUsers: number
    newUsers: number
    userGrowthPercentage: number
    verifiedProfessionals: number
    adminUsers: number
    totalListings: number
    activeListings: number
    newListings: number
    listingGrowthPercentage: number
    boostPlusListings: number
    totalViews: number
    totalContacts: number
    totalMessages: number
    newMessages: number
    totalConversations: number
    totalFavorites: number
    totalSavedSearches: number
    alertsSent: number
    publishedArticles: number
    draftArticles: number
    activeSubscriptions: number
}

interface StatsResponse {
    success: boolean
    data: {
        summary: StatsSummary
        charts: {
            listingsByType: { type: string; count: number }[]
            listingsByStatus: { status: string; count: number }[]
            topRegions: { region: string; count: number }[]
            userGrowth: { month: string; count: number }[]
        }
        recentActivity: {
            id: string
            title: string
            type: string
            status: string
            views: number
            createdAt: string
            userName: string
            userEmail: string
        }[]
        period: number
    }
}

export default function AdminStatsPage() {
    const { data: session } = authClient.useSession()
    const [stats, setStats] = useState<StatsResponse["data"] | null>(null)
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState("30")

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

    const fetchStats = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/stats?period=${period}`)
            if (response.ok) {
                const data: StatsResponse = await response.json()
                setStats(data.data)
            } else {
                toast.error("Erreur lors du chargement des statistiques")
            }
        } catch (error) {
            console.error("Error fetching stats:", error)
            toast.error("Erreur lors du chargement des statistiques")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session?.user) {
            fetchStats()
        }
    }, [session, period])

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("fr-FR").format(num)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR")
    }

    const getGrowthIndicator = (percentage: number) => {
        if (percentage > 0) {
            return (
                <div className="flex items-center text-green-600">
                    <RiArrowUpLine className="mr-1 h-4 w-4" />
                    <span className="text-sm">+{percentage.toFixed(1)}%</span>
                </div>
            )
        } else if (percentage < 0) {
            return (
                <div className="flex items-center text-red-600">
                    <RiArrowDownLine className="mr-1 h-4 w-4" />
                    <span className="text-sm">{percentage.toFixed(1)}%</span>
                </div>
            )
        }
        return (
            <div className="flex items-center text-gray-500">
                <span className="text-sm">0%</span>
            </div>
        )
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="mb-2 font-bold text-3xl text-white">
                        Statistiques
                    </h1>
                    <p className="text-blue-100">
                        Tableau de bord analytique de la plateforme
                    </p>
                </div>
                <div className="flex gap-3">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[140px] bg-white">
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">7 jours</SelectItem>
                            <SelectItem value="30">30 jours</SelectItem>
                            <SelectItem value="90">3 mois</SelectItem>
                            <SelectItem value="365">1 an</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={fetchStats}
                        variant="outline"
                        size="sm"
                        className="bg-white"
                    >
                        <RiRefreshLine className="mr-2 h-4 w-4" />
                        Actualiser
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="py-16 text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-white border-b-2" />
                    <p className="mt-4 text-blue-100">
                        Chargement des statistiques...
                    </p>
                </div>
            ) : stats ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-600 text-sm">
                                            Utilisateurs
                                        </p>
                                        <p className="font-bold text-2xl">
                                            {formatNumber(
                                                stats.summary.totalUsers
                                            )}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            +{stats.summary.newUsers} nouveaux
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <RiUserLine className="h-8 w-8 text-blue-500" />
                                        {getGrowthIndicator(
                                            stats.summary.userGrowthPercentage
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-600 text-sm">
                                            Annonces
                                        </p>
                                        <p className="font-bold text-2xl">
                                            {formatNumber(
                                                stats.summary.totalListings
                                            )}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {stats.summary.activeListings}{" "}
                                            actives
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <RiFileList3Line className="h-8 w-8 text-green-500" />
                                        {getGrowthIndicator(
                                            stats.summary
                                                .listingGrowthPercentage
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-600 text-sm">
                                            Messages
                                        </p>
                                        <p className="font-bold text-2xl">
                                            {formatNumber(
                                                stats.summary.totalMessages
                                            )}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {stats.summary.totalConversations}{" "}
                                            conversations
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <RiMessage3Line className="h-8 w-8 text-purple-500" />
                                        <div className="text-gray-500 text-xs">
                                            +{stats.summary.newMessages}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-600 text-sm">
                                            Vues totales
                                        </p>
                                        <p className="font-bold text-2xl">
                                            {formatNumber(
                                                stats.summary.totalViews
                                            )}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {stats.summary.totalContacts}{" "}
                                            contacts
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <RiEyeLine className="h-8 w-8 text-orange-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts and Data */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Listings by Type */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Annonces par type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stats.charts.listingsByType.map((item) => (
                                        <div
                                            key={item.type}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="capitalize">
                                                {getTypeBadge(item.type)}
                                            </span>
                                            <span className="font-semibold">
                                                {formatNumber(item.count)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Regions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Régions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {stats.charts.topRegions.map(
                                        (region, index) => (
                                            <div
                                                key={region.region}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-600 text-sm">
                                                        #{index + 1}
                                                    </span>
                                                    <span>{region.region}</span>
                                                </div>
                                                <span className="font-semibold">
                                                    {formatNumber(region.count)}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                        <Card className="text-center">
                            <CardContent className="p-4">
                                <RiUserLine className="mx-auto mb-2 h-6 w-6 text-green-500" />
                                <p className="text-gray-600 text-sm">
                                    Professionnels
                                </p>
                                <p className="font-bold text-lg">
                                    {stats.summary.verifiedProfessionals}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-4">
                                <RiHeartLine className="mx-auto mb-2 h-6 w-6 text-red-500" />
                                <p className="text-gray-600 text-sm">Favoris</p>
                                <p className="font-bold text-lg">
                                    {formatNumber(stats.summary.totalFavorites)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-4">
                                <RiBookmarkLine className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                                <p className="text-gray-600 text-sm">Alertes</p>
                                <p className="font-bold text-lg">
                                    {stats.summary.totalSavedSearches}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-4">
                                <RiNotification3Line className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
                                <p className="text-gray-600 text-sm">
                                    Notifications
                                </p>
                                <p className="font-bold text-lg">
                                    {stats.summary.alertsSent}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-4">
                                <RiArticleLine className="mx-auto mb-2 h-6 w-6 text-purple-500" />
                                <p className="text-gray-600 text-sm">
                                    Articles
                                </p>
                                <p className="font-bold text-lg">
                                    {stats.summary.publishedArticles}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="p-4">
                                <RiBarChart2Line className="mx-auto mb-2 h-6 w-6 text-indigo-500" />
                                <p className="text-gray-600 text-sm">Boost+</p>
                                <p className="font-bold text-lg">
                                    {stats.summary.boostPlusListings}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Activité récente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 text-left font-medium text-gray-700">
                                                Annonce
                                            </th>
                                            <th className="py-2 text-left font-medium text-gray-700">
                                                Type
                                            </th>
                                            <th className="py-2 text-left font-medium text-gray-700">
                                                Statut
                                            </th>
                                            <th className="py-2 text-left font-medium text-gray-700">
                                                Utilisateur
                                            </th>
                                            <th className="py-2 text-left font-medium text-gray-700">
                                                Vues
                                            </th>
                                            <th className="py-2 text-left font-medium text-gray-700">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentActivity.map(
                                            (activity) => (
                                                <tr
                                                    key={activity.id}
                                                    className="border-b hover:bg-gray-50"
                                                >
                                                    <td className="py-2">
                                                        <div className="font-medium text-sm">
                                                            {activity.title}
                                                        </div>
                                                    </td>
                                                    <td className="py-2">
                                                        {getTypeBadge(
                                                            activity.type
                                                        )}
                                                    </td>
                                                    <td className="py-2">
                                                        {getStatusBadge(
                                                            activity.status
                                                        )}
                                                    </td>
                                                    <td className="py-2">
                                                        <div className="text-sm">
                                                            <div>
                                                                {
                                                                    activity.userName
                                                                }
                                                            </div>
                                                            <div className="text-gray-500 text-xs">
                                                                {
                                                                    activity.userEmail
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-2">
                                                        {activity.views}
                                                    </td>
                                                    <td className="py-2 text-gray-600 text-sm">
                                                        {formatDate(
                                                            activity.createdAt
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <div className="py-16 text-center">
                    <p className="text-blue-100">
                        Impossible de charger les statistiques
                    </p>
                </div>
            )}
        </div>
    )
}
