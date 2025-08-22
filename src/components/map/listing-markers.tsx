"use client"

import { useMemo } from "react"
import { Marker, Popup } from "react-leaflet"
import { Icon, DivIcon, point } from "leaflet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Eye, Euro, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export interface MapListing {
  id: string
  title: string
  listingType: "transfer" | "replacement" | "collaboration"
  specialty?: string | null
  location: {
    latitude: number
    longitude: number
    city: string
    region: string
  }
  salePrice?: number
  dailyRate?: number
  viewsCount: number
  isBoostPlus: boolean
  createdAt: Date
}

interface ListingMarkersProps {
  listings: MapListing[]
  onMarkerClick?: (listing: MapListing) => void
  clustering?: boolean
}

// Custom marker icons for different listing types
const createListingIcon = (type: string, isBoostPlus: boolean = false): DivIcon => {
  const getIconColor = (type: string) => {
    switch (type) {
      case "transfer":
        return isBoostPlus ? "#dc2626" : "#ef4444" // Red shades
      case "replacement":
        return isBoostPlus ? "#2563eb" : "#3b82f6" // Blue shades
      case "collaboration":
        return isBoostPlus ? "#059669" : "#10b981" // Green shades
      default:
        return isBoostPlus ? "#6b7280" : "#9ca3af" // Gray shades
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

// Helper function to format price
const formatPrice = (price: number | undefined, type: "transfer" | "replacement" | "collaboration") => {
  if (!price) return null
  
  if (type === "transfer") {
    return `${price.toLocaleString()} €`
  } else if (type === "replacement") {
    return `${price} €/jour`
  }
  return null
}

// Helper function to get listing type label
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

export function ListingMarkers({ listings, onMarkerClick, clustering = false }: ListingMarkersProps) {
  const markers = useMemo(() => {
    return listings.map((listing) => (
      <Marker
        key={listing.id}
        position={[listing.location.latitude, listing.location.longitude]}
        icon={createListingIcon(listing.listingType, listing.isBoostPlus)}
        eventHandlers={{
          click: () => onMarkerClick?.(listing),
        }}
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
              
              <Link href={`/listings/${listing.id}`} className="block">
                <Button size="sm" className="w-full h-8 text-xs">
                  Voir l'annonce
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Popup>
      </Marker>
    ))
  }, [listings, onMarkerClick])

  return <>{markers}</>
}