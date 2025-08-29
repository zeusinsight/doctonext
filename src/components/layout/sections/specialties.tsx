import { 
    Stethoscope, 
    Heart, 
    Pill, 
    Activity,
    Eye,
    HeartHandshake,
    Scissors,
    Brain
} from "lucide-react"
import Link from "next/link"

interface SpecialtyCardProps {
    icon: React.ReactNode
    title: string
    count: number
    href: string
    color: string
}

const SpecialtyCard = ({ icon, title, count, href, color }: SpecialtyCardProps) => {
    return (
        <Link 
            href={href}
            className="group block p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
            <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 rounded-full ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    {icon}
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{count} annonces</p>
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
        <section className="py-16 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Choisissez votre domaine et découvrez les opportunités disponibles
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
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

                <div className="text-center mt-12">
                    <Link 
                        href="/annonces" 
                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
                    >
                        Voir toutes les spécialités
                        <span className="text-xl">›</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}