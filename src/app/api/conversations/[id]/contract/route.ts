import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/database/db"
import { contracts } from "@/database/schema"
import { eq } from "drizzle-orm"

export async function GET(
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

        const conversationId = (await params).id

        // Find contract by conversation ID
        const [contract] = await db
            .select({
                id: contracts.id,
                status: contracts.status,
                contractType: contracts.contractType,
                createdAt: contracts.createdAt,
                signedAt: contracts.signedAt,
                documentUrl: contracts.documentUrl,
                parties: contracts.parties,
                contractData: contracts.contractData
            })
            .from(contracts)
            .where(eq(contracts.conversationId, conversationId))

        if (!contract) {
            return NextResponse.json(
                { error: "No contract found for this conversation" },
                { status: 404 }
            )
        }

        // Verify user has permission to view this contract
        const parties = contract.parties as any
        const hasPermission =
            parties.initiator.email === session.user.email ||
            parties.recipient.email === session.user.email

        if (!hasPermission) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        return NextResponse.json(contract)
    } catch (error) {
        console.error("Get conversation contract error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
