import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { conversations, messages, users, listings } from "@/database/schema"
import { eq, and, or, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createNotification } from "@/lib/actions/notifications"
import { sendMessageNotificationEmail } from "@/lib/services/alert-service"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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
            return NextResponse.json(
                { error: "Conversation non trouvée" },
                { status: 404 }
            )
        }

        // Get messages with sender info
        const conversationMessages = await db
            .select({
                id: messages.id,
                conversationId: messages.conversationId,
                senderId: messages.senderId,
                recipientId: messages.recipientId,
                listingId: messages.listingId,
                content: messages.content,
                isRead: messages.isRead,
                createdAt: messages.createdAt,
                updatedAt: messages.updatedAt,
                sender: {
                    id: users.id,
                    name: users.name,
                    avatar: users.avatar,
                    avatarUrl: users.avatarUrl
                }
            })
            .from(messages)
            .leftJoin(users, eq(messages.senderId, users.id))
            .where(eq(messages.conversationId, conversationId))
            .orderBy(desc(messages.createdAt))

        return NextResponse.json({ success: true, data: conversationMessages })
    } catch (error) {
        console.error("Error fetching messages:", error)
        return NextResponse.json(
            { error: "Erreur lors de la récupération des messages" },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const conversationId = (await params).id
        const { content } = await request.json()

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: "Le contenu du message est requis" },
                { status: 400 }
            )
        }

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
            return NextResponse.json(
                { error: "Conversation non trouvée" },
                { status: 404 }
            )
        }

        const conv = conversation[0]
        const recipientId =
            conv.participant1Id === session.user.id
                ? conv.participant2Id
                : conv.participant1Id

        // Create message
        const [newMessage] = await db
            .insert(messages)
            .values({
                id: crypto.randomUUID(),
                conversationId,
                senderId: session.user.id,
                recipientId,
                listingId: conv.listingId,
                content: content.trim(),
                isRead: false
            })
            .returning()

        // Update conversation last message
        await db
            .update(conversations)
            .set({
                lastMessageAt: new Date(),
                lastMessageContent: content.trim(),
                updatedAt: new Date()
            })
            .where(eq(conversations.id, conversationId))

        // Create notification for recipient
        await createNotification(
            recipientId,
            "new_message",
            "Nouveau message",
            `Vous avez reçu un nouveau message de ${session.user.name}`,
            {
                conversationId,
                messageId: newMessage.id,
                senderId: session.user.id,
                senderName: session.user.name,
                messagePreview: content.trim().substring(0, 100)
            }
        )

        // Get recipient user data for email notification
        const [recipient] = await db
            .select()
            .from(users)
            .where(eq(users.id, recipientId))
            .limit(1)

        let listingTitle: string | undefined

        // Get listing title if conversation is about a listing
        if (conv.listingId) {
            const [listing] = await db
                .select({ title: listings.title })
                .from(listings)
                .where(eq(listings.id, conv.listingId))
                .limit(1)

            listingTitle = listing?.title
        }

        // Send email notification asynchronously
        if (recipient) {
            // Don't await this to avoid blocking the API response
            sendMessageNotificationEmail(
                recipient.email,
                recipient.name,
                session.user.name,
                content.trim(),
                conversationId,
                listingTitle
            ).catch((error) => {
                console.error(
                    "Failed to send message notification email:",
                    error
                )
            })
        }

        return NextResponse.json({ success: true, data: newMessage })
    } catch (error) {
        console.error("Error sending message:", error)
        return NextResponse.json(
            { error: "Erreur lors de l'envoi du message" },
            { status: 500 }
        )
    }
}
