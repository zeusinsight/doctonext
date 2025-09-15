import { Button } from "@/components/ui/button"
import { Search, FileText } from "lucide-react"
import Link from "next/link"

export const CTASection = () => {
    return (
        <section className="bg-gradient-to-br from-blue-500 to-blue-700 py-20">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-4 font-bold text-4xl text-white md:text-5xl">
                        Prêt à faire avancer votre carrière médicale ?
                    </h2>
                    <p className="mb-12 text-blue-100 text-lg md:text-xl">
                        Que vous cherchiez à vendre votre activité ou à vous
                        installer, Doctonext est la solution qu'il vous faut.
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="/annonces">
                            <Button
                                size="lg"
                                className="flex items-center gap-2 bg-white px-8 py-6 font-semibold text-blue-600 text-lg hover:bg-blue-50"
                            >
                                <Search className="h-5 w-5" />
                                Explorer les annonces
                            </Button>
                        </Link>
                        <Link href="/dashboard/annonces/new">
                            <Button
                                size="lg"
                                className="flex items-center gap-2 bg-green-600 px-8 py-6 font-semibold text-lg text-white hover:bg-green-700"
                            >
                                <FileText className="h-5 w-5" />
                                Déposer une annonce
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
