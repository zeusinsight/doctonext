import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { updateListingStatus } from "@/lib/actions/listings"
import { listingStatusSchema } from "@/lib/validations/listing"
import { headers } from "next/headers"

export async function PATCH(
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
        const validatedData = listingStatusSchema.parse(body)

        // Update listing status using server action
        const result = await updateListingStatus(
            (await params).id,
            validatedData.status
        )

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: "Statut de l'annonce mis à jour avec succès",
                data: {
                    status: validatedData.status
                }
            })
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: result.error?.includes("non trouvée") ? 404 : 400 }
            )
        }
    } catch (error) {
        console.error("Error updating listing status:", error)

        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                error: "Erreur lors de la mise à jour du statut"
            },
            { status: 500 }
        )
    }
}
