import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { messages } from "@/database/schema"
import { eq, and } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.json({ error: "Authentication requise" }, { status: 401 })
        }

        const messageId = (await params).id

        // Mark message as read (only if user is the recipient)
        const [updatedMessage] = await db
            .update(messages)
            .set({
                isRead: true,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(messages.id, messageId),
                    eq(messages.recipientId, session.user.id)
                )
            )
            .returning()

        if (!updatedMessage) {
            return NextResponse.json({ error: "Message non trouvé" }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: updatedMessage })
    } catch (error) {
        console.error("Error marking message as read:", error)
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour du message" },
            { status: 500 }
        )
    }
}