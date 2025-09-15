"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ExternalLink, Eye } from "lucide-react"
import Link from "next/link"
import type { MapListing } from "@/components/map/listing-markers"

// Dynamic imports to prevent SSR issues
const InteractiveMap = dynamic(
    () =>
        import("@/components/map/interactive-map").then(
            (mod) => mod.InteractiveMap
        ),
    { ssr: false }
)

const ListingMarkers = dynamic(
    () =>
        import("@/components/map/listing-markers").then(
            (mod) => mod.ListingMarkers
        ),
    { ssr: false }
)

interface MapWidgetProps {
    listingId: string
    location: {
        latitude: number
        longitude: number
        city: string
        region: string
        address?: string
    }
    listingType: "transfer" | "replacement" | "collaboration"
    title: string
    showNearbyListings?: boolean
    height?: string
    className?: string
}

export function MapWidget({
    listingId,
    location,
    listingType,
    title,
    showNearbyListings = true,
    height = "300px",
    className
}: MapWidgetProps) {
    const [nearbyListings, setNearbyListings] = useState<MapListing[]>([])
    const [loading, setLoading] = useState(false)

    // Create the main listing marker data
    const mainListing: MapListing = {
        id: listingId,
        title,
        listingType,
        location,
        viewsCount: 0,
        isBoostPlus: false,
        createdAt: new Date()
    }

    // Load nearby listings
    useEffect(() => {
        if (showNearbyListings) {
            loadNearbyListings()
        }
    }, [listingId, showNearbyListings])

    const loadNearbyListings = async () => {
        setLoading(true)
        try {
            // Create a bounding box around the current location (approximately 20km radius)
            const lat = location.latitude
            const lng = location.longitude
            const offset = 0.2 // Approximately 20km in degrees

            const bounds = `${lat - offset},${lng - offset},${lat + offset},${lng + offset}`

            const response = await fetch(`/api/map/listings?bounds=${bounds}`)
            if (response.ok) {
                const result = await response.json()
                if (result.success) {
                    // Filter out the current listing and limit to nearby ones
                    const filtered = result.data.listings
                        .filter(
                            (listing: MapListing) => listing.id !== listingId
                        )
                        .slice(0, 10) // Show max 10 nearby listings

                    setNearbyListings(filtered)
                }
            }
        } catch (error) {
            console.error("Error loading nearby listings:", error)
        } finally {
            setLoading(false)
        }
    }

    // Combine main listing with nearby ones for map display
    const allListings = [mainListing, ...nearbyListings]

    // Calculate map bounds to fit all listings
    const mapCenter: [number, number] = [location.latitude, location.longitude]
    const mapZoom = nearbyListings.length > 0 ? 11 : 13

    return (
        <div className={className}>
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MapPin className="h-5 w-5" />
                            Localisation
                        </CardTitle>
                        <Link
                            href={`/map?bounds=${location.latitude - 0.1},${location.longitude - 0.1},${location.latitude + 0.1},${location.longitude + 0.1}`}
                        >
                            <Button variant="outline" size="sm">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Voir en grand
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span>
                            {location.city}, {location.region}
                        </span>
                        {location.address && (
                            <span className="hidden md:inline">
                                • {location.address}
                            </span>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="relative">
                        <InteractiveMap
                            center={mapCenter}
                            zoom={mapZoom}
                            height={height}
                            className="rounded-none border-0"
                        >
                            <ListingMarkers
                                listings={allListings}
                                onMarkerClick={(listing) => {
                                    if (listing.id !== listingId) {
                                        // Open nearby listing in new tab
                                        window.open(
                                            `/listings/${listing.id}`,
                                            "_blank"
                                        )
                                    }
                                }}
                            />
                        </InteractiveMap>

                        {/* Loading overlay */}
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/70">
                                <div className="flex items-center gap-2 rounded bg-white p-2 shadow">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span className="text-sm">
                                        Chargement...
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nearby listings info */}
                    {showNearbyListings && nearbyListings.length > 0 && (
                        <div className="border-t bg-muted/50 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground text-sm">
                                        {nearbyListings.length} annonce
                                        {nearbyListings.length > 1 ? "s" : ""} à
                                        proximité
                                    </span>
                                </div>
                                <Link
                                    href={`/map?region=${encodeURIComponent(location.region)}`}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        Voir toutes les annonces de la région
                                    </Button>
                                </Link>
                            </div>

                            {/* Quick preview of nearby listings */}
                            <div className="mt-2 flex flex-wrap gap-1">
                                {nearbyListings.slice(0, 3).map((listing) => (
                                    <Badge
                                        key={listing.id}
                                        variant="outline"
                                        className={`text-xs ${
                                            listing.listingType === "transfer"
                                                ? "border-red-200 text-red-700"
                                                : listing.listingType ===
                                                    "replacement"
                                                  ? "border-blue-200 text-blue-700"
                                                  : "border-green-200 text-green-700"
                                        }`}
                                    >
                                        {listing.listingType === "transfer"
                                            ? "Cession"
                                            : listing.listingType ===
                                                "replacement"
                                              ? "Remplacement"
                                              : "Collaboration"}
                                        {listing.specialty &&
                                            ` • ${listing.specialty}`}
                                    </Badge>
                                ))}
                                {nearbyListings.length > 3 && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        +{nearbyListings.length - 3} autres
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
