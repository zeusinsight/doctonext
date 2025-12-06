import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Stripe from "stripe"
import { db } from "@/database/db"
import {
    listings,
    listingLocations,
    transferDetails,
    replacementDetails,
    collaborationDetails,
    listingMedia
} from "@/database/schema"
import { createListingSchema } from "@/lib/validations/listing"
import {
    geocodeByPostalCode,
    geocodeAddress,
    updateListingCoordinates
} from "@/lib/services/geocoding"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const body = await req.json()

        // Validate the listing data
        const validatedData = createListingSchema.parse(body)

        // Create the listing with pending_boost_payment status
        const result = await db.transaction(async (tx) => {
            // Create main listing with pending status
            const [listing] = await tx
                .insert(listings)
                .values({
                    id: crypto.randomUUID(),
                    userId: session.user.id,
                    title: validatedData.title,
                    description: validatedData.description,
                    listingType: validatedData.listingType,
                    specialty: validatedData.specialty,
                    status: "pending_boost_payment",
                    isBoostPlus: false, // Will be set to true after payment
                    publishedAt: null, // Will be set after payment
                    expiresAt: validatedData.expiresAt
                        ? new Date(validatedData.expiresAt)
                        : null
                })
                .returning()

            // Create location
            if (validatedData.location) {
                let lat: string | null =
                    validatedData.location.latitude ?? null
                let lng: string | null =
                    validatedData.location.longitude ?? null

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
                        console.warn(
                            "Approx geocoding failed (postal code)",
                            e
                        )
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
            if (
                validatedData.listingType === "transfer" &&
                validatedData.transferDetails
            ) {
                await tx.insert(transferDetails).values({
                    id: crypto.randomUUID(),
                    listingId: listing.id,
                    ...validatedData.transferDetails
                })
            }

            if (
                validatedData.listingType === "replacement" &&
                validatedData.replacementDetails
            ) {
                await tx.insert(replacementDetails).values({
                    id: crypto.randomUUID(),
                    listingId: listing.id,
                    ...validatedData.replacementDetails
                })
            }

            if (
                validatedData.listingType === "collaboration" &&
                validatedData.collaborationDetails
            ) {
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
                    investmentAmount:
                        cd.investmentAmount == null
                            ? null
                            : String(cd.investmentAmount),
                    remunerationModel: cd.remunerationModel,
                    specialtiesWanted: cd.specialtiesWanted,
                    experienceRequired: cd.experienceRequired,
                    valuesAndGoals: cd.valuesAndGoals
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

        // Fire-and-forget precise geocoding
        if (validatedData.location) {
            ;(async () => {
                try {
                    const precise = await geocodeAddress(
                        validatedData.location!.address || "",
                        validatedData.location!.city,
                        validatedData.location!.postalCode
                    )
                    if (!("error" in precise)) {
                        await updateListingCoordinates(result.id, precise)
                    }
                } catch (e) {
                    console.warn(
                        "Background precise geocoding failed for listing",
                        result.id,
                        e
                    )
                }
            })()
        }

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: "Boost+ Annonce",
                            description:
                                "Mise en avant de votre annonce - Care Evo"
                        },
                        unit_amount: 500 // €5.00
                    },
                    quantity: 1
                }
            ],
            metadata: {
                listingId: result.id,
                userId: session.user.id,
                type: "boost"
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/annonces?boost_success=${result.id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/annonces?boost_cancelled=${result.id}`,
            customer_email: session.user.email
        })

        return NextResponse.json({
            checkoutUrl: checkoutSession.url,
            listingId: result.id
        })
    } catch (error) {
        console.error("Boost checkout error:", error)

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
