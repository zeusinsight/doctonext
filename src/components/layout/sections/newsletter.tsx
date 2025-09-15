"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const NewsletterSection = () => {
    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle newsletter signup
        console.log("Newsletter signup:", email)
    }

    return (
        <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-4 font-bold text-4xl text-white md:text-5xl">
                        Restez informé
                    </h2>
                    <p className="mb-8 text-blue-100 text-lg md:text-xl">
                        Inscrivez-vous à notre newsletter pour recevoir les
                        dernières annonces et conseils pour les professionnels
                        de santé
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto mb-4 flex max-w-md flex-col gap-4 sm:flex-row"
                    >
                        <Input
                            type="email"
                            placeholder="Votre adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 border-blue-400/30 bg-white/20 text-white backdrop-blur-sm placeholder:text-blue-200 focus:bg-white/30"
                        />
                        <Button
                            type="submit"
                            className="bg-white px-8 font-semibold text-blue-600 hover:bg-blue-50"
                        >
                            S'inscrire
                        </Button>
                    </form>

                    <p className="text-blue-200 text-sm">
                        En vous inscrivant, vous acceptez nos conditions
                        d'utilisation et notre politique de confidentialité
                    </p>
                </div>
            </div>
        </section>
    )
}
