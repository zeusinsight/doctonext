import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { conversations, messages } from "@/database/schema"
import { eq, and, or } from "drizzle-orm"
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

        const conversationId = (await params).id

        // Verify user is participant in conversation
        const conversation = await db
            .select()
            .from(conversations)
            .where(
                and(
                    eq(conversations.id, conversationId),
                    or(
                        eq(conversations.participant1Id, session.user.id),
                        eq(conversations.participant2Id, session.user.id)
                    )
                )
            )
            .limit(1)

        if (conversation.length === 0) {
            return NextResponse.json({ error: "Conversation non trouvée" }, { status: 404 })
        }

        // Mark all messages in conversation as read (only messages where user is recipient)
        await db
            .update(messages)
            .set({
                isRead: true,
                updatedAt: new Date()
            })
            .where(
                and(
                    eq(messages.conversationId, conversationId),
                    eq(messages.recipientId, session.user.id),
                    eq(messages.isRead, false)
                )
            )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error marking all messages as read:", error)
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour des messages" },
            { status: 500 }
        )
    }
}