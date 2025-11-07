import { site } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: `Politique de confidentialité - ${site.name}`,
  description: "Politique de confidentialité et protection des données personnelles - Care Evo",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-4 font-bold text-4xl text-gray-900">
              Politique de confidentialité
            </h1>
            <div className="h-1 w-20 bg-care-evo-accent"></div>
            <p className="mt-4 text-gray-600">
              Version 1.0
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12 rounded-lg border-l-4 border-l-care-evo-accent bg-gray-50 p-6">
            <p className="text-gray-700 leading-relaxed">
              La présente Politique de Confidentialité explique comment <strong>CARE EVO</strong> (SAS au capital de 1 000 € - SIREN 992 985 606 - Siège social : 536 H chemin de Taurens, 83140 Six-Fours-les-Plages - contact :{" "}
              <a href="mailto:contact.careevo@gmail.com" className="text-care-evo-primary hover:underline">
                contact.careevo@gmail.com
              </a>) collecte, utilise et protège vos données personnelles conformément au RGPD (Règlement UE 2016/679).
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                1. Finalités du traitement
              </h2>
              <div className="text-gray-600">
                <p>CARE EVO traite vos données pour :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>création et gestion du compte utilisateur (profil professionnel)</li>
                  <li>mise en relation via la messagerie sécurisée</li>
                  <li>dépôt et consultation d'annonces</li>
                  <li>signature de documents et contrats</li>
                  <li>détection de fraude, modération des annonces</li>
                  <li>réalisations de statistiques d'utilisation</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                2. Données collectées
              </h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>Données d'identification :</strong> nom, prénom, email, mot de passe chiffré.</p>
                <p>
                  <strong>Données professionnelles :</strong> profession de santé, RPPS / ADELI (facultatif à l'inscription, requis pour certaines fonctionnalités).
                </p>
                <p><strong>Données de connexion et navigation :</strong> logs, IP, navigateur.</p>
                <p className="mt-4 font-semibold">Aucune donnée de santé n'est stockée.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                3. Base juridique (art. 6 RGPD)
              </h2>
              <div className="text-gray-600">
                <ul className="ml-6 list-disc space-y-2">
                  <li><strong>Exécution du contrat</strong> (utilisation de la plateforme)</li>
                  <li><strong>Consentement</strong> (cookies, communications marketing)</li>
                  <li><strong>Intérêt légitime</strong> (sécurisation, prévention des fraudes)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                4. Destinataires
              </h2>
              <div className="text-gray-600 space-y-3">
                <p className="font-semibold">Vos données ne sont jamais revendues.</p>
                <p>Destinataires possibles :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>équipes CARE EVO</li>
                  <li>prestataires techniques (hébergeur : Vercel - UE)</li>
                  <li>prestataire de signature électronique (si utilisé)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                5. Durée de conservation
              </h2>
              <div className="text-gray-600">
                <ul className="ml-6 list-disc space-y-2">
                  <li><strong>Compte utilisateur :</strong> durée de l'utilisation + 3 ans après la dernière activité</li>
                  <li><strong>Documents signés :</strong> entre 5 et 10 ans (obligations légales)</li>
                  <li><strong>Logs techniques :</strong> 12 mois</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                6. Sécurité & hébergement
              </h2>
              <div className="text-gray-600">
                <ul className="ml-6 list-disc space-y-2">
                  <li><strong>Hébergement :</strong> Vercel (serveurs situés dans l'Union Européenne)</li>
                  <li><strong>Chiffrement des données en transit</strong> (HTTPS / TLS)</li>
                  <li><strong>Données stockées sur serveurs sécurisés</strong></li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                7. Cookies et tracking
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>CARE EVO utilise des cookies pour :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>amélioration de l'expérience utilisateur</li>
                  <li>analyse de fréquentation (statistiques)</li>
                </ul>
                <p className="mt-4">Vous pouvez accepter ou refuser les cookies à tout moment.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                8. Droits des utilisateurs
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>Vous disposez des droits suivants :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li><strong>Accès</strong> : obtenir une copie de vos données</li>
                  <li><strong>Rectification</strong> : corriger vos données inexactes</li>
                  <li><strong>Suppression</strong> : effacer vos données</li>
                  <li><strong>Restriction</strong> : limiter le traitement</li>
                  <li><strong>Opposition</strong> : vous opposer au traitement</li>
                  <li><strong>Portabilité</strong> : récupérer vos données dans un format structuré</li>
                </ul>
                <p className="mt-4">
                  <strong>Demande par email :</strong>{" "}
                  <a href="mailto:contact.careevo@gmail.com" className="text-care-evo-primary hover:underline">
                    contact.careevo@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Réclamation autorité CNIL :</strong>{" "}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-care-evo-primary hover:underline">
                    www.cnil.fr
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                9. Suppression de compte
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  Vous pouvez supprimer votre compte et vos données depuis votre espace personnel ou par demande à{" "}
                  <a href="mailto:contact.careevo@gmail.com" className="text-care-evo-primary hover:underline">
                    contact.careevo@gmail.com
                  </a>
                </p>
                <p className="font-semibold">La suppression est définitive.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                10. Modifications
              </h2>
              <div className="text-gray-600">
                <p>
                  CARE EVO se réserve le droit de modifier cette politique.
                  La version applicable est celle publiée sur le site à la date de consultation.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                11. Contact
              </h2>
              <div className="text-gray-600">
                <p>
                  Pour toute question concernant cette Politique de confidentialité ou le traitement de vos données personnelles :
                </p>
                <p className="mt-4">
                  <strong>Email :</strong>{" "}
                  <a href="mailto:contact.careevo@gmail.com" className="text-care-evo-primary hover:underline">
                    contact.careevo@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Adresse postale :</strong><br />
                  CARE EVO<br />
                  536 H chemin de Taurens<br />
                  83140 Six-Fours-les-Plages<br />
                  France
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
