import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"
import { headers } from "next/headers"

import { db } from "@/database/db"
import * as schema from "@/database/schema"
import { type Plan, plans } from "@/lib/payments/plans"

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil",
    typescript: true
})

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        },
        twitter: {
            clientId: process.env.TWITTER_CLIENT_ID as string,
            clientSecret: process.env.TWITTER_CLIENT_SECRET as string
        }
    },
    plugins: [
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            subscription: {
                enabled: true,
                plans: plans,
                getCheckoutSessionParams: async ({ user, plan }) => {
                    const checkoutSession: {
                        params: {
                            subscription_data?: {
                                trial_period_days: number
                            }
                        }
                    } = {
                        params: {}
                    }

                    if (user.trialAllowed) {
                        checkoutSession.params.subscription_data = {
                            trial_period_days: (plan as Plan).trialDays
                        }
                    }

                    return checkoutSession
                },
                onSubscriptionComplete: async ({ event }) => {
                    const eventDataObject = event.data
                        .object as Stripe.Checkout.Session
                    const userId = eventDataObject.metadata?.userId
                }
            }
        })
    ]
})

export async function getActiveSubscription() {
    const nextHeaders = await headers()
    const subscriptions = await auth.api.listActiveSubscriptions({
        headers: nextHeaders
    })
    return subscriptions.find((s) => s.status === "active")
}
