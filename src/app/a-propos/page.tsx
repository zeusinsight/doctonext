import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Shield,
    Clock,
    MessageSquare,
    FileText,
    Heart,
    CheckCircle,
    Award,
    TrendingUp
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Hero Section */}
                <section className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="font-bold text-4xl text-gray-900 tracking-tight sm:text-6xl">
                            À propos de{" "}
                            <span className="text-blue-600">Care Evo</span>
                        </h1>
                        <p className="mt-6 text-gray-600 text-lg leading-8">
                            La plateforme de référence pour les professionnels
                            de santé qui souhaitent céder, reprendre ou
                            collaborer dans le secteur médical.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button asChild size="lg">
                                <Link href="/annonces">
                                    Explorer les annonces
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/dashboard/listings/new">
                                    Déposer une annonce
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 font-bold text-3xl text-gray-900">
                                Notre Mission
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Simplifier et sécuriser les transitions
                                professionnelles dans le domaine médical
                            </p>
                        </div>

                        <Card className="mb-8">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                        <Heart className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        Care Evo connecte les professionnels de
                                        santé pour faciliter les cessions de
                                        cabinets, les remplacements et les
                                        collaborations. Notre objectif est de
                                        créer un écosystème de confiance où
                                        chaque professionnel peut trouver les
                                        opportunités qui correspondent à ses
                                        aspirations et à son projet de carrière.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 font-bold text-3xl text-gray-900">
                                Pourquoi choisir Care Evo ?
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Une plateforme pensée par et pour les
                                professionnels de santé
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                        <Shield className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                        Sécurité et Confiance
                                    </h3>
                                    <p className="text-gray-600">
                                        Vérification des profils, données
                                        sécurisées et processus transparents
                                        pour des transactions en toute
                                        confiance.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                        <Users className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                        Communauté Active
                                    </h3>
                                    <p className="text-gray-600">
                                        Rejoignez une communauté de
                                        professionnels de santé partageant les
                                        mêmes valeurs et objectifs.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                                        <MessageSquare className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                        Communication Facilitée
                                    </h3>
                                    <p className="text-gray-600">
                                        Messagerie intégrée, outils de
                                        collaboration et suivi des échanges pour
                                        une communication fluide.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                                        <FileText className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                        Outils Professionnels
                                    </h3>
                                    <p className="text-gray-600">
                                        Génération de contrats, outils
                                        d'évaluation et accompagnement
                                        personnalisé pour vos projets.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                                        <Clock className="h-6 w-6 text-red-600" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                        Gain de Temps
                                    </h3>
                                    <p className="text-gray-600">
                                        Interface intuitive, recherche avancée
                                        et notifications intelligentes pour
                                        optimiser votre recherche.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                                        <Award className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                        Expertise Reconnue
                                    </h3>
                                    <p className="text-gray-600">
                                        Une équipe d'experts du secteur médical
                                        pour vous accompagner dans tous vos
                                        projets professionnels.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Statistics Section */}
                <section className="px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 font-bold text-3xl text-gray-900">
                                Care Evo en chiffres
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Une plateforme en croissance constante au
                                service des professionnels de santé
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="mb-2 font-bold text-3xl text-gray-900">
                                        500+
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        Professionnels inscrits
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                        <TrendingUp className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="mb-2 font-bold text-3xl text-gray-900">
                                        200+
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        Annonces actives
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                                        <CheckCircle className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="mb-2 font-bold text-3xl text-gray-900">
                                        50+
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        Transactions réussies
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Types of Services */}
                <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 font-bold text-3xl text-gray-900">
                                Nos Services
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Trois types d'opportunités pour répondre à tous
                                vos besoins professionnels
                            </p>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                            Cession
                                        </Badge>
                                        <div className="flex-1">
                                            <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                                Cession de Cabinet
                                            </h3>
                                            <p className="text-gray-600">
                                                Vendez ou reprenez un cabinet
                                                médical en toute sérénité.
                                                Accédez aux informations
                                                financières, à la patientèle,
                                                aux équipements et bénéficiez
                                                d'un accompagnement personnalisé
                                                pour votre transaction.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                            Remplacement
                                        </Badge>
                                        <div className="flex-1">
                                            <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                                Remplacement
                                            </h3>
                                            <p className="text-gray-600">
                                                Trouvez des remplacements
                                                temporaires, de long terme ou
                                                pour les week-ends. Que vous
                                                soyez remplaçant ou que vous
                                                cherchiez un remplaçant,
                                                connectez-vous facilement avec
                                                des professionnels qualifiés.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                            Collaboration
                                        </Badge>
                                        <div className="flex-1">
                                            <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                                                Collaboration
                                            </h3>
                                            <p className="text-gray-600">
                                                Développez votre pratique en
                                                association, partenariat ou dans
                                                un cabinet de groupe. Trouvez
                                                des collaborateurs partageant
                                                votre vision pour créer une
                                                pratique médicale enrichissante
                                                et durable.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-care-evo-primary px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="mb-4 font-bold text-3xl text-white">
                            Prêt à donner un nouvel élan à votre carrière ?
                        </h2>
                        <p className="mb-8 text-blue-50 text-lg">
                            Rejoignez Care Evo aujourd'hui et découvrez les
                            opportunités qui vous attendent.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Button asChild size="lg" variant="secondary" className="bg-white text-care-evo-primary hover:bg-gray-100">
                                <Link href="/annonces">
                                    Parcourir les annonces
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-care-evo-accent hover:text-white hover:border-care-evo-accent"
                            >
                                <Link href="/dashboard/listings/new">
                                    Publier une annonce
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
