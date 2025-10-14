import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTY_SLUG_TO_LABEL } from "@/lib/constants/specialties";
import { SPECIALTY_ICONS } from "@/lib/constants/specialty-icons";
import Link from "next/link";

const specialties = Object.values(SPECIALTY_SLUG_TO_LABEL).slice(0, 10);

export const SpecialtiesSection = () => {
    return (
        <section className="container mx-auto px-4 py-16 sm:py-24">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:text-4xl">Choisissez votre domaine</h2>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {specialties.map((specialty) => {
                    const Icon = SPECIALTY_ICONS[specialty];
                    return (
                        <Link key={specialty} href={`/annonces?specialties=${specialty}`}>
                            <Card className="transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                                <CardContent className="flex flex-col items-center justify-center gap-2 h-28 p-2 text-center">
                                    {Icon && <Icon className="h-8 w-8 text-blue-600" />}
                                    <span className="font-medium text-gray-800">{specialty}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}; 
