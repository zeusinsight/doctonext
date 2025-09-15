import { createAuthClient } from "better-auth/react"
import { stripeClient } from "@better-auth/stripe/client"
import { toast } from "sonner"

export const authClient = createAuthClient({
    plugins: [
        stripeClient({
            subscription: true // Enable subscription management
        })
    ],
    onError: (ctx: any) => {
        // Handle the error
        if (ctx.error.status === 403) {
            toast.error("Veuillez vérifier votre adresse email")
        } else {
            toast.error(ctx.error.message)
        }
    }
})
