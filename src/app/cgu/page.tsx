import { site } from "@/config/site";
import { Navbar } from "@/components/layout/navbar";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: `Conditions Générales d'Utilisation - ${site.name}`,
  description: "Conditions Générales d'Utilisation de Care Evo",
};

export default function CGUPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
          {/* Header */}
          <div className="mb-12">
            <h1 className="mb-4 font-bold text-4xl text-gray-900">
              Conditions Générales d'Utilisation
            </h1>
            <div className="h-1 w-20 bg-care-evo-accent"></div>
            <p className="mt-4 text-gray-600">
              Version 1.0
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-12 rounded-lg border-l-4 border-l-care-evo-accent bg-gray-50 p-6">
            <p className="text-gray-700 leading-relaxed">
              Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir les règles d'accès et d'utilisation de la plateforme CARE EVO (ci-après "la Plateforme"), éditée par :
            </p>
            <div className="mt-4 space-y-1 text-gray-700">
              <p><strong>CARE EVO</strong> - SAS au capital de 1 000 euros</p>
              <p>Siège social : 536 H chemin de Taurens, 83140 Six-Fours-les-Plages, France</p>
              <p>SIREN : 992 985 606</p>
              <p>TVA Intracommunautaire : FR15992985606</p>
              <p>Email contact : <a href="mailto:contact.careevo@gmail.com" className="text-care-evo-primary hover:underline">contact.careevo@gmail.com</a></p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 1 - Objet de la plateforme
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>CARE EVO est une plateforme numérique permettant aux professionnels de santé :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>de créer un compte professionnel</li>
                  <li>de consulter et publier des annonces liées à leur activité (remplacement, cession, association, installation)</li>
                  <li>d'échanger via une messagerie sécurisée</li>
                  <li>de générer et signer des contrats électroniquement</li>
                </ul>
                <p className="mt-4 font-semibold">
                  CARE EVO n'est pas une agence de placement et n'intervient pas dans la relation contractuelle entre utilisateurs. La Plateforme est un outil d'intermédiation technique.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 2 - Acceptation des CGU
              </h2>
              <div className="text-gray-600">
                <p>
                  L'utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU.
                  Tout utilisateur coche la case : "J'accepte les CGU", ce qui constitue une acceptation contractuelle.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 3 - Conditions d'inscription
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  <strong>La Plateforme est strictement réservée aux professionnels de santé :</strong> médecins, chirurgiens-dentistes, kinésithérapeutes, orthophonistes, ostéopathes, sages-femmes, podologues et autres professionnels de santé pouvant exercer en libéral.
                </p>
                <p>Lors de l'inscription, l'utilisateur doit :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>créer un compte (adresse e‑mail + mot de passe)</li>
                  <li>certifier l'exercice d'une profession de santé</li>
                </ul>
                <p className="mt-4">
                  <strong>Le numéro RPPS ou ADELI peut être demandé :</strong>
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>facultatif à l'inscription</li>
                  <li>obligatoire pour certaines fonctionnalités (ex : dépôt d'annonce, signature d'un contrat)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 4 - Identité / Vérification
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>CARE EVO peut vérifier l'identité de l'utilisateur en demandant :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>un numéro RPPS / ADELI</li>
                  <li>une attestation d'inscription à l'Ordre</li>
                  <li>une copie d'un justificatif professionnel</li>
                </ul>
                <p className="mt-4 font-semibold">
                  CARE EVO peut suspendre ou supprimer un compte en cas de doute ou fraude.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 5 - Utilisation de la plateforme
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>L'utilisateur s'engage à :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>fournir des informations exactes</li>
                  <li>ne pas usurper l'identité d'un tiers</li>
                  <li>ne pas publier de fausses annonces</li>
                  <li>utiliser la messagerie uniquement à des fins professionnelles</li>
                </ul>
                <p className="mt-4"><strong>Les pratiques suivantes sont strictement interdites :</strong></p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>spam / démarchage commercial non autorisé</li>
                  <li>transfert ou extraction massive de données</li>
                  <li>contournement des mesures de sécurité</li>
                  <li>publication d'annonces illégales, diffamatoires, ou non conformes aux règles ordinales</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 6 - Messagerie et signature électronique
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>La messagerie permet des échanges professionnels sécurisés.</p>
                <p>Les documents signés via la Plateforme sont soumis à la réglementation européenne :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Règlement eIDAS (EU) n°910/2014</li>
                  <li>Article 1367 du Code civil</li>
                </ul>
                <p className="mt-4 font-semibold">
                  Chaque utilisateur est responsable du contenu des documents signés.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 7 - Responsabilité
              </h2>
              <div className="text-gray-600 space-y-3">
                <p><strong>CARE EVO agit comme hébergeur de contenus.</strong></p>
                <p>CARE EVO :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>n'est pas partie aux contrats conclus entre utilisateurs</li>
                  <li>ne garantit pas l'exactitude des informations publiées par les utilisateurs</li>
                  <li>ne fournit aucun conseil juridique, médical ou fiscal</li>
                </ul>
                <p className="mt-4">
                  En cas de signalement de contenu illicite (LCEN / DSA), CARE EVO peut retirer le contenu.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 8 - Accessibilité de la plateforme
              </h2>
              <div className="text-gray-600">
                <p>
                  La Plateforme est accessible 24h/24 et 7j/7 sauf maintenance.
                  CARE EVO peut suspendre temporairement l'accès pour raison technique.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 9 - Données personnelles (RGPD)
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>CARE EVO agit en qualité de Responsable de traitement.</p>
                <p>Les données sont traitées conformément au RGPD.</p>
                <p>
                  <strong>Droits utilisateur :</strong> accès, rectification, suppression, portabilité, opposition.
                </p>
                <p>
                  Email RGPD : <a href="mailto:contact.careevo@gmail.com" className="text-care-evo-primary hover:underline">contact.careevo@gmail.com</a>
                </p>
                <p>
                  Pour plus d'informations, consultez notre{" "}
                  <a href="/politique-de-confidentialite" className="text-care-evo-primary hover:underline">
                    Politique de confidentialité
                  </a>.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 10 - Sécurité et hébergement
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>CARE EVO utilise Vercel (serveurs situés dans l'Union Européenne).</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Les données sont chiffrées en transit (HTTPS)</li>
                  <li>Les données de santé ne sont pas stockées</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 11 - Durée / Suppression du compte
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>L'utilisateur peut supprimer son compte à tout moment.</p>
                <p>CARE EVO peut supprimer le compte en cas de :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>fraude</li>
                  <li>non respect des CGU</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 12 - Tarifs / Facturation
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>
                  L'utilisation de la Plateforme est <strong>gratuite</strong> pour publier des annonces et utiliser la messagerie.
                </p>
                <p>Certaines fonctionnalités peuvent être payantes, telles que :</p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>signature électronique de contrat (ex : 15€ TTC)</li>
                </ul>
                <p className="mt-4">Les prix sont affichés avant paiement.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 13 - Propriété intellectuelle
              </h2>
              <div className="text-gray-600">
                <p>
                  Toute reproduction de CARE EVO ou extraction des données est interdite.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900">
                Article 14 - Droit applicable
              </h2>
              <div className="text-gray-600 space-y-3">
                <p>Les présentes CGU sont régies par le droit français.</p>
                <p>
                  <strong>Tribunal compétent en cas de litige :</strong> Tribunal de Commerce de Toulon.
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
