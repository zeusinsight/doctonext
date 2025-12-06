import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";
import { Button } from "@/components/ui/button";
import { SmartJoinButton } from "@/components/ui/smart-join-button";
import {
  ShieldCheck,
  Users,
  Sparkles,
  ArrowRight,
  Building2,
  UserRound,
  Handshake,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Hero Section - Clean & Minimal */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
              Réinventer l'avenir de <br />
              <span className="text-care-evo-primary">votre carrière médicale</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Care Evo est la plateforme premium dédiée aux professionnels de santé. 
              Nous simplifions les transitions, sécurisons les opportunités et connectons 
              les talents du monde médical.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                asChild
                size="lg"
                className="hover:opacity-90 px-8 h-12 text-base"
                style={{ backgroundColor: "#206dc5", color: "white" }}
              >
                <Link href="/annonces">Découvrir les opportunités</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-gray-900 hover:bg-gray-50 group h-12 text-base"
              >
                <SmartJoinButton className="flex items-center gap-2">
                  Nous rejoindre <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </SmartJoinButton>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Visual / Story Section */}
      <section className="py-16 sm:py-24 bg-neutral-50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
              <Image
                src="/default-images/collaboration.jpeg"
                alt="Collaboration médicale"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                Une vision centrée sur l'humain et l'excellence
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Le monde de la santé évolue rapidement. Les attentes des praticiens aussi. 
                  Chez Care Evo, nous croyons que chaque transition professionnelle — qu'il s'agisse 
                  d'une cession, d'une installation ou d'un remplacement — mérite d'être traitée 
                  avec le plus grand soin.
                </p>
                <p>
                  Notre mission est de créer un écosystème de confiance où l'expertise rencontre 
                  l'opportunité. Nous ne sommes pas juste une plateforme d'annonces, nous sommes 
                  le partenaire de votre évolution professionnelle.
                </p>
                <div className="pt-4 grid grid-cols-2 gap-8 border-t border-gray-200/60">
                  <div>
                    <div className="text-3xl font-bold text-care-evo-primary">500+</div>
                    <div className="text-sm text-gray-500 mt-1">Praticiens</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-care-evo-primary">100%</div>
                    <div className="text-sm text-gray-500 mt-1">Vérifié</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values / Features - Clean Grid */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              L'Expérience Care Evo
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Des outils pensés pour les exigences du secteur médical.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-start p-8 rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="h-12 w-12 rounded-xl bg-care-evo-primary/10 flex items-center justify-center text-care-evo-primary mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sécurité Absolue</h3>
              <p className="text-gray-600 leading-relaxed">
                Chaque profil est rigoureusement vérifié. Vos données sont protégées. 
                Échangez en toute sérénité avec des confrères certifiés.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start p-8 rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="h-12 w-12 rounded-xl bg-care-evo-accent/10 flex items-center justify-center text-care-evo-accent mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Réseau Qualifié</h3>
              <p className="text-gray-600 leading-relaxed">
                Accédez à une communauté active et pertinente. 
                Trouvez le successeur ou le partenaire idéal qui partage vos valeurs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start p-8 rounded-2xl bg-gray-50 border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Simplicité Premium</h3>
              <p className="text-gray-600 leading-relaxed">
                Une interface fluide, sans publicité intrusive. 
                Des outils de gestion efficaces pour gagner un temps précieux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
             <div>
               <h2 className="text-3xl font-bold sm:text-4xl mb-4">Trois piliers pour votre réussite</h2>
               <p className="text-gray-400 text-lg">
                 Que vous soyez en début de carrière ou à l'heure de la transmission, 
                 nous avons la solution adaptée.
               </p>
             </div>
             <div className="flex justify-start lg:justify-end">
               <Button asChild variant="outline" className="bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white">
                 <Link href="/annonces">Voir toutes les catégories</Link>
               </Button>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-800 pt-12">
              <div className="group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-gray-800 group-hover:bg-care-evo-primary transition-colors duration-300">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium">Cession</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Transmission de cabinet, vente de patientèle ou de parts de SCM/SEL. 
                  Valorisez votre patrimoine professionnel.
                </p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-gray-800 group-hover:bg-care-evo-accent transition-colors duration-300">
                    <UserRound className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium">Remplacement</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Gérez vos absences ou trouvez des opportunités flexibles. 
                  Un matching intelligent par spécialité et géographie.
                </p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-gray-800 group-hover:bg-blue-500 transition-colors duration-300">
                    <Handshake className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium">Collaboration</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Rejoignez une équipe ou recrutez un associé. 
                  Construisez l'avenir de la médecine de ville, ensemble.
                </p>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl text-center px-6">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl mb-6 tracking-tight">
            Prêt à avancer ?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Rejoignez des centaines de professionnels de santé qui font confiance à Care Evo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="hover:opacity-90 px-8 h-14 text-lg shadow-xl shadow-care-evo-primary/20"
              style={{ backgroundColor: "#206dc5", color: "white" }}
            >
              <Link href="/register">Créer mon compte gratuitement</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 text-lg px-8 border-gray-200 hover:bg-gray-50 hover:text-gray-900">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
