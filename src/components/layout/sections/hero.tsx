"use client"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SmartListingButton } from "@/components/ui/smart-listing-button"

type TriangleLabels = {
    a: string
    b: string
    c: string
}

const ConnectedTriangles = ({
    labels = { a: "Titulaires", b: "Remplaçants", c: "Associés" }
}: {
    labels?: TriangleLabels
}) => {
    return (
        <div className="relative flex h-[360px] w-full items-center justify-center md:h-[420px]">
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
                        <stop
                            offset="100%"
                            stopColor="#e5e7eb"
                            stopOpacity="0.6"
                        />
                    </radialGradient>
                    <filter
                        id="softShadow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feDropShadow
                            dx="0"
                            dy="6"
                            stdDeviation="8"
                            floodColor="#111827"
                            floodOpacity="0.08"
                        />
                    </filter>
                </defs>

                {/* Triangle connecting lines */}
                <g
                    stroke="url(#lineGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="1"
                >
                    {/* top to left */}
                    <line
                        x1="240"
                        y1="52"
                        x2="96"
                        y2="300"
                        strokeDasharray="4 6"
                    />
                    {/* top to right */}
                    <line
                        x1="240"
                        y1="52"
                        x2="384"
                        y2="300"
                        strokeDasharray="4 6"
                    />
                    {/* left to right */}
                    {/* shorten to avoid hiding under nodes; add white underlay for contrast + dashed overlay */}
                    <line
                        x1="120"
                        y1="300"
                        x2="360"
                        y2="300"
                        stroke="#ffffff"
                        strokeOpacity="0.9"
                        strokeWidth="6"
                    />
                    <line
                        x1="120"
                        y1="300"
                        x2="360"
                        y2="300"
                        strokeDasharray="4 6"
                        strokeWidth="3"
                    />
                </g>

                {/* Relationship labels */}
                <g fontSize="12" fontWeight="600" textAnchor="middle">
                    {/* midpoint of top-left line: ((240+96)/2, (52+300)/2) => (168,176) */}
                    <g>
                        <rect
                            x="116"
                            y="164"
                            width="104"
                            height="24"
                            rx="12"
                            fill="#ffffff"
                            stroke="#e5e7eb"
                        />
                        <text x="168" y="180" fill="#374151">
                            Remplacement
                        </text>
                    </g>
                    {/* midpoint of top-right line: ((240+384)/2, (52+300)/2) => (312,176) */}
                    <g>
                        <rect
                            x="260"
                            y="164"
                            width="104"
                            height="24"
                            rx="12"
                            fill="#ffffff"
                            stroke="#e5e7eb"
                        />
                        <text x="312" y="180" fill="#374151">
                            Collaboration
                        </text>
                    </g>
                    {/* midpoint of bottom line: ((96+384)/2, 300) => (240,300) */}
                    <g>
                        <rect
                            x="188"
                            y="288"
                            width="104"
                            height="24"
                            rx="12"
                            fill="#ffffff"
                            stroke="#e5e7eb"
                        />
                        <text x="240" y="304" fill="#374151">
                            Cession
                        </text>
                    </g>
                </g>

                {/* Nodes */}
                <g filter="url(#softShadow)">
                    {/* Top node */}
                    <g>
                        <circle
                            cx="240"
                            cy="52"
                            r="24"
                            fill="url(#nodeBg)"
                            stroke="#2563eb"
                            strokeWidth="2"
                        />
                        <text
                            x="240"
                            y="96"
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
                            stroke="#10b981"
                            strokeWidth="2"
                        />
                        <text
                            x="96"
                            y="344"
                            textAnchor="middle"
                            fontSize="13"
                            fill="#111827"
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
                            stroke="#7c3aed"
                            strokeWidth="2"
                        />
                        <text
                            x="384"
                            y="344"
                            textAnchor="middle"
                            fontSize="13"
                            fill="#111827"
                        >
                            {labels.c}
                        </text>
                    </g>
                </g>

                {/* Center badge */}
                <g transform="translate(240,200)" filter="url(#softShadow)">
                    <rect
                        x="-56"
                        y="-18"
                        rx="10"
                        ry="10"
                        width="112"
                        height="36"
                        fill="#111827"
                        fillOpacity="0.9"
                    />
                    <text
                        x="0"
                        y="6"
                        textAnchor="middle"
                        fontSize="12"
                        fill="#ffffff"
                    >
                        Mises en relation
                    </text>
                </g>
            </svg>
        </div>
    )
}

export const HeroSection = () => {
    return (
        <section className="relative w-full overflow-hidden bg-white">
            {/* decorative gradient */}
            <div className="-top-48 -z-10 pointer-events-none absolute inset-x-0 h-72 bg-gradient-to-b from-blue-50 via-white to-transparent" />
            <div className="container mx-auto px-4 py-16 lg:py-24">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Left Content */}
                    <div className="order-2 space-y-6 text-gray-900 lg:order-1">
                        <h1 className="font-semibold text-4xl leading-tight tracking-tight md:text-5xl">
                            La plateforme de mise en relation des professionnels
                            de santé
                        </h1>

                        <p className="text-gray-600 text-lg leading-relaxed md:text-xl">
                            Remplacements, collaborations et cessions de
                            patientèle en quelques clics.
                        </p>

                        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <Link
                                    href="/annonces"
                                    className="flex items-center gap-2"
                                >
                                    <Search className="size-5" />
                                    Trouver une annonce
                                </Link>
                            </Button>

                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-gray-300 text-gray-900 hover:bg-gray-50"
                            >
                                <SmartListingButton className="flex items-center gap-2">
                                    <Plus className="size-5" />
                                    Déposer une annonce
                                </SmartListingButton>
                            </Button>
                        </div>
                    </div>

                    {/* Right - Relationship diagram */}
                    <div className="relative order-1 lg:order-2">
                        <ConnectedTriangles />
                    </div>
                </div>
            </div>
        </section>
    )
}
