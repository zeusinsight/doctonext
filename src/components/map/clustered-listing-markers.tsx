"use client"

import { useMemo, useEffect, useState } from "react"
import { useMap } from "react-leaflet"
import { Marker, Popup } from "react-leaflet"
import Supercluster from "supercluster"
import { DivIcon } from "leaflet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Eye, Euro, ArrowUpRight } from "lucide-react"
import type { MapListing } from "./listing-markers"

interface ClusteredListingMarkersProps {
  listings: MapListing[]
  onMarkerClick?: (listing: MapListing) => void
}

interface ClusterPoint {
  type: 'Feature'
  properties: {
    cluster: boolean
    cluster_id?: number
    point_count?: number
    point_count_abbreviated?: string
    listing?: MapListing
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

// Create cluster icon
const createClusterIcon = (count: number, types: string[]): DivIcon => {
  const size = count < 10 ? 40 : count < 100 ? 50 : 60

  // Determine dominant color based on listing types in cluster
  const typeColors = {
    transfer: '#ef4444',
    replacement: '#3b82f6',
    collaboration: '#10b981'
  }

  // Count occurrences of each type
  const typeCounts = types.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get dominant type
  const dominantType = Object.keys(typeCounts).reduce((a, b) =>
    typeCounts[a] > typeCounts[b] ? a : b
  )

  const color = typeColors[dominantType as keyof typeof typeColors] || '#6b7280'

  return new DivIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-weight: bold;
        color: white;
        font-size: ${size > 50 ? '14px' : '12px'};
        position: relative;
      ">
        ${count}
        <div style="
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          background: #fbbf24;
          border-radius: 50%;
          border: 2px solid white;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${Object.keys(typeCounts).length}
        </div>
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  })
}

// Create individual marker icon
const createListingIcon = (type: string, isBoostPlus: boolean = false): DivIcon => {
  const getIconColor = (type: string) => {
    switch (type) {
      case "transfer":
        return isBoostPlus ? "#dc2626" : "#ef4444"
      case "replacement":
        return isBoostPlus ? "#2563eb" : "#3b82f6"
      case "collaboration":
        return isBoostPlus ? "#059669" : "#10b981"
      default:
        return isBoostPlus ? "#6b7280" : "#9ca3af"
    }
  }

  const color = getIconColor(type)
  const size = isBoostPlus ? 35 : 30

  return new DivIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        ${isBoostPlus ? '<div style="position: absolute; top: -5px; right: -5px; width: 12px; height: 12px; background: #fbbf24; border-radius: 50%; border: 2px solid white;"></div>' : ''}
        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    className: "custom-div-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  })
}

// Format price helper
const formatPrice = (price: number | undefined, type: "transfer" | "replacement" | "collaboration") => {
  if (!price) return null

  if (type === "transfer") {
    return `${price.toLocaleString()} €`
  } else if (type === "replacement") {
    return `${price} €/jour`
  }
  return null
}

// Get listing type label
const getListingTypeLabel = (type: "transfer" | "replacement" | "collaboration") => {
  switch (type) {
    case "transfer":
      return "Cession"
    case "replacement":
      return "Remplacement"
    case "collaboration":
      return "Collaboration"
    default:
      return type
  }
}

export function ClusteredListingMarkers({ listings, onMarkerClick }: ClusteredListingMarkersProps) {
  const map = useMap()
  const [clusters, setClusters] = useState<ClusterPoint[]>([])
  const [zoom, setZoom] = useState(map.getZoom())

  // Initialize Supercluster
  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 60, // Cluster radius in pixels
      maxZoom: 15, // Max zoom level for clustering
      minZoom: 0,
      minPoints: 2, // Minimum points to form a cluster
    })

    // Convert listings to GeoJSON points
    const points = listings.map(listing => ({
      type: 'Feature' as const,
      properties: {
        cluster: false,
        listing
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [listing.location.longitude, listing.location.latitude] as [number, number]
      }
    }))

    cluster.load(points)
    return cluster
  }, [listings])

  // Update clusters when zoom changes
  useEffect(() => {
    if (!map) return

    const updateClusters = () => {
      const currentZoom = map.getZoom()
      setZoom(currentZoom)

      const bounds = map.getBounds()
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
      ] as [number, number, number, number]

      const newClusters = supercluster.getClusters(bbox, Math.floor(currentZoom)) as ClusterPoint[]
      setClusters(newClusters)
    }

    // Initial load
    updateClusters()

    // Listen for map events
    map.on('moveend', updateClusters)
    map.on('zoomend', updateClusters)

    return () => {
      map.off('moveend', updateClusters)
      map.off('zoomend', updateClusters)
    }
  }, [map, supercluster])

  // Handle cluster click
  const handleClusterClick = (clusterId: number, coordinates: [number, number]) => {
    const expansionZoom = supercluster.getClusterExpansionZoom(clusterId)
    map.setView([coordinates[1], coordinates[0]], expansionZoom, {
      animate: true,
      duration: 0.5
    })
  }

  return (
    <>
      {clusters.map((cluster) => {
        const { cluster: isCluster, cluster_id, point_count, listing } = cluster.properties
        const [longitude, latitude] = cluster.geometry.coordinates

        if (isCluster && cluster_id && point_count) {
          // Get all points in this cluster to determine types
          const clusterListings = supercluster.getLeaves(cluster_id, Infinity)
          const types = clusterListings.map(leaf => leaf.properties.listing.listingType)

          return (
            <Marker
              key={`cluster-${cluster_id}`}
              position={[latitude, longitude]}
              icon={createClusterIcon(point_count, types)}
              eventHandlers={{
                click: () => handleClusterClick(cluster_id, [longitude, latitude])
              }}
            >
              <Popup maxWidth={300} className="cluster-popup">
                <div className="p-2">
                  <h4 className="font-medium mb-2">{point_count} annonces</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(
                      types.reduce((acc, type) => {
                        acc[type] = (acc[type] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span>{getListingTypeLabel(type as any)}</span>
                        <Badge variant="secondary">{String(count)}</Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cliquez pour zoomer et voir les détails
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        }

        // Individual listing marker
        if (listing) {
          return (
            <Marker
              key={listing.id}
              position={[latitude, longitude]}
              icon={createListingIcon(listing.listingType, listing.isBoostPlus)}
            >
              <Popup maxWidth={320} className="custom-popup">
                <Card className="border-0 shadow-none p-0 m-0">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-medium line-clamp-2 flex-1">
                        {listing.title}
                      </CardTitle>
                      {listing.isBoostPlus && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          ⭐ Premium
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{listing.location.city}, {listing.location.region}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <div className="flex items-center gap-4 text-xs">
                      <Badge
                        variant="outline"
                        className={`${
                          listing.listingType === "transfer" ? "border-red-200 text-red-700" :
                          listing.listingType === "replacement" ? "border-blue-200 text-blue-700" :
                          "border-green-200 text-green-700"
                        }`}
                      >
                        {getListingTypeLabel(listing.listingType)}
                      </Badge>
                      {listing.specialty && (
                        <span className="text-muted-foreground">{listing.specialty}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        <span>{listing.viewsCount} vues</span>
                      </div>
                      {formatPrice(listing.salePrice || listing.dailyRate, listing.listingType) && (
                        <div className="flex items-center gap-1 font-medium">
                          <Euro className="h-3 w-3" />
                          <span>{formatPrice(listing.salePrice || listing.dailyRate, listing.listingType)}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full h-8 text-xs"
                      onClick={() => onMarkerClick?.(listing)}
                    >
                      Voir l'annonce
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          )
        }

        return null
      })}
    </>
  )
}