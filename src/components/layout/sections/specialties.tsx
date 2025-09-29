import Link from "next/link"

interface SpecialtyCardProps {
    icon: React.ReactNode
    title: string
    count: number
    href: string
    color: string
}

const SpecialtyCard = ({
    icon,
    title,
    count,
    href,
    color
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
    )
}

export const SpecialtiesSection = () => {
    const specialties = [
        {
            icon: <span className="text-3xl">👨‍⚕️</span>,
            title: "Médecine générale",
            count: 0,
            href: "/annonces?specialty=medecine-generale",
            color: "bg-blue-600"
        },
        {
            icon: <span className="text-3xl">🦷</span>,
            title: "Dentistes",
            count: 0,
            href: "/annonces?specialty=dentistes",
            color: "bg-green-600"
        },
        {
            icon: <span className="text-3xl">💊</span>,
            title: "Pharmacies",
            count: 0,
            href: "/annonces?specialty=pharmacies",
            color: "bg-purple-600"
        },
        {
            icon: <span className="text-3xl">🧠</span>,
            title: "Kinésithérapie",
            count: 0,
            href: "/annonces?specialty=kinesitherapie",
            color: "bg-orange-600"
        },
        {
            icon: <span className="text-3xl">👁️</span>,
            title: "Ophtalmologie",
            count: 0,
            href: "/annonces?specialty=ophtalmologie",
            color: "bg-pink-600"
        },
        {
            icon: <span className="text-3xl">❤️</span>,
            title: "Cardiologie",
            count: 0,
            href: "/annonces?specialty=cardiologie",
            color: "bg-red-600"
        },
        {
            icon: <span className="text-3xl">🥼</span>,
            title: "Chirurgie",
            count: 0,
            href: "/annonces?specialty=chirurgie",
            color: "bg-indigo-600"
        },
        {
            icon: <span className="text-3xl">🧠</span>,
            title: "Neurologie",
            count: 0,
            href: "/annonces?specialty=neurologie",
            color: "bg-yellow-600"
        }
    ]

    return (
        <section className="bg-blue-50 py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 font-bold text-3xl text-gray-900 lg:text-4xl">
                        Choisissez votre domaine et découvrez les opportunités
                        disponibles
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
                        className="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
                    >
                        Voir toutes les spécialités
                        <span className="text-xl">›</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}
