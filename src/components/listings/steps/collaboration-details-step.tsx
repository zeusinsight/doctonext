"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { collaborationDetailsStepSchema } from "@/lib/validations/listing"
import type { CollaborationDetailsStepData } from "@/types/listing"

const MEDICAL_SPECIALTIES = [
    "Médecin généraliste",
    "Cardiologue",
    "Dermatologue",
    "Gynécologue",
    "Neurologue",
    "Ophtalmologue",
    "Orthopédiste",
    "Pédiatre",
    "Psychiatre",
    "Radiologue",
    "Chirurgien",
    "Anesthésiste",
    "Endocrinologue",
    "Gastro-entérologue",
    "Pneumologue",
    "Rhumatologue",
    "Urologue",
    "ORL",
    "Dentiste",
    "Pharmacien",
    "Kinésithérapeute",
    "Infirmier(ère)",
    "Sage-femme",
    "Ostéopathe",
    "Podologue",
    "Orthophoniste",
    "Psychologue",
    "Diététicien(ne)",
    "Autre"
]

interface CollaborationDetailsStepProps {
    data?: CollaborationDetailsStepData
    onDataChange: (data: CollaborationDetailsStepData) => void
    onNext: () => void
    onPrevious: () => void
}

export function CollaborationDetailsStep({
    data,
    onDataChange,
    onNext,
    onPrevious
}: CollaborationDetailsStepProps) {
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
            Object.keys(data).forEach((key) => {
                setValue(
                    key as keyof CollaborationDetailsStepData,
                    data[key as keyof CollaborationDetailsStepData]
                )
            })
        }
    }, [data, setValue])

    const onSubmit = (formData: CollaborationDetailsStepData) => {
        console.log("Form submitted with data:", formData)
        console.log("Form errors:", errors)
        onDataChange(formData)
        onNext()
    }

    const handleFormChange = (
        field: keyof CollaborationDetailsStepData,
        value: any
    ) => {
        setValue(field, value, { shouldValidate: true })
        const currentData = watch()
        onDataChange({ ...currentData, [field]: value })
    }

    const handleSpecialtyChange = (specialty: string) => {
        const current = watch("specialtiesWanted") || []

        if (current.includes(specialty)) {
            // Remove specialty if already selected
            const updated = current.filter((s) => s !== specialty)
            handleFormChange("specialtiesWanted", updated)
        } else {
            // Add specialty if not selected
            const updated = [...current, specialty]
            handleFormChange("specialtiesWanted", updated)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg">
                    Détails de la collaboration
                </h3>
                <p className="text-muted-foreground">
                    Remplissez les informations spécifiques à votre recherche de
                    collaboration
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Collaboration Type */}
                <div className="space-y-2">
                    <Label htmlFor="collaborationType">
                        Type de collaboration *
                    </Label>
                    <Select
                        value={watch("collaborationType") || ""}
                        onValueChange={(value) =>
                            handleFormChange("collaborationType", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="association">
                                Association
                            </SelectItem>
                            <SelectItem value="partnership">
                                Partenariat
                            </SelectItem>
                            <SelectItem value="group_practice">
                                Cabinet de groupe
                            </SelectItem>
                            <SelectItem value="shared_space">
                                Partage d'espace
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Duration Expectation */}
                    <div className="space-y-2">
                        <Label htmlFor="durationExpectation">
                            Durée envisagée *
                        </Label>
                        <Select
                            value={watch("durationExpectation") || ""}
                            onValueChange={(value) =>
                                handleFormChange("durationExpectation", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez la durée" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="short_term">
                                    Court terme (&lt; 1 an)
                                </SelectItem>
                                <SelectItem value="long_term">
                                    Long terme (1-5 ans)
                                </SelectItem>
                                <SelectItem value="permanent">
                                    Permanent
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Space Arrangement */}
                    <div className="space-y-2">
                        <Label htmlFor="spaceArrangement">
                            Organisation de l'espace *
                        </Label>
                        <Select
                            value={watch("spaceArrangement") || ""}
                            onValueChange={(value) =>
                                handleFormChange("spaceArrangement", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez l'organisation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="shared_office">
                                    Bureau partagé
                                </SelectItem>
                                <SelectItem value="separate_offices">
                                    Bureaux séparés
                                </SelectItem>
                                <SelectItem value="rotation">
                                    Rotation des espaces
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Activity Distribution */}
                <div className="space-y-4">
                    <Label>Répartition de l'activité *</Label>
                    <RadioGroup
                        value={watch("activityDistribution") || ""}
                        onValueChange={(value) =>
                            handleFormChange("activityDistribution", value)
                        }
                        className="space-y-3"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full_time" id="full_time" />
                            <Label htmlFor="full_time">
                                Temps plein : activité exclusive dans ce cabinet
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="part_time" id="part_time" />
                            <Label htmlFor="part_time">Temps partiel</Label>
                        </div>
                    </RadioGroup>

                    {watch("activityDistribution") === "part_time" && (
                        <div className="ml-6 space-y-2">
                            <Input
                                placeholder="Ex: 60% ou 3 jours/semaine"
                                {...register("activityDistributionDetails")}
                                onChange={(e) =>
                                    handleFormChange(
                                        "activityDistributionDetails",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Patient Management */}
                <div className="space-y-2">
                    <Label htmlFor="patientManagement">
                        Gestion de la patientèle *
                    </Label>
                    <Select
                        value={watch("patientManagement") || ""}
                        onValueChange={(value) =>
                            handleFormChange("patientManagement", value)
                        }
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

                {/* Investment Required */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="investmentRequired"
                            checked={watch("investmentRequired") ?? false}
                            onCheckedChange={(checked) =>
                                handleFormChange(
                                    "investmentRequired",
                                    checked === true
                                )
                            }
                        />
                        <Label htmlFor="investmentRequired">
                            Investissement financier requis
                        </Label>
                    </div>

                    {watch("investmentRequired") && (
                        <div className="ml-6 space-y-2">
                            <Label htmlFor="investmentAmount">
                                Montant de l'investissement
                            </Label>
                            <Input
                                id="investmentAmount"
                                placeholder="Ex: 50000 ou À discuter"
                                value={watch("investmentAmount") || ""}
                                onChange={(e) =>
                                    handleFormChange(
                                        "investmentAmount",
                                        e.target.value || undefined
                                    )
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Remuneration Model */}
                <div className="space-y-2">
                    <Label htmlFor="remunerationModel">
                        Modèle de rémunération *
                    </Label>
                    <Textarea
                        id="remunerationModel"
                        placeholder="Décrivez par exemple : salaire fixe, salaire fixe + variable, % du CA…"
                        {...register("remunerationModel")}
                        onChange={(e) =>
                            handleFormChange(
                                "remunerationModel",
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* Specialties Wanted */}
                <div className="space-y-3">
                    <Label htmlFor="specialtiesWanted">
                        Spécialités recherchées *
                    </Label>
                    <Select onValueChange={handleSpecialtyChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                            {MEDICAL_SPECIALTIES.map((specialty) => (
                                <SelectItem key={specialty} value={specialty}>
                                    {specialty}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Display selected specialties */}
                    {watch("specialtiesWanted") &&
                        watch("specialtiesWanted")!.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-sm">
                                    Spécialités sélectionnées :
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {watch("specialtiesWanted")!.map(
                                        (specialty, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-1 rounded-md bg-secondary px-2 py-1 text-sm"
                                            >
                                                <span>{specialty}</span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSpecialtyChange(
                                                            specialty
                                                        )
                                                    }
                                                    className="ml-1 text-muted-foreground hover:text-destructive"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                </div>

                {/* Experience Required */}
                <div className="space-y-2">
                    <Label htmlFor="experienceRequired">
                        Expérience requise *
                    </Label>
                    <Input
                        id="experienceRequired"
                        placeholder="Ex: Minimum 5 ans d'expérience"
                        {...register("experienceRequired")}
                        onChange={(e) =>
                            handleFormChange(
                                "experienceRequired",
                                e.target.value
                            )
                        }
                    />
                </div>

                {/* Values and Goals */}
                <div className="space-y-2">
                    <Label htmlFor="valuesAndGoals">
                        Valeurs et objectifs communs
                    </Label>
                    <Textarea
                        id="valuesAndGoals"
                        placeholder="Décrivez les valeurs et objectifs recherchés..."
                        {...register("valuesAndGoals")}
                        onChange={(e) =>
                            handleFormChange("valuesAndGoals", e.target.value)
                        }
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrevious}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Précédent
                    </Button>
                    <Button
                        type="submit"
                        onClick={() =>
                            console.log("Submit button clicked", errors)
                        }
                    >
                        Suivant
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
