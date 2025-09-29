"use client"

const animatedFeatures = [
    {
        icon: "🚀",
        title: "6x plus rapide",
        description: "Trouvez un remplacement ou un associé en quelques clics."
    },
    {
        icon: "✍️",
        title: "Signez en ligne",
        description:
            "Générez et envoyez vos documents administratifs en toute simplicité."
    },
    {
        icon: "🔒",
        title: "Messagerie sécurisée",
        description:
            "Échangez en toute confidentialité avec les autres praticiens."
    },
    {
        icon: "📊",
        title: "96 %",
        description:
            "des professionnels estiment que trouver un remplaçant ou un associé est un processus trop complexe. Doctonext simplifie tout."
    }
]

export const TestimonialSection = () => {
    return (
        <section
            id="testimonials"
            className="overflow-hidden bg-blue-50 py-16 lg:py-24"
        >
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-6 font-bold text-3xl text-gray-900 lg:text-4xl">
                        Pourquoi choisir Doctonext ?
                    </h2>
                </div>

                <div className="relative">
                    <div className="flex w-max animate-marquee hover:animate-pause">
                        <div className="flex gap-16 pr-8">
                            {animatedFeatures.map((feature, index) => (
                                <div
                                    key={`a-${index}`}
                                    className="min-w-[280px] flex-shrink-0 rounded-xl border border-gray-100 bg-white p-6 text-center transition-shadow hover:shadow-md"
                                >
                                    <div className="mb-4 text-4xl">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mb-3 font-semibold text-gray-900 text-xl">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-16 pl-8" aria-hidden="true">
                            {animatedFeatures.map((feature, index) => (
                                <div
                                    key={`b-${index}`}
                                    className="min-w-[280px] flex-shrink-0 rounded-xl border border-gray-100 bg-white p-6 text-center transition-shadow hover:shadow-md"
                                >
                                    <div className="mb-4 text-4xl">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mb-3 font-semibold text-gray-900 text-xl">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 28s linear infinite;
          will-change: transform;
        }

        .animate-pause:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    )
}
