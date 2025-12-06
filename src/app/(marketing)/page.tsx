import Link from "next/link";
import Image from "next/image";
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

      {/* Interactive Map Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Map Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/map.png"
                  alt="Carte interactive des zones sous-dotées"
                  fill
                  className="object-cover"
                  quality={100}
                  priority
                />
              </div>
              {/* Content */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                  Carte interactive des <span style={{ color: "#206dc5" }} className="whitespace-nowrap">zones d'activité médicale</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Visualisez en un coup d'œil les zones sous-dotées en professionnels de santé
                  et identifiez facilement où vous installer pour répondre aux besoins du territoire.
                </p>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex-shrink-0 mt-0.5"></div>
                    <span>Zones sous-dotées — installation facilitée</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-orange-400 flex-shrink-0 mt-0.5"></div>
                    <span>Zones intermédiaires</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-red-500 flex-shrink-0 mt-0.5"></div>
                    <span>Zones sur-dotées — installation plus difficile</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link href="/annonces">
                    <button
                      className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      style={{ backgroundColor: "#206dc5" }}
                    >
                      Explorer la carte
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SpecialtiesSection />
      <div className="bg-gradient-to-b from-blue-100/80 via-blue-50/40 to-blue-100/80">
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <SectionTitle
              subtitle="Pourquoi choisir CareEvo?"
              title="Une plateforme tout-en-un pour votre carrière"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="flex items-center justify-center gap-4 pb-2">
                  <div
                    className="rounded-full p-3"
                    style={{
                      backgroundColor: "#206dc5",
                    }}
                  >
                    <Clock className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle style={{ color: "#206dc5" }}>
                    Gain de temps
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Centralisez vos recherches et démarches pour vous concentrer sur
                  l'essentiel.
                </CardContent>
              </Card>
              <Card className="border-0 bg-transparent shadow-none">
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
              <Card className="border-0 bg-transparent shadow-none">
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
              <Card className="border-0 bg-transparent shadow-none">
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
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <SectionTitle
              subtitle="Comment ça marche?"
              title="Simple, rapide et efficace"
            />
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                {
                  title: "Transmettez à l'Ordre",
                  description:
                    "Adressez une copie de votre contrat signé au conseil de l'Ordre.",
                },
              ].map((step, i) => {
                const steps = 5;
                return (
                <div key={i} className="relative">
                  <Card className="h-full border border-gray-200 transition-shadow hover:shadow-xl">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white"
                        style={{ backgroundColor: "#206dc5" }}
                      >
                        {i + 1}
                      </div>
                      <h4 className="mt-4 font-semibold text-gray-900">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                  {/* Ligne entre les étapes */}
                  {i < steps - 1 && (
                    <div className="absolute top-1/2 -right-4 hidden h-0.5 w-4 -translate-y-1/2 bg-gray-300 lg:block" />
                  )}
                </div>
              );
              })}
            </div>
          </div>
        </section>
      </div>
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
