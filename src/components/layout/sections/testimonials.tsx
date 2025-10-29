import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Care Evo a transformé ma recherche de collaboration. J'ai trouvé le partenaire idéal en quelques semaines seulement.",
    name: "Dr. Sophie Dubois",
    title: "Médecin Généraliste",
    rating: 5,
    initials: "SD",
    bgColor: "bg-blue-500",
  },
  {
    quote:
      "La plateforme est incroyablement intuitive. J'ai pu publier mon annonce et recevoir des candidatures qualifiées très rapidement.",
    name: "Dr. Antoine Martin",
    title: "Dentiste",
    rating: 5,
    initials: "AM",
    bgColor: "bg-emerald-500",
  },
  {
    quote:
      "Grâce à Care Evo, j'ai trouvé un remplaçant de confiance pour mon cabinet en un temps record. Je recommande vivement!",
    name: "Dr. Isabelle Lefevre",
    title: "Kinésithérapeute",
    rating: 5,
    initials: "IL",
    bgColor: "bg-purple-500",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="bg-gradient-to-br from-white via-care-evo-primary/2 to-care-evo-accent/2 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Des milliers de professionnels nous font confiance
          </h2>
          <p className="text-lg text-gray-600">
            Rejoignez une communauté de professionnels de la santé qui
            transforment leur carrière avec Care Evo.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="border-0 bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-8">
                {/* Star Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5"
                      style={{ fill: "#fbbf24", color: "#fbbf24" }}
                    />
                  ))}
                </div>
                {/* Quote */}
                <p className="mb-6 text-base leading-relaxed text-gray-700">
                  "{testimonial.quote}"
                </p>
                {/* Author avec photo de profil */}
                <div className="flex items-center gap-4 border-t border-gray-200 pt-4">
                  {/* Avatar avec initiales */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${testimonial.bgColor} text-white font-bold text-sm shadow-md`}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-care-evo-primary font-medium">
                      {testimonial.title}
                    </p>
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
