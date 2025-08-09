"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, DollarSign } from "lucide-react"
import { collaborationDetailsStepSchema } from "@/lib/validations/listing"
import { CollaborationDetailsStepData } from "@/types/listing"

interface CollaborationDetailsStepProps {
    data?: CollaborationDetailsStepData
    onDataChange: (data: CollaborationDetailsStepData) => void
    onNext: () => void
    onPrevious: () => void
}

export function CollaborationDetailsStep({ data, onDataChange, onNext, onPrevious }: CollaborationDetailsStepProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<CollaborationDetailsStepData>({
        resolver: zodResolver(collaborationDetailsStepSchema),
        defaultValues: data || {},
        mode: "onChange"
    })

    useEffect(() => {
        if (data) {
            Object.keys(data).forEach(key => {
                setValue(key as keyof CollaborationDetailsStepData, data[key as keyof CollaborationDetailsStepData])
            })
        }
    }, [data, setValue])

    const onSubmit = (formData: CollaborationDetailsStepData) => {
        onDataChange(formData)
        onNext()
    }

    const handleFormChange = (field: keyof CollaborationDetailsStepData, value: any) => {
        setValue(field, value, { shouldValidate: true })
        const currentData = watch()
        onDataChange({ ...currentData, [field]: value })
    }

    const handleSpecialtiesChange = (specialty: string, checked: boolean) => {
        const current = watch("specialtiesWanted") || []
        let updated: string[]
        
        if (checked) {
            updated = [...current, specialty]
        } else {
            updated = current.filter(s => s !== specialty)
        }
        
        handleFormChange("specialtiesWanted", updated)
    }


    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Détails de la collaboration</h3>
                <p className="text-muted-foreground">
                    Remplissez les informations spécifiques à votre recherche de collaboration
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Collaboration Type */}
                <div className="space-y-2">
                    <Label htmlFor="collaborationType">Type de collaboration</Label>
                    <Select
                        value={watch("collaborationType") || ""}
                        onValueChange={(value) => handleFormChange("collaborationType", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="association">Association</SelectItem>
                            <SelectItem value="partnership">Partenariat</SelectItem>
                            <SelectItem value="group_practice">Cabinet de groupe</SelectItem>
                            <SelectItem value="shared_space">Partage d'espace</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Duration Expectation */}
                    <div className="space-y-2">
                        <Label htmlFor="durationExpectation">Durée envisagée</Label>
                        <Select
                            value={watch("durationExpectation") || ""}
                            onValueChange={(value) => handleFormChange("durationExpectation", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez la durée" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="short_term">Court terme (&lt; 1 an)</SelectItem>
                                <SelectItem value="long_term">Long terme (1-5 ans)</SelectItem>
                                <SelectItem value="permanent">Permanent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Space Arrangement */}
                    <div className="space-y-2">
                        <Label htmlFor="spaceArrangement">Organisation de l'espace</Label>
                        <Select
                            value={watch("spaceArrangement") || ""}
                            onValueChange={(value) => handleFormChange("spaceArrangement", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez l'organisation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="shared_office">Bureau partagé</SelectItem>
                                <SelectItem value="separate_offices">Bureaux séparés</SelectItem>
                                <SelectItem value="rotation">Rotation des espaces</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Workload Share */}
                    <div className="space-y-2">
                        <Label htmlFor="workloadShare">Répartition de l'activité</Label>
                        <Input
                            id="workloadShare"
                            placeholder="Ex: 50/50, 60/40"
                            {...register("workloadShare")}
                            onChange={(e) => handleFormChange("workloadShare", e.target.value)}
                        />
                    </div>

                    {/* Patient Management */}
                    <div className="space-y-2">
                        <Label htmlFor="patientManagement">Gestion de la patientèle</Label>
                        <Select
                            value={watch("patientManagement") || ""}
                            onValueChange={(value) => handleFormChange("patientManagement", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="shared">Partagée</SelectItem>
                                <SelectItem value="separate">Séparée</SelectItem>
                                <SelectItem value="mixed">Mixte</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Investment Required */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="investmentRequired"
                            checked={watch("investmentRequired") ?? false}
                            onCheckedChange={(checked) => handleFormChange("investmentRequired", checked === true)}
                        />
                        <Label htmlFor="investmentRequired">
                            Investissement financier requis
                        </Label>
                    </div>

                    {watch("investmentRequired") && (
                        <div className="space-y-2 ml-6">
                            <Label htmlFor="investmentAmount">Montant de l'investissement (€)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="investmentAmount"
                                    type="number"
                                    placeholder="Ex: 50000"
                                    className="pl-10"
                                    {...register("investmentAmount", { valueAsNumber: true })}
                                    onChange={(e) => handleFormChange("investmentAmount", parseInt(e.target.value) || undefined)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Revenue Sharing */}
                <div className="space-y-2">
                    <Label htmlFor="revenueSharing">Modèle de partage des revenus</Label>
                    <Textarea
                        id="revenueSharing"
                        placeholder="Décrivez comment les revenus seront partagés..."
                        {...register("revenueSharing")}
                        onChange={(e) => handleFormChange("revenueSharing", e.target.value)}
                    />
                </div>

                {/* Expense Sharing */}
                <div className="space-y-2">
                    <Label htmlFor="expenseSharing">Modèle de partage des dépenses</Label>
                    <Textarea
                        id="expenseSharing"
                        placeholder="Décrivez comment les dépenses seront partagées..."
                        {...register("expenseSharing")}
                        onChange={(e) => handleFormChange("expenseSharing", e.target.value)}
                    />
                </div>

                {/* Decision Making */}
                <div className="space-y-2">
                    <Label htmlFor="decisionMaking">Mode de prise de décision</Label>
                    <Select
                        value={watch("decisionMaking") || ""}
                        onValueChange={(value) => handleFormChange("decisionMaking", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez le mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="equal">Égalitaire</SelectItem>
                            <SelectItem value="senior_led">Dirigé par le senior</SelectItem>
                            <SelectItem value="committee">Comité de décision</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Specialties Wanted */}
                <div className="space-y-3">
                    <Label>Spécialités recherchées</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            "Médecine générale",
                            "Pédiatrie",
                            "Gynécologie",
                            "Psychiatrie",
                            "Dermatologie",
                            "Cardiologie"
                        ].map((specialty) => (
                            <div key={specialty} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`specialty_${specialty}`}
                                    checked={(watch("specialtiesWanted") || []).includes(specialty)}
                                    onCheckedChange={(checked) => handleSpecialtiesChange(specialty, checked === true)}
                                />
                                <Label htmlFor={`specialty_${specialty}`} className="text-sm">
                                    {specialty}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Experience Required */}
                <div className="space-y-2">
                    <Label htmlFor="experienceRequired">Expérience requise</Label>
                    <Input
                        id="experienceRequired"
                        placeholder="Ex: Minimum 5 ans d'expérience"
                        {...register("experienceRequired")}
                        onChange={(e) => handleFormChange("experienceRequired", e.target.value)}
                    />
                </div>

                {/* Values and Goals */}
                <div className="space-y-2">
                    <Label htmlFor="valuesAndGoals">Valeurs et objectifs communs</Label>
                    <Textarea
                        id="valuesAndGoals"
                        placeholder="Décrivez les valeurs et objectifs recherchés..."
                        {...register("valuesAndGoals")}
                        onChange={(e) => handleFormChange("valuesAndGoals", e.target.value)}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={onPrevious}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Précédent
                    </Button>
                    <Button type="submit">
                        Suivant
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}