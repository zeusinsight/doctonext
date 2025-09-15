import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getContractStatus } from "@/lib/services/contract-service"

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

        const contractId = (await params).id

        // Get contract with updated status from DocuSeal
        const contract = await getContractStatus(contractId)

        if (!contract) {
            return NextResponse.json(
                { error: "Contract not found" },
                { status: 404 }
            )
        }

        // Ensure user has permission to view this contract
        if (
            contract.senderId !== session.user.id &&
            contract.recipientId !== session.user.id
        ) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        return NextResponse.json(contract)
    } catch (error) {
        console.error("Contract status error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
