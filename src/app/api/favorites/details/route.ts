import { NextRequest, NextResponse } from "next/server"
import { getUserFavoritesWithDetails } from "@/lib/actions/favorites"

export async function GET() {
    try {
        const result = await getUserFavoritesWithDetails()
        
        return NextResponse.json({
            success: result.success,
            favorites: result.favorites,
            count: result.count,
            error: result.error
        })
    } catch (error) {
        console.error("Error in GET /api/favorites/details:", error)
        
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        )
    }
}