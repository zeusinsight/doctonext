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
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Restez informé
                    </h2>
                    <p className="text-lg md:text-xl text-blue-100 mb-8">
                        Inscrivez-vous à notre newsletter pour recevoir les dernières annonces et conseils pour les professionnels de santé
                    </p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-4">
                        <Input
                            type="email"
                            placeholder="Votre adresse email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 bg-white/20 backdrop-blur-sm border-blue-400/30 text-white placeholder:text-blue-200 focus:bg-white/30"
                        />
                        <Button 
                            type="submit"
                            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
                        >
                            S'inscrire
                        </Button>
                    </form>
                    
                    <p className="text-sm text-blue-200">
                        En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
                    </p>
                </div>
            </div>
        </section>
    )
}