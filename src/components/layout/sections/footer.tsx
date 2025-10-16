import {
    Mail,
    Phone,
    Facebook,
    Twitter,
    Instagram,
    Linkedin
} from "lucide-react"
import Link from "next/link"
import { SmartListingButton } from "@/components/ui/smart-listing-button"

interface FooterLinkProps {
    href: string
    label: string
}

interface FooterSectionProps {
    title: string
    links: FooterLinkProps[]
}

const footerSections: FooterSectionProps[] = [
    {
        title: "Explorer",
        links: [
            { href: "/annonces", label: "Annonces" },
            { href: "/a-propos", label: "Comment ça marche" },
            { href: "/dashboard/listings/new", label: "Déposer une annonce" },
            { href: "/blog", label: "Blog" }
        ]
    },
    {
        title: "Informations",
        links: [
            { href: "/a-propos", label: "À propos" },
            { href: "/blog", label: "Blog" },
            { href: "/contact", label: "Contact" },
            { href: "/legal", label: "Mentions légales" },
            { href: "/privacy", label: "Politique de confidentialité" }
        ]
    }
]

export const FooterSection = () => {
    return (
        <footer className="bg-gray-900 py-12 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <h3 className="mb-4 font-bold text-2xl">CareEvo</h3>
                        <p className="mb-6 text-gray-400">
                            La première plateforme pour trouver toutes les
                            opportunités médicales en ligne, 100 % gratuitement.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="#"
                                className="text-gray-400 transition-colors hover:text-white"
                            >
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 transition-colors hover:text-white"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 transition-colors hover:text-white"
                            >
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 transition-colors hover:text-white"
                            >
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="mb-4 font-semibold text-care-evo-accent">
                                {section.title}
                            </h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        {link.label ===
                                        "Déposer une annonce" ? (
                                            <SmartListingButton className="text-gray-400 transition-colors hover:text-white">
                                                {link.label}
                                            </SmartListingButton>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="text-gray-400 transition-colors hover:text-white"
                                            >
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Section */}
                    <div>
                        <h4 className="mb-4 font-semibold text-care-evo-accent">
                            Contact
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="mailto:contact@careevo.fr"
                                    className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
                                >
                                    <Mail className="h-4 w-4" />
                                    contact@careevo.fr
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+33612345678"
                                    className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
                                >
                                    <Phone className="h-4 w-4" />
                                    +33 6 12 34 56 78
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 border-gray-800 border-t pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-gray-400 text-sm">
                            © 2025 CareEvo. Tous droits réservés.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link
                                href="/legal"
                                className="text-gray-400 transition-colors hover:text-white"
                            >
                                Mentions légales
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-gray-400 transition-colors hover:text-white"
                            >
                                Politique de confidentialité
                            </Link>
                            <Link
                                href="/cgv"
                                className="text-gray-400 transition-colors hover:text-white"
                            >
                                CGV
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
