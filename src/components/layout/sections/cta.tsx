import { Button } from "@/components/ui/button";
import { FileText, Search } from "lucide-react";
import Link from "next/link";

export const CtaSection = () => {
    return (
        <section className="bg-blue-900 py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="rounded-2xl p-8 text-center md:p-16">
                    <h2 className="mb-4 font-bold text-3xl md:text-5xl text-white">Prêt à faire le prochain pas?</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-white/95 text-lg">
                        Rejoignez des milliers de professionnels de santé qui transforment leur carrière avec Care Evo.
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="/annonces">
                            <Button
                                size="lg"
                                className="flex items-center gap-2 bg-white text-care-evo-primary px-8 py-6 font-semibold text-lg hover:bg-gray-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-care-evo-primary"
                            >
                                <Search className="h-5 w-5" />
                                Explorer les annonces
                            </Button>
                        </Link>

                        <Link href="/annonces/new">
                            <Button
                                size="lg"
                                className="flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-6 font-semibold text-lg hover:bg-care-evo-accent hover:border-care-evo-accent hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-care-evo-primary"
                            >
                                <FileText className="h-5 w-5" />
                                Déposer une annonce
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
