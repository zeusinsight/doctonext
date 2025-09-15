import { type NextRequest, NextResponse } from "next/server"
import { checkNewListingAgainstSavedSearches } from "@/lib/services/alert-service"

export async function GET(request: NextRequest) {
    try {
        // This endpoint is now for testing specific listings
        const searchParams = request.nextUrl.searchParams
        const listingId = searchParams.get("listingId")

        if (!listingId) {
            return NextResponse.json(
                {
                    error: "Missing listingId parameter",
                    usage: "GET /api/alerts/check?listingId=<id>"
                },
                { status: 400 }
            )
        }

        // Verify API key for security (optional)
        const authHeader = request.headers.get("authorization")
        const apiKey = process.env.ALERTS_API_KEY

        if (apiKey && authHeader !== `Bearer ${apiKey}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Check alerts for the specific listing
        const result = await checkNewListingAgainstSavedSearches(listingId)

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
                stats: result.stats
            })
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error("Error in alerts check API:", error)
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { listingId } = body

        if (!listingId) {
            return NextResponse.json(
                { error: "Missing listingId in request body" },
                { status: 400 }
            )
        }

        // Check alerts for the specific listing
        const result = await checkNewListingAgainstSavedSearches(listingId)

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
                stats: result.stats
            })
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error("Error in alerts check API:", error)
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        )
    }
}
