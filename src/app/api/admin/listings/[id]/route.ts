import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-utils"
import { db } from "@/database/db"
import { listings } from "@/database/schema"
import { eq } from "drizzle-orm"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()

        const listingId = (await params).id

        // Check if listing exists
        const [existingListing] = await db
            .select()
            .from(listings)
            .where(eq(listings.id, listingId))
            .limit(1)

        if (!existingListing) {
            return NextResponse.json(
                { success: false, error: "Annonce introuvable" },
                { status: 404 }
            )
        }

        // Admin can permanently delete any listing (hard delete)
        await db.delete(listings).where(eq(listings.id, listingId))

        return NextResponse.json({
            success: true,
            message: "Annonce supprimée définitivement"
        })
    } catch (error) {
        console.error("Error deleting listing:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Erreur lors de la suppression de l'annonce"
            },
            { status: 500 }
        )
    }
}
