import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"
import { headers } from "next/headers"
import { Resend } from "resend"
import { EmailTemplate } from "@daveyplate/better-auth-ui/server"
import React from "react"
import { db } from "@/database/db"
import * as schema from "@/database/schema"
import { type Plan, plans } from "@/lib/payments/plans"
import { site } from "@/config/site"

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true
})

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema
    }),

    emailAndPassword: {
        rememberMe: true,
        enabled: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            const name = user.name || user.email.split("@")[0]

            await resend.emails.send({
                from: site.mailFrom,
                to: user.email,
                subject: "Réinitialisez votre mot de passe",
                react: EmailTemplate({
                    heading: "Réinitialisez votre mot de passe",
                    content: React.createElement(
                        React.Fragment,
                        null,
                        React.createElement("p", null, `Bonjour ${name},`),
                        React.createElement(
                            "p",
                            null,
                            "Quelqu'un a demandé la réinitialisation du mot de passe de votre compte. Si c'était vous, ",
                            "cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe."
                        ),
                        React.createElement(
                            "p",
                            null,
                            "Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email en toute sécurité."
                        )
                    ),
                    action: "Réinitialiser le mot de passe",
                    url,
                    siteName: site.name,
                    baseUrl: site.url,
                    imageUrl: `${site.url}/logo.png`
                })
            })
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
