import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { 
    getListingById, 
    updateListing, 
    deleteListing,
    incrementListingViews
} from "@/lib/actions/listings"
import { updateListingSchema } from "@/lib/validations/listing"
import { headers } from "next/headers"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {   
        const listing = await getListingById((await params).id)

        if (!listing) {
            return NextResponse.json(
                { success: false, error: "Annonce non trouvée" },
                { status: 404 }
            )
        }

        // Increment view count (fire and forget)
        incrementListingViews((await params).id).catch(error => 
            console.error("Failed to increment views:", error)
        )

        return NextResponse.json({
            success: true,
            data: listing
        })
    } catch (error) {
        console.error("Error fetching listing:", error)
        
        return NextResponse.json(
            { success: false, error: "Erreur lors de la récupération de l'annonce" },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const validatedData = updateListingSchema.parse(body)

        // Update listing using server action
        const result = await updateListing((await params).id, validatedData)

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Annonce mise à jour avec succès"
            })
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error("Error updating listing:", error)
        
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: false, error: "Erreur lors de la mise à jour de l'annonce" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        // Delete listing using server action (soft delete)
        const result = await deleteListing((await params).id)

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Annonce supprimée avec succès"
            })
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: result.error?.includes("non trouvée") ? 404 : 400 }
            )
        }
    } catch (error) {
        console.error("Error deleting listing:", error)
        
        return NextResponse.json(
            { success: false, error: "Erreur lors de la suppression de l'annonce" },
            { status: 500 }
        )
    }
}