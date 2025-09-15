"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map, MapPin, TrendingUp, Users, ArrowRight } from "lucide-react"
import type { MapListing } from "@/components/map/listing-markers"
import type { MedicalProfession } from "@/lib/services/town-density-types"

// Dynamic imports to prevent SSR issues
const InteractiveMap = dynamic(
    () =>
        import("@/components/map/interactive-map").then(
            (mod) => mod.InteractiveMap
        ),
    { ssr: false, loading: () => <MapSkeleton /> }
)

const ListingMarkers = dynamic(
    () =>
        import("@/components/map/listing-markers").then(
            (mod) => mod.ListingMarkers
        ),
    { ssr: false }
)

const ViewportOptimizedTownOverlay = dynamic(
    () =>
        import("@/components/map/viewport-optimized-town-overlay").then(
            (mod) => mod.ViewportOptimizedTownOverlay
        ),
    { ssr: false }
)

// Loading skeleton for the map
function MapSkeleton() {
    return (
        <div className="flex h-[400px] items-center justify-center rounded-lg bg-gray-100">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                    <Map className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Chargement de la carte...</p>
            </div>
        </div>
    )
}

export function MapShowcaseSection() {
    const [sampleListings, setSampleListings] = useState<MapListing[]>([])
    const [selectedProfession] = useState<MedicalProfession>(
        "chirurgiens-dentistes"
    )
    const [loading, setLoading] = useState(true)

    // Town density is now handled directly by the TownDensityOverlay component

    // Load a few sample listings for demo
    useEffect(() => {
        const loadSampleData = async () => {
            try {
                const response = await fetch("/api/map/listings?limit=20")
                if (response.ok) {
                    const result = await response.json()
                    if (result.success && result.data.listings.length > 0) {
                        setSampleListings(result.data.listings.slice(0, 10)) // Show max 10 for demo
                    } else {
                        // Fallback to sample data if no listings available
                        console.log(
                            "No listings with coordinates found, using demo data"
                        )
                        setSampleListings([
                            {
                                id: "demo-1",
                                title: "Cabinet médical centre-ville Paris",
                                listingType: "transfer",
                                specialty: "Médecin généraliste",
                                location: {
                                    latitude: 48.8566,
                                    longitude: 2.3522,
                                    city: "Paris",
                                    region: "Île-de-France"
                                },
                                salePrice: 150000,
                                viewsCount: 45,
                                isBoostPlus: true,
                                createdAt: new Date()
                            },
                            {
                                id: "demo-2",
                                title: "Remplacement cabinet dentaire Lyon",
                                listingType: "replacement",
                                specialty: "Dentiste",
                                location: {
                                    latitude: 45.764,
                                    longitude: 4.8357,
                                    city: "Lyon",
                                    region: "Auvergne-Rhône-Alpes"
                                },
                                dailyRate: 800,
                                viewsCount: 23,
                                isBoostPlus: false,
                                createdAt: new Date()
                            },
                            {
                                id: "demo-3",
                                title: "Association cabinet kinésithérapie Marseille",
                                listingType: "collaboration",
                                specialty: "Kinésithérapeute",
                                location: {
                                    latitude: 43.2965,
                                    longitude: 5.3698,
                                    city: "Marseille",
                                    region: "Provence-Alpes-Côte d'Azur"
                                },
                                viewsCount: 67,
                                isBoostPlus: false,
                                createdAt: new Date()
                            }
                        ])
                    }
                }

                // Town density data is now loaded by the TownDensityOverlay component
            } catch (error) {
                console.error("Error loading sample listings:", error)
                // Use fallback data on error
                setSampleListings([])
            } finally {
                setLoading(false)
            }
        }

        loadSampleData()
    }, [])

    const stats = [
        {
            icon: MapPin,
            label: "Communes analysées",
            value: "35,000+",
            description: "Toute la France"
        },
        {
            icon: TrendingUp,
            label: "Zones sous-dotées",
            value: "70%",
            description: "Opportunités chirurgiens-dentistes"
        },
        {
            icon: Users,
            label: "Professions médicales",
            value: "5",
            description: "Données ARS officielles"
        }
    ]

    return (
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <Badge variant="outline" className="mb-4">
                        <Map className="mr-2 h-4 w-4" />
                        Nouvelle fonctionnalité
                    </Badge>
                    <h2 className="mb-4 font-bold text-3xl">
                        Explorez la carte interactive
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Explorez la densité médicale par commune avec les
                        données officielles ARS. Identifiez les opportunités
                        d'installation pour chaque profession médicale.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Map Preview */}
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                {loading ? (
                                    <MapSkeleton />
                                ) : (
                                    <div className="relative">
                                        <InteractiveMap
                                            center={[46.603354, 1.888334]}
                                            zoom={6}
                                            height="400px"
                                            className="border-0"
                                        >
                                            <ViewportOptimizedTownOverlay
                                                profession={selectedProfession}
                                                opacity={0.6}
                                                showLabels={false}
                                                onTownClick={(town) => {
                                                    console.log(
                                                        "Town clicked:",
                                                        town.name
                                                    )
                                                }}
                                            />
                                            <ListingMarkers
                                                listings={sampleListings}
                                                onMarkerClick={(listing) => {
                                                    // Just show the popup, don't navigate anywhere
                                                    console.log(
                                                        "Listing clicked:",
                                                        listing.title
                                                    )
                                                }}
                                            />
                                        </InteractiveMap>

                                        {/* Overlay CTA */}
                                        <div className="absolute top-4 left-4 z-[1000]">
                                            <Link href="/map">
                                                <Button
                                                    size="sm"
                                                    className="shadow-lg"
                                                >
                                                    <ArrowRight className="mr-2 h-4 w-4" />
                                                    Voir en plein écran
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Sample marker count */}
                                        <div className="absolute right-4 bottom-4 z-[1000] space-y-2">
                                            {sampleListings.length > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-white/90 backdrop-blur-sm"
                                                >
                                                    {sampleListings.length}{" "}
                                                    annonces affichées
                                                </Badge>
                                            )}
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-100 text-green-800 backdrop-blur-sm"
                                            >
                                                Densité par commune •{" "}
                                                {selectedProfession}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats & Features */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="space-y-4">
                            {stats.map((stat, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2">
                                            <stat.icon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-lg">
                                                {stat.value}
                                            </div>
                                            <div className="font-medium text-sm">
                                                {stat.label}
                                            </div>
                                            <div className="text-muted-foreground text-xs">
                                                {stat.description}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Features List */}
                        <Card className="p-6">
                            <h3 className="mb-4 font-semibold">
                                Fonctionnalités de la carte
                            </h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span>Cessions de cabinet</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span>Remplacements</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span>Collaborations</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
                                    <span>
                                        Zonage médical par commune (ARS)
                                    </span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                                    <span>Annonces premium</span>
                                </li>
                            </ul>
                        </Card>

                        {/* CTA */}
                        <div className="text-center">
                            <Link href="/map">
                                <Button size="lg" className="w-full">
                                    Explorer la carte complète
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <p className="mt-2 text-muted-foreground text-xs">
                                Filtrez par spécialité, région, type
                                d&apos;annonce
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground">
                        La carte est mise à jour en temps réel avec les
                        nouvelles annonces.{" "}
                        <Link
                            href="/listings"
                            className="text-blue-600 hover:underline"
                        >
                            Voir toutes les annonces
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
