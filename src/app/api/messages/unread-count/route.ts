import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { messages, conversations } from "@/database/schema"
import { eq, and, or } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.json(
                { error: "Authentication requise" },
                { status: 401 }
            )
        }

        // Count unread messages where user is the recipient
        const unreadMessages = await db
            .select({ count: messages.id })
            .from(messages)
            .innerJoin(
                conversations,
                eq(messages.conversationId, conversations.id)
            )
            .where(
                and(
                    eq(messages.recipientId, session.user.id),
                    eq(messages.isRead, false),
                    // Ensure user is participant in the conversation
                    or(
                        eq(conversations.participant1Id, session.user.id),
                        eq(conversations.participant2Id, session.user.id)
                    )
                )
            )

        return NextResponse.json({
            success: true,
            count: unreadMessages.length
        })
    } catch (error) {
        console.error("Error counting unread messages:", error)
        return NextResponse.json(
            { error: "Erreur lors du comptage des messages" },
            { status: 500 }
        )
    }
}
