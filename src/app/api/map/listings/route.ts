import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/database/db"
import {
    listings,
    listingLocations,
    transferDetails,
    replacementDetails
} from "@/database/schema"
import { eq, and, isNotNull, sql } from "drizzle-orm"
import type { MapListing } from "@/components/map/listing-markers"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const filters = {
            listingType: searchParams.get("type") as
                | "transfer"
                | "replacement"
                | "collaboration"
                | undefined,
            specialty: searchParams.get("specialty") || undefined,
            region: searchParams.get("region") || undefined,
            minPrice: searchParams.get("min_price")
                ? parseInt(searchParams.get("min_price")!)
                : undefined,
            maxPrice: searchParams.get("max_price")
                ? parseInt(searchParams.get("max_price")!)
                : undefined,
            bounds: searchParams.get("bounds") || undefined // "lat1,lng1,lat2,lng2"
        }

        // Build query conditions
        const conditions = [
            eq(listings.status, "active"),
            isNotNull(listingLocations.latitude),
            isNotNull(listingLocations.longitude)
        ]

        if (filters.listingType) {
            conditions.push(eq(listings.listingType, filters.listingType))
        }

        if (filters.specialty) {
            conditions.push(eq(listings.specialty, filters.specialty))
        }

        if (filters.region) {
            conditions.push(eq(listingLocations.region, filters.region))
        }

        // Parse bounds for geographic filtering
        let boundsCondition = null
        if (filters.bounds) {
            try {
                const [lat1, lng1, lat2, lng2] = filters.bounds
                    .split(",")
                    .map(parseFloat)
                const minLat = Math.min(lat1, lat2)
                const maxLat = Math.max(lat1, lat2)
                const minLng = Math.min(lng1, lng2)
                const maxLng = Math.max(lng1, lng2)

                boundsCondition = and(
                    sql`CAST(${listingLocations.latitude} AS FLOAT) >= ${minLat}`,
                    sql`CAST(${listingLocations.latitude} AS FLOAT) <= ${maxLat}`,
                    sql`CAST(${listingLocations.longitude} AS FLOAT) >= ${minLng}`,
                    sql`CAST(${listingLocations.longitude} AS FLOAT) <= ${maxLng}`
                )
            } catch (error) {
                console.warn("Invalid bounds format:", filters.bounds)
            }
        }

        if (boundsCondition) {
            conditions.push(boundsCondition)
        }

        // Base query for all listings with locations
        const query = db
            .select({
                id: listings.id,
                title: listings.title,
                listingType: listings.listingType,
                specialty: listings.specialty,
                isBoostPlus: listings.isBoostPlus,
                viewsCount: listings.viewsCount,
                createdAt: listings.createdAt,
                latitude: listingLocations.latitude,
                longitude: listingLocations.longitude,
                city: listingLocations.city,
                region: listingLocations.region
                // We'll get prices in a separate query due to different detail tables
            })
            .from(listings)
            .innerJoin(
                listingLocations,
                eq(listingLocations.listingId, listings.id)
            )
            .where(and(...conditions))
            .limit(1000) // Limit to prevent excessive data transfer

        // Debug: Let's first check if we have any listings at all
        const allListingsCount = await db
            .select({ count: sql`count(*)` })
            .from(listings)
        const activeListingsCount = await db
            .select({ count: sql`count(*)` })
            .from(listings)
            .where(eq(listings.status, "active"))
        const locationsCount = await db
            .select({ count: sql`count(*)` })
            .from(listingLocations)
        const locationsWithCoordsCount = await db
            .select({ count: sql`count(*)` })
            .from(listingLocations)
            .where(
                and(
                    isNotNull(listingLocations.latitude),
                    isNotNull(listingLocations.longitude)
                )
            )

        console.log("🗂️ Database stats:", {
            allListings: allListingsCount[0]?.count,
            activeListings: activeListingsCount[0]?.count,
            locations: locationsCount[0]?.count,
            locationsWithCoords: locationsWithCoordsCount[0]?.count
        })

        const baseListings = await query
        console.log(
            "🗂️ Query result:",
            baseListings.length,
            "listings found with conditions:",
            conditions.length,
            "conditions"
        )

        // Get pricing data for transfer and replacement listings
        const listingIds = baseListings.map((l) => l.id)

        const transferPrices =
            listingIds.length > 0
                ? await db
                      .select({
                          listingId: transferDetails.listingId,
                          salePrice: transferDetails.salePrice
                      })
                      .from(transferDetails)
                      .where(
                          sql`${transferDetails.listingId} IN (${sql.join(
                              listingIds.map((id) => sql`${id}`),
                              sql`,`
                          )})`
                      )
                : []

        const replacementPrices =
            listingIds.length > 0
                ? await db
                      .select({
                          listingId: replacementDetails.listingId,
                          dailyRate: replacementDetails.dailyRate
                      })
                      .from(replacementDetails)
                      .where(
                          sql`${replacementDetails.listingId} IN (${sql.join(
                              listingIds.map((id) => sql`${id}`),
                              sql`,`
                          )})`
                      )
                : []

        // Create lookup maps for pricing data
        const transferPriceMap = new Map(
            transferPrices.map((t) => [t.listingId, t.salePrice])
        )
        const replacementPriceMap = new Map(
            replacementPrices.map((r) => [r.listingId, r.dailyRate])
        )

        // Combine data and filter by price if needed
        const mapListings: MapListing[] = baseListings
            .map((listing) => {
                const salePrice =
                    listing.listingType === "transfer"
                        ? transferPriceMap.get(listing.id)
                        : undefined
                const dailyRate =
                    listing.listingType === "replacement"
                        ? replacementPriceMap.get(listing.id)
                        : undefined

                return {
                    id: listing.id,
                    title: listing.title,
                    listingType: listing.listingType as
                        | "transfer"
                        | "replacement"
                        | "collaboration",
                    specialty: listing.specialty,
                    location: {
                        latitude: parseFloat(listing.latitude!),
                        longitude: parseFloat(listing.longitude!),
                        city: listing.city,
                        region: listing.region
                    },
                    salePrice: salePrice ? Number(salePrice) : undefined,
                    dailyRate: dailyRate ? Number(dailyRate) : undefined,
                    viewsCount: listing.viewsCount,
                    isBoostPlus: listing.isBoostPlus,
                    createdAt: listing.createdAt
                }
            })
            .filter((listing) => {
                // Apply price filters
                if (filters.minPrice || filters.maxPrice) {
                    const price = listing.salePrice || listing.dailyRate
                    if (!price) return false

                    if (filters.minPrice && price < filters.minPrice)
                        return false
                    if (filters.maxPrice && price > filters.maxPrice)
                        return false
                }

                return true
            })

        return NextResponse.json({
            success: true,
            data: {
                listings: mapListings,
                total: mapListings.length,
                filters: filters
            }
        })
    } catch (error) {
        console.error("Error fetching map listings:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Erreur lors de la récupération des annonces pour la carte"
            },
            { status: 500 }
        )
    }
}
