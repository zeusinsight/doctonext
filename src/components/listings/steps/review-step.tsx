"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    CheckCircle,
    MapPin,
    Calendar,
    Euro,
    FileText,
    Handshake,
    Sparkles,
    Zap,
    Bell,
    Mail,
    Star
} from "lucide-react"
import type { CreateListingFormData, ReviewStepData } from "@/types/listing"

interface ReviewStepProps {
    formData: CreateListingFormData
    onDataChange: (data: ReviewStepData) => void
    onPrevious: () => void
    onSubmit: () => void
    isSubmitting: boolean
}

export function ReviewStep({
    formData,
    onDataChange,
    onPrevious,
    onSubmit,
    isSubmitting
}: ReviewStepProps) {
    const [reviewData, setReviewData] = useState<ReviewStepData>({
        isBoostPlus: false,
        expiresAt: undefined
    })

    const handleOptionChange = (field: keyof ReviewStepData, value: any) => {
        const newData = { ...reviewData, [field]: value }
        setReviewData(newData)
        onDataChange(newData)
    }

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

    const typeBadge = getListingTypeBadge(
        formData.basicInfo?.listingType || "transfer"
    )

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg">
                    Révision et publication
                </h3>
                <p className="text-muted-foreground">
                    Vérifiez vos informations avant de publier votre annonce
                </p>
            </div>

            {/* Summary Cards */}
            <div className="space-y-4">
                {/* Basic Info */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="h-4 w-4" />
                            Informations de base
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <h4 className="font-medium">
                                {formData.basicInfo?.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-2">
                                <Badge variant={typeBadge.variant}>
                                    {typeBadge.label}
                                </Badge>
                                {formData.basicInfo?.specialty && (
                                    <span className="text-muted-foreground text-sm">
                                        • {formData.basicInfo.specialty}
                                    </span>
                                )}
                            </div>
                        </div>
                        {formData.basicInfo?.description && (
                            <p className="text-muted-foreground text-sm">
                                {formData.basicInfo.description}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Location */}
                {formData.location && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPin className="h-4 w-4" />
                                Localisation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                {formData.location.address &&
                                    `${formData.location.address}, `}
                                {formData.location.postalCode}{" "}
                                {formData.location.city}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                {formData.location.region}
                                {formData.location.department &&
                                    `, ${formData.location.department}`}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Transfer Details */}
                {formData.basicInfo?.listingType === "transfer" &&
                    formData.transferDetails && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Euro className="h-4 w-4" />
                                    Détails de la cession
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {formData.transferDetails.practiceType && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Type :{" "}
                                            </span>
                                            {
                                                formData.transferDetails
                                                    .practiceType
                                            }
                                        </div>
                                    )}
                                    {formData.transferDetails.salePrice && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Prix :{" "}
                                            </span>
                                            {formData.transferDetails.salePrice.toLocaleString()}{" "}
                                            €
                                        </div>
                                    )}
                                    {formData.transferDetails
                                        .annualTurnover && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                CA annuel :{" "}
                                            </span>
                                            {formData.transferDetails.annualTurnover.toLocaleString()}{" "}
                                            €
                                        </div>
                                    )}
                                    {formData.transferDetails
                                        .patientBaseSize && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Patients :{" "}
                                            </span>
                                            {
                                                formData.transferDetails
                                                    .patientBaseSize
                                            }
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                {/* Replacement Details */}
                {formData.basicInfo?.listingType === "replacement" &&
                    formData.replacementDetails && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Calendar className="h-4 w-4" />
                                    Détails du remplacement
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {formData.replacementDetails
                                        .replacementType && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Type :{" "}
                                            </span>
                                            {
                                                formData.replacementDetails
                                                    .replacementType
                                            }
                                        </div>
                                    )}
                                    {formData.replacementDetails.dailyRate && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Tarif/jour :{" "}
                                            </span>
                                            {
                                                formData.replacementDetails
                                                    .dailyRate
                                            }{" "}
                                            €
                                        </div>
                                    )}
                                    {formData.replacementDetails.startDate && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Début :{" "}
                                            </span>
                                            {new Date(
                                                formData.replacementDetails
                                                    .startDate
                                            ).toLocaleDateString()}
                                        </div>
                                    )}
                                    {formData.replacementDetails.endDate && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Fin :{" "}
                                            </span>
                                            {new Date(
                                                formData.replacementDetails
                                                    .endDate
                                            ).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                {/* Collaboration Details */}
                {formData.basicInfo?.listingType === "collaboration" &&
                    formData.collaborationDetails && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Handshake className="h-4 w-4" />
                                    Détails de la collaboration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                    {formData.collaborationDetails
                                        .collaborationType && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Type :{" "}
                                            </span>
                                            <span className="capitalize">
                                                {formData.collaborationDetails.collaborationType.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {formData.collaborationDetails
                                        .durationExpectation && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Durée :{" "}
                                            </span>
                                            <span className="capitalize">
                                                {formData.collaborationDetails.durationExpectation.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {formData.collaborationDetails
                                        .spaceArrangement && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Espace :{" "}
                                            </span>
                                            <span className="capitalize">
                                                {formData.collaborationDetails.spaceArrangement.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {formData.collaborationDetails
                                        .patientManagement && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Patients :{" "}
                                            </span>
                                            <span className="capitalize">
                                                {
                                                    formData
                                                        .collaborationDetails
                                                        .patientManagement
                                                }
                                            </span>
                                        </div>
                                    )}
                                    {formData.collaborationDetails
                                        .activityDistribution && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Répartition :{" "}
                                            </span>
                                            <span className="capitalize">
                                                {formData.collaborationDetails.activityDistribution.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {formData.collaborationDetails
                                        .activityDistributionDetails && (
                                        <div>
                                            <span className="text-muted-foreground">
                                                Détails répartition :{" "}
                                            </span>
                                            {
                                                formData.collaborationDetails
                                                    .activityDistributionDetails
                                            }
                                        </div>
                                    )}
                                </div>

                                {formData.collaborationDetails
                                    .investmentRequired && (
                                    <div className="border-t pt-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">
                                                Investissement requis :
                                            </span>
                                            {formData.collaborationDetails
                                                .investmentAmount && (
                                                <span className="font-medium">
                                                    {formData.collaborationDetails.investmentAmount.toLocaleString()}{" "}
                                                    €
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {formData.collaborationDetails
                                    .specialtiesWanted &&
                                    formData.collaborationDetails
                                        .specialtiesWanted.length > 0 && (
                                        <div className="border-t pt-2">
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">
                                                    Spécialités recherchées :{" "}
                                                </span>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {formData.collaborationDetails.specialtiesWanted.map(
                                                        (specialty, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {specialty}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {formData.collaborationDetails
                                    .remunerationModel && (
                                    <div className="border-t pt-2">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">
                                                Modèle de rémunération :{" "}
                                            </span>
                                            <p className="mt-1 rounded bg-muted p-2 text-xs">
                                                {
                                                    formData
                                                        .collaborationDetails
                                                        .remunerationModel
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {formData.collaborationDetails
                                    .valuesAndGoals && (
                                    <div className="border-t pt-2">
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">
                                                Valeurs et objectifs :{" "}
                                            </span>
                                            <p className="mt-1 rounded bg-muted p-2 text-xs">
                                                {
                                                    formData
                                                        .collaborationDetails
                                                        .valuesAndGoals
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                {/* Media */}
                {formData.media?.files && formData.media.files.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Fichiers joints
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                {formData.media.files.length} fichier(s)
                                sélectionné(s)
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Separator />

            {/* Publishing Options */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Options de publication</h3>

                {/* Boost+ Option Card */}
                <div
                    className={`relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        reviewData.isBoostPlus
                            ? "border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg shadow-amber-100"
                            : "border-gray-200 bg-white hover:border-amber-200 hover:shadow-md"
                    }`}
                    onClick={() => handleOptionChange("isBoostPlus", !reviewData.isBoostPlus)}
                >
                    {/* Decorative gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/10 to-yellow-400/10" />

                    <div className="relative p-5">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <Checkbox
                                    id="isBoostPlus"
                                    checked={reviewData.isBoostPlus}
                                    onCheckedChange={(checked) =>
                                        handleOptionChange("isBoostPlus", checked === true)
                                    }
                                    className="h-5 w-5 border-2 border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white"
                                />
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-amber-500" />
                                        <Label
                                            htmlFor="isBoostPlus"
                                            className="cursor-pointer font-bold text-lg text-gray-900"
                                        >
                                            Option Boost+
                                        </Label>
                                    </div>
                                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-semibold">
                                        +5€ TTC
                                    </Badge>
                                </div>

                                {/* Features grid */}
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                                            <Zap className="h-3.5 w-3.5 text-amber-600" />
                                        </div>
                                        <span>Mise en avant continue</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                                            <Star className="h-3.5 w-3.5 text-amber-600" />
                                        </div>
                                        <span>Badge distinctif</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                                            <Bell className="h-3.5 w-3.5 text-amber-600" />
                                        </div>
                                        <span>Notifications aux abonnés</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                                            <Mail className="h-3.5 w-3.5 text-amber-600" />
                                        </div>
                                        <span>Alerte email instantanée</span>
                                    </div>
                                </div>

                                {reviewData.isBoostPlus && (
                                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                                        <CheckCircle className="h-4 w-4" />
                                        Option sélectionnée - Vous serez redirigé vers le paiement
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 pb-4">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                </Button>
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        reviewData.isBoostPlus
                            ? "Redirection vers le paiement..."
                            : "Publication..."
                    ) : reviewData.isBoostPlus ? (
                        <>
                            <Euro className="mr-2 h-4 w-4" />
                            Payer et publier (5€)
                        </>
                    ) : (
                        <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Publier l'annonce
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
