"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/ui/favorite-button"
import { MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ListingWithDetails, PublicListing } from "@/types/listing"

interface SponsoredListingCardProps {
    listing: PublicListing | ListingWithDetails
    className?: string
    orientation?: "horizontal" | "vertical"
}

export function SponsoredListingCard({ 
    listing, 
    className,
    orientation = "horizontal" 
}: SponsoredListingCardProps) {
    const firstImage = "media" in listing && listing.media?.length > 0 
        ? listing.media[0] 
        : null

    const formatPrice = (price: number | null | undefined) => {
        if (!price) return null
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0
        }).format(price)
    }

    const getPrice = () => {
        if ("details" in listing && listing.details) {
            if (listing.listingType === "transfer" && "salePrice" in listing.details) {
                return formatPrice(listing.details.salePrice)
            }
            if (listing.listingType === "replacement" && "dailyRate" in listing.details) {
                const rate = formatPrice(listing.details.dailyRate)
                return rate ? `${rate}/jour` : null
            }
        }
        return "75000" // Default price for demo
    }

    const price = getPrice()

    if (orientation === "vertical") {
        return (
            <Link href={`/listings/${listing.id}`} className="block group">
                <div className={cn(
                    "bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col",
                    className
                )}>
                    <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
                        {firstImage ? (
                            <Image
                                src={firstImage.fileUrl}
                                alt={listing.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <MapPin className="h-8 w-8 text-gray-400" />
                            </div>
                        )}
                        <div className="absolute top-2 left-2">
                            <FavoriteButton
                                listingId={listing.id}
                                listingTitle={listing.title || "Cabinet médical moderne"}
                                variant="ghost"
                                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                                showToast={false}
                            />
                        </div>
                        <div className="absolute top-2 right-2">
                            <Badge className="bg-white/90 backdrop-blur-sm text-emerald-700 border-0 text-xs px-2 py-0.5">
                                {listing.listingType === "transfer" ? "Cession" : 
                                 listing.listingType === "replacement" ? "Remplacement" : "Collaboration"}
                            </Badge>
                        </div>
                    </div>
                    <div className="p-4 space-y-2 flex-shrink-0">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-medium text-gray-900 line-clamp-1 text-sm group-hover:text-blue-600 transition-colors">
                                {listing.title || "Cabinet médical moderne"}
                            </h3>
                            {price && (
                                <span className="text-sm font-semibold text-gray-900 shrink-0">
                                    {price}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {listing.description || "Opportunité exceptionnelle dans un quartier dynamique avec forte patientèle établie"}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{listing.location?.city || "Paris"}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">
                                {listing.viewsCount} vues
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link href={`/listings/${listing.id}`} className="block group">
            <div className={cn(
                "bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200",
                className
            )}>
                <div className="flex gap-3 p-3">
                    <div className="w-28 h-28 relative bg-gray-50 rounded-lg shrink-0 overflow-hidden">
                        {firstImage ? (
                            <Image
                                src={firstImage.fileUrl}
                                alt={listing.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <MapPin className="h-6 w-6 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex items-start justify-between gap-3 mb-1">
                                <h3 className="font-medium text-gray-900 line-clamp-1 text-sm group-hover:text-blue-600 transition-colors">
                                    {listing.title || "Cabinet médical moderne"}
                                </h3>
                                {price && (
                                    <span className="text-sm font-semibold text-gray-900 shrink-0">
                                        {price}
                                    </span>
                                )}
                            </div>
                            {listing.specialty && (
                                <p className="text-xs text-gray-500 mb-1.5">{listing.specialty}</p>
                            )}
                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                {listing.description || "Opportunité exceptionnelle dans un quartier dynamique avec forte patientèle établie"}
                            </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1 text-gray-500">
                                    <MapPin className="h-3 w-3" />
                                    <span>{listing.location?.city || "Paris"}</span>
                                </div>
                                <Badge variant="secondary" className="h-5 text-[10px] px-1.5 bg-emerald-50 text-emerald-700 border-emerald-200">
                                    {listing.listingType === "transfer" ? "Cession" : 
                                     listing.listingType === "replacement" ? "Remplacement" : "Collaboration"}
                                </Badge>
                            </div>
                            <span className="text-[10px] text-gray-400">
                                {listing.publishedAt ? new Date(listing.publishedAt).toLocaleDateString("fr-FR") : "Aujourd'hui"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}