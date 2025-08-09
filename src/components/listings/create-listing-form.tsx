"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { 
    CreateListingFormData, 
    FormStep,
    BasicInfoStepData,
    LocationStepData,
    TransferDetailsStepData,
    ReplacementDetailsStepData,
    MediaUploadData,
    ReviewStepData
} from "@/types/listing"
import { BasicInfoStep } from "./steps/basic-info-step"
import { LocationStep } from "./steps/location-step"
import { TransferDetailsStep } from "./steps/transfer-details-step"
import { ReplacementDetailsStep } from "./steps/replacement-details-step"
import { MediaUploadStep } from "./steps/media-upload-step"
import { ReviewStep } from "./steps/review-step"

const STEPS: FormStep[] = ["basic-info", "location", "details", "media", "review"]

const STEP_NAMES = {
    "basic-info": "Informations de base",
    "location": "Localisation",
    "details": "Détails spécifiques",
    "replacement-details": "Détails de la remplacement",
    "media": "Photos & Documents",
    "review": "Révision & Publication"
}

export function CreateListingForm() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<FormStep>("basic-info")
    const [formData, setFormData] = useState<CreateListingFormData>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const currentStepIndex = STEPS.indexOf(currentStep)
    const progress = ((currentStepIndex + 1) / STEPS.length) * 100

    const handleStepData = useCallback((stepName: FormStep, data: any) => {
        setFormData(prev => ({
            ...prev,
            [stepName]: data
        }))
    }, [])

    const handleNext = () => {
        const nextIndex = currentStepIndex + 1
        if (nextIndex < STEPS.length) {
            setCurrentStep(STEPS[nextIndex])
        }
    }

    const handlePrevious = () => {
        const prevIndex = currentStepIndex - 1
        if (prevIndex >= 0) {
            setCurrentStep(STEPS[prevIndex])
        }
    }

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            
            // Prepare the data for API submission
            const submissionData = {
                title: formData.basicInfo?.title || "",
                description: formData.basicInfo?.description || "",
                listingType: formData.basicInfo?.listingType || "transfer",
                specialty: formData.basicInfo?.specialty || "",
                isPremium: formData.review?.isPremium || false,
                isUrgent: formData.review?.isUrgent || false,
                expiresAt: formData.review?.expiresAt,
                location: formData.location ? {
                    address: formData.location.address,
                    postalCode: formData.location.postalCode,
                    city: formData.location.city,
                    region: formData.location.region,
                    department: formData.location.department,
                    latitude: formData.location.latitude,
                    longitude: formData.location.longitude,
                    medicalDensityZone: formData.location.medicalDensityZone,
                    densityScore: formData.location.densityScore
                } : undefined,
                transferDetails: formData.basicInfo?.listingType === "transfer" ? formData.transferDetails : undefined,
                replacementDetails: formData.basicInfo?.listingType === "replacement" ? formData.replacementDetails : undefined
            }

            const response = await fetch("/api/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Annonce créée avec succès !")
                router.push("/dashboard/listings")
            } else {
                toast.error(result.error || "Erreur lors de la création de l'annonce")
            }
        } catch (error) {
            console.error("Error creating listing:", error)
            toast.error("Erreur lors de la création de l'annonce")
        } finally {
            setIsSubmitting(false)
        }
    }

    const canProceed = () => {
        switch (currentStep) {
            case "basic-info":
                return formData.basicInfo?.title && formData.basicInfo?.listingType
            case "location":
                return formData.location?.city && formData.location?.region
            case "details":
                if (formData.basicInfo?.listingType === "transfer") {
                    return true // Transfer details are optional
                }
                if (formData.basicInfo?.listingType === "replacement") {
                    return true // Replacement details are optional
                }
                return true
            case "media":
                return true // Media is optional
            case "review":
                return true
            default:
                return false
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case "basic-info":
                return (
                    <BasicInfoStep
                        data={formData.basicInfo}
                        onDataChange={(data) => handleStepData("basic-info", data)}
                        onNext={handleNext}
                    />
                )
            case "location":
                return (
                    <LocationStep
                        data={formData.location}
                        onDataChange={(data) => handleStepData("location", data)}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case "details":
                const listingType = formData.basicInfo?.listingType
                if (listingType === "transfer") {
                    return (
                        <TransferDetailsStep
                            data={formData.transferDetails}
                            onDataChange={(data) => handleStepData("details", data)}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />
                    )
                } else if (listingType === "replacement") {
                    return (
                        <ReplacementDetailsStep
                            data={formData.replacementDetails}
                            onDataChange={(data) => handleStepData("details", data)}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />
                    )
                } else {
                    // For collaboration, skip to media step
                    return (
                        <div className="text-center py-8">
                            <p>Type de collaboration - Passer aux médias</p>
                            <div className="flex justify-between mt-4">
                                <Button variant="outline" onClick={handlePrevious}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Précédent
                                </Button>
                                <Button onClick={handleNext}>
                                    Suivant
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )
                }
            case "media":
                return (
                    <MediaUploadStep
                        data={formData.media}
                        onDataChange={(data) => handleStepData("media", data)}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case "review":
                return (
                    <ReviewStep
                        formData={formData}
                        onDataChange={(data) => handleStepData("review", data)}
                        onPrevious={handlePrevious}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="">
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Étape {currentStepIndex + 1} sur {STEPS.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <div className="text-center">
                    <h2 className="text-lg font-semibold">{STEP_NAMES[currentStep]}</h2>
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px] ">
                <div className="w-full max-w-5xl min-w-4xl">
                    {renderStep()}
                </div>
            </div>
        </div>
    )
}