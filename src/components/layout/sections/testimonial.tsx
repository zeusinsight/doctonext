"use client";

const animatedFeatures = [
  {
    icon: "🚀",
    title: "6x plus rapide",
    description: "Trouvez un remplacement ou un associé en quelques clics."
  },
  {
    icon: "✍️",
    title: "Signez en ligne",
    description: "Générez et envoyez vos documents administratifs en toute simplicité."
  },
  {
    icon: "🔒",
    title: "Messagerie sécurisée",
    description: "Échangez en toute confidentialité avec les autres praticiens."
  },
  {
    icon: "📊",
    title: "96 %",
    description: "des professionnels estiment que trouver un remplaçant ou un associé est un processus trop complexe. Doctonext simplifie tout."
  }
];

export const TestimonialSection = () => {
  const duplicatedFeatures = [...animatedFeatures, ...animatedFeatures];

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Pourquoi choisir Doctonext ?
          </h2>
        </div>

        <div className="relative">
          <div className="flex animate-marquee hover:animate-pause">
            {duplicatedFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 bg-gray-50 rounded-xl p-6 text-center min-w-[280px] border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
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
          animation: marquee 20s linear infinite;
        }

        .animate-pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
