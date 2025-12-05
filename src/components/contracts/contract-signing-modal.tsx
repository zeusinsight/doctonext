"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Download,
    Users,
    Calendar,
    MapPin,
    Building,
    Briefcase
} from "lucide-react"
import { toast } from "sonner"
// @ts-ignore
import { DocusealForm } from "@docuseal/react"

interface Contract {
    id: string
    status: string
    contractType: string
    docusealSubmissionId?: string
    parties: {
        initiator: {
            name: string
            email: string
            profession?: string
        }
        recipient: {
            name: string
            email: string
            profession?: string
        }
    }
    contractData: {
        listingTitle: string
        location: string
    }
    createdAt: string
    signedAt?: string
    documentUrl?: string
}

interface ContractSigningModalProps {
    isOpen: boolean
    onClose: () => void
    contractId: string
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "pending_payment":
            return "bg-yellow-500"
        case "pending_signature":
            return "bg-blue-500"
        case "in_progress":
            return "bg-orange-500"
        case "completed":
            return "bg-green-500"
        case "cancelled":
            return "bg-red-500"
        default:
            return "bg-gray-500"
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case "pending_payment":
            return "En attente de paiement"
        case "pending_signature":
            return "En attente de signature"
        case "in_progress":
            return "En cours de signature"
        case "completed":
            return "Complété"
        case "cancelled":
            return "Annulé"
        default:
            return status
    }
}

const getContractTypeLabel = (type: string) => {
    switch (type) {
        case "replacement":
            return "Contrat de Remplacement"
        case "transfer":
            return "Contrat de Cession"
        case "collaboration":
            return "Contrat de Collaboration"
        default:
            return type
    }
}

export function ContractSigningModal({
    isOpen,
    onClose,
    contractId
}: ContractSigningModalProps) {
    const [contract, setContract] = useState<Contract | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [embedUrl, setEmbedUrl] = useState<string>()
    const [isWaitingForPayment, setIsWaitingForPayment] = useState(false)
    const [paymentPollCount, setPaymentPollCount] = useState(0)
    const MAX_PAYMENT_POLLS = 15 // 15 polls * 2 seconds = 30 seconds max

    useEffect(() => {
        if (isOpen && contractId) {
            fetchContract()
        }
        // Reset states when modal closes
        if (!isOpen) {
            setIsWaitingForPayment(false)
            setPaymentPollCount(0)
            setEmbedUrl(undefined)
        }
    }, [isOpen, contractId])

    // Poll for payment confirmation when status is pending_payment
    useEffect(() => {
        if (!isWaitingForPayment || !contractId) return

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/contracts/${contractId}/status`)
                if (!response.ok) return

                const contractData = await response.json()

                if (contractData.status !== "pending_payment") {
                    // Payment confirmed! Stop polling and proceed
                    setIsWaitingForPayment(false)
                    setContract(contractData)

                    if (
                        contractData.status === "pending_signature" &&
                        !contractData.docusealSubmissionId
                    ) {
                        await createDocusealSubmission(contractId)
                    }
                    return
                }

                setPaymentPollCount((prev) => {
                    if (prev >= MAX_PAYMENT_POLLS - 1) {
                        // Timeout - stop polling
                        setIsWaitingForPayment(false)
                        toast.error(
                            "Confirmation de paiement expirée. Veuillez réessayer ou contacter le support."
                        )
                        return prev
                    }
                    return prev + 1
                })
            } catch (error) {
                console.error("Error polling payment status:", error)
            }
        }, 2000)

        return () => clearInterval(pollInterval)
    }, [isWaitingForPayment, contractId])

    const fetchContract = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/contracts/${contractId}/status`)

            if (!response.ok) {
                throw new Error("Failed to fetch contract")
            }

            const contractData = await response.json()
            setContract(contractData)

            // If payment is still pending, start polling
            if (contractData.status === "pending_payment") {
                setIsWaitingForPayment(true)
                setPaymentPollCount(0)
                return
            }

            // If contract is ready for signing but no submission exists, create it
            if (
                contractData.status === "pending_signature" &&
                !contractData.docusealSubmissionId
            ) {
                await createDocusealSubmission(contractId)
            } else if (
                contractData.status === "in_progress" &&
                contractData.docusealSubmissionId
            ) {
                // For in_progress contracts, get the embed URL for the current user
                await getEmbedUrlForCurrentUser(contractId)
            }
        } catch (error) {
            console.error("Error fetching contract:", error)
            toast.error("Erreur lors du chargement du contrat")
        } finally {
            setIsLoading(false)
        }
    }

    const createDocusealSubmission = async (contractId: string) => {
        try {
            const response = await fetch(
                `/api/contracts/${contractId}/create-submission`,
                {
                    method: "POST"
                }
            )

            if (!response.ok) {
                throw new Error("Failed to create submission")
            }

            const { embedUrl } = await response.json()
            console.log("Got embed URL from create-submission:", embedUrl)
            setEmbedUrl(embedUrl)
        } catch (error) {
            console.error("Error creating DocuSeal submission:", error)
            toast.error("Erreur lors de la préparation du contrat")
        }
    }

    const getEmbedUrlForCurrentUser = async (contractId: string) => {
        try {
            const response = await fetch(
                `/api/contracts/${contractId}/embed-url`
            )

            if (!response.ok) {
                throw new Error("Failed to get embed URL")
            }

            const { embedUrl } = await response.json()
            console.log("Got embed URL for current user:", embedUrl)
            setEmbedUrl(embedUrl)
        } catch (error) {
            console.error("Error getting embed URL:", error)
            toast.error("Erreur lors du chargement du formulaire de signature")
        }
    }

    const handleDocusealComplete = () => {
        toast.success("Contrat signé avec succès!")
        fetchContract() // Refresh contract status
    }

    const downloadContract = async () => {
        try {
            const response = await fetch(
                `/api/contracts/${contractId}/download`
            )

            if (!response.ok) {
                throw new Error("Failed to download contract")
            }

            const { url, filename } = await response.json()

            // Create download link
            const link = document.createElement("a")
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error("Error downloading contract:", error)
            toast.error("Erreur lors du téléchargement")
        }
    }

    if (isLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl">
                    <div className="flex items-center justify-center py-8">
                        <div className="space-y-2 text-center">
                            <Clock className="mx-auto h-8 w-8 animate-spin text-primary" />
                            <p>Chargement du contrat...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    // Show waiting for payment confirmation UI
    if (isWaitingForPayment && contract?.status === "pending_payment") {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="space-y-4 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                <Clock className="h-8 w-8 animate-spin text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Confirmation du paiement...
                                </h3>
                                <p className="mt-2 text-muted-foreground text-sm">
                                    Nous vérifions votre paiement auprès de Stripe.
                                    <br />
                                    Cela peut prendre quelques secondes.
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-2 w-2 animate-bounce rounded-full bg-yellow-500"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                ))}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Tentative {paymentPollCount + 1}/{MAX_PAYMENT_POLLS}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    if (!contract) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl">
                    <div className="flex items-center justify-center py-8">
                        <div className="space-y-2 text-center">
                            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                            <p>Contrat non trouvé</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[95vh] w-[95vw] overflow-hidden p-4 sm:max-w-[95vw] sm:p-5 md:max-w-[92vw] lg:max-w-[1100px] xl:max-w-[1280px]">
                <DialogHeader
                    className={
                        (contract.status === "pending_signature" ||
                            contract.status === "in_progress") &&
                        embedUrl
                            ? "border-b pb-2"
                            : undefined
                    }
                >
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {getContractTypeLabel(contract.contractType)}
                    </DialogTitle>
                    <DialogDescription>
                        Contrat pour "{contract.contractData.listingTitle}"
                    </DialogDescription>
                </DialogHeader>

                {/* Show DocuSeal form layout when ready */}
                {(contract.status === "pending_signature" ||
                    contract.status === "in_progress") &&
                embedUrl ? (
                    <div className="flex h-[calc(95vh-7rem)] min-h-0 gap-3 overflow-hidden sm:gap-4">
                        {/* DocuSeal Contract Form - Left Side (Primary) */}
                        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                            <div className="h-full overflow-auto rounded-lg border bg-background">
                                <DocusealForm
                                    src={embedUrl}
                                    onComplete={handleDocusealComplete}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        </div>

                        {/* Contract Details - Right Side */}
                        <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
                            {/* Contract Status */}
                            <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                                <div className="space-y-3 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">
                                            Statut du contrat
                                        </h3>
                                        <Badge
                                            className={`${getStatusColor(contract.status)} px-4 py-2 text-sm text-white`}
                                        >
                                            {getStatusText(contract.status)}
                                        </Badge>
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        <div className="mb-1 flex items-center justify-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Créé le{" "}
                                                {new Date(
                                                    contract.createdAt
                                                ).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                        {contract.signedAt && (
                                            <div className="flex items-center justify-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span>
                                                    Signé le{" "}
                                                    {new Date(
                                                        contract.signedAt
                                                    ).toLocaleDateString(
                                                        "fr-FR"
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contract Details */}
                            <Card className="border-gray-200">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Building className="h-4 w-4 text-gray-500" />
                                        Détails du contrat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">
                                                {
                                                    contract.contractData
                                                        .listingTitle
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span>
                                                {contract.contractData.location}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h4 className="flex items-center gap-2 font-medium text-sm">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            Parties impliquées
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="rounded-lg border border-green-100 bg-green-50 p-3">
                                                <p className="mb-1 font-medium text-green-700 text-xs">
                                                    Initiateur
                                                </p>
                                                <p className="font-medium text-sm">
                                                    {
                                                        contract.parties
                                                            .initiator.name
                                                    }
                                                </p>
                                                <p className="text-gray-600 text-xs">
                                                    {
                                                        contract.parties
                                                            .initiator.email
                                                    }
                                                </p>
                                            </div>
                                            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                                                <p className="mb-1 font-medium text-blue-700 text-xs">
                                                    Destinataire
                                                </p>
                                                <p className="font-medium text-sm">
                                                    {
                                                        contract.parties
                                                            .recipient.name
                                                    }
                                                </p>
                                                <p className="text-gray-600 text-xs">
                                                    {
                                                        contract.parties
                                                            .recipient.email
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="max-h-[calc(95vh-8rem)] space-y-6 overflow-y-auto">
                        {/* Contract Status */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        Statut du contrat
                                    </CardTitle>
                                    <Badge
                                        variant="secondary"
                                        className={`${getStatusColor(contract.status)} text-white`}
                                    >
                                        {getStatusText(contract.status)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            Créé le{" "}
                                            {new Date(
                                                contract.createdAt
                                            ).toLocaleDateString("fr-FR")}
                                        </span>
                                    </div>
                                    {contract.signedAt && (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">
                                                Signé le{" "}
                                                {new Date(
                                                    contract.signedAt
                                                ).toLocaleDateString("fr-FR")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contract Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Détails du contrat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {contract.contractData.listingTitle}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {contract.contractData.location}
                                    </span>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 font-medium">
                                        <Users className="h-4 w-4" />
                                        Parties impliquées
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <p className="font-medium text-primary text-sm">
                                                Initiateur
                                            </p>
                                            <p className="text-sm">
                                                {
                                                    contract.parties.initiator
                                                        .name
                                                }
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {
                                                    contract.parties.initiator
                                                        .email
                                                }
                                            </p>
                                            {contract.parties.initiator
                                                .profession && (
                                                <p className="text-muted-foreground text-xs">
                                                    {
                                                        contract.parties
                                                            .initiator
                                                            .profession
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium text-primary text-sm">
                                                Destinataire
                                            </p>
                                            <p className="text-sm">
                                                {
                                                    contract.parties.recipient
                                                        .name
                                                }
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {
                                                    contract.parties.recipient
                                                        .email
                                                }
                                            </p>
                                            {contract.parties.recipient
                                                .profession && (
                                                <p className="text-muted-foreground text-xs">
                                                    {
                                                        contract.parties
                                                            .recipient
                                                            .profession
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Loading or Status Messages */}
                        {!embedUrl &&
                            (contract.status === "pending_signature" ||
                                contract.status === "in_progress") && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="space-y-2 text-center">
                                            <Clock className="mx-auto h-8 w-8 animate-spin text-primary" />
                                            <p>
                                                Chargement du formulaire de
                                                signature...
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Download Section */}
                        {contract.status === "completed" &&
                            contract.documentUrl && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            Contrat complété
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-4 text-muted-foreground text-sm">
                                            Le contrat a été signé par toutes
                                            les parties. Vous pouvez maintenant
                                            télécharger la version finale.
                                        </p>
                                        <Button
                                            onClick={downloadContract}
                                            className="gap-2"
                                        >
                                            <Download className="h-4 w-4" />
                                            Télécharger le contrat signé
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
