"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, MapPin, Calendar, Euro, Users, Clock, FileText } from "lucide-react"
import { CreateListingFormData, ReviewStepData } from "@/types/listing"

interface ReviewStepProps {
    formData: CreateListingFormData
    onDataChange: (data: ReviewStepData) => void
    onPrevious: () => void
    onSubmit: () => void
    isSubmitting: boolean
}

export function ReviewStep({ formData, onDataChange, onPrevious, onSubmit, isSubmitting }: ReviewStepProps) {
    const [reviewData, setReviewData] = useState<ReviewStepData>({
        isPremium: false,
        isUrgent: false,
        expiresAt: undefined
    })

    useEffect(() => {
        onDataChange(reviewData)
    }, [reviewData, onDataChange])

    const handleOptionChange = (field: keyof ReviewStepData, value: any) => {
        setReviewData(prev => ({ ...prev, [field]: value }))
    }

    const getListingTypeBadge = (type: string) => {
        const typeConfig = {
            transfer: { label: "Cession", variant: "default" as const },
            replacement: { label: "Remplacement", variant: "secondary" as const },
            collaboration: { label: "Collaboration", variant: "outline" as const }
        }
        return typeConfig[type as keyof typeof typeConfig] || typeConfig.transfer
    }

    const typeBadge = getListingTypeBadge(formData.basicInfo?.listingType || "transfer")

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Révision et publication</h3>
                <p className="text-muted-foreground">
                    Vérifiez vos informations avant de publier votre annonce
                </p>
            </div>

            {/* Summary Cards */}
            <div className="space-y-4">
                {/* Basic Info */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Informations de base
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <h4 className="font-medium">{formData.basicInfo?.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={typeBadge.variant}>
                                    {typeBadge.label}
                                </Badge>
                                {formData.basicInfo?.specialty && (
                                    <span className="text-sm text-muted-foreground">
                                        • {formData.basicInfo.specialty}
                                    </span>
                                )}
                            </div>
                        </div>
                        {formData.basicInfo?.description && (
                            <p className="text-sm text-muted-foreground">
                                {formData.basicInfo.description}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Location */}
                {formData.location && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Localisation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                {formData.location.address && `${formData.location.address}, `}
                                {formData.location.postalCode} {formData.location.city}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formData.location.region}
                                {formData.location.department && `, ${formData.location.department}`}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Transfer Details */}
                {formData.basicInfo?.listingType === "transfer" && formData.transferDetails && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Euro className="h-4 w-4" />
                                Détails de la cession
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {formData.transferDetails.practiceType && (
                                    <div>
                                        <span className="text-muted-foreground">Type : </span>
                                        {formData.transferDetails.practiceType}
                                    </div>
                                )}
                                {formData.transferDetails.salePrice && (
                                    <div>
                                        <span className="text-muted-foreground">Prix : </span>
                                        {formData.transferDetails.salePrice.toLocaleString()} €
                                    </div>
                                )}
                                {formData.transferDetails.annualTurnover && (
                                    <div>
                                        <span className="text-muted-foreground">CA annuel : </span>
                                        {formData.transferDetails.annualTurnover.toLocaleString()} €
                                    </div>
                                )}
                                {formData.transferDetails.patientBaseSize && (
                                    <div>
                                        <span className="text-muted-foreground">Patients : </span>
                                        {formData.transferDetails.patientBaseSize}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Replacement Details */}
                {formData.basicInfo?.listingType === "replacement" && formData.replacementDetails && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Détails du remplacement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                {formData.replacementDetails.replacementType && (
                                    <div>
                                        <span className="text-muted-foreground">Type : </span>
                                        {formData.replacementDetails.replacementType}
                                    </div>
                                )}
                                {formData.replacementDetails.dailyRate && (
                                    <div>
                                        <span className="text-muted-foreground">Tarif/jour : </span>
                                        {formData.replacementDetails.dailyRate} €
                                    </div>
                                )}
                                {formData.replacementDetails.startDate && (
                                    <div>
                                        <span className="text-muted-foreground">Début : </span>
                                        {new Date(formData.replacementDetails.startDate).toLocaleDateString()}
                                    </div>
                                )}
                                {formData.replacementDetails.endDate && (
                                    <div>
                                        <span className="text-muted-foreground">Fin : </span>
                                        {new Date(formData.replacementDetails.endDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Media */}
                {formData.media?.files && formData.media.files.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Fichiers joints</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {formData.media.files.length} fichier(s) sélectionné(s)
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Separator />

            {/* Publishing Options */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Options de publication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isPremium"
                            checked={reviewData.isPremium}
                            onCheckedChange={(checked) => handleOptionChange("isPremium", checked === true)}
                        />
                        <div>
                            <Label htmlFor="isPremium" className="font-medium">
                                Annonce Premium (+19€/mois)
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Mise en avant, badge premium, priorité dans les résultats
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isUrgent"
                            checked={reviewData.isUrgent}
                            onCheckedChange={(checked) => handleOptionChange("isUrgent", checked === true)}
                        />
                        <div>
                            <Label htmlFor="isUrgent" className="font-medium">
                                Annonce Urgente (+9€)
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Badge urgence, notification aux abonnés, remontée en tête
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                </Button>
                <Button 
                    onClick={onSubmit} 
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                >
                    {isSubmitting ? (
                        "Publication..."
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