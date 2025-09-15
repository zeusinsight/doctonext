import { type NextRequest, NextResponse } from "next/server"
import { incrementListingViews } from "@/lib/actions/listings"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Increment view count using server action
        const result = await incrementListingViews((await params).id)

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Vue comptabilisée"
            })
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: "Erreur lors de la comptabilisation de la vue"
                },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error("Error incrementing listing views:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Erreur lors de la comptabilisation de la vue"
            },
            { status: 500 }
        )
    }
}
