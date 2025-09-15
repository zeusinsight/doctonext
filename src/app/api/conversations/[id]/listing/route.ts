import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import {
    conversations,
    listings,
    listingLocations,
    transferDetails,
    replacementDetails,
    collaborationDetails,
    users
} from "@/database/schema"
import { eq, and, or } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.json(
                { error: "Authentication requise" },
                { status: 401 }
            )
        }

        const conversationId = (await params).id

        // Verify user is participant in conversation and get listing details
        const conversationWithListing = await db
            .select({
                conversation: {
                    id: conversations.id,
                    listingId: conversations.listingId,
                    participant1Id: conversations.participant1Id,
                    participant2Id: conversations.participant2Id
                },
                listing: {
                    id: listings.id,
                    title: listings.title,
                    description: listings.description,
                    listingType: listings.listingType,
                    specialty: listings.specialty,
                    status: listings.status,
                    createdAt: listings.createdAt,
                    publishedAt: listings.publishedAt,
                    userId: listings.userId
                },
                location: {
                    address: listingLocations.address,
                    city: listingLocations.city,
                    postalCode: listingLocations.postalCode,
                    region: listingLocations.region,
                    department: listingLocations.department
                },
                owner: {
                    id: users.id,
                    name: users.name,
                    profession: users.profession,
                    specialty: users.specialty,
                    isVerifiedProfessional: users.isVerifiedProfessional,
                    avatar: users.avatar,
                    avatarUrl: users.image
                }
            })
            .from(conversations)
            .leftJoin(listings, eq(conversations.listingId, listings.id))
            .leftJoin(
                listingLocations,
                eq(listings.id, listingLocations.listingId)
            )
            .leftJoin(users, eq(listings.userId, users.id))
            .where(
                and(
                    eq(conversations.id, conversationId),
                    or(
                        eq(conversations.participant1Id, session.user.id),
                        eq(conversations.participant2Id, session.user.id)
                    )
                )
            )
            .limit(1)

        if (conversationWithListing.length === 0) {
            return NextResponse.json(
                { error: "Conversation non trouvée" },
                { status: 404 }
            )
        }

        const result = conversationWithListing[0]

        if (!result.listing) {
            return NextResponse.json(
                { error: "Annonce non trouvée" },
                { status: 404 }
            )
        }

        // Get type-specific details
        let details = null
        if (result.listing.listingType === "transfer") {
            const transferDetail = await db
                .select()
                .from(transferDetails)
                .where(eq(transferDetails.listingId, result.listing.id))
                .limit(1)
            details = transferDetail[0] || null
        } else if (result.listing.listingType === "replacement") {
            const replacementDetail = await db
                .select()
                .from(replacementDetails)
                .where(eq(replacementDetails.listingId, result.listing.id))
                .limit(1)
            details = replacementDetail[0] || null
        } else if (result.listing.listingType === "collaboration") {
            const collaborationDetail = await db
                .select()
                .from(collaborationDetails)
                .where(eq(collaborationDetails.listingId, result.listing.id))
                .limit(1)
            details = collaborationDetail[0] || null
        }

        return NextResponse.json({
            success: true,
            data: {
                listing: result.listing,
                location: result.location,
                owner: result.owner,
                details: details
            }
        })
    } catch (error) {
        console.error("Error fetching listing details:", error)
        return NextResponse.json(
            { error: "Erreur lors de la récupération des détails" },
            { status: 500 }
        )
    }
}
