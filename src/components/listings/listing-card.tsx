"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/ui/favorite-button"
import { Eye, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ListingWithDetails, PublicListing } from "@/types/listing"

interface ListingCardProps {
    listing: PublicListing | ListingWithDetails
    className?: string
    showFavorite?: boolean
}

export function ListingCard({
    listing,
    className,
    showFavorite = true
}: ListingCardProps) {
    const getListingTypeBadge = (type: string) => {
        const typeConfig = {
            transfer: { label: "Cession", variant: "default" as const },
            replacement: {
                label: "Remplacement",
                variant: "secondary" as const
            },
            collaboration: {
                label: "Collaboration",
                variant: "outline" as const
            }
        }

        return (
            typeConfig[type as keyof typeof typeConfig] || typeConfig.transfer
        )
    }

    const typeBadge = getListingTypeBadge(listing.listingType)

    const firstImage =
        "media" in listing && listing.media?.length > 0
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
            if (
                listing.listingType === "transfer" &&
                "salePrice" in listing.details
            ) {
                return formatPrice(listing.details.salePrice)
            }
            if (
                listing.listingType === "replacement" &&
                "dailyRate" in listing.details
            ) {
                const rate = formatPrice(listing.details.dailyRate)
                return rate ? `${rate}/jour` : null
            }
        }
        return null
    }

    const price = getPrice()

    return (
        <Link href={`/annonces/${listing.id}`} className="block">
            <Card
                className={cn(
                    "group overflow-hidden transition-all hover:shadow-lg",
                    className
                )}
            >
                <div className="relative aspect-[16/10] w-full bg-muted">
                    {firstImage ? (
                        <Image
                            src={firstImage.fileUrl}
                            alt={firstImage.fileName || listing.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                            <Eye className="h-12 w-12" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant={typeBadge.variant}>
                            {typeBadge.label}
                        </Badge>
                        {listing.isBoostPlus && (
                            <Badge
                                variant="outline"
                                className="border-amber-500/60 bg-amber-50 text-amber-600"
                            >
                                Boost+
                            </Badge>
                        )}
                    </div>

                    {showFavorite && (
                        <div className="absolute top-3 right-3">
                            <FavoriteButton
                                listingId={listing.id}
                                listingTitle={listing.title}
                                variant="ghost"
                                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                                showToast={false}
                            />
                        </div>
                    )}

                    {price && (
                        <div className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2 py-1 backdrop-blur-sm">
                            <span className="font-semibold text-gray-900 text-sm">
                                {price}
                            </span>
                        </div>
                    )}
                </div>

                <CardContent className="space-y-3 p-4 py-6">
                    <div>
                        <h3 className="line-clamp-2 font-semibold text-base leading-tight">
                            {listing.title}
                        </h3>
                        {listing.specialty && (
                            <p className="mt-1 text-muted-foreground text-sm">
                                {listing.specialty}
                            </p>
                        )}
                    </div>

                    {listing.location && (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>
                                {listing.location.city}
                                {listing.location.postalCode &&
                                    ` (${listing.location.postalCode})`}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-muted-foreground text-xs">
                        <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{listing.viewsCount} vues</span>
                        </div>
                        {listing.publishedAt && (
                            <span>
                                {new Date(
                                    listing.publishedAt
                                ).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short"
                                })}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
