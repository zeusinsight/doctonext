"use client"

import { FavoriteButton } from "@/components/ui/favorite-button"
import { ShareButton } from "@/components/ui/share-button"

interface ListingDetailActionsProps {
    listingId: string
    listingTitle: string
    listingType: string
    specialty?: string | null
    location?: { city: string | null } | null
}

export function ListingDetailActions({
    listingId,
    listingTitle,
    listingType,
    specialty,
    location
}: ListingDetailActionsProps) {
    const description = `${listingType === "transfer" ? "Cession" : listingType === "replacement" ? "Remplacement" : "Collaboration"} - ${specialty || "Médical"} à ${location?.city || "France"}`

    return (
        <div className="flex gap-2">
            <FavoriteButton listingId={listingId} listingTitle={listingTitle} />
            <ShareButton title={listingTitle} description={description} />
        </div>
    )
}
