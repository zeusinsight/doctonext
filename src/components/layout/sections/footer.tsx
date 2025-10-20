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
        <footer className="bg-gray-900 py-16 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand Section */}
                    <div className="col-span-1 md:border-r md:border-gray-800 md:pr-8">
                        <h3 className="mb-4 font-bold text-2xl text-white">CareEvo</h3>
                        <p className="mb-6 text-gray-400 leading-relaxed">
                            La première plateforme pour trouver toutes les
                            opportunités médicales en ligne, 100 % gratuitement.
                        </p>
                        <div className="flex gap-6">
                            <Link
                                href="#"
                                className="text-white transition-all duration-300 hover:text-care-evo-accent hover:scale-110"
                            >
                                <Facebook className="h-6 w-6" />
                            </Link>
                            <Link
                                href="#"
                                className="text-white transition-all duration-300 hover:text-care-evo-accent hover:scale-110"
                            >
                                <Twitter className="h-6 w-6" />
                            </Link>
                            <Link
                                href="#"
                                className="text-white transition-all duration-300 hover:text-care-evo-accent hover:scale-110"
                            >
                                <Instagram className="h-6 w-6" />
                            </Link>
                            <Link
                                href="#"
                                className="text-white transition-all duration-300 hover:text-care-evo-accent hover:scale-110"
                            >
                                <Linkedin className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section, index) => (
                        <div key={section.title} className={index === 0 ? "md:border-r md:border-gray-800 md:pr-8" : ""}>
                            <h4 className="mb-4 font-semibold text-care-evo-accent">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        {link.label ===
                                        "Déposer une annonce" ? (
                                            <SmartListingButton className="text-white transition-all duration-300 hover:text-care-evo-accent hover:pl-2">
                                                {link.label}
                                            </SmartListingButton>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="text-white transition-all duration-300 hover:text-care-evo-accent hover:pl-2 inline-block"
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
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="mailto:contact@careevo.fr"
                                    className="flex items-center gap-2 text-white transition-all duration-300 hover:text-care-evo-accent"
                                >
                                    <Mail className="h-5 w-5" />
                                    contact@careevo.fr
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+33612345678"
                                    className="flex items-center gap-2 text-white transition-all duration-300 hover:text-care-evo-accent"
                                >
                                    <Phone className="h-5 w-5" />
                                    +33 6 12 34 56 78
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-gray-800 border-t pt-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 CareEvo. Tous droits réservés.
                        </p>
                        <div className="flex gap-6 text-sm flex-wrap justify-center">
                            <Link
                                href="/legal"
                                className="text-white transition-all duration-300 hover:text-care-evo-accent"
                            >
                                Mentions légales
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-white transition-all duration-300 hover:text-care-evo-accent"
                            >
                                Politique de confidentialité
                            </Link>
                            <Link
                                href="/cgv"
                                className="text-white transition-all duration-300 hover:text-care-evo-accent"
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
