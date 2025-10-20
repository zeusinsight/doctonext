import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
    {
        quote: "Care Evo a transformé ma recherche de collaboration. J'ai trouvé le partenaire idéal en quelques semaines seulement.",
        name: "Dr. Sophie Dubois",
        title: "Médecin Généraliste",
        rating: 5,
        avatar: "SD",
        avatarColor: "bg-care-evo-primary"
    },
    {
        quote: "La plateforme est incroyablement intuitive. J'ai pu publier mon annonce et recevoir des candidatures qualifiées très rapidement.",
        name: "Dr. Antoine Martin",
        title: "Dentiste",
        rating: 5,
        avatar: "AM",
        avatarColor: "bg-care-evo-accent"
    },
    {
        quote: "Grâce à Care Evo, j'ai trouvé un remplaçant de confiance pour mon cabinet en un temps record. Je recommande vivement!",
        name: "Dr. Isabelle Lefevre",
        title: "Kinésithérapeute",
        rating: 5,
        avatar: "IL",
        avatarColor: "bg-care-evo-primary"
    },
];

export const TestimonialsSection = () => {
    return (
        <section className="bg-gradient-to-br from-white via-care-evo-primary/2 to-care-evo-accent/2 py-20 sm:py-28">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center mb-16">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                        Des milliers de professionnels nous font confiance
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Rejoignez une communauté de professionnels de la santé qui transforment leur carrière avec Care Evo.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3 max-w-6xl mx-auto">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name} className="border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <CardContent className="p-8">
                                {/* Star Rating - Remplies */}
                                <div className="mb-6 flex gap-1">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>
                                {/* Quote */}
                                <p className="mb-8 text-base leading-relaxed text-gray-700 italic">
                                    "{testimonial.quote}"
                                </p>
                                {/* Author avec photo de profil ronde */}
                                <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${testimonial.avatarColor} text-white font-bold text-sm flex-shrink-0`}>
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-care-evo-accent font-medium">{testimonial.title}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
