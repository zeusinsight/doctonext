import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTY_SLUG_TO_LABEL } from "@/lib/constants/specialties";
import { SPECIALTY_ICONS } from "@/lib/constants/specialty-icons";
import Link from "next/link";

const specialties = [
    SPECIALTY_SLUG_TO_LABEL["medecine-generale"],
    SPECIALTY_SLUG_TO_LABEL["dentistes"],
    SPECIALTY_SLUG_TO_LABEL["pharmacies"],
    SPECIALTY_SLUG_TO_LABEL["kinesitherapie"],
    SPECIALTY_SLUG_TO_LABEL["orthophoniste"],
    SPECIALTY_SLUG_TO_LABEL["infirmier"],
    SPECIALTY_SLUG_TO_LABEL["sage-femme"],
    SPECIALTY_SLUG_TO_LABEL["podologie"],
];

export const SpecialtiesSection = () => {
    return (
        <section className="container mx-auto px-4 py-20 sm:py-28">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">Choisissez votre domaine</h2>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                {specialties.map((specialty) => {
                    const Icon = SPECIALTY_ICONS[specialty];
                    return (
                        <Link key={specialty} href={`/annonces?specialties=${specialty}`}>
                            <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-care-evo-accent hover:bg-care-evo-accent/5">
                                <CardContent className="flex flex-col items-center justify-center gap-3 h-36 p-4 text-center">
                                    {Icon && <Icon className="h-10 w-10 text-care-evo-primary transition-colors duration-300 group-hover:text-care-evo-accent" />}
                                    <span className="font-medium text-gray-800 text-sm">{specialty}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}; 
