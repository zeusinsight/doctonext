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
import {HeroSection} from "@/components/blocks/hero-section-4"
import { SectionTitle } from "@/components/layout/sections/section-title";
import { TestimonialsSection } from "@/components/layout/sections/testimonials";
import { CtaSection } from "@/components/layout/sections/cta";
import { SpecialtiesSection } from "@/components/layout/sections/specialties-section";
import { MagicText } from "@/components/ui/magic-text"


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
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">Notre Mission</h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
              Connecter les professionnels de la santé pour créer des opportunités de carrière exceptionnelles.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-care-evo-primary/10">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Simplifier</h3>
                <p className="text-md text-gray-600">Une plateforme centralisée et intuitive pour tous vos besoins professionnels.</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-care-evo-accent/10">
                  <span className="text-3xl">🔐</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Sécuriser</h3>
                <p className="text-md text-gray-600">Messagerie sécurisée et signature électronique pour vos transactions.</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-care-evo-primary/10">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">Accélérer</h3>
                <p className="text-md text-gray-600">Trouvez les bonnes opportunités plus rapidement et efficacement.</p>
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
              <div className="rounded-full bg-primary/20 p-2 ring-8 ring-primary/10">
                <Clock className="h-7 w-7 text-blue-600" />
              </div>
              <CardTitle>Gain de temps</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Centralisez vos recherches et démarches pour vous concentrer sur l'essentiel.
            </CardContent>
          </Card>
          <Card className="border-0 bg-background shadow-none">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div className="rounded-full bg-primary/20 p-2 ring-8 ring-primary/10">
                <MessageSquareLock className="h-7 w-7 text-blue-600" />
              </div>
              <CardTitle>Messagerie sécurisée</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Échangez en toute confiance avec notre système de messagerie cryptée.
            </CardContent>
          </Card>
          <Card className="border-0 bg-background shadow-none">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div className="rounded-full bg-primary/20 p-2 ring-8 ring-primary/10">
                <FileCheck2 className="h-7 w-7 text-blue-600" />
              </div>
              <CardTitle>Signature électronique</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Signez vos contrats numériquement, en toute légalité et simplicité.
            </CardContent>
          </Card>
          <Card className="border-0 bg-background shadow-none">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div className="rounded-full bg-primary/20 p-2 ring-8 ring-primary/10">
                <BadgeCheck className="h-7 w-7 text-blue-600" />
              </div>
              <CardTitle>Conformité légale</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Accédez à des modèles de contrats validés par des experts juridiques.
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
            { title: "Créez votre compte", description: "Texte court" },
            { title: "Publiez ou cherchez", description: "Texte court" },
            { title: "Échangez en sécurité", description: "Texte court" },
            { title: "Finalisez en ligne", description: "Texte court" },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {i + 1}
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">{step.title}</h4>
              <p className="mt-1 text-sm text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
        <TestimonialsSection />
        <CtaSection />
    </main>
  );
}
