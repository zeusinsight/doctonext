import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/database/db"
import { contracts } from "@/database/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        const { searchParams } = new URL(req.url)
        const contractId = searchParams.get("contractId")
        const conversationId = searchParams.get("conversationId")

        if (!contractId) {
            return NextResponse.json(
                { error: "Contract ID is required" },
                { status: 400 }
            )
        }

        // If user is not authenticated, redirect to login with return URL
        if (!session) {
            const returnUrl = encodeURIComponent(req.url)
            return NextResponse.redirect(
                new URL(`/auth/sign-in?callbackUrl=${returnUrl}`, req.url)
            )
        }

        // Get contract details
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

        // Check if user has permission to access this contract
        const userEmail = session.user.email
        const parties = contract.parties as any
        const hasPermission =
            parties.initiator.email === userEmail ||
            parties.recipient.email === userEmail

        if (!hasPermission) {
            return NextResponse.json(
                { error: "Unauthorized access to contract" },
                { status: 403 }
            )
        }

        // Build redirect URL based on contract status and user role
        let redirectUrl = "/dashboard/messages"

        if (conversationId) {
            redirectUrl = `/dashboard/messages/${conversationId}`
        }

        // Add contract resume parameter if contract is still in signing process
        if (
            contract.status === "pending_signature" ||
            contract.status === "in_progress"
        ) {
            const separator = redirectUrl.includes("?") ? "&" : "?"
            redirectUrl += `${separator}contract_resume=${contractId}`
        }

        // Redirect to the appropriate page
        return NextResponse.redirect(new URL(redirectUrl, req.url))
    } catch (error) {
        console.error("Contract redirect error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
