import { Button } from "@/components/ui/button";
import { FileText, Search } from "lucide-react";
import Link from "next/link";

export const CtaSection = () => {
    return (
        <section className="bg-white py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="rounded-2xl bg-gray-50 p-8 text-center md:p-12">
                    <h2 className="mb-4 font-bold text-3xl md:text-4xl">Prêt à faire le prochain pas?</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-lg">
                        Rejoignez des milliers de professionnels de santé qui transforment leur carrière avec CareEvo.
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="/annonces">
                            <Button
                                size="lg"
                                className="flex items-center gap-2 bg-white px-8 py-6 font-semibold text-blue-600 text-lg hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
                            >
                                <Search className="h-5 w-5" />
                                Explorer les annonces
                            </Button>
                        </Link>

                        <Link href="/annonces/new">
                            <Button
                                size="lg"
                                className="flex items-center gap-2 bg-blue-600 px-8 py-6 font-semibold text-white text-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
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
