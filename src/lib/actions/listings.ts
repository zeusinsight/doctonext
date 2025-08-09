"use server"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { listings, listingLocations, transferDetails, replacementDetails, listingMedia } from "@/database/schema"
import { eq, and, desc, asc, or, ilike, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createListingSchema, updateListingSchema } from "@/lib/validations/listing"
import type { CreateListingData, UpdateListingData } from "@/types/listing"

export async function createListing(data: CreateListingData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            throw new Error("Non autorisé")
        }

        const validatedData = createListingSchema.parse(data)

        const result = await db.transaction(async (tx) => {
            // Create main listing
            const [listing] = await tx
                .insert(listings)
                .values({
                    id: crypto.randomUUID(),
                    userId: session.user.id,
                    title: validatedData.title,
                    description: validatedData.description,
                    listingType: validatedData.listingType,
                    specialty: validatedData.specialty,
                    status: "active",
                    isPremium: validatedData.isPremium || false,
                    isUrgent: validatedData.isUrgent || false,
                    publishedAt: new Date(),
                    expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null
                })
                .returning()

            // Create location
            if (validatedData.location) {
                await tx.insert(listingLocations).values({
                    id: crypto.randomUUID(),
                    listingId: listing.id,
                    address: validatedData.location.address,
                    postalCode: validatedData.location.postalCode,
                    city: validatedData.location.city,
                    region: validatedData.location.region,
                    department: validatedData.location.department,
                    latitude: validatedData.location.latitude,
                    longitude: validatedData.location.longitude,
                    medicalDensityZone: validatedData.location.medicalDensityZone,
                    densityScore: validatedData.location.densityScore
                })
            }

            // Create type-specific details
            if (validatedData.listingType === "transfer" && validatedData.transferDetails) {
                await tx.insert(transferDetails).values({
                    id: crypto.randomUUID(),
                    listingId: listing.id,
                    ...validatedData.transferDetails
                })
            }

            if (validatedData.listingType === "replacement" && validatedData.replacementDetails) {
                await tx.insert(replacementDetails).values({
                    id: crypto.randomUUID(),
                    listingId: listing.id,
                    ...validatedData.replacementDetails
                })
            }

            return listing
        })

        revalidatePath("/dashboard/listings")
        revalidatePath("/listings")

        return { success: true, listingId: result.id }
    } catch (error) {
        console.error("Error creating listing:", error)
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "Erreur lors de la création de l'annonce" }
    }
}

export async function updateListing(listingId: string, data: UpdateListingData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            throw new Error("Non autorisé")
        }

        const validatedData = updateListingSchema.parse(data)

        // Check if user owns the listing
        const [existingListing] = await db
            .select()
            .from(listings)
            .where(and(eq(listings.id, listingId), eq(listings.userId, session.user.id)))
            .limit(1)

        if (!existingListing) {
            throw new Error("Annonce non trouvée ou non autorisé")
        }

        await db.transaction(async (tx) => {
            // Update main listing
            await tx
                .update(listings)
                .set({
                    title: validatedData.title,
                    description: validatedData.description,
                    specialty: validatedData.specialty,
                    isPremium: validatedData.isPremium,
                    isUrgent: validatedData.isUrgent,
                    updatedAt: new Date()
                })
                .where(eq(listings.id, listingId))

            // Update location if provided
            if (validatedData.location) {
                await tx
                    .update(listingLocations)
                    .set({
                        address: validatedData.location.address,
                        postalCode: validatedData.location.postalCode,
                        city: validatedData.location.city,
                        region: validatedData.location.region,
                        department: validatedData.location.department,
                        latitude: validatedData.location.latitude,
                        longitude: validatedData.location.longitude,
                        medicalDensityZone: validatedData.location.medicalDensityZone,
                        densityScore: validatedData.location.densityScore
                    })
                    .where(eq(listingLocations.listingId, listingId))
            }

            // Update type-specific details
            if (existingListing.listingType === "transfer" && validatedData.transferDetails) {
                await tx
                    .update(transferDetails)
                    .set(validatedData.transferDetails)
                    .where(eq(transferDetails.listingId, listingId))
            }

            if (existingListing.listingType === "replacement" && validatedData.replacementDetails) {
                await tx
                    .update(replacementDetails)
                    .set(validatedData.replacementDetails)
                    .where(eq(replacementDetails.listingId, listingId))
            }
        })

        revalidatePath("/dashboard/listings")
        revalidatePath(`/listings/${listingId}`)

        return { success: true }
    } catch (error) {
        console.error("Error updating listing:", error)
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "Erreur lors de la mise à jour de l'annonce" }
    }
}

export async function deleteListing(listingId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            throw new Error("Non autorisé")
        }

        // Check if user owns the listing
        const [existingListing] = await db
            .select()
            .from(listings)
            .where(and(eq(listings.id, listingId), eq(listings.userId, session.user.id)))
            .limit(1)

        if (!existingListing) {
            throw new Error("Annonce non trouvée ou non autorisé")
        }

        // Soft delete by updating status
        await db
            .update(listings)
            .set({
                status: "inactive",
                updatedAt: new Date()
            })
            .where(eq(listings.id, listingId))

        revalidatePath("/dashboard/listings")
        revalidatePath("/listings")

        return { success: true }
    } catch (error) {
        console.error("Error deleting listing:", error)
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "Erreur lors de la suppression de l'annonce" }
    }
}

export async function getListingById(listingId: string) {
    try {
        const [listing] = await db
            .select({
                id: listings.id,
                userId: listings.userId,
                title: listings.title,
                description: listings.description,
                listingType: listings.listingType,
                specialty: listings.specialty,
                status: listings.status,
                isPremium: listings.isPremium,
                isUrgent: listings.isUrgent,
                viewsCount: listings.viewsCount,
                contactsCount: listings.contactsCount,
                createdAt: listings.createdAt,
                updatedAt: listings.updatedAt,
                publishedAt: listings.publishedAt,
                expiresAt: listings.expiresAt
            })
            .from(listings)
            .where(eq(listings.id, listingId))
            .limit(1)

        if (!listing) {
            return null
        }

        // Get location
        const [location] = await db
            .select()
            .from(listingLocations)
            .where(eq(listingLocations.listingId, listingId))
            .limit(1)

        // Get type-specific details
        let details = null
        if (listing.listingType === "transfer") {
            const [transferDetail] = await db
                .select()
                .from(transferDetails)
                .where(eq(transferDetails.listingId, listingId))
                .limit(1)
            details = transferDetail
        } else if (listing.listingType === "replacement") {
            const [replacementDetail] = await db
                .select()
                .from(replacementDetails)
                .where(eq(replacementDetails.listingId, listingId))
                .limit(1)
            details = replacementDetail
        }

        // Get media
        const media = await db
            .select()
            .from(listingMedia)
            .where(eq(listingMedia.listingId, listingId))
            .orderBy(listingMedia.displayOrder)

        return {
            ...listing,
            location,
            details,
            media
        }
    } catch (error) {
        console.error("Error fetching listing:", error)
        return null
    }
}

export async function getUserListings() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return []
        }

        const userListings = await db
            .select({
                id: listings.id,
                title: listings.title,
                listingType: listings.listingType,
                specialty: listings.specialty,
                status: listings.status,
                isPremium: listings.isPremium,
                isUrgent: listings.isUrgent,
                viewsCount: listings.viewsCount,
                contactsCount: listings.contactsCount,
                createdAt: listings.createdAt,
                publishedAt: listings.publishedAt,
                expiresAt: listings.expiresAt
            })
            .from(listings)
            .where(eq(listings.userId, session.user.id))
            .orderBy(desc(listings.createdAt))

        return userListings
    } catch (error) {
        console.error("Error fetching user listings:", error)
        return []
    }
}

export async function getPublicListings(filters?: {
    listingType?: string
    specialty?: string
    region?: string
    search?: string
    sortBy?: "newest" | "oldest" | "price_low" | "price_high" | "views"
    limit?: number
    offset?: number
}) {
    try {
        const conditions = [eq(listings.status, "active")]

        if (filters?.listingType) {
            conditions.push(eq(listings.listingType, filters.listingType))
        }

        if (filters?.specialty) {
            conditions.push(eq(listings.specialty, filters.specialty))
        }

        if (filters?.search) {
            conditions.push(
                or(
                    ilike(listings.title, `%${filters.search}%`),
                    ilike(listings.description, `%${filters.search}%`)
                )!
            )
        }

        // Determine sort order
        let orderByClause
        switch (filters?.sortBy) {
            case "oldest":
                orderByClause = [asc(listings.publishedAt)]
                break
            case "views":
                orderByClause = [desc(listings.viewsCount)]
                break
            case "price_low":
                // For price sorting, we need to join with transferDetails or replacementDetails
                // We'll use COALESCE to get the first non-null price value
                orderByClause = [asc(sql`COALESCE(${transferDetails.salePrice}, ${replacementDetails.dailyRate}, 0)`)]
                break
            case "price_high":
                orderByClause = [desc(sql`COALESCE(${transferDetails.salePrice}, ${replacementDetails.dailyRate}, 0)`)]
                break
            default: // "newest" or undefined
                orderByClause = [desc(listings.publishedAt)]
                break
        }

        const baseQuery = db
            .select({
                id: listings.id,
                title: listings.title,
                description: listings.description,
                listingType: listings.listingType,
                specialty: listings.specialty,
                isPremium: listings.isPremium,
                isUrgent: listings.isUrgent,
                viewsCount: listings.viewsCount,
                createdAt: listings.createdAt,
                publishedAt: listings.publishedAt,
                location: {
                    city: listingLocations.city,
                    region: listingLocations.region,
                    postalCode: listingLocations.postalCode
                }
            })
            .from(listings)
            .leftJoin(listingLocations, eq(listings.id, listingLocations.listingId))
            .leftJoin(transferDetails, eq(listings.id, transferDetails.listingId))
            .leftJoin(replacementDetails, eq(listings.id, replacementDetails.listingId))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(...orderByClause)

        // Apply pagination if provided
        const limit = filters?.limit || 20
        const offset = filters?.offset || 0
        
        const publicListings = await baseQuery.limit(limit).offset(offset)

        return publicListings
    } catch (error) {
        console.error("Error fetching public listings:", error)
        return []
    }
}

export async function updateListingStatus(listingId: string, status: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            throw new Error("Non autorisé")
        }

        // Check if user owns the listing
        const [existingListing] = await db
            .select()
            .from(listings)
            .where(and(eq(listings.id, listingId), eq(listings.userId, session.user.id)))
            .limit(1)

        if (!existingListing) {
            throw new Error("Annonce non trouvée ou non autorisé")
        }

        await db
            .update(listings)
            .set({
                status,
                updatedAt: new Date()
            })
            .where(eq(listings.id, listingId))

        revalidatePath("/dashboard/listings")
        revalidatePath("/listings")

        return { success: true }
    } catch (error) {
        console.error("Error updating listing status:", error)
        if (error instanceof Error) {
            return { success: false, error: error.message }
        }
        return { success: false, error: "Erreur lors de la mise à jour du statut" }
    }
}

export async function incrementListingViews(listingId: string) {
    try {
        await db
            .update(listings)
            .set({
                viewsCount: sql`${listings.viewsCount} + 1`,
                updatedAt: new Date()
            })
            .where(eq(listings.id, listingId))

        return { success: true }
    } catch (error) {
        console.error("Error incrementing listing views:", error)
        return { success: false }
    }
}