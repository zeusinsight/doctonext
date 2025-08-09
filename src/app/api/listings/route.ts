import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createListing, getPublicListings } from "@/lib/actions/listings"
import { createListingSchema, listingFiltersSchema } from "@/lib/validations/listing"
import { headers } from "next/headers"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        
        const filters = {
            listingType: searchParams.get("type") || undefined,
            specialty: searchParams.get("specialty") || undefined,
            region: searchParams.get("region") || undefined,
            search: searchParams.get("search") || undefined,
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "20"),
            sortBy: searchParams.get("sortBy") || undefined
        }

        // Validate filters
        const validatedFilters = listingFiltersSchema.parse(filters)

        const listings = await getPublicListings({
            listingType: validatedFilters.listingType,
            specialty: validatedFilters.specialty,
            region: validatedFilters.region,
            search: validatedFilters.search,
            limit: validatedFilters.limit,
            offset: (validatedFilters.page - 1) * validatedFilters.limit,
            sortBy: validatedFilters.sortBy
        })

        return NextResponse.json({
            success: true,
            data: {
                listings,
                pagination: {
                    page: filters.page,
                    limit: filters.limit,
                    total: listings.length,
                    hasMore: listings.length === filters.limit
                }
            }
        })
    } catch (error) {
        console.error("Error fetching listings:", error)
        
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: false, error: "Erreur lors de la récupération des annonces" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            )
        }

        const body = await request.json()
        
        // Validate request body
        const validatedData = createListingSchema.parse(body)

        // Create listing using server action
        const result = await createListing(validatedData)

        if (result.success) {
            return NextResponse.json({
                success: true,
                data: {
                    listingId: result.listingId
                }
            }, { status: 201 })
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error("Error creating listing:", error)
        
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: false, error: "Erreur lors de la création de l'annonce" },
            { status: 500 }
        )
    }
}