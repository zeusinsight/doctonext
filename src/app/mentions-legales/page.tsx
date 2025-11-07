import { site } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: `Mentions légales - ${site.name}`,
  description: "Mentions légales de Care Evo",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-4 font-bold text-4xl text-gray-900">
              Mentions légales
            </h1>
            <div className="h-1 w-20 bg-care-evo-accent"></div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                1. Éditeur du site / de la plateforme
              </h2>
              <div className="text-gray-600 space-y-2">
                <p><strong>Dénomination sociale :</strong> CARE EVO</p>
                <p><strong>Forme juridique :</strong> SAS</p>
                <p><strong>Capital social :</strong> 1 000 euros</p>
                <p><strong>Siège social :</strong> 536 H chemin de Taurens, 83140 Six-Fours-les-Plages, France</p>
                <p><strong>SIREN (RCS) :</strong> 992 985 606</p>
                <p><strong>N° TVA intracommunautaire :</strong> FR15992985606</p>
                <p><strong>Directeur de la publication :</strong> Maxime Meyer (Président)</p>
                <p><strong>Contact :</strong> <a href="mailto:contact.careevo@gmail.com" className="text-care-evo-primary hover:underline">contact.careevo@gmail.com</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                2. Hébergeur
              </h2>
              <div className="text-gray-600 space-y-2">
                <p><strong>Hébergeur :</strong> Vercel (hébergement européen - serveurs UE)</p>
                <p><strong>Site :</strong> <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="text-care-evo-primary hover:underline">https://vercel.com/</a></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                3. Objet de la plateforme
              </h2>
              <div className="text-gray-600">
                <p>
                  Care Evo est une plateforme en ligne de mise en relation dédiée aux professionnels de santé libéraux.
                </p>
                <p className="mt-3">
                  <strong>La plateforme permet :</strong>
                </p>
                <ul className="ml-6 list-disc space-y-2 mt-2">
                  <li>Publication d'annonces</li>
                  <li>Messagerie sécurisée</li>
                  <li>Signature de contrats</li>
                  <li>Création de profils</li>
                  <li>Gestion des opportunités</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                4. Contacts légaux
              </h2>
              <div className="text-gray-600">
                <p>
                  <strong>Support & juridique :</strong>{" "}
                  <a href="mailto:contact.careevo@gmail.com" className="text-care-evo-primary hover:underline">
                    contact.careevo@gmail.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
