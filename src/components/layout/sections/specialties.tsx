"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SPECIALTY_SLUG_TO_LABEL } from "@/lib/constants/specialties";

interface SpecialtyCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  href: string;
  color: string;
}

const SpecialtyCard = ({
  icon,
  title,
  count,
  href,
  color,
}: SpecialtyCardProps) => {
  return (
    <Link
      href={href}
      className="group block h-full rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex flex-col items-center space-y-3 text-center">
        <div
          className={`rounded-full p-4 ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}
        >
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm">{count} annonces</p>
      </div>
    </Link>
  );
};

export const SpecialtiesSection = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/listings/counts-by-specialty");
        const result = await response.json();
        if (result.success) {
          setCounts(result.data);
        }
      } catch (error) {
        console.error("Error fetching specialty counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const specialties = [
    {
      icon: <span className="text-3xl">👨‍⚕️</span>,
      title: "Médecin généraliste",
      count: counts[SPECIALTY_SLUG_TO_LABEL["medecine-generale"]] || 0,
      href: "/annonces?specialty=medecine-generale",
      color: "bg-care-evo-primary",
    },
    {
      icon: <span className="text-3xl">🦷</span>,
      title: "Dentiste",
      count: counts[SPECIALTY_SLUG_TO_LABEL["dentistes"]] || 0,
      href: "/annonces?specialty=dentistes",
      color: "bg-care-evo-accent",
    },
    {
      icon: <span className="text-3xl">💊</span>,
      title: "Pharmacien",
      count: counts[SPECIALTY_SLUG_TO_LABEL["pharmacies"]] || 0,
      href: "/annonces?specialty=pharmacies",
      color: "bg-care-evo-primary-light",
    },
    {
      icon: <span className="text-3xl">🧠</span>,
      title: "Kinésithérapeute",
      count: counts[SPECIALTY_SLUG_TO_LABEL["kinesitherapie"]] || 0,
      href: "/annonces?specialty=kinesitherapie",
      color: "bg-care-evo-accent-light",
    },
    {
      icon: <span className="text-3xl">🗣️</span>,
      title: "Orthophoniste",
      count: counts[SPECIALTY_SLUG_TO_LABEL["orthophoniste"]] || 0,
      href: "/annonces?specialty=orthophoniste",
      color: "bg-care-evo-primary",
    },
    {
      icon: <span className="text-3xl">💉</span>,
      title: "Infirmier",
      count: counts[SPECIALTY_SLUG_TO_LABEL["infirmier"]] || 0,
      href: "/annonces?specialty=infirmier",
      color: "bg-care-evo-accent",
    },
    {
      icon: <span className="text-3xl">👶</span>,
      title: "Sage-femme",
      count: counts[SPECIALTY_SLUG_TO_LABEL["sage-femme"]] || 0,
      href: "/annonces?specialty=sage-femme",
      color: "bg-care-evo-primary-light",
    },
    {
      icon: <span className="text-3xl">🦶</span>,
      title: "Podologue",
      count: counts[SPECIALTY_SLUG_TO_LABEL["podologie"]] || 0,
      href: "/annonces?specialty=podologie",
      color: "bg-care-evo-accent-light",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-3xl text-gray-900 lg:text-4xl">
            Choisissez votre domaine et découvrez les opportunités disponibles
          </h2>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
          {specialties.map((specialty) => (
            <SpecialtyCard
              key={specialty.title}
              icon={specialty.icon}
              title={specialty.title}
              count={specialty.count}
              href={specialty.href}
              color={specialty.color}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/annonces"
            className="inline-flex items-center gap-2 font-medium text-care-evo-primary hover:text-care-evo-primary-dark"
          >
            Voir toutes les spécialités
            <span className="text-xl">›</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
