import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { db } from "@/database/db"
import { contracts } from "@/database/schema"
import { eq } from "drizzle-orm"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    try {
        const body = await req.text()
        const signature = req.headers.get("stripe-signature")

        if (!signature) {
            return NextResponse.json(
                { error: "No signature provided" },
                { status: 400 }
            )
        }

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            )
        } catch (err) {
            console.error("Webhook signature verification failed:", err)
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            )
        }

        // Handle the event
        switch (event.type) {
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(
                    event.data.object as Stripe.Checkout.Session
                )
                break

            case "payment_intent.succeeded":
                await handlePaymentIntentSucceeded(
                    event.data.object as Stripe.PaymentIntent
                )
                break

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("Stripe webhook error:", error)
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        )
    }
}

async function handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
) {
    const contractId = session.metadata?.contractId

    if (!contractId) {
        console.error("No contract ID in session metadata")
        return
    }

    try {
        // Update contract status to paid and ready for signing
        await db
            .update(contracts)
            .set({
                stripePaymentIntentId: session.payment_intent as string,
                paidAt: new Date(),
                status: "pending_signature",
                updatedAt: new Date()
            })
            .where(eq(contracts.id, contractId))

        console.log("Contract payment completed:", contractId)

        // TODO: Send notification to both parties that contract is ready for signing
        // await sendContractReadyEmail(contractId)
    } catch (error) {
        console.error("Error updating contract after payment:", error)
    }
}

async function handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
) {
    console.log("Payment intent succeeded:", paymentIntent.id)
    // Additional logic if needed
}
