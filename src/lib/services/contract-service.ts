"use server"

import { DocusealApi } from "@docuseal/api"
import { db } from "@/database/db"
import {
    contracts,
    contractTemplates,
    listings,
    users,
    replacementDetails
} from "@/database/schema"
import { eq, and } from "drizzle-orm"
import { nanoid } from "nanoid"

const docuseal = new DocusealApi({
    key: process.env.DOCUSEAL_API_KEY!
})

export interface ContractTemplate {
    id: string
    name: string
    contractType: string
    profession: string
    description: string
    docusealTemplateId: string
}

export interface ContractParties {
    initiator: {
        id: string
        name: string
        email: string
        profession?: string
        rppsNumber?: string
        adeliNumber?: string
    }
    recipient: {
        id: string
        name: string
        email: string
        profession?: string
        rppsNumber?: string
        adeliNumber?: string
    }
}

export interface ContractData {
    listingId: string
    listingTitle: string
    location: string
    startDate?: string
    endDate?: string
    price?: number
    additionalTerms?: string
    feeSharePercentage?: number
    submitterEmbedUrls?: Record<string, string>
}

export async function getContractTemplates(
    profession: string,
    contractType?: string
) {
    const templates = await db
        .select()
        .from(contractTemplates)
        .where(
            and(
                eq(contractTemplates.profession, profession),
                eq(contractTemplates.isActive, true),
                contractType
                    ? eq(contractTemplates.contractType, contractType)
                    : undefined
            )
        )

    return templates
}

export async function createContract(params: {
    conversationId?: string
    listingId: string
    senderId: string
    recipientId: string
    contractType: string
    templateId?: string
    docusealTemplateId?: string
}) {
    const contractId = nanoid()

    // Get listing and user details
    const [listing] = await db
        .select()
        .from(listings)
        .where(eq(listings.id, params.listingId))

    const [sender, recipient] = await Promise.all([
        db.select().from(users).where(eq(users.id, params.senderId)),
        db.select().from(users).where(eq(users.id, params.recipientId))
    ])

    if (!listing || !sender[0] || !recipient[0]) {
        throw new Error("Required data not found")
    }

    // Récupérer les détails de remplacement si c'est un contrat de remplacement
    let replacementData = null
    if (params.contractType === "replacement") {
        const [details] = await db
            .select()
            .from(replacementDetails)
            .where(eq(replacementDetails.listingId, params.listingId))
        replacementData = details
    }

    // Prepare contract data
    const contractData: ContractData = {
        listingId: params.listingId,
        listingTitle: listing.title,
        location: "Location TBD", // Will be filled from listing location
        startDate: replacementData?.startDate || undefined,
        endDate: replacementData?.endDate || undefined,
        feeSharePercentage: replacementData?.feeSharePercentage
            ? parseFloat(replacementData.feeSharePercentage)
            : undefined
    }

    // Prepare parties data
    const parties: ContractParties = {
        initiator: {
            id: sender[0].id,
            name: sender[0].name,
            email: sender[0].email,
            profession: sender[0].profession || undefined,
            rppsNumber: sender[0].rppsNumber || undefined,
            adeliNumber: sender[0].adeliNumber || undefined
        },
        recipient: {
            id: recipient[0].id,
            name: recipient[0].name,
            email: recipient[0].email,
            profession: recipient[0].profession || undefined,
            rppsNumber: recipient[0].rppsNumber || undefined,
            adeliNumber: recipient[0].adeliNumber || undefined
        }
    }

    // Create contract record
    const [contract] = await db
        .insert(contracts)
        .values({
            id: contractId,
            conversationId: params.conversationId,
            listingId: params.listingId,
            senderId: params.senderId,
            recipientId: params.recipientId,
            contractType: params.contractType,
            templateId: params.templateId || null, // Make optional for now
            docusealTemplateId: params.docusealTemplateId,
            status: "pending_payment",
            contractData,
            parties,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        })
        .returning()

    return contract
}

export async function createDocusealSubmission(contractId: string) {
    const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId))

    if (!contract || !contract.docusealTemplateId) {
        throw new Error("Contract or template not found")
    }

    const parties = contract.parties as ContractParties
    const contractData = contract.contractData as ContractData

    // Create DocuSeal submission
    console.log(
        "Creating DocuSeal submission with template ID:",
        contract.docusealTemplateId
    )
    console.log("Submitters:", parties)

    // Préparer les champs pré-remplis pour le contrat de remplacement
    const prefillFieldsFirstParty: { name: string; default_value: string }[] = []
    const prefillFieldsSecondParty: { name: string; default_value: string }[] = []

    // Champs de l'annonce (pour First Party)
    if (contractData.startDate) {
        prefillFieldsFirstParty.push({ name: "DATE_DEBUT", default_value: contractData.startDate })
    }
    if (contractData.endDate) {
        prefillFieldsFirstParty.push({ name: "DATE_FIN", default_value: contractData.endDate })
    }
    if (contractData.feeSharePercentage) {
        prefillFieldsFirstParty.push({ name: "POURCENTAGE", default_value: contractData.feeSharePercentage.toString() })
    }

    // Nom pour chaque partie
    if (parties.initiator.name) {
        prefillFieldsFirstParty.push({ name: "NOM", default_value: parties.initiator.name })
    }
    if (parties.recipient.name) {
        prefillFieldsSecondParty.push({ name: "NOM", default_value: parties.recipient.name })
    }

    // RPPS pour chaque partie
    if (parties.initiator.rppsNumber) {
        prefillFieldsFirstParty.push({ name: "RPPS", default_value: parties.initiator.rppsNumber })
    }
    if (parties.recipient.rppsNumber) {
        prefillFieldsSecondParty.push({ name: "RPPS", default_value: parties.recipient.rppsNumber })
    }

    const submission = await docuseal.createSubmission({
        template_id: parseInt(contract.docusealTemplateId),
        send_email: false, // We'll handle this manually
        submitters: [
            {
                role: "First Party",
                email: parties.initiator.email,
                name: parties.initiator.name,
                fields: prefillFieldsFirstParty.length > 0 ? prefillFieldsFirstParty : undefined
            },
            {
                role: "Second Party",
                email: parties.recipient.email,
                name: parties.recipient.name,
                fields: prefillFieldsSecondParty.length > 0 ? prefillFieldsSecondParty : undefined
            }
        ]
    })

    // Update contract with DocuSeal submission ID
    await db
        .update(contracts)
        .set({
            docusealSubmissionId: submission.id.toString(),
            status: "pending_signature",
            updatedAt: new Date()
        })
        .where(eq(contracts.id, contractId))

    console.log("DocuSeal submission response:", submission)

    // Store embed URLs for both submitters
    const submitterEmbedUrls =
        submission.submitters?.reduce((acc: any, submitter: any) => {
            acc[submitter.email] = submitter.embed_src
            return acc
        }, {}) || {}

    // Update contract with submission info and embed URLs
    await db
        .update(contracts)
        .set({
            contractData: {
                ...contractData,
                submitterEmbedUrls
            },
            updatedAt: new Date()
        })
        .where(eq(contracts.id, contractId))

    return {
        submissionId: submission.id,
        submitterEmbedUrls
    }
}

export async function getContractStatus(contractId: string) {
    const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId))

    if (!contract) {
        throw new Error("Contract not found")
    }

    // If we have a DocuSeal submission ID, check its status
    if (contract.docusealSubmissionId) {
        try {
            const submission = await docuseal.getSubmission(
                parseInt(contract.docusealSubmissionId)
            )

            // Update local status based on DocuSeal status
            let newStatus = contract.status
            if (submission.completed_at) {
                newStatus = "completed"
            } else if (submission.submitters?.some((s) => s.completed_at)) {
                newStatus = "in_progress"
            }

            if (newStatus !== contract.status) {
                await db
                    .update(contracts)
                    .set({
                        status: newStatus as any,
                        signedAt: submission.completed_at
                            ? new Date(submission.completed_at)
                            : null,
                        documentUrl: submission.audit_log_url,
                        updatedAt: new Date()
                    })
                    .where(eq(contracts.id, contractId))
            }

            return {
                ...contract,
                status: newStatus,
                docusealStatus: submission
            }
        } catch (error) {
            console.error("Error fetching DocuSeal submission:", error)
        }
    }

    return contract
}

export async function getUserContracts(userId: string) {
    const userContracts = await db
        .select({
            contract: contracts,
            listing: {
                title: listings.title,
                listingType: listings.listingType
            }
        })
        .from(contracts)
        .leftJoin(listings, eq(contracts.listingId, listings.id))
        .where(
            and(
                eq(contracts.senderId, userId),
                eq(contracts.recipientId, userId)
            )
        )
        .orderBy(contracts.createdAt)

    return userContracts
}

export async function downloadSignedContract(contractId: string) {
    const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, contractId))

    if (
        !contract ||
        !contract.docusealSubmissionId ||
        contract.status !== "completed"
    ) {
        throw new Error("Contract not found or not completed")
    }

    try {
        const submission = await docuseal.getSubmission(
            parseInt(contract.docusealSubmissionId)
        )

        if (submission.audit_log_url) {
            return {
                url: submission.audit_log_url,
                filename: `contract-${contractId}.pdf`
            }
        }

        throw new Error("No signed document available")
    } catch (error) {
        console.error("Error downloading contract:", error)
        throw new Error("Failed to download contract")
    }
}

export async function sendFirstPartySignedEmail(
    contractId: string,
    signerEmail: string
) {
    try {
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.id, contractId))

        if (!contract) {
            throw new Error("Contract not found")
        }

        const parties = contract.parties as ContractParties
        const contractData = contract.contractData as ContractData

        // Find the signer and recipient
        const signer =
            parties.initiator.email === signerEmail
                ? parties.initiator
                : parties.recipient
        const recipient =
            parties.initiator.email === signerEmail
                ? parties.recipient
                : parties.initiator

        if (!signer) {
            throw new Error("Signer not found in contract parties")
        }

        // Import email template
        const { ContractFirstSignatureEmail } = await import(
            "@/components/emails/contract-first-signature-template"
        )
        const { renderAsync } = await import("@react-email/render")
        const { Resend } = await import("resend")

        const resend = new Resend(process.env.RESEND_API_KEY)

        const emailHtml = await renderAsync(
            ContractFirstSignatureEmail({
                signerName: signer.name,
                recipientName: recipient.name,
                contractType: contract.contractType,
                listingTitle: contractData.listingTitle,
                location: contractData.location
            })
        )

        const { error } = await resend.emails.send({
            from: process.env.MAIL_FROM || "noreply@careevo.fr",
            to: signerEmail,
            subject:
                "Signature confirmée ✅ - Contrat en attente de la deuxième signature",
            html: emailHtml
        })

        if (error) {
            console.error("Error sending first party signed email:", error)
            return false
        }

        console.log("First party signed email sent to:", signerEmail)
        return true
    } catch (error) {
        console.error("Error sending first party signed email:", error)
        return false
    }
}

export async function sendSecondPartyNotificationEmail(
    contractId: string,
    recipientEmail: string
) {
    try {
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.id, contractId))

        if (!contract) {
            throw new Error("Contract not found")
        }

        const parties = contract.parties as ContractParties
        const contractData = contract.contractData as ContractData

        // Find the recipient and signer
        const recipient =
            parties.initiator.email === recipientEmail
                ? parties.initiator
                : parties.recipient
        const signer =
            parties.initiator.email === recipientEmail
                ? parties.recipient
                : parties.initiator

        if (!recipient) {
            throw new Error("Recipient not found in contract parties")
        }

        // Import email template
        const { ContractAwaitingSignatureEmail } = await import(
            "@/components/emails/contract-awaiting-signature-template"
        )
        const { renderAsync } = await import("@react-email/render")
        const { Resend } = await import("resend")

        const resend = new Resend(process.env.RESEND_API_KEY)

        const emailHtml = await renderAsync(
            ContractAwaitingSignatureEmail({
                recipientName: recipient.name,
                signerName: signer.name,
                contractType: contract.contractType,
                listingTitle: contractData.listingTitle,
                location: contractData.location,
                contractId: contractId,
                conversationId: contract.conversationId || ""
            })
        )

        const { error } = await resend.emails.send({
            from: process.env.MAIL_FROM || "noreply@careevo.fr",
            to: recipientEmail,
            subject: `📋 Signature requise - Contrat de ${signer.name}`,
            html: emailHtml
        })

        if (error) {
            console.error(
                "Error sending second party notification email:",
                error
            )
            return false
        }

        console.log("Second party notification email sent to:", recipientEmail)
        return true
    } catch (error) {
        console.error("Error sending second party notification email:", error)
        return false
    }
}

export async function sendContractCompletedEmail(contractId: string) {
    try {
        const [contract] = await db
            .select()
            .from(contracts)
            .where(eq(contracts.id, contractId))

        if (!contract) {
            throw new Error("Contract not found")
        }

        const parties = contract.parties as ContractParties
        const contractData = contract.contractData as ContractData

        // Import email template
        const { ContractCompletedEmail } = await import(
            "@/components/emails/contract-completed-template"
        )
        const { renderAsync } = await import("@react-email/render")
        const { Resend } = await import("resend")

        const resend = new Resend(process.env.RESEND_API_KEY)

        // Send completion email to both parties
        const emailPromises = [parties.initiator, parties.recipient].map(
            async (party) => {
                const emailHtml = await renderAsync(
                    ContractCompletedEmail({
                        recipientName: party.name,
                        contractType: contract.contractType,
                        listingTitle: contractData.listingTitle,
                        location: contractData.location,
                        contractId: contractId,
                        documentUrl: contract.documentUrl || undefined
                    })
                )

                const { error } = await resend.emails.send({
                    from: process.env.MAIL_FROM || "noreply@careevo.com",
                    to: party.email,
                    subject: "🎉 Contrat finalisé avec succès !",
                    html: emailHtml
                })

                if (error) {
                    console.error(
                        `Error sending completion email to ${party.email}:`,
                        error
                    )
                    return false
                }

                console.log(`Contract completion email sent to: ${party.email}`)
                return true
            }
        )

        const results = await Promise.all(emailPromises)
        const successCount = results.filter(Boolean).length

        console.log(
            `Contract completion emails: ${successCount}/2 sent successfully`
        )
        return successCount > 0
    } catch (error) {
        console.error("Error sending contract completion emails:", error)
        return false
    }
}
