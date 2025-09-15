import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getListingById, incrementListingViews } from "@/lib/actions/listings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    MapPin,
    Calendar,
    Euro,
    MessageCircle,
    Building,
    Users,
    Clock,
    Briefcase,
    Home,
    Stethoscope,
    CheckCircle,
    FileText,
    Settings
} from "lucide-react"
import Image from "next/image"
import {
    ListingStatus,
    type ListingStatusType
} from "@/components/listings/listing-status"
import { ListingDetailActions } from "@/components/listings/listing-detail-client"
import { ContactSellerButton } from "@/components/messages/contact-seller-button"

interface ListingPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({
    params
}: ListingPageProps): Promise<Metadata> {
    const { id } = await params
    const listing = await getListingById(id)

    if (!listing) {
        return {
            title: "Annonce non trouvée"
        }
    }

    return {
        title: listing.title,
        description:
            listing.description ||
            `${listing.listingType === "transfer" ? "Cession" : listing.listingType === "replacement" ? "Remplacement" : "Collaboration"} - ${listing.specialty || "Médical"}`
    }
}

export default async function ListingPage({ params }: ListingPageProps) {
    const { id } = await params
    const listing = await getListingById(id)

    if (!listing) {
        notFound()
    }

    // Increment view count
    await incrementListingViews(id)

    const getListingTypeBadge = (type: string) => {
        const typeConfig = {
            transfer: { label: "Cession", variant: "default" as const },
            replacement: {
                label: "Remplacement",
                variant: "secondary" as const
            },
            collaboration: {
                label: "Collaboration",
                variant: "outline" as const
            }
        }

        return (
            typeConfig[type as keyof typeof typeConfig] || typeConfig.transfer
        )
    }

    const typeBadge = getListingTypeBadge(listing.listingType)

    const formatPrice = (price: number | null | undefined) => {
        if (!price) return null
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0
        }).format(price)
    }

    const getPrice = () => {
        if (listing.details) {
            if (
                listing.listingType === "transfer" &&
                "salePrice" in listing.details
            ) {
                return formatPrice(listing.details.salePrice)
            }
            if (
                listing.listingType === "replacement" &&
                "dailyRate" in listing.details
            ) {
                const rate = formatPrice(listing.details.dailyRate)
                return rate ? `${rate}/jour` : null
            }
            if (
                listing.listingType === "collaboration" &&
                "investmentAmount" in listing.details
            ) {
                const amount = listing.details.investmentAmount
                if (amount === "to_discuss") return "À discuter"
                if (amount) return formatPrice(Number(amount))
            }
        }
        return null
    }

    const price = getPrice()

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Image Gallery */}
                    {listing.media && listing.media.length > 0 && (
                        <div className="space-y-4">
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted">
                                <Image
                                    src={listing.media[0].fileUrl}
                                    alt={
                                        listing.media[0].fileName ||
                                        listing.title
                                    }
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            {listing.media.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {listing.media
                                        .slice(1, 5)
                                        .map((media, index) => (
                                            <div
                                                key={media.id}
                                                className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                                            >
                                                <Image
                                                    src={media.fileUrl}
                                                    alt={
                                                        media.fileName ||
                                                        `Image ${index + 2}`
                                                    }
                                                    fill
                                                    className="object-cover"
                                                />
                                                {index === 3 &&
                                                    listing.media.length >
                                                        5 && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                                                            <span className="font-semibold text-2xl">
                                                                +
                                                                {listing.media
                                                                    .length - 5}
                                                            </span>
                                                        </div>
                                                    )}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Main Content */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h1 className="font-bold text-2xl">
                                        {listing.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant={typeBadge.variant}>
                                            {typeBadge.label}
                                        </Badge>
                                        {listing.isBoostPlus && (
                                            <Badge
                                                variant="outline"
                                                className="border-amber-500/60 bg-amber-50 text-amber-600"
                                            >
                                                Boost+
                                            </Badge>
                                        )}
                                        <ListingStatus
                                            status={
                                                listing.status as ListingStatusType
                                            }
                                        />
                                    </div>
                                </div>
                                <ListingDetailActions
                                    listingId={listing.id}
                                    listingTitle={listing.title}
                                    listingType={listing.listingType}
                                    specialty={listing.specialty}
                                    location={listing.location}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {listing.description && (
                                <div>
                                    <h2 className="mb-3 font-semibold text-lg">
                                        Description
                                    </h2>
                                    <p className="whitespace-pre-wrap text-muted-foreground">
                                        {listing.description}
                                    </p>
                                </div>
                            )}

                            <Separator />

                            {/* Location */}
                            {listing.location && (
                                <div>
                                    <h2 className="mb-3 font-semibold text-lg">
                                        Localisation
                                    </h2>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">
                                                {listing.location.city} (
                                                {listing.location.postalCode})
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                {listing.location.region}
                                                {listing.location.department &&
                                                    `, ${listing.location.department}`}
                                            </p>
                                            {listing.location.address && (
                                                <p className="mt-1 text-muted-foreground text-sm">
                                                    {listing.location.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* Type-specific Details */}
                            {listing.details && (
                                <div>
                                    <h2 className="mb-3 font-semibold text-lg">
                                        {listing.listingType === "transfer"
                                            ? "Détails de la cession"
                                            : listing.listingType ===
                                                "replacement"
                                              ? "Détails du remplacement"
                                              : "Détails de la collaboration"}
                                    </h2>

                                    {listing.listingType === "transfer" &&
                                        "practiceType" in listing.details && (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {listing.details
                                                    .practiceType && (
                                                    <div className="flex items-start gap-3">
                                                        <Building className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Type de pratique
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {listing.details
                                                                    .practiceType ===
                                                                "solo"
                                                                    ? "Cabinet individuel"
                                                                    : listing
                                                                            .details
                                                                            .practiceType ===
                                                                        "group"
                                                                      ? "Cabinet de groupe"
                                                                      : "Clinique"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .annualTurnover && (
                                                    <div className="flex items-start gap-3">
                                                        <Euro className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Chiffre
                                                                d'affaires
                                                                annuel
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {formatPrice(
                                                                    listing
                                                                        .details
                                                                        .annualTurnover
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .patientBaseSize && (
                                                    <div className="flex items-start gap-3">
                                                        <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Patientèle
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {
                                                                    listing
                                                                        .details
                                                                        .patientBaseSize
                                                                }{" "}
                                                                patients
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .accompanimentOffered && (
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Accompagnement
                                                                proposé
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                Oui
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .chargesPercentage && (
                                                    <div className="flex items-start gap-3">
                                                        <Euro className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Charges
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {
                                                                    listing
                                                                        .details
                                                                        .chargesPercentage
                                                                }
                                                                %
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .availabilityOption && (
                                                    <div className="flex items-start gap-3">
                                                        <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Disponibilité
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {listing.details
                                                                    .availabilityOption ===
                                                                "immediately"
                                                                    ? "Immédiate"
                                                                    : "À discuter"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .softwareUsed && (
                                                    <div className="flex items-start gap-3">
                                                        <Settings className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Logiciel utilisé
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {
                                                                    listing
                                                                        .details
                                                                        .softwareUsed
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .equipmentIncluded && (
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Équipement
                                                                inclus
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                Oui
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .reasonForTransfer && (
                                                    <div className="col-span-2">
                                                        <div className="flex items-start gap-3">
                                                            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="font-medium text-sm">
                                                                    Raison de la
                                                                    cession
                                                                </p>
                                                                <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                                                                    {
                                                                        listing
                                                                            .details
                                                                            .reasonForTransfer
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    {listing.listingType === "replacement" &&
                                        "replacementType" in
                                            listing.details && (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {listing.details
                                                    .replacementType && (
                                                    <div className="flex items-start gap-3">
                                                        <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Type de
                                                                remplacement
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {listing.details
                                                                    .replacementType ===
                                                                "temporary"
                                                                    ? "Temporaire"
                                                                    : listing
                                                                            .details
                                                                            .replacementType ===
                                                                        "long_term"
                                                                      ? "Long terme"
                                                                      : "Week-end"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details.startDate && (
                                                    <div className="flex items-start gap-3">
                                                        <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Période
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                Du{" "}
                                                                {new Date(
                                                                    listing
                                                                        .details
                                                                        .startDate
                                                                ).toLocaleDateString(
                                                                    "fr-FR"
                                                                )}
                                                                {listing.details
                                                                    .endDate &&
                                                                    ` au ${new Date(listing.details.endDate).toLocaleDateString("fr-FR")}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .housingProvided && (
                                                    <div className="flex items-start gap-3">
                                                        <Home className="mt-0.5 h-4 w-4 text-green-600" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Logement fourni
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                Oui
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .hasAssistant && (
                                                    <div className="flex items-start gap-3">
                                                        <Users className="mt-0.5 h-4 w-4 text-green-600" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Assistant(e)
                                                                disponible
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                Oui
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details.workingDays &&
                                                    listing.details.workingDays
                                                        .length > 0 && (
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="font-medium text-sm">
                                                                    Jours de
                                                                    travail
                                                                </p>
                                                                <p className="text-muted-foreground text-sm">
                                                                    {listing.details.workingDays
                                                                        .map(
                                                                            (
                                                                                day
                                                                            ) => {
                                                                                const dayMap: Record<
                                                                                    string,
                                                                                    string
                                                                                > =
                                                                                    {
                                                                                        monday: "Lundi",
                                                                                        tuesday:
                                                                                            "Mardi",
                                                                                        wednesday:
                                                                                            "Mercredi",
                                                                                        thursday:
                                                                                            "Jeudi",
                                                                                        friday: "Vendredi",
                                                                                        saturday:
                                                                                            "Samedi",
                                                                                        sunday: "Dimanche"
                                                                                    }
                                                                                return (
                                                                                    dayMap[
                                                                                        day
                                                                                    ] ||
                                                                                    day
                                                                                )
                                                                            }
                                                                        )
                                                                        .join(
                                                                            ", "
                                                                        )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                {listing.details
                                                    .feeSharePercentage && (
                                                    <div className="flex items-start gap-3">
                                                        <Euro className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Rétrocession
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {
                                                                    listing
                                                                        .details
                                                                        .feeSharePercentage
                                                                }
                                                                %
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details.dailyRate && (
                                                    <div className="flex items-start gap-3">
                                                        <Euro className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Rémunération
                                                                journalière
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {formatPrice(
                                                                    listing
                                                                        .details
                                                                        .dailyRate
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .practicalTerms && (
                                                    <div className="col-span-2">
                                                        <div className="flex items-start gap-3">
                                                            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="font-medium text-sm">
                                                                    Modalités
                                                                    pratiques
                                                                </p>
                                                                <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                                                                    {
                                                                        listing
                                                                            .details
                                                                            .practicalTerms
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    {listing.listingType === "collaboration" &&
                                        "collaborationType" in
                                            listing.details && (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {listing.details
                                                    .collaborationType && (
                                                    <div className="flex items-start gap-3">
                                                        <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Type de
                                                                collaboration
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {listing.details
                                                                    .collaborationType ===
                                                                "association"
                                                                    ? "Association"
                                                                    : listing
                                                                            .details
                                                                            .collaborationType ===
                                                                        "partnership"
                                                                      ? "Partenariat"
                                                                      : listing
                                                                              .details
                                                                              .collaborationType ===
                                                                          "group_practice"
                                                                        ? "Pratique de groupe"
                                                                        : "Espace partagé"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .durationExpectation && (
                                                    <div className="flex items-start gap-3">
                                                        <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Durée attendue
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {listing.details
                                                                    .durationExpectation ===
                                                                "short_term"
                                                                    ? "Court terme"
                                                                    : listing
                                                                            .details
                                                                            .durationExpectation ===
                                                                        "long_term"
                                                                      ? "Long terme"
                                                                      : "Permanent"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .activityDistribution && (
                                                    <div className="flex items-start gap-3">
                                                        <Settings className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Répartition
                                                                d'activité
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {listing.details
                                                                    .activityDistribution ===
                                                                "full_time"
                                                                    ? "Temps plein"
                                                                    : "Temps partiel"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .investmentRequired && (
                                                    <div className="flex items-start gap-3">
                                                        <Euro className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Investissement
                                                                requis
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {listing.details
                                                                    .investmentAmount ===
                                                                "to_discuss"
                                                                    ? "À discuter"
                                                                    : listing
                                                                            .details
                                                                            .investmentAmount
                                                                      ? formatPrice(
                                                                            Number(
                                                                                listing
                                                                                    .details
                                                                                    .investmentAmount
                                                                            )
                                                                        )
                                                                      : "Oui"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .activityDistributionDetails && (
                                                    <div className="flex items-start gap-3">
                                                        <Settings className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Détails de la
                                                                répartition
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {
                                                                    listing
                                                                        .details
                                                                        .activityDistributionDetails
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .spaceArrangement && (
                                                    <div className="flex items-start gap-3">
                                                        <Building className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Aménagement des
                                                                locaux
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {listing.details
                                                                    .spaceArrangement ===
                                                                "shared_office"
                                                                    ? "Bureau partagé"
                                                                    : listing
                                                                            .details
                                                                            .spaceArrangement ===
                                                                        "separate_offices"
                                                                      ? "Bureaux séparés"
                                                                      : "Rotation"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .patientManagement && (
                                                    <div className="flex items-start gap-3">
                                                        <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Gestion de la
                                                                patientèle
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {listing.details
                                                                    .patientManagement ===
                                                                "shared"
                                                                    ? "Partagée"
                                                                    : listing
                                                                            .details
                                                                            .patientManagement ===
                                                                        "separate"
                                                                      ? "Séparée"
                                                                      : "Mixte"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .remunerationModel && (
                                                    <div className="flex items-start gap-3">
                                                        <Euro className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Modèle de
                                                                rémunération
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {
                                                                    listing
                                                                        .details
                                                                        .remunerationModel
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .specialtiesWanted &&
                                                    listing.details
                                                        .specialtiesWanted
                                                        .length > 0 && (
                                                        <div className="flex items-start gap-3">
                                                            <Stethoscope className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="font-medium text-sm">
                                                                    Spécialités
                                                                    recherchées
                                                                </p>
                                                                <p className="text-muted-foreground text-sm">
                                                                    {listing.details.specialtiesWanted.join(
                                                                        ", "
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                {listing.details
                                                    .experienceRequired && (
                                                    <div className="flex items-start gap-3">
                                                        <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                Expérience
                                                                requise
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                {
                                                                    listing
                                                                        .details
                                                                        .experienceRequired
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {listing.details
                                                    .valuesAndGoals && (
                                                    <div className="col-span-2">
                                                        <div className="flex items-start gap-3">
                                                            <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <p className="font-medium text-sm">
                                                                    Valeurs et
                                                                    objectifs
                                                                </p>
                                                                <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                                                                    {
                                                                        listing
                                                                            .details
                                                                            .valuesAndGoals
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>
                            )}

                            <Separator />

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-muted-foreground text-sm">
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>
                                        {listing.contactsCount} contacts
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        Publié le{" "}
                                        {new Date(
                                            listing.publishedAt ||
                                                listing.createdAt
                                        ).toLocaleDateString("fr-FR")}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price Card */}
                    {price && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Prix</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-bold text-2xl">{price}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Seller Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Professionnel
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage
                                        src={
                                            listing.user?.avatarUrl ||
                                            listing.user?.avatar ||
                                            listing.user?.image ||
                                            `https://api.dicebear.com/7.x/initials/svg?seed=${listing.user?.name}`
                                        }
                                    />
                                    <AvatarFallback>
                                        {listing.user?.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {listing.user?.name || "Professionnel"}
                                    </p>
                                    {listing.user?.profession && (
                                        <p className="text-muted-foreground text-sm">
                                            {listing.user.profession}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {listing.user?.isVerifiedProfessional && (
                                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2 text-green-700 text-sm">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Professionnel vérifié</span>
                                </div>
                            )}

                            {listing.specialty && (
                                <div className="flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {listing.specialty}
                                    </span>
                                </div>
                            )}

                            <ContactSellerButton
                                listingId={listing.id}
                                sellerId={listing.userId}
                                sellerName={
                                    listing.user?.name || "Professionnel"
                                }
                                listingTitle={listing.title}
                                className="w-full"
                            />
                        </CardContent>
                    </Card>

                    {/* Safety Tips */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Conseils de sécurité
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-muted-foreground text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                                    <span>
                                        Vérifiez toujours les documents
                                        officiels
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                                    <span>
                                        Rencontrez le vendeur en personne
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                                    <span>
                                        Ne payez jamais avant de visiter
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
