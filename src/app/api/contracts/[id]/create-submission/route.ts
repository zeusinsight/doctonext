import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { createDocusealSubmission } from "@/lib/services/contract-service"
import { db } from "@/database/db"
import { contracts } from "@/database/schema"
import { eq } from "drizzle-orm"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const contractId = (await params).id

        // Verify payment before creating submission
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.id, contractId))

        if (!contract) {
            return NextResponse.json(
                { error: "Contract not found" },
                { status: 404 }
            )
        }

        // Check if payment was confirmed (either paidAt is set or status is not pending_payment)
        if (!contract.paidAt && contract.status === "pending_payment") {
            return NextResponse.json(
                { error: "Payment not confirmed yet", code: "PAYMENT_PENDING" },
                { status: 402 }
            )
        }

        // Verify user is a party to this contract
        if (contract.senderId !== session.user.id && contract.recipientId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            )
        }

        // Create DocuSeal submission
        const result = await createDocusealSubmission(contractId)

        // Find the embed URL for the current user
        const userEmbedUrl = result.submitterEmbedUrls?.[session.user.email]

        return NextResponse.json({
            ...result,
            embedUrl: userEmbedUrl
        })
    } catch (error) {
        console.error("Create submission error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
