import { NextRequest, NextResponse } from "next/server"
import { toggleFavorite } from "@/lib/actions/favorites"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { listingId } = body

        if (!listingId) {
            return NextResponse.json(
                { success: false, error: "listingId is required" },
                { status: 400 }
            )
        }

        const result = await toggleFavorite(listingId)
        
        return NextResponse.json({
            success: result.success,
            isFavorite: result.isFavorite,
            error: result.error
        })
    } catch (error) {
        console.error("Error in POST /api/favorites/toggle:", error)
        
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        )
    }
}