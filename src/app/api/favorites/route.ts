import { NextRequest, NextResponse } from "next/server"
import { getUserFavorites } from "@/lib/actions/favorites"

export async function GET() {
    try {
        const result = await getUserFavorites()
        
        return NextResponse.json({
            success: result.success,
            data: result.favorites,
            error: result.error
        })
    } catch (error) {
        console.error("Error in GET /api/favorites:", error)
        
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        )
    }
}