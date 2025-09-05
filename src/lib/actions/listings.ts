"use server"

import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { listings, listingLocations, transferDetails, replacementDetails, collaborationDetails, listingMedia, users } from "@/database/schema"
import { eq, and, desc, asc, or, ilike, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createListingSchema, updateListingSchema } from "@/lib/validations/listing"
import type { CreateListingData, UpdateListingData } from "@/types/listing"
import { checkNewListingAgainstSavedSearches } from "@/lib/services/alert-service"
import { geocodeAddress, geocodeByPostalCode, updateListingCoordinates } from "@/lib/services/geocoding"

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
                    isBoostPlus: validatedData.isBoostPlus || false,
                    publishedAt: new Date(),
                    expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null
                })
                .returning()

            // Create location
            if (validatedData.location) {
                // Synchronous approximate coordinates (department centroid) if missing
                let lat: string | null = validatedData.location.latitude ?? null
                let lng: string | null = validatedData.location.longitude ?? null

                if (!lat || !lng) {
                    try {
                        const approx = await geocodeByPostalCode(
                            validatedData.location.postalCode,
                            validatedData.location.city
                        )
                        if (!("error" in approx)) {
                            lat = approx.latitude.toString()
                            lng = approx.longitude.toString()
                        }
                    } catch (e) {
                        console.warn("Approx geocoding failed (postal code)", e)
                    }
                }

                await tx.insert(listingLocations).values({
                    id: crypto.randomUUID(),
                    listingId: listing.id,
                    address: validatedData.location.address,
                    postalCode: validatedData.location.postalCode,
                    city: validatedData.location.city,
                    region: validatedData.location.region,
                    department: validatedData.location.department,
                    latitude: lat,
                    longitude: lng
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

            if (validatedData.listingType === "collaboration" && validatedData.collaborationDetails) {
                const cd = validatedData.collaborationDetails
                await tx.insert(collaborationDetails).values({
                    id: crypto.randomUUID(),
                    listingId: listing.id,
                    collaborationType: cd.collaborationType,
                    durationExpectation: cd.durationExpectation,
                    activityDistribution: cd.activityDistribution,
                    activityDistributionDetails: cd.activityDistributionDetails,
                    spaceArrangement: cd.spaceArrangement,
                    patientManagement: cd.patientManagement,
                    investmentRequired: cd.investmentRequired ?? false,
                    investmentAmount: cd.investmentAmount == null ? null : String(cd.investmentAmount),
                    remunerationModel: cd.remunerationModel,
                    specialtiesWanted: cd.specialtiesWanted,
                    experienceRequired: cd.experienceRequired,
                    valuesAndGoals: cd.valuesAndGoals,
                })
            }

            // Create media files
            if (validatedData.media && validatedData.media.length > 0) {
                const mediaToInsert = validatedData.media.map((file, index) => ({
                    id: crypto.randomUUID(),
                    listingId: listing.id,
                    fileUrl: file.url,
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    displayOrder: index,
                    uploadKey: null
                }))

                await tx.insert(listingMedia).values(mediaToInsert)
            }

            return listing
        })

        revalidatePath("/dashboard/annonces")
        revalidatePath("/annonces")

        // Trigger alert checks asynchronously (don't wait for it)
        checkNewListingAgainstSavedSearches(result.id)
            .then((alertResult) => {
                if (alertResult.success && alertResult.stats) {
                    console.log(`Alert check completed: ${alertResult.message}`)
                }
            })
            .catch((error) => {
                console.error("Error checking alerts for new listing:", error)
                // Don't fail the listing creation if alert check fails
            })

        // Fire-and-forget precise geocoding to refine coordinates
        ;(async () => {
            try {
                if (validatedData.location) {
                    const precise = await geocodeAddress(
                        validatedData.location.address || "",
                        validatedData.location.city,
                        validatedData.location.postalCode
                    )
                    if (!("error" in precise)) {
                        await updateListingCoordinates(result.id, precise)
                    }
                }
            } catch (e) {
                console.warn("Background precise geocoding failed for listing", result.id, e)
            }
        })()

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
                    isBoostPlus: validatedData.isBoostPlus,
                    updatedAt: new Date()
                })
                .where(eq(listings.id, listingId))

            // Update location if provided
            if (validatedData.location) {
                // Compute approximate coords if missing
                let lat: string | null = validatedData.location.latitude ?? null
                let lng: string | null = validatedData.location.longitude ?? null

                if (!lat || !lng) {
                    try {
                        const approx = await geocodeByPostalCode(
                            validatedData.location.postalCode,
                            validatedData.location.city
                        )
                        if (!("error" in approx)) {
                            lat = approx.latitude.toString()
                            lng = approx.longitude.toString()
                        }
                    } catch (e) {
                        console.warn("Approx geocoding failed on update (postal code)", e)
                    }
                }

                await tx
                    .update(listingLocations)
                    .set({
                        address: validatedData.location.address,
                        postalCode: validatedData.location.postalCode,
                        city: validatedData.location.city,
                        region: validatedData.location.region,
                        department: validatedData.location.department,
                        latitude: lat,
                        longitude: lng
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

            if (existingListing.listingType === "collaboration" && validatedData.collaborationDetails) {
                const cd = validatedData.collaborationDetails
                await tx
                    .update(collaborationDetails)
                    .set({
                        collaborationType: cd.collaborationType,
                        durationExpectation: cd.durationExpectation,
                        activityDistribution: cd.activityDistribution,
                        activityDistributionDetails: cd.activityDistributionDetails,
                        spaceArrangement: cd.spaceArrangement,
                        patientManagement: cd.patientManagement,
                        investmentRequired: cd.investmentRequired,
                        investmentAmount: cd.investmentAmount == null ? null : String(cd.investmentAmount),
                        remunerationModel: cd.remunerationModel,
                        specialtiesWanted: cd.specialtiesWanted,
                        experienceRequired: cd.experienceRequired,
                        valuesAndGoals: cd.valuesAndGoals,
                    })
                    .where(eq(collaborationDetails.listingId, listingId))
            }
        })

        revalidatePath("/dashboard/annonces")
        revalidatePath(`/annonces/${listingId}`)

        // Background precise geocoding after update (non-blocking)
        ;(async () => {
            try {
                if (validatedData.location) {
                    const precise = await geocodeAddress(
                        validatedData.location.address || "",
                        validatedData.location.city,
                        validatedData.location.postalCode
                    )
                    if (!("error" in precise)) {
                        await updateListingCoordinates(listingId, precise)
                    }
                }
            } catch (e) {
                console.warn("Background precise geocoding failed for update", listingId, e)
            }
        })()

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

        revalidatePath("/dashboard/annonces")
        revalidatePath("/annonces")

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
                isBoostPlus: listings.isBoostPlus,
                viewsCount: listings.viewsCount,
                contactsCount: listings.contactsCount,
                createdAt: listings.createdAt,
                updatedAt: listings.updatedAt,
                publishedAt: listings.publishedAt,
                expiresAt: listings.expiresAt,
                user: {
                    name: users.name,
                    profession: users.profession,
                    specialty: users.specialty,
                    isVerifiedProfessional: users.isVerifiedProfessional,
                    avatar: users.avatar,
                    avatarUrl: users.avatarUrl,
                    image: users.image
                }
            })
            .from(listings)
            .innerJoin(users, eq(listings.userId, users.id))
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
        } else if (listing.listingType === "collaboration") {
            const [collaborationDetail] = await db
                .select()
                .from(collaborationDetails)
                .where(eq(collaborationDetails.listingId, listingId))
                .limit(1)
            details = collaborationDetail
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
                isBoostPlus: listings.isBoostPlus,
                viewsCount: listings.viewsCount,
                contactsCount: listings.contactsCount,
                createdAt: listings.createdAt,
                publishedAt: listings.publishedAt,
                expiresAt: listings.expiresAt
            })
            .from(listings)
            .where(eq(listings.userId, session.user.id))
            .orderBy(desc(listings.createdAt))

        // Get first image for each listing
        const listingsWithFirstImage = await Promise.all(
            userListings.map(async (listing) => {
                const [firstImage] = await db
                    .select({
                        id: listingMedia.id,
                        fileUrl: listingMedia.fileUrl,
                        fileName: listingMedia.fileName
                    })
                    .from(listingMedia)
                    .where(eq(listingMedia.listingId, listing.id))
                    .orderBy(listingMedia.displayOrder)
                    .limit(1)

                return {
                    ...listing,
                    firstImage: firstImage || null
                }
            })
        )

        return listingsWithFirstImage
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
    collaborationType?: string
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

        if (filters?.collaborationType) {
            conditions.push(eq(collaborationDetails.collaborationType, filters.collaborationType))
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
                isBoostPlus: listings.isBoostPlus,
                viewsCount: listings.viewsCount,
                createdAt: listings.createdAt,
                publishedAt: listings.publishedAt,
                location: {
                    city: listingLocations.city,
                    region: listingLocations.region,
                    postalCode: listingLocations.postalCode
                },
                collaborationType: collaborationDetails.collaborationType,
                // Pricing data
                salePrice: transferDetails.salePrice,
                dailyRate: replacementDetails.dailyRate,
                investmentAmount: collaborationDetails.investmentAmount
            })
            .from(listings)
            .leftJoin(listingLocations, eq(listings.id, listingLocations.listingId))
            .leftJoin(transferDetails, eq(listings.id, transferDetails.listingId))
            .leftJoin(replacementDetails, eq(listings.id, replacementDetails.listingId))
            .leftJoin(collaborationDetails, eq(listings.id, collaborationDetails.listingId))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(...orderByClause)

        // Apply pagination if provided
        const limit = filters?.limit || 20
        const offset = filters?.offset || 0
        
        const publicListings = await baseQuery.limit(limit).offset(offset)

        // Fetch first image for each listing
        const listingIds = publicListings.map(l => l.id).filter(Boolean)
        
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
                        sql`${listingMedia.listingId} IN (${sql.join(listingIds.map(id => sql`${id}`), sql`, `)})`,
                        eq(listingMedia.displayOrder, 0)
                    )
                )
            
            // Create a map of listing ID to first image
            const imageMap = new Map(firstImages.map(img => [img.listingId, img]))
            
            // Add first image to each listing
            const listingsWithImages = publicListings.map(listing => ({
                ...listing,
                media: imageMap.has(listing.id) ? [{
                    id: listing.id,
                    fileUrl: imageMap.get(listing.id)!.fileUrl,
                    fileName: imageMap.get(listing.id)!.fileName
                }] : []
            }))
            
            return listingsWithImages
        }

        return publicListings.map(listing => ({
            ...listing,
            media: []
        }))
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

        revalidatePath("/dashboard/annonces")
        revalidatePath("/annonces")

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