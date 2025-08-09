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
import { ArrowLeft, ArrowRight } from "lucide-react"
import { replacementDetailsStepSchema } from "@/lib/validations/listing"
import { ReplacementDetailsStepData } from "@/types/listing"

interface ReplacementDetailsStepProps {
    data?: ReplacementDetailsStepData
    onDataChange: (data: ReplacementDetailsStepData) => void
    onNext: () => void
    onPrevious: () => void
}

const DAYS_OF_WEEK = [
    { value: "monday", label: "Lundi" },
    { value: "tuesday", label: "Mardi" },
    { value: "wednesday", label: "Mercredi" },
    { value: "thursday", label: "Jeudi" },
    { value: "friday", label: "Vendredi" },
    { value: "saturday", label: "Samedi" },
    { value: "sunday", label: "Dimanche" }
] as const

export function ReplacementDetailsStep({ data, onDataChange, onNext, onPrevious }: ReplacementDetailsStepProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<ReplacementDetailsStepData>({
        resolver: zodResolver(replacementDetailsStepSchema),
        defaultValues: data || {},
        mode: "onChange"
    })

    useEffect(() => {
        if (data) {
            Object.keys(data).forEach(key => {
                setValue(key as keyof ReplacementDetailsStepData, data[key as keyof ReplacementDetailsStepData])
            })
        }
    }, [data, setValue])

    const onSubmit = (formData: ReplacementDetailsStepData) => {
        onDataChange(formData)
        onNext()
    }

    const handleFormChange = (field: keyof ReplacementDetailsStepData, value: any) => {
        setValue(field, value, { shouldValidate: true })
        const currentData = watch()
        onDataChange({ ...currentData, [field]: value })
    }

    const handleWorkingDaysChange = (day: string, checked: boolean) => {
        const currentDays = watch("workingDays") || []
        let newDays: string[]
        
        if (checked) {
            newDays = [...currentDays, day]
        } else {
            newDays = currentDays.filter(d => d !== day)
        }
        
        handleFormChange("workingDays", newDays)
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Détails du remplacement</h3>
                <p className="text-muted-foreground">
                    Remplissez les informations spécifiques à votre remplacement
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Replacement Type */}
                <div className="space-y-2">
                    <Label htmlFor="replacementType">Type de remplacement</Label>
                    <Select
                        value={watch("replacementType") || ""}
                        onValueChange={(value) => handleFormChange("replacementType", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="temporary">Temporaire</SelectItem>
                            <SelectItem value="long_term">Long terme</SelectItem>
                            <SelectItem value="weekend">Weekend/Vacances</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input
                            id="startDate"
                            type="date"
                            {...register("startDate")}
                            onChange={(e) => handleFormChange("startDate", e.target.value)}
                        />
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input
                            id="endDate"
                            type="date"
                            {...register("endDate")}
                            onChange={(e) => handleFormChange("endDate", e.target.value)}
                        />
                    </div>
                </div>

                {/* Working Days */}
                <div className="space-y-3">
                    <Label>Jours de travail</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {DAYS_OF_WEEK.map(({ value, label }) => (
                            <div key={value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`workingDay_${value}`}
                                    checked={(watch("workingDays") || []).includes(value)}
                                    onCheckedChange={(checked) => handleWorkingDaysChange(value, checked === true)}
                                />
                                <Label htmlFor={`workingDay_${value}`} className="text-sm">
                                    {label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Daily Rate */}
                    <div className="space-y-2">
                        <Label htmlFor="dailyRate">Rémunération journalière (€)</Label>
                        <Input
                            id="dailyRate"
                            type="number"
                            placeholder="Ex: 300"
                            {...register("dailyRate", { valueAsNumber: true })}
                            onChange={(e) => handleFormChange("dailyRate", parseInt(e.target.value) || undefined)}
                        />
                    </div>

                    {/* Fee Share Percentage */}
                    <div className="space-y-2">
                        <Label htmlFor="feeSharePercentage">Pourcentage de rétrocession (%)</Label>
                        <Input
                            id="feeSharePercentage"
                            placeholder="Ex: 65"
                            {...register("feeSharePercentage")}
                            onChange={(e) => handleFormChange("feeSharePercentage", e.target.value)}
                        />
                    </div>
                </div>

                {/* Practical Terms */}
                <div className="space-y-2">
                    <Label htmlFor="practicalTerms">Modalités pratiques</Label>
                    <Textarea
                        id="practicalTerms"
                        placeholder="Décrivez les conditions spécifiques, horaires, etc..."
                        {...register("practicalTerms")}
                        onChange={(e) => handleFormChange("practicalTerms", e.target.value)}
                    />
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="hasAssistant"
                            checked={watch("hasAssistant") ?? false}
                            onCheckedChange={(checked) => handleFormChange("hasAssistant", checked === true)}
                        />
                        <Label htmlFor="hasAssistant">
                            Secrétaire/assistante sur place
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="housingProvided"
                            checked={watch("housingProvided") ?? false}
                            onCheckedChange={(checked) => handleFormChange("housingProvided", checked === true)}
                        />
                        <Label htmlFor="housingProvided">
                            Hébergement fourni
                        </Label>
                    </div>
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