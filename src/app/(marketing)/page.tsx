import Link from "next/link";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeCheck, Clock, FileCheck2, MessageSquareLock } from "lucide-react";
import { HeroSection } from "@/components/blocks/hero-section-4";
import { SectionTitle } from "@/components/layout/sections/section-title";
import { TestimonialsSection } from "@/components/layout/sections/testimonials";
import { CtaSection } from "@/components/layout/sections/cta";
import { SpecialtiesSection } from "@/components/layout/sections/specialties-section";
import { MagicText } from "@/components/ui/magic-text";

export const metadata = {
  title: site.name,
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    title: site.name,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 750,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: site.url,
    title: site.name,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 750,
        alt: site.name,
      },
    ],
  },
};

export default function Home() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <HeroSection />
      <section className="bg-gradient-to-br from-care-evo-primary/5 via-white to-care-evo-accent/5 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              Notre Mission
            </h2>
            <p className="mb-12 text-lg leading-relaxed text-gray-700 md:text-xl">
              Connecter les professionnels de la santé pour créer des
              opportunités de carrière exceptionnelles.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-care-evo-primary/10">
                  <span className="text-5xl">🎯</span>
                </div>
                <h3 className="mb-3 font-bold text-xl text-gray-900">
                  Simplifier
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Une plateforme centralisée et intuitive pour tous vos besoins
                  professionnels.
                </p>
              </div>
              <div className="rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-care-evo-accent/10">
                  <span className="text-5xl">🔐</span>
                </div>
                <h3 className="mb-3 font-bold text-xl text-gray-900">
                  Sécuriser
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Messagerie sécurisée et signature électronique pour vos
                  transactions.
                </p>
              </div>
              <div className="rounded-xl bg-white p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-care-evo-primary/10">
                  <span className="text-5xl">⚡</span>
                </div>
                <h3 className="mb-3 font-bold text-xl text-gray-900">
                  Accélérer
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  Trouvez les bonnes opportunités plus rapidement et
                  efficacement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SpecialtiesSection />
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <SectionTitle
          subtitle="Pourquoi choisir CareEvo?"
          title="Une plateforme tout-en-un pour votre carrière"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-background shadow-none">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div
                className="rounded-full p-3"
                style={{
                  backgroundColor: "#206dc5",
                }}
              >
                <Clock className="h-7 w-7 text-white" />
              </div>
              <CardTitle style={{ color: "#206dc5" }}>Gain de temps</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Centralisez vos recherches et démarches pour vous concentrer sur
              l'essentiel.
            </CardContent>
          </Card>
          <Card className="border-0 bg-background shadow-none">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div
                className="rounded-full p-3"
                style={{
                  backgroundColor: "#206dc5",
                }}
              >
                <MessageSquareLock className="h-7 w-7 text-white" />
              </div>
              <CardTitle style={{ color: "#206dc5" }}>
                Messagerie sécurisée
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Échangez en toute confiance avec notre système de messagerie
              cryptée.
            </CardContent>
          </Card>
          <Card className="border-0 bg-background shadow-none">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div
                className="rounded-full p-3"
                style={{
                  backgroundColor: "#206dc5",
                }}
              >
                <FileCheck2 className="h-7 w-7 text-white" />
              </div>
              <CardTitle style={{ color: "#206dc5" }}>
                Signature électronique
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Signez vos contrats numériquement, en toute légalité et
              simplicité.
            </CardContent>
          </Card>
          <Card className="border-0 bg-background shadow-none">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div
                className="rounded-full p-3"
                style={{
                  backgroundColor: "#206dc5",
                }}
              >
                <BadgeCheck className="h-7 w-7 text-white" />
              </div>
              <CardTitle style={{ color: "#206dc5" }}>
                Conformité légale
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Accédez à des modèles de contrats validés par des experts
              juridiques.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:py-24">
        <SectionTitle
          subtitle="Comment ça marche?"
          title="Simple, rapide et efficace"
        />
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {[
            {
              title: "Créez votre compte",
              description:
                "Inscrivez-vous gratuitement et complétez votre profil en 2 minutes.",
            },
            {
              title: "Publiez ou cherchez",
              description:
                "Publiez une annonce ou trouvez des opportunités par spécialité et lieu.",
            },
            {
              title: "Échangez en sécurité",
              description:
                "Discutez via la messagerie sécurisée et partagez vos documents.",
            },
            {
              title: "Finalisez en ligne",
              description:
                "Signez électroniquement et finalisez votre accord en toute légalité.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center text-center"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white"
                style={{ backgroundColor: "#206dc5" }}
              >
                {i + 1}
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">{step.title}</h4>
              <p className="mt-1 text-sm text-gray-500">{step.description}</p>
              {/* Flèche entre les étapes */}
              {i < 3 && (
                <div className="absolute top-6 -right-4 hidden md:block text-care-evo-primary text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
