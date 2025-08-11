import { auth } from "@/lib/auth"
import { db } from "@/database/db"
import { conversations, users, listings } from "@/database/schema"
import { eq, and, or, desc } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.json({ error: "Authentication requise" }, { status: 401 })
        }

        const userConversations = await db
            .select({
                id: conversations.id,
                listingId: conversations.listingId,
                participant1Id: conversations.participant1Id,
                participant2Id: conversations.participant2Id,
                lastMessageAt: conversations.lastMessageAt,
                lastMessageContent: conversations.lastMessageContent,
                createdAt: conversations.createdAt,
                updatedAt: conversations.updatedAt,
                // Get the other participant's info
                otherParticipant: {
                    id: users.id,
                    name: users.name,
                    avatar: users.avatar,
                    avatarUrl: users.image
                },
                // Get listing info
                listing: {
                    id: listings.id,
                    title: listings.title,
                    listingType: listings.listingType
                }
            })
            .from(conversations)
            .leftJoin(
                users,
                or(
                    and(
                        eq(conversations.participant1Id, session.user.id),
                        eq(users.id, conversations.participant2Id)
                    ),
                    and(
                        eq(conversations.participant2Id, session.user.id),
                        eq(users.id, conversations.participant1Id)
                    )
                )
            )
            .leftJoin(listings, eq(conversations.listingId, listings.id))
            .where(
                or(
                    eq(conversations.participant1Id, session.user.id),
                    eq(conversations.participant2Id, session.user.id)
                )
            )
            .orderBy(desc(conversations.lastMessageAt))

        return NextResponse.json({ success: true, data: userConversations })
    } catch (error) {
        console.error("Error fetching conversations:", error)
        return NextResponse.json(
            { error: "Erreur lors de la récupération des conversations" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.json({ error: "Authentication requise" }, { status: 401 })
        }

        const { listingId, participantId } = await request.json()

        if (!listingId || !participantId) {
            return NextResponse.json(
                { error: "listingId et participantId sont requis" },
                { status: 400 }
            )
        }

        // Check if conversation already exists
        const existingConversation = await db
            .select()
            .from(conversations)
            .where(
                and(
                    eq(conversations.listingId, listingId),
                    or(
                        and(
                            eq(conversations.participant1Id, session.user.id),
                            eq(conversations.participant2Id, participantId)
                        ),
                        and(
                            eq(conversations.participant1Id, participantId),
                            eq(conversations.participant2Id, session.user.id)
                        )
                    )
                )
            )
            .limit(1)

        if (existingConversation.length > 0) {
            return NextResponse.json({ 
                success: true, 
                data: existingConversation[0],
                existing: true 
            })
        }

        // Create new conversation
        const [newConversation] = await db
            .insert(conversations)
            .values({
                id: crypto.randomUUID(),
                listingId,
                participant1Id: session.user.id,
                participant2Id: participantId,
                lastMessageAt: new Date(),
                lastMessageContent: null
            })
            .returning()

        return NextResponse.json({ 
            success: true, 
            data: newConversation,
            existing: false 
        })
    } catch (error) {
        console.error("Error creating conversation:", error)
        return NextResponse.json(
            { error: "Erreur lors de la création de la conversation" },
            { status: 500 }
        )
    }
}