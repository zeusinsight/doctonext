import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { createDocusealSubmission } from "@/lib/services/contract-service"

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
