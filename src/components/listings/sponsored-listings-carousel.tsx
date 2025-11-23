"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SponsoredListingCard } from "./sponsored-listing-card"
import type { ListingWithDetails, PublicListing } from "@/types/listing"

interface SponsoredListingsCarouselProps {
    listings: (PublicListing | ListingWithDetails)[]
}

export function SponsoredListingsCarousel({
    listings
}: SponsoredListingsCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400
            const currentScroll = scrollContainerRef.current.scrollLeft
            scrollContainerRef.current.scrollTo({
                left:
                    direction === "left"
                        ? currentScroll - scrollAmount
                        : currentScroll + scrollAmount,
                behavior: "smooth"
            })
        }
    }

    // For demo purposes, create mock listings if none provided
    const displayListings: (PublicListing | ListingWithDetails)[] =
        listings.length > 0
            ? listings
            : Array(6)
                  .fill(null)
                  .map((_, i) => ({
                      id: `sponsored-${i}`,
                      title: "Lorem ipsum",
                      description:
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                      listingType: "transfer" as const,
                      specialty: "Médecine générale",
                      isBoostPlus: true,
                      viewsCount: 0,
                      createdAt: new Date(),
                      publishedAt: new Date(),
                      location: {
                          city: "Paris",
                          region: "Île-de-France",
                          postalCode: "75000",
                          latitude: null,
                          longitude: null
                      }
                  })) satisfies PublicListing[]

    return (
        <div className="relative">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-2xl">Sponsorisées</h2>
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* 3 column grid matching skeleton size */}
            <div className="grid grid-cols-3 gap-4">
                {displayListings.slice(0, 3).map((listing, i) => (
                    <div key={listing.id || i} className="h-96">
                        <SponsoredListingCard
                            listing={listing}
                            orientation="vertical"
                            className="h-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
