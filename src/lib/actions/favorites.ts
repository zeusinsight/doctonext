"use server"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import {
    favorites,
    listings,
    listingLocations,
    listingMedia
} from "@/database/schema"
import { eq, and, desc, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function addFavorite(listingId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication required" }
        }

        // Check if favorite already exists
        const existingFavorite = await db
            .select()
            .from(favorites)
            .where(
                and(
                    eq(favorites.userId, session.user.id),
                    eq(favorites.listingId, listingId)
                )
            )
            .limit(1)

        if (existingFavorite.length > 0) {
            return { success: false, error: "Already in favorites" }
        }

        // Create new favorite
        await db.insert(favorites).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            listingId: listingId
        })

        revalidatePath("/dashboard/favorites")
        return { success: true }
    } catch (error) {
        console.error("Error adding favorite:", error)
        return { success: false, error: "Failed to add to favorites" }
    }
}

export async function removeFavorite(listingId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication required" }
        }

        await db
            .delete(favorites)
            .where(
                and(
                    eq(favorites.userId, session.user.id),
                    eq(favorites.listingId, listingId)
                )
            )

        revalidatePath("/dashboard/favorites")
        return { success: true }
    } catch (error) {
        console.error("Error removing favorite:", error)
        return { success: false, error: "Failed to remove from favorites" }
    }
}

export async function toggleFavorite(listingId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, error: "Authentication required" }
        }

        // Check if favorite exists
        const existingFavorite = await db
            .select()
            .from(favorites)
            .where(
                and(
                    eq(favorites.userId, session.user.id),
                    eq(favorites.listingId, listingId)
                )
            )
            .limit(1)

        if (existingFavorite.length > 0) {
            // Remove favorite
            await db
                .delete(favorites)
                .where(
                    and(
                        eq(favorites.userId, session.user.id),
                        eq(favorites.listingId, listingId)
                    )
                )

            revalidatePath("/dashboard/favorites")
            return { success: true, isFavorite: false }
        } else {
            // Add favorite
            await db.insert(favorites).values({
                id: crypto.randomUUID(),
                userId: session.user.id,
                listingId: listingId
            })

            revalidatePath("/dashboard/favorites")
            return { success: true, isFavorite: true }
        }
    } catch (error) {
        console.error("Error toggling favorite:", error)
        return { success: false, error: "Failed to toggle favorite" }
    }
}

export async function getUserFavorites() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return {
                success: false,
                error: "Authentication required",
                favorites: []
            }
        }

        const userFavorites = await db
            .select({
                listingId: favorites.listingId,
                createdAt: favorites.createdAt
            })
            .from(favorites)
            .where(eq(favorites.userId, session.user.id))
            .orderBy(favorites.createdAt)

        return {
            success: true,
            favorites: userFavorites.map((f) => f.listingId)
        }
    } catch (error) {
        console.error("Error fetching user favorites:", error)
        return {
            success: false,
            error: "Failed to fetch favorites",
            favorites: []
        }
    }
}

export async function isFavorite(listingId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return { success: false, isFavorite: false }
        }

        const favorite = await db
            .select()
            .from(favorites)
            .where(
                and(
                    eq(favorites.userId, session.user.id),
                    eq(favorites.listingId, listingId)
                )
            )
            .limit(1)

        return { success: true, isFavorite: favorite.length > 0 }
    } catch (error) {
        console.error("Error checking favorite status:", error)
        return { success: false, isFavorite: false }
    }
}

export async function getUserFavoritesWithDetails() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return {
                success: false,
                error: "Authentication required",
                favorites: []
            }
        }

        // Get favorites with full listing details
        const userFavoritesWithDetails = await db
            .select({
                favoriteId: favorites.id,
                favoriteCreatedAt: favorites.createdAt,
                id: listings.id,
                title: listings.title,
                description: listings.description,
                listingType: listings.listingType,
                specialty: listings.specialty,
                status: listings.status,
                isBoostPlus: listings.isBoostPlus,
                viewsCount: listings.viewsCount,
                createdAt: listings.createdAt,
                publishedAt: listings.publishedAt,
                location: {
                    city: listingLocations.city,
                    region: listingLocations.region,
                    postalCode: listingLocations.postalCode,
                    latitude: listingLocations.latitude,
                    longitude: listingLocations.longitude
                }
            })
            .from(favorites)
            .innerJoin(listings, eq(favorites.listingId, listings.id))
            .leftJoin(
                listingLocations,
                eq(listings.id, listingLocations.listingId)
            )
            .where(eq(favorites.userId, session.user.id))
            .orderBy(desc(favorites.createdAt))

        // Get first image for each listing
        const listingIds = userFavoritesWithDetails
            .map((f) => f.id)
            .filter(Boolean)

        let imageMap = new Map()
        if (listingIds.length > 0) {
            const firstImages = await db
                .select({
                    listingId: listingMedia.listingId,
                    fileUrl: listingMedia.fileUrl,
                    fileName: listingMedia.fileName
                })
                .from(listingMedia)
                .where(
                    and(
                        sql`${listingMedia.listingId} IN (${sql.join(
                            listingIds.map((id) => sql`${id}`),
                            sql`, `
                        )})`,
                        eq(listingMedia.displayOrder, 0)
                    )
                )

            imageMap = new Map(firstImages.map((img) => [img.listingId, img]))
        }

        // Add first image to each listing
        const favoritesWithImages = userFavoritesWithDetails.map(
            (favorite) => ({
                ...favorite,
                media: imageMap.has(favorite.id)
                    ? [
                          {
                              id: favorite.id,
                              fileUrl: imageMap.get(favorite.id)!.fileUrl,
                              fileName: imageMap.get(favorite.id)!.fileName
                          }
                      ]
                    : []
            })
        )

        return {
            success: true,
            favorites: favoritesWithImages,
            count: favoritesWithImages.length
        }
    } catch (error) {
        console.error("Error fetching user favorites with details:", error)
        return {
            success: false,
            error: "Failed to fetch favorites",
            favorites: [],
            count: 0
        }
    }
}
