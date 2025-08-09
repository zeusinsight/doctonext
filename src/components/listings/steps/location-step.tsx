"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { locationStepSchema } from "@/lib/validations/listing"
import { LocationStepData } from "@/types/listing"
import { FRENCH_REGIONS } from "@/types/listing"

interface LocationStepProps {
    data?: LocationStepData
    onDataChange: (data: LocationStepData) => void
    onNext: () => void
    onPrevious: () => void
}

export function LocationStep({ data, onDataChange, onNext, onPrevious }: LocationStepProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid }
    } = useForm<LocationStepData>({
        resolver: zodResolver(locationStepSchema),
        defaultValues: data || {},
        mode: "onChange"
    })

    useEffect(() => {
        if (data) {
            setValue("address", data.address || "")
            setValue("postalCode", data.postalCode || "")
            setValue("city", data.city || "")
            setValue("region", data.region || "")
            setValue("department", data.department || "")
        }
    }, [data, setValue])

    const onSubmit = (formData: LocationStepData) => {
        onDataChange(formData)
        onNext()
    }

    const handleFormChange = (field: keyof LocationStepData, value: string) => {
        setValue(field, value, { shouldValidate: true })
        const currentData = watch()
        onDataChange({ ...currentData, [field]: value })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Address */}
            <div className="space-y-2">
                <Label htmlFor="address">Adresse complète</Label>
                <Input
                    id="address"
                    placeholder="Ex: 123 Rue de la République"
                    {...register("address")}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                />
                {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Postal Code */}
                <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal *</Label>
                    <Input
                        id="postalCode"
                        placeholder="Ex: 75015"
                        {...register("postalCode")}
                        onChange={(e) => handleFormChange("postalCode", e.target.value)}
                    />
                    {errors.postalCode && (
                        <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                    )}
                </div>

                {/* City */}
                <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                        id="city"
                        placeholder="Ex: Paris"
                        {...register("city")}
                        onChange={(e) => handleFormChange("city", e.target.value)}
                    />
                    {errors.city && (
                        <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Region */}
                <div className="space-y-2">
                    <Label htmlFor="region">Région *</Label>
                    <Select
                        value={watch("region") || ""}
                        onValueChange={(value) => handleFormChange("region", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une région" />
                        </SelectTrigger>
                        <SelectContent>
                            {FRENCH_REGIONS.map((region) => (
                                <SelectItem key={region} value={region}>
                                    {region}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.region && (
                        <p className="text-sm text-destructive">{errors.region.message}</p>
                    )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                    <Label htmlFor="department">Département</Label>
                    <Input
                        id="department"
                        placeholder="Ex: Paris"
                        {...register("department")}
                        onChange={(e) => handleFormChange("department", e.target.value)}
                    />
                    {errors.department && (
                        <p className="text-sm text-destructive">{errors.department.message}</p>
                    )}
                </div>
            </div>

            {/* Medical Density Zone (Optional) */}
            <div className="space-y-2">
                <Label htmlFor="medicalDensityZone">Zone de densité médicale</Label>
                <Select
                    value={watch("medicalDensityZone") || ""}
                    onValueChange={(value) => handleFormChange("medicalDensityZone", value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez si connue" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="under_served">Zone sous-dotée</SelectItem>
                        <SelectItem value="balanced">Zone équilibrée</SelectItem>
                        <SelectItem value="over_served">Zone sur-dotée</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                    Information optionnelle qui peut aider les candidats à évaluer l'opportunité
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                </Button>
                <Button type="submit" disabled={!isValid}>
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    )
}