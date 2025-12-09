import { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { FooterSection } from "@/components/layout/sections/footer"
import { site } from "@/config/site"

export const metadata: Metadata = {
    title: "Annonces - Cessions, Remplacements & Collaborations | CareEvo",
    description: "Trouvez des opportunités de cession de cabinet médical, de remplacement ou de collaboration entre professionnels de santé partout en France. Filtrez par spécialité, région et type d'annonce.",
    keywords: ["cession cabinet médical", "remplacement médecin", "collaboration médecin", "annonces santé", "cabinet dentaire", "pharmacie à vendre"],
    openGraph: {
        title: "Annonces - Cessions, Remplacements & Collaborations | CareEvo",
        description: "Trouvez des opportunités de cession de cabinet médical, de remplacement ou de collaboration entre professionnels de santé partout en France.",
        url: `${site.url}/annonces`,
        siteName: site.name,
        type: "website",
        locale: "fr_FR",
        images: [
            {
                url: site.ogImage,
                width: 1200,
                height: 630,
                alt: "CareEvo - Annonces pour professionnels de santé",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Annonces - Cessions, Remplacements & Collaborations | CareEvo",
        description: "Trouvez des opportunités de cession de cabinet médical, de remplacement ou de collaboration entre professionnels de santé.",
        images: [site.ogImage],
    },
    alternates: {
        canonical: `${site.url}/annonces`,
    },
}

export default function ListingsLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <FooterSection />
        </>
    )
}
