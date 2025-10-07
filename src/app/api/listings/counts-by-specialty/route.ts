import { type NextRequest, NextResponse } from "next/server"
import { getListingCountsBySpecialty } from "@/lib/actions/listings"

export const revalidate = 300 // Cache for 5 minutes

export async function GET(request: NextRequest) {
    try {
        const counts = await getListingCountsBySpecialty()

        return NextResponse.json({
            success: true,
            data: counts
        })
    } catch (error) {
        console.error("Error fetching listing counts by specialty:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Erreur lors de la récupération des compteurs"
            },
            { status: 500 }
        )
    }
}
