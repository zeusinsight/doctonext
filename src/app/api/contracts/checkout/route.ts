import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Stripe from "stripe"
import { createContract } from "@/lib/services/contract-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
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

        const body = await req.json()
        const {
            conversationId,
            listingId,
            recipientId,
            senderId,
            contractType,
            docusealTemplateId,
            templateId
        } = body

        // Validate required fields
        if (!listingId || !recipientId || !senderId || !contractType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Ensure the current user is the sender
        if (session.user.id !== senderId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        // Create contract record
        const contract = await createContract({
            conversationId,
            listingId,
            senderId,
            recipientId,
            contractType,
            templateId,
            docusealTemplateId
        })

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: "Création de contrat professionnel",
                            description: `Contrat de ${contractType} - DoctoNext`
                        },
                        unit_amount: 500 // €5.00 in cents
                    },
                    quantity: 1
                }
            ],
            metadata: {
                contractId: contract.id,
                listingId,
                senderId,
                recipientId,
                contractType
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/messages?contract_success=${contract.id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/messages?contract_cancelled=true`,
            customer_email: session.user.email
        })

        return NextResponse.json({
            checkoutUrl: checkoutSession.url,
            contractId: contract.id
        })
    } catch (error) {
        console.error("Contract checkout error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
