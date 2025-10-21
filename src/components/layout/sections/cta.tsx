import { Button } from "@/components/ui/button";
import { FileText, Search } from "lucide-react";
import Link from "next/link";

export const CtaSection = () => {
    return (
        <section className="bg-care-evo-primary py-20 sm:py-28">
            <div className="container mx-auto px-4">
                <div className="rounded-2xl p-8 text-center md:p-16 max-w-4xl mx-auto">
                    <h2 className="mb-6 font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
                        Prêt à faire le prochain pas?
                    </h2>
                    <p className="mx-auto mb-12 max-w-2xl text-white/95 text-xl leading-relaxed">
                        Rejoignez des milliers de professionnels de santé qui transforment leur carrière avec Care Evo.
                    </p>

                    <div className="flex flex-col justify-center gap-6 sm:flex-row">
                        <Link href="/annonces">
                            <Button
                                size="lg"
                                className="flex items-center gap-3 bg-care-evo-primary-light text-white px-10 py-7 font-semibold text-lg hover:bg-care-evo-primary-dark hover:scale-105 hover:shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-care-evo-primary"
                            >
                                <Search className="h-6 w-6" />
                                Explorer les annonces
                            </Button>
                        </Link>

                        <Link href="/annonces/new">
                            <Button
                                size="lg"
                                className="flex items-center gap-3 bg-care-evo-accent text-white px-10 py-7 font-semibold text-lg hover:bg-care-evo-accent-dark hover:scale-105 hover:shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-care-evo-accent"
                            >
                                <FileText className="h-6 w-6" />
                                Déposer une annonce
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
