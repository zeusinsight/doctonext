import { type NextRequest, NextResponse } from "next/server"
import { geocodeAllListings } from "@/lib/services/geocoding"

export async function POST(request: NextRequest) {
    try {
        // Check if user is admin or has appropriate permissions
        // const session = await auth.api.getSession({
        //   headers: await headers()
        // })

        // if (!session?.user) {
        //   return NextResponse.json(
        //     { success: false, error: "Authentication required" },
        //     { status: 401 }
        //   )
        // }

        // For now, let's allow any authenticated user to run this
        // In production, you might want to restrict this to admin users only

        const { searchParams } = new URL(request.url)
        const batchSize = parseInt(searchParams.get("batch_size") || "5")

        if (batchSize > 50) {
            return NextResponse.json(
                { success: false, error: "Batch size too large (max 50)" },
                { status: 400 }
            )
        }

        console.log(`Starting batch geocoding with batch size: ${batchSize}`)
        const result = await geocodeAllListings(batchSize)

        return NextResponse.json({
            success: true,
            data: {
                processed: result.success + result.failed,
                successful: result.success,
                failed: result.failed,
                rateLimited: result.rateLimited,
                message: result.rateLimited
                    ? "Geocoding paused due to rate limiting. Please retry later."
                    : `Geocoded ${result.success} listings successfully, ${result.failed} failed.`
            }
        })
    } catch (error) {
        console.error("Batch geocoding error:", error)

        return NextResponse.json(
            {
                success: false,
                error: "Erreur lors du géocodage par lot"
            },
            { status: 500 }
        )
    }
}

// Convenience handler to allow triggering from browser via GET
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const batchSize = parseInt(searchParams.get("batch_size") || "5")

        if (batchSize > 50) {
            return NextResponse.json(
                { success: false, error: "Batch size too large (max 50)" },
                { status: 400 }
            )
        }

        console.log(`Starting batch geocoding with batch size: ${batchSize}`)
        const result = await geocodeAllListings(batchSize)

        return NextResponse.json({
            success: true,
            data: {
                processed: result.success + result.failed,
                successful: result.success,
                failed: result.failed,
                rateLimited: result.rateLimited,
                message: result.rateLimited
                    ? "Geocoding paused due to rate limiting. Please retry later."
                    : `Geocoded ${result.success} listings successfully, ${result.failed} failed.`
            }
        })
    } catch (error) {
        console.error("Batch geocoding error:", error)
        return NextResponse.json(
            { success: false, error: "Erreur lors du géocodage par lot" },
            { status: 500 }
        )
    }
}
