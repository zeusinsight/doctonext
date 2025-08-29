import { Card } from "@/components/ui/card"
import { FileText, Search, MessageSquare, Handshake } from "lucide-react"

const steps = [
    {
        icon: FileText,
        label: "Publiez",
        title: "Mettez en ligne votre annonce en quelques clics",
        description: "Créez un compte et publiez votre annonce détaillée en quelques minutes."
    },
    {
        icon: Search,
        label: "Recherchez",
        title: "Trouvez rapidement l'opportunité qui vous correspond",
        description: "Utilisez notre moteur de recherche avancé pour trouver l'opportunité idéale."
    },
    {
        icon: MessageSquare,
        label: "Échangez",
        title: "Discutez directement via notre messagerie sécurisée",
        description: "Communiquez directement via notre messagerie sécurisée."
    },
    {
        icon: Handshake,
        label: "Concrétisez",
        title: "Finalisez votre projet en toute sérénité",
        description: "Finalisez votre transaction et développez votre activité professionnelle."
    }
]

export const HowItWorksSection = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Comment ça marche ?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Doctonext simplifie l'achat et la vente de patientèle et de fonds de commerce dans le domaine médical
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <Card key={index} className="bg-white border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                                        {step.label}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {step.description}
                                </p>
                            </Card>
                        )
                    })}
                </div>
                
                <div className="text-center mt-12">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        En savoir plus
                    </button>
                </div>
            </div>
        </section>
    )
}