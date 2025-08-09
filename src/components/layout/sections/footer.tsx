import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

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
            { href: "/search", label: "Annonces" },
            { href: "/how-it-works", label: "Comment ça marche" },
            { href: "/specialties", label: "Types de professionnels" },
            { href: "/regions", label: "Régions" }
        ]
    },
    {
        title: "Informations",
        links: [
            { href: "/about", label: "À propos" },
            { href: "/faq", label: "FAQ" },
            { href: "/blog", label: "Blog" },
            { href: "/contact", label: "Contact" },
            { href: "/legal", label: "Démarches légales de cession" }
        ]
    }
]

export const FooterSection = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <h3 className="text-2xl font-bold mb-4">Doctonext</h3>
                        <p className="text-gray-400 mb-6">
                            La première plateforme dédiée à la vente et à l'achat de patientèle et de fonds de commerce dans le domaine médical.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-green-400 font-semibold mb-4">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Section */}
                    <div>
                        <h4 className="text-green-400 font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="mailto:contact@doctonext.fr" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    contact@doctonext.fr
                                </a>
                            </li>
                            <li>
                                <a href="tel:+33612345678" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    +33 6 12 34 56 78
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © 2025 Doctonext. Tous droits réservés.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/legal" className="text-gray-400 hover:text-white transition-colors">
                                Mentions légales
                            </Link>
                            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                Politique de confidentialité
                            </Link>
                            <Link href="/cgv" className="text-gray-400 hover:text-white transition-colors">
                                CGV
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
