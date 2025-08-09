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
import { transferDetailsStepSchema } from "@/lib/validations/listing"
import { TransferDetailsStepData } from "@/types/listing"

interface TransferDetailsStepProps {
    data?: TransferDetailsStepData
    onDataChange: (data: TransferDetailsStepData) => void
    onNext: () => void
    onPrevious: () => void
}

export function TransferDetailsStep({ data, onDataChange, onNext, onPrevious }: TransferDetailsStepProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<TransferDetailsStepData>({
        resolver: zodResolver(transferDetailsStepSchema),
        defaultValues: data || {},
        mode: "onChange"
    })

    useEffect(() => {
        if (data) {
            Object.keys(data).forEach(key => {
                setValue(key as keyof TransferDetailsStepData, data[key as keyof TransferDetailsStepData])
            })
        }
    }, [data, setValue])

    const onSubmit = (formData: TransferDetailsStepData) => {
        onDataChange(formData)
        onNext()
    }

    const handleFormChange = (field: keyof TransferDetailsStepData, value: any) => {
        setValue(field, value, { shouldValidate: true })
        const currentData = watch()
        onDataChange({ ...currentData, [field]: value })
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Détails de la cession</h3>
                <p className="text-muted-foreground">
                    Remplissez les informations spécifiques à votre cession de cabinet
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Practice Type */}
                <div className="space-y-2">
                    <Label htmlFor="practiceType">Type de cabinet</Label>
                    <Select
                        value={watch("practiceType") || ""}
                        onValueChange={(value) => handleFormChange("practiceType", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="solo">Cabinet individuel</SelectItem>
                            <SelectItem value="group">Cabinet de groupe</SelectItem>
                            <SelectItem value="clinic">Clinique</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Annual Turnover */}
                    <div className="space-y-2">
                        <Label htmlFor="annualTurnover">Chiffre d'affaires annuel (€)</Label>
                        <Input
                            id="annualTurnover"
                            type="number"
                            placeholder="Ex: 250000"
                            {...register("annualTurnover", { valueAsNumber: true })}
                            onChange={(e) => handleFormChange("annualTurnover", parseInt(e.target.value) || undefined)}
                        />
                    </div>

                    {/* Sale Price */}
                    <div className="space-y-2">
                        <Label htmlFor="salePrice">Prix de vente (€)</Label>
                        <Input
                            id="salePrice"
                            type="number"
                            placeholder="Ex: 150000"
                            {...register("salePrice", { valueAsNumber: true })}
                            onChange={(e) => handleFormChange("salePrice", parseInt(e.target.value) || undefined)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Charges Percentage */}
                    <div className="space-y-2">
                        <Label htmlFor="chargesPercentage">Pourcentage de charges (%)</Label>
                        <Input
                            id="chargesPercentage"
                            placeholder="Ex: 35"
                            {...register("chargesPercentage")}
                            onChange={(e) => handleFormChange("chargesPercentage", e.target.value)}
                        />
                    </div>

                    {/* Patient Base Size */}
                    <div className="space-y-2">
                        <Label htmlFor="patientBaseSize">Nombre de patients</Label>
                        <Input
                            id="patientBaseSize"
                            type="number"
                            placeholder="Ex: 1200"
                            {...register("patientBaseSize", { valueAsNumber: true })}
                            onChange={(e) => handleFormChange("patientBaseSize", parseInt(e.target.value) || undefined)}
                        />
                    </div>
                </div>

                {/* Availability Date */}
                <div className="space-y-2">
                    <Label htmlFor="availabilityDate">Date de disponibilité</Label>
                    <Input
                        id="availabilityDate"
                        type="date"
                        {...register("availabilityDate")}
                        onChange={(e) => handleFormChange("availabilityDate", e.target.value)}
                    />
                </div>

                {/* Software Used */}
                <div className="space-y-2">
                    <Label htmlFor="softwareUsed">Logiciel métier utilisé</Label>
                    <Input
                        id="softwareUsed"
                        placeholder="Ex: Doctolib, Maiia, autre..."
                        {...register("softwareUsed")}
                        onChange={(e) => handleFormChange("softwareUsed", e.target.value)}
                    />
                </div>

                {/* Reason for Transfer */}
                <div className="space-y-2">
                    <Label htmlFor="reasonForTransfer">Motif de la cession</Label>
                    <Textarea
                        id="reasonForTransfer"
                        placeholder="Ex: Départ à la retraite, mutation..."
                        {...register("reasonForTransfer")}
                        onChange={(e) => handleFormChange("reasonForTransfer", e.target.value)}
                    />
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="accompanimentOffered"
                            checked={watch("accompanimentOffered") || false}
                            onCheckedChange={(checked) => handleFormChange("accompanimentOffered", checked === true)}
                        />
                        <Label htmlFor="accompanimentOffered">
                            Accompagnement proposé pour la transition
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="equipmentIncluded"
                            checked={watch("equipmentIncluded") || false}
                            onCheckedChange={(checked) => handleFormChange("equipmentIncluded", checked === true)}
                        />
                        <Label htmlFor="equipmentIncluded">
                            Équipement médical inclus dans la vente
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