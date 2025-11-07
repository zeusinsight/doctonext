import { site } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: `Conditions Générales de Vente - ${site.name}`,
  description: "Conditions Générales de Vente des services payants Care Evo",
};

export default function CGVPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-4 font-bold text-4xl text-gray-900">
              Conditions Générales de Vente
            </h1>
            <div className="h-1 w-20 bg-care-evo-accent"></div>
            <p className="mt-4 text-gray-600">
              Version 1.0
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12 rounded-lg border-l-4 border-l-care-evo-accent bg-gray-50 p-6">
            <p className="text-gray-700 leading-relaxed">
              Les présentes Conditions Générales de Vente (ci-après "CGV") régissent les modalités de vente de services optionnels proposés sur la plateforme CARE EVO (ci-après "la Plateforme"), éditée par :
            </p>
            <div className="mt-4 space-y-1 text-gray-700">
              <p><strong>CARE EVO</strong> - SAS au capital de 1 000 €</p>
              <p>536 H chemin de Taurens, 83140 Six-Fours-les-Plages, France</p>
              <p>SIREN : 992 985 606</p>
              <p>TVA Intracommunautaire : FR15992985606</p>
              <p>Email : <a href="mailto:contact.careevo@gmail.com" className="text-care-evo-primary hover:underline">contact.careevo@gmail.com</a></p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                1. Objet
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  Les CGV encadrent les prestations payantes disponibles sur la Plateforme, notamment et sans limitation :
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>la mise en avant d'annonces ("boost d'annonce")</li>
                  <li>la signature de documents et contrats via signature électronique</li>
                  <li>d'autres services additionnels pouvant être ajoutés ultérieurement</li>
                </ul>
                <p className="mt-4">
                  L'utilisation des services gratuits demeure soumise aux{" "}
                  <a href="/cgu" className="text-care-evo-primary hover:underline">CGU</a>.
                  Les CGV ne concernent que les fonctionnalités payantes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                2. Services payants
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  CARE EVO propose certains services optionnels payants. Les services disponibles et leurs conditions sont affichés dans l'interface utilisateur.
                </p>
                <p>
                  Les services payants n'ont <strong>aucune obligation d'achat</strong> pour accéder à l'essentiel des fonctionnalités (publication d'annonces, messagerie, mise en relation).
                </p>
                <p>Les options payantes peuvent inclure :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Mise en avant / boost d'annonce avec visibilité accrue</li>
                  <li>Génération / Signature électronique de contrats</li>
                </ul>
                <p className="mt-4 italic">
                  Aucun prix fixe n'est mentionné ici : le prix de chaque service est affiché au moment de l'achat.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                3. Commande et validation
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>Toute commande d'un service payant est validée lorsque l'utilisateur :</p>
                <ol className="ml-6 list-decimal space-y-2">
                  <li>sélectionne l'option souhaitée,</li>
                  <li>accepte les présentes CGV,</li>
                  <li>procède au paiement.</li>
                </ol>
                <p className="mt-4">
                  La validation constitue une signature électronique ayant valeur contractuelle.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                4. Prix
              </h2>
              <div className="text-gray-600">
                <p>
                  Les prix des options payantes sont indiqués en euros, TTC, directement dans l'interface.
                  CARE EVO se réserve le droit de modifier ses tarifs à tout moment.
                  Les prix applicables sont ceux affichés au moment de la commande.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                5. Paiement
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  Le paiement s'effectue par carte bancaire via un prestataire de paiement sécurisé (ex. Stripe).
                </p>
                <p><strong>CARE EVO ne stocke aucune donnée bancaire.</strong></p>
                <p>Le paiement est exigible au moment de la commande.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                6. Droit de rétractation
              </h2>
              <div className="text-gray-600">
                <p>
                  Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux services numériques pleinement exécutés avant la fin du délai légal.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                7. Responsabilité
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>CARE EVO n'est pas responsable :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>des informations publiées par les utilisateurs,</li>
                  <li>des contrats et accords entre utilisateurs.</li>
                </ul>
                <p className="mt-4">
                  <strong>CARE EVO n'intervient pas dans la relation contractuelle entre utilisateurs.</strong>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                8. Résiliation / Suppression du compte
              </h2>
              <div className="text-gray-600">
                <p>
                  La suppression d'un compte utilisateur n'ouvre droit à aucun remboursement de services déjà consommés.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                9. Données personnelles (RGPD)
              </h2>
              <div className="text-gray-600">
                <p>
                  Dans le cadre des services payants, CARE EVO traite des données de facturation.
                  Pour toute information sur les traitements, se référer à la{" "}
                  <a href="/politique-de-confidentialite" className="text-care-evo-primary hover:underline">
                    Politique de Confidentialité
                  </a>.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                10. Droit applicable
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  Les présentes CGV sont soumises au droit français.
                </p>
                <p>
                  <strong>Tout litige sera porté devant les tribunaux de Toulon, France.</strong>
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
