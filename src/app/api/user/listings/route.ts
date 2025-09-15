import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserListings } from "@/lib/actions/listings"
import { headers } from "next/headers"

export async function GET(request: NextRequest) {
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

        // Get user's listings using server action
        const listings = await getUserListings()
        return NextResponse.json({
            success: true,
            data: {
                listings,
                total: listings.length
            }
        })
    } catch (error) {
        console.error("Error fetching user listings:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Erreur lors de la récupération de vos annonces"
            },
            { status: 500 }
        )
    }
}
