import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { downloadSignedContract } from "@/lib/services/contract-service"

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

        // Download signed contract
        const result = await downloadSignedContract(contractId)

        return NextResponse.json(result)
    } catch (error) {
        console.error("Download contract error:", error)
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error"
            },
            { status: 500 }
        )
    }
}
