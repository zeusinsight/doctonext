import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/database/db"
import { contracts } from "@/database/schema"
import { eq } from "drizzle-orm"
import { DocusealApi } from "@docuseal/api"

const docuseal = new DocusealApi({
    key: process.env.DOCUSEAL_API_KEY!,
})

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

        // Get contract
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.id, contractId))

        if (!contract || !contract.docusealSubmissionId) {
            return NextResponse.json(
                { error: "Contract or submission not found" },
                { status: 404 }
            )
        }

        // Ensure user has permission to view this contract
        if (contract.senderId !== session.user.id && contract.recipientId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            )
        }

        // Get DocuSeal submission details
        const submission = await docuseal.getSubmission(
            parseInt(contract.docusealSubmissionId)
        )

        // Find the correct submitter for the current user
        const parties = contract.parties as any
        let currentUserSubmitter = null

        for (const submitter of submission.submitters || []) {
            if (submitter.email === session.user.email) {
                currentUserSubmitter = submitter
                break
            }
        }

        if (!currentUserSubmitter) {
            return NextResponse.json(
                { error: "Submitter not found for current user" },
                { status: 404 }
            )
        }

        // Debug: log the submitter object to see its structure
        console.log("Submitter object:", JSON.stringify(currentUserSubmitter, null, 2))

        // Try different possible embed URL field names
        const embedUrl = (currentUserSubmitter as any).embed_src || 
                         (currentUserSubmitter as any).embed_url ||
                         `https://docuseal.com/s/${currentUserSubmitter.slug}`

        console.log("Final embed URL:", embedUrl)

        return NextResponse.json({
            embedUrl,
            submitterSlug: currentUserSubmitter.slug,
            status: currentUserSubmitter.status
        })

    } catch (error) {
        console.error("Get embed URL error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}