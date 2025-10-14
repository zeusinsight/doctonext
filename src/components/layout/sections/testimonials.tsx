import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "./section-title";

const testimonials = [
    {
        quote: "CareEvo a transformé ma recherche de collaboration. J'ai trouvé le partenaire idéal en quelques semaines seulement.",
        name: "Dr. Sophie Dubois",
        title: "Médecin Généraliste",
    },
    {
        quote: "La plateforme est incroyablement intuitive. J'ai pu publier mon annonce et recevoir des candidatures qualifiées très rapidement.",
        name: "Dr. Antoine Martin",
        title: "Dentiste",
    },
    {
        quote: "Grâce à CareEvo, j'ai trouvé un remplaçant de confiance pour mon cabinet en un temps record. Je recommande vivement!",
        name: "Dr. Isabelle Lefevre",
        title: "Kinésithérapeute",
    },
];

export const TestimonialsSection = () => {
    return (
        <section className="bg-gray-50 py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <SectionTitle
                    subtitle="Ce que nos utilisateurs disent de nous"
                    title="Des milliers de professionnels nous font confiance"
                />
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name} className="bg-white">
                            <CardContent className="p-6">
                                <p className="mb-4 text-gray-600">"{testimonial.quote}"</p>
                                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                <p className="text-sm text-gray-500">{testimonial.title}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
