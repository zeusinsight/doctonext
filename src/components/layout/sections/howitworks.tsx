import { Card } from "@/components/ui/card"
import { FileText, Search, MessageSquare, Handshake } from "lucide-react"

const steps = [
    {
        icon: FileText,
        title: "Publiez votre annonce",
        description: "Créez un compte et publiez votre annonce détaillée en quelques minutes."
    },
    {
        icon: Search,
        title: "Recherchez des opportunités",
        description: "Utilisez notre moteur de recherche avancé pour trouver l'opportunité idéale."
    },
    {
        icon: MessageSquare,
        title: "Échangez en toute sécurité",
        description: "Communiquez directement via notre messagerie sécurisée."
    },
    {
        icon: Handshake,
        title: "Concrétisez votre projet",
        description: "Finalisez votre transaction et développez votre activité professionnelle."
    }
]

export const HowItWorksSection = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-500 to-blue-700">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Comment ça marche
                    </h2>
                    <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
                        Doctonext simplifie l'achat et la vente de patientèle et de fonds de commerce dans le domaine médical
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <Card key={index} className="bg-blue-600/20 backdrop-blur-sm border-blue-400/30 p-6 text-center hover:bg-blue-600/30 transition-colors">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-blue-100">
                                    {step.description}
                                </p>
                            </Card>
                        )
                    })}
                </div>
                
                <div className="text-center mt-12">
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                        En savoir plus
                    </button>
                </div>
            </div>
        </section>
    )
}