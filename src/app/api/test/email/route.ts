import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { ListingAlertEmail } from "@/components/emails/listing-alert-template"
import { MessageNotificationEmail } from "@/components/emails/message-notification-template"
import { ContractFirstSignatureEmail } from "@/components/emails/contract-first-signature-template"
import { ContractAwaitingSignatureEmail } from "@/components/emails/contract-awaiting-signature-template"
import { ContractCompletedEmail } from "@/components/emails/contract-completed-template"
import { renderAsync } from "@react-email/render"

const resend = new Resend(process.env.RESEND_API_KEY)

// Test endpoint - only works in development
export async function GET(req: NextRequest) {
    // Only allow in development or with a secret
    if (
        process.env.NODE_ENV === "production" &&
        req.nextUrl.searchParams.get("secret") !== process.env.TEST_EMAIL_SECRET
    ) {
        return NextResponse.json({ error: "Not allowed" }, { status: 403 })
    }

    const email = req.nextUrl.searchParams.get("email") || "thomas@zeusinlabs.com"
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://careevo.com"

    // Sample listing data with images
    const testListings = [
        {
            id: "test-listing-1",
            title: "Cabinet dentaire à céder - Centre-ville Lyon",
            listingType: "transfer" as const,
            specialty: "Chirurgien-dentiste",
            imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80",
            location: {
                city: "Lyon",
                region: "Auvergne-Rhône-Alpes"
            },
            createdAt: new Date()
        },
        {
            id: "test-listing-2",
            title: "Remplacement médecin généraliste - 2 semaines",
            listingType: "replacement" as const,
            specialty: "Médecin généraliste",
            imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
            location: {
                city: "Paris",
                region: "Île-de-France"
            },
            createdAt: new Date()
        },
        {
            id: "test-listing-3",
            title: "Collaboration kinésithérapeute",
            listingType: "collaboration" as const,
            specialty: "Kinésithérapeute",
            imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
            location: {
                city: "Marseille",
                region: "Provence-Alpes-Côte d'Azur"
            },
            createdAt: new Date()
        }
    ]

    const type = req.nextUrl.searchParams.get("type") || "listing-alert"

    try {
        let emailHtml: string
        let subject: string

        if (type === "message") {
            // Message notification email
            emailHtml = await renderAsync(
                MessageNotificationEmail({
                    recipientName: "Thomas",
                    senderName: "Dr. Marie Dupont",
                    messagePreview: "Bonjour, je suis intéressée par votre annonce de cession de cabinet dentaire à Lyon. Pourriez-vous me donner plus d'informations sur les conditions de la cession et la patientèle ?",
                    conversationId: "test-conversation-123",
                    listingTitle: "Cabinet dentaire à céder - Centre-ville Lyon"
                })
            )
            subject = "[TEST] Nouveau message de Dr. Marie Dupont"
        } else if (type === "contract-first") {
            // Contract first signature email
            emailHtml = await renderAsync(
                ContractFirstSignatureEmail({
                    signerName: "Thomas",
                    recipientName: "Dr. Marie Dupont",
                    contractType: "cession",
                    listingTitle: "Cabinet dentaire à céder - Centre-ville Lyon",
                    location: "Lyon, Auvergne-Rhône-Alpes"
                })
            )
            subject = "[TEST] Signature confirmée - Contrat de cession"
        } else if (type === "contract-awaiting") {
            // Contract awaiting signature email
            emailHtml = await renderAsync(
                ContractAwaitingSignatureEmail({
                    recipientName: "Dr. Marie Dupont",
                    signerName: "Thomas",
                    contractType: "cession",
                    listingTitle: "Cabinet dentaire à céder - Centre-ville Lyon",
                    location: "Lyon, Auvergne-Rhône-Alpes",
                    contractId: "test-contract-123",
                    conversationId: "test-conversation-123"
                })
            )
            subject = "[TEST] Contrat en attente de votre signature"
        } else if (type === "contract-completed") {
            // Contract completed email
            emailHtml = await renderAsync(
                ContractCompletedEmail({
                    recipientName: "Thomas",
                    contractType: "cession",
                    listingTitle: "Cabinet dentaire à céder - Centre-ville Lyon",
                    location: "Lyon, Auvergne-Rhône-Alpes",
                    contractId: "test-contract-123",
                    documentUrl: "https://careevo.fr/dashboard/contracts/test-contract-123"
                })
            )
            subject = "[TEST] Contrat signé avec succès"
        } else {
            // Listing alert email (default)
            emailHtml = await renderAsync(
                ListingAlertEmail({
                    userName: "Thomas",
                    searchName: "Recherche test",
                    listingsCount: testListings.length,
                    listings: testListings,
                    unsubscribeUrl: `${siteUrl}/api/alerts/unsubscribe?id=test`
                })
            )
            subject = `[TEST] ${testListings.length} nouvelle(s) annonce(s) pour "Recherche test"`
        }

        const { data, error } = await resend.emails.send({
            from: process.env.MAIL_FROM || "noreply@careevo.com",
            to: email,
            subject,
            html: emailHtml
        })

        if (error) {
            console.error("Error sending test email:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: `Test ${type} email sent to ${email}`,
            emailId: data?.id
        })
    } catch (error) {
        console.error("Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }
}
