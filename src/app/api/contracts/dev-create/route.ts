import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { createContract } from "@/lib/services/contract-service"
import { db } from "@/database/db"
import { contracts } from "@/database/schema"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
    // Only allow this in development
    if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
            { error: "Not available in production" },
            { status: 403 }
        )
    }

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const {
            conversationId,
            listingId,
            recipientId,
            senderId,
            contractType,
            docusealTemplateId,
            templateId
        } = body

        // Validate required fields
        if (!listingId || !recipientId || !senderId || !contractType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Ensure the current user is the sender
        if (session.user.id !== senderId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        // Create contract record
        const contract = await createContract({
            conversationId,
            listingId,
            senderId,
            recipientId,
            contractType,
            templateId,
            docusealTemplateId
        })

        // DEV: Immediately mark as paid and ready for signing
        await db
            .update(contracts)
            .set({
                paidAt: new Date(),
                status: "pending_signature",
                updatedAt: new Date()
            })
            .where(eq(contracts.id, contract.id))

        return NextResponse.json({
            contractId: contract.id,
            message: "Contract created and marked as paid (dev mode)"
        })
    } catch (error) {
        console.error("Dev contract creation error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
