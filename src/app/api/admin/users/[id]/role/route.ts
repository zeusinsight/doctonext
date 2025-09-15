import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-utils"
import { db } from "@/database/db"
import { users } from "@/database/schema"
import { eq } from "drizzle-orm"

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await requireAdmin()
        const { role } = await request.json()

        if (!role || !["user", "admin"].includes(role)) {
            return NextResponse.json(
                { success: false, error: "Rôle invalide" },
                { status: 400 }
            )
        }

        if ((await params).id === currentUser.id && role === "user") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Vous ne pouvez pas retirer vos propres privilèges d'administrateur"
                },
                { status: 400 }
            )
        }

        const [targetUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, (await params).id))
            .limit(1)

        if (!targetUser) {
            return NextResponse.json(
                { success: false, error: "Utilisateur introuvable" },
                { status: 404 }
            )
        }

        await db
            .update(users)
            .set({
                role,
                updatedAt: new Date()
            })
            .where(eq(users.id, (await params).id))

        return NextResponse.json({
            success: true,
            message: `Rôle mis à jour vers ${role === "admin" ? "administrateur" : "utilisateur"}`
        })
    } catch (error) {
        console.error("Error updating user role:", error)
        return NextResponse.json(
            { success: false, error: "Erreur lors de la mise à jour du rôle" },
            { status: 500 }
        )
    }
}
