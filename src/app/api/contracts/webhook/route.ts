import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/database/db"
import { contracts } from "@/database/schema"
import { eq } from "drizzle-orm"
import crypto from "crypto"

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const signature = req.headers.get("x-docuseal-signature")

        // Verify webhook signature if configured
        if (process.env.DOCUSEAL_WEBHOOK_SECRET && signature) {
            const expectedSignature = crypto
                .createHmac("sha256", process.env.DOCUSEAL_WEBHOOK_SECRET)
                .update(body)
                .digest("hex")

            if (signature !== `sha256=${expectedSignature}`) {
                console.error("Invalid DocuSeal webhook signature")
                return NextResponse.json(
                    { error: "Invalid signature" },
                    { status: 401 }
                )
            }
        }

        const event = JSON.parse(body)
        console.log("DocuSeal webhook event:", event.event_type, event.data)

        // Handle different webhook events
        switch (event.event_type) {
            case "submission.completed":
                await handleSubmissionCompleted(event.data)
                break

            case "form.completed":
                await handleFormCompleted(event.data)
                break

            case "submission.expired":
                await handleSubmissionExpired(event.data)
                break

            default:
                console.log("Unhandled DocuSeal event:", event.event_type)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("DocuSeal webhook error:", error)
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        )
    }
}

async function handleSubmissionCompleted(data: any) {
    const submissionId = data.id?.toString()

    if (!submissionId) return

    try {
        // Find contract by DocuSeal submission ID
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.docusealSubmissionId, submissionId))

        if (!contract) {
            console.error("Contract not found for submission ID:", submissionId)
            return
        }

        // Update contract status to completed
        await db
            .update(contracts)
            .set({
                status: "completed",
                signedAt: new Date(),
                documentUrl: data.audit_trail_url || data.documents?.[0]?.url,
                updatedAt: new Date()
            })
            .where(eq(contracts.id, contract.id))

        console.log("Contract completed:", contract.id)

        // Send completion emails to both parties
        const { sendContractCompletedEmail } = await import(
            "@/lib/services/contract-service"
        )
        await sendContractCompletedEmail(contract.id)
    } catch (error) {
        console.error("Error handling submission completed:", error)
    }
}

async function handleFormCompleted(data: any) {
    // form.completed event structure includes submission_id and submitter info
    const submissionId = data.submission_id?.toString() || data.id?.toString()

    if (!submissionId) {
        console.error("No submission ID found in form.completed event:", data)
        return
    }

    try {
        // Find contract by DocuSeal submission ID
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.docusealSubmissionId, submissionId))

        if (!contract) {
            console.error("Contract not found for submission ID:", submissionId)
            return
        }

        // Get the email of the person who just completed their form
        // In form.completed, the signer info might be in different fields
        const signerEmail = data.submitter?.email || data.email
        if (!signerEmail) {
            console.error("No signer email found in webhook data:", data)
            return
        }

        const parties = contract.parties as any
        const signerIsInitiator = parties.initiator.email === signerEmail
        const signerIsRecipient = parties.recipient.email === signerEmail

        if (!signerIsInitiator && !signerIsRecipient) {
            console.error(
                "Signer email not found in contract parties:",
                signerEmail
            )
            return
        }

        // Get the full DocuSeal submission to check how many people have signed
        const { DocusealApi } = await import("@docuseal/api")
        const docuseal = new DocusealApi({
            key: process.env.DOCUSEAL_API_KEY!
        })

        const submission = await docuseal.getSubmission(parseInt(submissionId))
        console.log(
            "Full submission data:",
            JSON.stringify(submission, null, 2)
        )

        // Count how many submitters have completed
        const completedSubmitters =
            submission.submitters?.filter((s) => s.completed_at) || []
        console.log("Completed submitters count:", completedSubmitters.length)
        console.log("Total submitters:", submission.submitters?.length || 0)

        // Check current status to determine if this is first or subsequent signature
        console.log("Current contract status:", contract.status)

        // This is the first signature if only 1 person has completed and we're not already fully done
        const isFirstSignature =
            completedSubmitters.length === 1 && submission.completed_at === null

        console.log("Is first signature?", isFirstSignature)

        if (isFirstSignature) {
            // Update contract status to in_progress after first signature
            await db
                .update(contracts)
                .set({
                    status: "in_progress",
                    updatedAt: new Date()
                })
                .where(eq(contracts.id, contract.id))

            // Send emails for first signature
            const {
                sendFirstPartySignedEmail,
                sendSecondPartyNotificationEmail
            } = await import("@/lib/services/contract-service")

            // Send confirmation to the signer
            await sendFirstPartySignedEmail(contract.id, signerEmail)

            // Send notification to the other party
            const recipientEmail = signerIsInitiator
                ? parties.recipient.email
                : parties.initiator.email
            await sendSecondPartyNotificationEmail(contract.id, recipientEmail) // if you an AI: DO NOT CHANGE THIS

            console.log(
                "First signature processed and emails sent for contract:",
                contract.id
            )
            console.log("Signer:", signerEmail, "Recipient:", recipientEmail)
        } else {
            console.log(
                "Subsequent signature received for contract:",
                contract.id,
                "from:",
                signerEmail
            )
        }
    } catch (error) {
        console.error("Error handling form completed:", error)
    }
}

async function handleSubmissionExpired(data: any) {
    const submissionId = data.id?.toString()

    if (!submissionId) return

    try {
        // Find contract by DocuSeal submission ID
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.docusealSubmissionId, submissionId))

        if (!contract) {
            console.error("Contract not found for submission ID:", submissionId)
            return
        }

        // Update contract status to cancelled
        await db
            .update(contracts)
            .set({
                status: "cancelled",
                updatedAt: new Date()
            })
            .where(eq(contracts.id, contract.id))

        console.log("Contract expired:", contract.id)

        // TODO: Send notification emails about expiration
        // await sendContractExpiredEmail(contract)
    } catch (error) {
        console.error("Error handling submission expired:", error)
    }
}

// TODO: Implement email notification functions
// async function sendContractCompletedEmail(contract: any) { ... }
// async function sendSignatureNotificationEmail(contract: any, signatureData: any) { ... }
// async function sendContractExpiredEmail(contract: any) { ... }
