import { Button } from "@/components/ui/button"
import { Search, FileText } from "lucide-react"
import Link from "next/link"

export const CTASection = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-500 to-blue-700">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Prêt à faire avancer votre carrière médicale ?
                    </h2>
                    <p className="text-lg md:text-xl text-blue-100 mb-12">
                        Que vous cherchiez à vendre votre activité ou à vous installer, Doctonext est la solution qu'il vous faut.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register">
                            <Button 
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                Explorer les annonces
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button 
                                size="lg"
                                className="bg-green-600 text-white hover:bg-green-700 font-semibold px-8 py-6 text-lg flex items-center gap-2"
                            >
                                <FileText className="w-5 h-5" />
                                Déposer une annonce
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}