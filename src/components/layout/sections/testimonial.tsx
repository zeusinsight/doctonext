import { Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface ReviewProps {
    image: string
    name: string
    role: string
    location: string
    comment: string
}

const reviewList: ReviewProps[] = [
    {
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop",
        name: "Dr. Sophie Martin",
        role: "Médecin généraliste",
        location: "Paris",
        comment: "Grâce à Doctonext, j'ai pu trouver rapidement un cabinet médical qui correspondait parfaitement à mes attentes. La plateforme est intuitive et les annonces sont très détaillées. Je recommande vivement ce service à tous les professionnels de santé."
    },
    {
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop",
        name: "Dr. Thomas Dubois",
        role: "Chirurgien-dentiste",
        location: "Lyon",
        comment: "J'ai pu vendre mon cabinet dentaire en seulement deux mois grâce à Doctonext. Le processus était simple, la visibilité excellente, et l'équipe m'a accompagné tout au long de la vente. Une solution idéale pour les professionnels de santé."
    },
    {
        image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=200&auto=format&fit=crop",
        name: "Marie Leroy",
        role: "Pharmacienne",
        location: "Bordeaux",
        comment: "Après plusieurs mois de recherche infructueuse, j'ai trouvé la pharmacie de mes rêves sur Doctonext. La qualité des annonces et la facilité de communication avec les vendeurs font toute la différence. Merci pour ce service qui répond vraiment à un besoin dans notre secteur."
    }
]

export const TestimonialSection = () => {
    return (
        <section id="testimonials" className="py-24 sm:py-32 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">
                        Ils nous font confiance
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Découvrez les témoignages de professionnels de santé qui ont concrétisé leurs projets grâce à Doctonext
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {reviewList.map((review, index) => (
                        <Card key={index} className="relative bg-white border-0 shadow-lg">
                            <CardContent className="p-8">
                                <Quote className="w-12 h-12 text-blue-500 mb-4" />
                                <p className="text-gray-700 mb-6 italic leading-relaxed">
                                    "{review.comment}"
                                </p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={review.image}
                                            alt={review.name}
                                        />
                                        <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-gray-900">{review.name}</p>
                                        <p className="text-sm text-gray-600">{review.role}, {review.location}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
