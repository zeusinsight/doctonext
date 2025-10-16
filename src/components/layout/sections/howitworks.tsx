import { Card } from "@/components/ui/card";
import { FileText, Search, MessageSquare, Handshake } from "lucide-react";

const steps = [
  {
    icon: FileText,
    label: "Publiez",
    title: "Mettez en ligne votre annonce en quelques clics",
    description:
      "Créez un compte et publiez votre annonce détaillée en quelques minutes.",
  },
  {
    icon: Search,
    label: "Recherchez",
    title: "Trouvez rapidement l'opportunité qui vous correspond",
    description:
      "Utilisez notre moteur de recherche avancé pour trouver l'opportunité idéale.",
  },
  {
    icon: MessageSquare,
    label: "Échangez",
    title: "Discutez directement via notre messagerie sécurisée",
    description: "Communiquez directement via notre messagerie sécurisée.",
  },
  {
    icon: Handshake,
    label: "Concrétisez",
    title: "Finalisez votre projet en toute sérénité",
    description:
      "Finalisez votre transaction et développez votre activité professionnelle.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-4xl text-gray-900 md:text-5xl">
            Comment ça marche ?
          </h2>
          <p className="mx-auto max-w-3xl text-gray-600 text-lg md:text-xl">
            Care Evo simplifie l'achat et la vente de patientèle et de fonds de
            commerce dans le domaine médical
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="border-gray-100 bg-white p-6 text-center transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-blue-600 text-sm uppercase tracking-wide">
                    {step.label}
                  </span>
                </div>
                <h3 className="mb-3 font-semibold text-gray-900 text-lg">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
            En savoir plus
          </button>
        </div>
      </div>
    </section>
  );
};
