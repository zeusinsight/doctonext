"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import type { CreateListingFormData, FormStep } from "@/types/listing"
import { BasicInfoStep } from "./steps/basic-info-step"
import { LocationStep } from "./steps/location-step"
import { TransferDetailsStep } from "./steps/transfer-details-step"
import { ReplacementDetailsStep } from "./steps/replacement-details-step"
import { CollaborationDetailsStep } from "./steps/collaboration-details-step"
import { MediaUploadStep } from "./steps/media-upload-step"
import { ReviewStep } from "./steps/review-step"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, UserPlus } from "lucide-react"

const STEPS: FormStep[] = [
    "basic-info",
    "location",
    "details",
    "media",
    "review"
]

const STEP_NAMES = {
    "basic-info": "Informations de base",
    location: "Localisation",
    details: "Détails spécifiques",
    media: "Photos & Documents",
    review: "Révision & Publication"
}

interface CreateListingFormProps {
    isAdminMode?: boolean
}

export function CreateListingForm({ isAdminMode = false }: CreateListingFormProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<FormStep>("basic-info")
    const [formData, setFormData] = useState<CreateListingFormData>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [assignedEmail, setAssignedEmail] = useState("")
    const [emailError, setEmailError] = useState("")

    const currentStepIndex = STEPS.indexOf(currentStep)
    const progress = ((currentStepIndex + 1) / STEPS.length) * 100

    const handleStepData = useCallback((stepName: string, data: any) => {
        setFormData((prev) => ({
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

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async () => {
        try {
            // Validate email for admin mode
            if (isAdminMode) {
                if (!assignedEmail.trim()) {
                    setEmailError("L'email est requis")
                    toast.error("Veuillez saisir l'email de l'utilisateur")
                    return
                }
                if (!validateEmail(assignedEmail)) {
                    setEmailError("Email invalide")
                    toast.error("Veuillez saisir un email valide")
                    return
                }
                setEmailError("")
            }

            setIsSubmitting(true)

            // Prepare the data for API submission
            const submissionData = {
                title: formData.basicInfo?.title || "",
                description: formData.basicInfo?.description || "",
                listingType: formData.basicInfo?.listingType || "transfer",
                specialty: formData.basicInfo?.specialty || "",
                isBoostPlus: formData.review?.isBoostPlus || false,
                expiresAt: formData.review?.expiresAt,
                location: formData.location
                    ? {
                          address: formData.location.address,
                          postalCode: formData.location.postalCode,
                          city: formData.location.city,
                          region: formData.location.region,
                          department: formData.location.department,
                          latitude: formData.location.latitude,
                          longitude: formData.location.longitude
                      }
                    : undefined,
                transferDetails:
                    formData.basicInfo?.listingType === "transfer"
                        ? formData.transferDetails
                        : undefined,
                replacementDetails:
                    formData.basicInfo?.listingType === "replacement"
                        ? formData.replacementDetails
                        : undefined,
                collaborationDetails:
                    formData.basicInfo?.listingType === "collaboration"
                        ? formData.collaborationDetails
                        : undefined,
                media: formData.media?.files || [],
                // Add assigned email for admin mode
                ...(isAdminMode && { assignedEmail: assignedEmail.trim().toLowerCase() })
            }

            // Admin mode - submit to admin API
            if (isAdminMode) {
                const response = await fetch("/api/admin/listings", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(submissionData)
                })

                const result = await response.json()

                if (result.success) {
                    if (result.data.assignedToExistingUser) {
                        toast.success("Annonce créée et assignée à l'utilisateur existant !")
                    } else {
                        toast.success("Annonce créée ! Elle sera visible par l'utilisateur dès son inscription.")
                    }
                    router.push("/dashboard/admin/annonces")
                } else {
                    toast.error(
                        result.error || "Erreur lors de la création de l'annonce"
                    )
                }
                return
            }

            // If boost is selected, redirect to Stripe checkout
            if (formData.review?.isBoostPlus) {
                const response = await fetch("/api/listings/boost-checkout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(submissionData)
                })

                const result = await response.json()

                if (result.checkoutUrl) {
                    // Redirect to Stripe checkout
                    window.location.href = result.checkoutUrl
                    return
                } else {
                    toast.error(
                        result.error ||
                            "Erreur lors de la création du paiement"
                    )
                    setIsSubmitting(false)
                    return
                }
            }

            // Regular submit (without boost)
            const response = await fetch("/api/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(submissionData)
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Annonce créée avec succès !")
                router.push("/dashboard/annonces")
            } else {
                toast.error(
                    result.error || "Erreur lors de la création de l'annonce"
                )
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
                return (
                    formData.basicInfo?.title && formData.basicInfo?.listingType
                )
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
                        onDataChange={(data) =>
                            handleStepData("basicInfo", data)
                        }
                        onNext={handleNext}
                    />
                )
            case "location":
                return (
                    <LocationStep
                        data={formData.location}
                        onDataChange={(data) =>
                            handleStepData("location", data)
                        }
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )
            case "details": {
                const listingType = formData.basicInfo?.listingType
                if (listingType === "transfer") {
                    return (
                        <TransferDetailsStep
                            data={formData.transferDetails}
                            onDataChange={(data) =>
                                handleStepData("transferDetails", data)
                            }
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />
                    )
                } else if (listingType === "replacement") {
                    return (
                        <ReplacementDetailsStep
                            data={formData.replacementDetails}
                            onDataChange={(data) =>
                                handleStepData("replacementDetails", data)
                            }
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />
                    )
                } else {
                    // For collaboration
                    return (
                        <CollaborationDetailsStep
                            data={formData.collaborationDetails}
                            onDataChange={(data) =>
                                handleStepData("collaborationDetails", data)
                            }
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                        />
                    )
                }
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
            {/* Admin Email Assignment Section */}
            {isAdminMode && (
                <Card className="mb-6 border-amber-200 bg-amber-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-amber-800">
                            <UserPlus className="h-5 w-5" />
                            Assigner à un utilisateur
                        </CardTitle>
                        <CardDescription className="text-amber-700">
                            L'annonce sera visible par cet utilisateur dès son inscription
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="assignedEmail" className="text-amber-800">
                                Email de l'utilisateur
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-600" />
                                <Input
                                    id="assignedEmail"
                                    type="email"
                                    placeholder="email@exemple.com"
                                    value={assignedEmail}
                                    onChange={(e) => {
                                        setAssignedEmail(e.target.value)
                                        if (emailError) setEmailError("")
                                    }}
                                    className={`pl-10 ${emailError ? "border-red-500" : "border-amber-300"}`}
                                />
                            </div>
                            {emailError && (
                                <p className="text-red-500 text-sm">{emailError}</p>
                            )}
                            <p className="text-amber-600 text-xs">
                                Si l'utilisateur existe déjà, l'annonce lui sera directement assignée.
                                Sinon, elle lui sera assignée lors de son inscription avec cet email.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground text-sm">
                    <span>
                        Étape {currentStepIndex + 1} sur {STEPS.length}
                    </span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
                <div className="text-center">
                    <h2 className="font-semibold text-lg">
                        {currentStep === "details"
                            ? formData.basicInfo?.listingType === "transfer"
                                ? "Détails de la cession"
                                : formData.basicInfo?.listingType ===
                                    "replacement"
                                  ? "Détails du remplacement"
                                  : formData.basicInfo?.listingType ===
                                      "collaboration"
                                    ? "Détails de la collaboration"
                                    : "Détails spécifiques"
                            : STEP_NAMES[currentStep]}
                    </h2>
                </div>
            </div>

            {/* Step Content */}
            <div className="mt-6">
                <div className="w-full">{renderStep()}</div>
            </div>
        </div>
    )
}
