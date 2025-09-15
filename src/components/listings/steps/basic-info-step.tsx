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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight } from "lucide-react"
import { basicInfoStepSchema } from "@/lib/validations/listing"
import type { BasicInfoStepData } from "@/types/listing"
import { SPECIALTIES } from "@/types/listing"

interface BasicInfoStepProps {
    data?: BasicInfoStepData
    onDataChange: (data: BasicInfoStepData) => void
    onNext: () => void
}

export function BasicInfoStep({
    data,
    onDataChange,
    onNext
}: BasicInfoStepProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid }
    } = useForm<BasicInfoStepData>({
        resolver: zodResolver(basicInfoStepSchema),
        defaultValues: data || {},
        mode: "onChange"
    })

    const listingType = watch("listingType")

    useEffect(() => {
        if (data) {
            setValue("title", data.title || "")
            setValue("description", data.description || "")
            setValue("listingType", data.listingType)
            setValue("specialty", data.specialty || "")
        }
    }, [data, setValue])

    const onSubmit = (formData: BasicInfoStepData) => {
        onDataChange(formData)
        onNext()
    }

    const handleFormChange = (
        field: keyof BasicInfoStepData,
        value: string
    ) => {
        setValue(field, value, { shouldValidate: true })
        const currentData = watch()
        onDataChange({ ...currentData, [field]: value })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce *</Label>
                <Input
                    id="title"
                    placeholder="Ex: Cession cabinet de médecine générale - Paris 15e"
                    {...register("title")}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                />
                {errors.title && (
                    <p className="text-destructive text-sm">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    placeholder="Décrivez votre annonce en détail..."
                    rows={4}
                    {...register("description")}
                    onChange={(e) =>
                        handleFormChange("description", e.target.value)
                    }
                />
                {errors.description && (
                    <p className="text-destructive text-sm">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Listing Type */}
            <div className="space-y-3">
                <Label>Type d'annonce *</Label>
                <RadioGroup
                    value={listingType}
                    onValueChange={(value) =>
                        handleFormChange("listingType", value)
                    }
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                    <label
                        htmlFor="transfer"
                        className="flex cursor-pointer items-center space-x-2 rounded-lg border border-blue-200 p-4 transition-colors hover:border-blue-300 hover:bg-muted/50"
                    >
                        <RadioGroupItem value="transfer" id="transfer" />
                        <div className="flex-1">
                            <span className="font-medium">Cession</span>
                            <p className="text-muted-foreground text-sm">
                                Vente de votre cabinet ou de votre patientèle
                            </p>
                        </div>
                    </label>
                    <label
                        htmlFor="replacement"
                        className="flex cursor-pointer items-center space-x-2 rounded-lg border border-blue-200 p-4 transition-colors hover:border-blue-300 hover:bg-muted/50"
                    >
                        <RadioGroupItem value="replacement" id="replacement" />
                        <div className="flex-1">
                            <span className="font-medium">Remplacement</span>
                            <p className="text-muted-foreground text-sm">
                                Recherche de remplaçant ou proposition de
                                remplacement
                            </p>
                        </div>
                    </label>
                    <label
                        htmlFor="collaboration"
                        className="flex cursor-pointer items-center space-x-2 rounded-lg border border-blue-200 p-4 transition-colors hover:border-blue-300 hover:bg-muted/50"
                    >
                        <RadioGroupItem
                            value="collaboration"
                            id="collaboration"
                        />
                        <div className="flex-1">
                            <span className="font-medium">Collaboration</span>
                            <p className="text-muted-foreground text-sm">
                                Recherche d'associé ou de collaboration
                            </p>
                        </div>
                    </label>
                </RadioGroup>
                {errors.listingType && (
                    <p className="text-destructive text-sm">
                        {errors.listingType.message}
                    </p>
                )}
            </div>

            {/* Specialty */}
            <div className="space-y-2">
                <Label htmlFor="specialty">Spécialité *</Label>
                <Select
                    value={watch("specialty") || ""}
                    onValueChange={(value) =>
                        handleFormChange("specialty", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                        {SPECIALTIES.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                                {specialty}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.specialty && (
                    <p className="text-destructive text-sm">
                        {errors.specialty.message}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={!isValid}>
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </form>
    )
}
