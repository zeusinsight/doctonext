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
import { BadgeCheck, Clock, FileCheck2, MessageSquareLock, Target, Shield, Zap, UserPlus, Search as SearchIcon, MessageCircle, CheckCircle } from "lucide-react";
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
      {/* Notre Mission - Fond léger, espacement amélioré, icônes SVG professionnelles */}
      <section style={{backgroundColor: '#F7FAFB'}} className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">Notre Mission</h2>
            <p className="mb-12 text-lg leading-relaxed text-gray-700 md:text-xl">
              Connecter les professionnels de la santé pour créer des opportunités de carrière exceptionnelles.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="group rounded-lg bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-care-evo-primary/10 group-hover:bg-care-evo-primary/20 transition-colors duration-300">
                  <Target className="h-8 w-8 text-care-evo-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Simplifier</h3>
                <p className="text-base text-gray-600 leading-relaxed">Une plateforme centralisée et intuitive pour tous vos besoins professionnels.</p>
              </div>
              <div className="group rounded-lg bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-care-evo-accent/10 group-hover:bg-care-evo-accent/20 transition-colors duration-300">
                  <Shield className="h-8 w-8 text-care-evo-accent" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Sécuriser</h3>
                <p className="text-base text-gray-600 leading-relaxed">Messagerie sécurisée et signature électronique pour vos transactions.</p>
              </div>
              <div className="group rounded-lg bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-care-evo-primary/10 group-hover:bg-care-evo-primary/20 transition-colors duration-300">
                  <Zap className="h-8 w-8 text-care-evo-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">Accélérer</h3>
                <p className="text-base text-gray-600 leading-relaxed">Trouvez les bonnes opportunités plus rapidement et efficacement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SpecialtiesSection />
      {/* Pourquoi choisir Care Evo - Fond alterné pour rythme visuel */}
      <section style={{backgroundColor: '#F7FAFB'}} className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-care-evo-accent font-semibold text-sm uppercase tracking-wider mb-3">Pourquoi choisir CareEvo?</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Une plateforme tout-en-un pour votre carrière</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div className="rounded-full bg-care-evo-primary/20 p-3 ring-8 ring-care-evo-primary/10">
                <Clock className="h-8 w-8 text-care-evo-primary" />
              </div>
              <CardTitle className="text-lg">Gain de temps</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Centralisez vos recherches et démarches pour vous concentrer sur l'essentiel.
            </CardContent>
          </Card>
          <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div className="rounded-full bg-care-evo-accent/20 p-3 ring-8 ring-care-evo-accent/10">
                <MessageSquareLock className="h-8 w-8 text-care-evo-accent" />
              </div>
              <CardTitle className="text-lg">Messagerie sécurisée</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Échangez en toute confiance avec notre système de messagerie cryptée.
            </CardContent>
          </Card>
          <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div className="rounded-full bg-care-evo-primary/20 p-3 ring-8 ring-care-evo-primary/10">
                <FileCheck2 className="h-8 w-8 text-care-evo-primary" />
              </div>
              <CardTitle className="text-lg">Signature électronique</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Signez vos contrats numériquement, en toute légalité et simplicité.
            </CardContent>
          </Card>
          <Card className="border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex items-center justify-center gap-4 pb-2">
              <div className="rounded-full bg-care-evo-accent/20 p-3 ring-8 ring-care-evo-accent/10">
                <BadgeCheck className="h-8 w-8 text-care-evo-accent" />
              </div>
              <CardTitle className="text-lg">Conformité légale</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Accédez à des modèles de contrats validés par des experts juridiques.
            </CardContent>
          </Card>
        </div>
        </div>
      </section>

      {/* Comment ça marche - Fond alterné, icônes rondes, pastilles bleues */}
      <section style={{backgroundColor: '#F7FAFB'}} className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-care-evo-accent font-semibold text-sm uppercase tracking-wider mb-3">Comment ça marche?</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">Simple, rapide et efficace</h2>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
            {[
              {
                title: "Créez votre compte",
                description: "Inscription rapide et gratuite en quelques clics",
                icon: UserPlus,
                delay: "0ms"
              },
              {
                title: "Publiez ou cherchez",
                description: "Parcourez les annonces ou déposez la vôtre",
                icon: SearchIcon,
                delay: "100ms"
              },
              {
                title: "Échangez en sécurité",
                description: "Communiquez via notre messagerie cryptée",
                icon: MessageCircle,
                delay: "200ms"
              },
              {
                title: "Finalisez en ligne",
                description: "Signez électroniquement vos contrats",
                icon: CheckCircle,
                delay: "300ms"
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center group"
                  style={{animationDelay: step.delay}}
                >
                  {/* Pastille bleue avec numéro */}
                  <div className="relative mb-6">
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-care-evo-primary text-sm font-bold text-white shadow-lg z-10">
                      {i + 1}
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-care-evo-primary/10 group-hover:ring-care-evo-accent/30 transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-10 w-10 text-care-evo-primary group-hover:text-care-evo-accent transition-colors duration-300" />
                    </div>
                  </div>
                  <h4 className="mt-4 font-bold text-lg text-gray-900">{step.title}</h4>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
        <TestimonialsSection />
        <CtaSection />
    </main>
  );
}
