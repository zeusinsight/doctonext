"use client";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SmartListingButton } from "@/components/ui/smart-listing-button";

type TriangleLabels = {
  a: string;
  b: string;
  c: string;
};

export const ConnectedTriangles = ({
  labels = { a: "Titulaires", b: "Remplaçants", c: "Associés" },
}: {
  labels?: TriangleLabels;
}) => {
  const [hovered, setHovered] = useState<
    "remplacement" | "collaboration" | "cession" | null
  >(null);
  return (
    <div className="relative flex h-[300px] w-full items-center justify-center md:h-[420px]">
      {/* subtle glow background */}
      <div className="-z-10 absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white" />
      <svg
        role="img"
        aria-label="Schéma des relations sur la plateforme"
        width="480"
        height="360"
        viewBox="0 0 480 360"
        className="h-full w-full max-w-xl"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <radialGradient id="nodeBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.6" />
          </radialGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="8"
              floodColor="#111827"
              floodOpacity="0.08"
            />
          </filter>
        </defs>

        {/* Triangle connecting lines (with hover emphasis) - Harmonisé avec les couleurs Care Evo */}
        {/* Remplacement: dotted, Care Evo primary blue */}
        <g
          stroke="#1e40af"
          strokeLinecap="round"
          opacity={hovered && hovered !== "remplacement" ? 0.35 : 1}
          className="cursor-pointer transition-all duration-300 ease-out"
          onMouseEnter={() => setHovered("remplacement")}
          onMouseLeave={() => setHovered(null)}
        >
          <line
            x1="240"
            y1="52"
            x2="96"
            y2="300"
            strokeWidth={hovered === "remplacement" ? 6 : 4}
          />
        </g>
        {/* Collaboration: solid, Care Evo primary blue */}
        <g
          stroke="#1e40af"
          strokeLinecap="round"
          opacity={hovered && hovered !== "collaboration" ? 0.35 : 1}
          className="cursor-pointer transition-all duration-300 ease-out"
          onMouseEnter={() => setHovered("collaboration")}
          onMouseLeave={() => setHovered(null)}
        >
          <line
            x1="240"
            y1="52"
            x2="384"
            y2="300"
            strokeWidth={hovered === "collaboration" ? 6 : 4}
          />
        </g>
        {/* Cession: solid, Care Evo primary blue */}
        <g
          strokeLinecap="round"
          opacity={hovered && hovered !== "cession" ? 0.35 : 1}
          className="cursor-pointer transition-all duration-300 ease-out"
          onMouseEnter={() => setHovered("cession")}
          onMouseLeave={() => setHovered(null)}
        >
          <line
            x1="120"
            y1="300"
            x2="360"
            y2="300"
            stroke="#1e40af"
            strokeOpacity="0.9"
            strokeWidth={hovered === "cession" ? 6 : 4}
          />
        </g>

        {/* Relationship labels (hover-aware, centered) */}
        <g fontSize="12" fontWeight={600} textAnchor="middle">
          {/* Remplacement label @ (168,176) */}
          <g
            className="cursor-pointer transition-all duration-200 ease-out"
            onMouseEnter={() => setHovered("remplacement")}
            onMouseLeave={() => setHovered(null)}
          >
            <rect
              x="116"
              y="164"
              width="104"
              height="24"
              rx="12"
              fill="#ffffff"
              stroke={hovered === "remplacement" ? "#14b8a6" : "#e5e7eb"}
              strokeWidth={hovered === "remplacement" ? 2 : 1}
            />
            <text x="168" y="180" fill="#374151">
              Remplacement
            </text>
          </g>
          {/* Collaboration label @ (312,176) */}
          <g
            className="cursor-pointer transition-all duration-300 ease-out"
            onMouseEnter={() => setHovered("collaboration")}
            onMouseLeave={() => setHovered(null)}
          >
            <rect
              x="260"
              y="164"
              width="104"
              height="24"
              rx="12"
              fill="#ffffff"
              stroke={hovered === "collaboration" ? "#1e40af" : "#e5e7eb"}
              strokeWidth={hovered === "collaboration" ? 2 : 1}
            />
            <text x="312" y="180" fill="#374151">
              Collaboration
            </text>
          </g>
          {/* Cession label @ (240,300) */}
          <g
            className="cursor-pointer transition-all duration-300 ease-out"
            onMouseEnter={() => setHovered("cession")}
            onMouseLeave={() => setHovered(null)}
          >
            <rect
              x="188"
              y="288"
              width="104"
              height="24"
              rx="12"
              fill="#ffffff"
              stroke={hovered === "cession" ? "#14b8a6" : "#e5e7eb"}
              strokeWidth={hovered === "cession" ? 2 : 1}
            />
            <text x="240" y="304" fill="#374151">
              Cession
            </text>
          </g>
        </g>

        {/* Nodes - Harmonisé avec Care Evo colors */}
        <g filter="url(#softShadow)">
          {/* Top node */}
          <g>
            <circle
              cx="240"
              cy="52"
              r="24"
              fill="url(#nodeBg)"
              stroke="#1e40af"
              strokeWidth="2"
            />
            <text
              x="240"
              y="120"
              textAnchor="middle"
              fontSize="13"
              fill="#111827"
            >
              {labels.a}
            </text>
          </g>
          {/* Left node */}
          <g>
            <circle
              cx="96"
              cy="300"
              r="24"
              fill="url(#nodeBg)"
              stroke="#1e40af"
              strokeWidth="2"
            />
            <text
              x="96"
              y="344"
              textAnchor="middle"
              fontSize="13"
              fill="#1e40af"
            >
              {labels.b}
            </text>
          </g>
          {/* Right node */}
          <g>
            <circle
              cx="384"
              cy="300"
              r="24"
              fill="url(#nodeBg)"
              stroke="#1e40af"
              strokeWidth="2"
            />
            <text
              x="384"
              y="344"
              textAnchor="middle"
              fontSize="13"
              fill="#1e40af"
            >
              {labels.c}
            </text>
          </g>
        </g>

        {/* Center badge (emphasized) */}
        <g transform="translate(240,200)" filter="url(#softShadow)">
          <rect
            x="-70"
            y="20"
            rx="999"
            ry="999"
            width="140"
            height="36"
            fill="#eff6ff"
            stroke="#bfdbfe"
          />
          <text
            x="0"
            y="43"
            textAnchor="middle"
            fontSize="13"
            fontWeight={700}
            fill="#1d4ed8"
          >
            Mises en relation
          </text>
        </g>
      </svg>
    </div>
  );
};

export const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* decorative gradient */}
      <div
        aria-hidden="true"
        className="-top-48 -z-10 pointer-events-none absolute inset-x-0 h-72 bg-gradient-to-b from-gray-50 via-white to-transparent"
      />
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-8 text-gray-900">
            {/* Care Evo Logo - Agrandie pour plus de présence visuelle */}
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/logo.png"
                alt="Care Evo"
                width={180}
                height={60}
                className="h-auto w-48"
              />
            </div>

            {/* Main Title - Amélioration du contraste et espacement */}
            <h1 className="font-bold text-4xl leading-snug tracking-tight md:text-5xl lg:text-6xl text-center lg:text-left text-gray-900">
              Réinventez votre
              <br />
              <span className="text-care-evo-primary">carrière médicale</span>
            </h1>

            {/* Subtitle - Plus percutant */}
            <p className="text-gray-700 text-lg leading-relaxed md:text-xl text-center lg:text-left font-medium">
              La première plateforme qui connecte les professionnels de santé pour développer leur carrière, en toute simplicité.
            </p>

            {/* CTA discret */}
            <p className="text-gray-600 text-base text-center lg:text-left italic">
              Découvrez comment Care Evo peut transformer votre parcours professionnel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-lg bg-care-evo-primary text-white shadow-lg hover:bg-care-evo-primary-dark hover:shadow-xl transition-all duration-200"
              >
                <Link href="/annonces" className="flex items-center gap-2">
                  <Search className="size-5" />
                  Trouver une annonce
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-2 border-care-evo-accent text-care-evo-accent hover:bg-care-evo-accent hover:text-white transition-all duration-200"
              >
                <SmartListingButton className="flex items-center gap-2">
                  <Plus className="size-5" />
                  Déposer une annonce
                </SmartListingButton>
              </Button>
            </div>
          </div>

          {/* Right - Relationship diagram */}
          <div className="relative hidden lg:block">
            <ConnectedTriangles />
          </div>
        </div>
      </div>
    </section>
  );
};
