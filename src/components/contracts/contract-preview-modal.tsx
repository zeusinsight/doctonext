"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    FileText,
    Users,
    Building,
    Handshake,
    Euro,
    ArrowRight
} from "lucide-react"
import { toast } from "sonner"

interface ContractTemplate {
    id: string
    name: string
    contractType: string
    description: string
    docusealTemplateId: string
    icon: any
}

interface ContractPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    conversationId?: string
    listingId: string
    recipientId: string
    senderId: string
    listingType: string
    userProfession?: string
    onContractPaid: (contractId: string) => void
}

// Contract templates - now using hardcoded ones for better UX, but could be fetched from API
const getContractTemplates = (
    listingType: string,
    profession?: string
): ContractTemplate[] => {
    const baseTemplates: ContractTemplate[] = [
        {
            id: "replacement",
            name: "Contrat de remplacement Dentiste",
            contractType: "replacement",
            description:
                "Contrat officiel pour le remplacement temporaire d'un professionnel de santé",
            docusealTemplateId: "1750262", // You'll need to create these templates in DocuSeal
            icon: Users
        },
        {
            id: "transfer",
            name: "Contrat de Cession de Patientèle",
            contractType: "transfer",
            description:
                "Contrat de cession de patientèle conforme aux réglementations professionnelles",
            docusealTemplateId: "2", // You'll need to create these templates in DocuSeal
            icon: Building
        },
        {
            id: "collaboration",
            name: "Contrat de Collaboration",
            contractType: "collaboration",
            description:
                "Accord de collaboration entre professionnels de santé",
            docusealTemplateId: "3", // You'll need to create these templates in DocuSeal
            icon: Handshake
        }
    ]

    // Filter templates based on listing type
    return baseTemplates.filter((template) => {
        if (listingType === "replacement")
            return template.contractType === "replacement"
        if (listingType === "transfer")
            return template.contractType === "transfer"
        if (listingType === "collaboration")
            return template.contractType === "collaboration"
        return true // Show all templates if listing type doesn't match
    })
}

export function ContractPreviewModal({
    isOpen,
    onClose,
    conversationId,
    listingId,
    recipientId,
    senderId,
    listingType,
    userProfession,
    onContractPaid
}: ContractPreviewModalProps) {
    const [selectedTemplate, setSelectedTemplate] =
        useState<ContractTemplate | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const templates = getContractTemplates(listingType, userProfession)

    const handleContinue = async () => {
        if (!selectedTemplate) {
            toast.error("Veuillez sélectionner un modèle de contrat")
            return
        }

        setIsLoading(true)
        try {
            // Create contract and initiate Stripe checkout
            const response = await fetch("/api/contracts/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    conversationId,
                    listingId,
                    recipientId,
                    senderId,
                    contractType: selectedTemplate.contractType,
                    docusealTemplateId: selectedTemplate.docusealTemplateId,
                    templateId: null // Using hardcoded templates for now
                })
            })

            if (!response.ok) {
                throw new Error("Failed to create checkout session")
            }

            const { checkoutUrl } = await response.json()

            // Redirect to Stripe checkout
            window.location.href = checkoutUrl
        } catch (error) {
            console.error("Error creating checkout:", error)
            toast.error("Erreur lors de la création du paiement")
        } finally {
            setIsLoading(false)
        }
    }

    // DEV: Bypass payment for testing
    const handleDevBypass = async () => {
        if (!selectedTemplate) {
            toast.error("Veuillez sélectionner un modèle de contrat")
            return
        }

        setIsLoading(true)
        try {
            // Create contract directly
            const response = await fetch("/api/contracts/dev-create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    conversationId,
                    listingId,
                    recipientId,
                    senderId,
                    contractType: selectedTemplate.contractType,
                    docusealTemplateId: selectedTemplate.docusealTemplateId,
                    templateId: null // Using hardcoded templates for now
                })
            })

            if (!response.ok) {
                throw new Error("Failed to create contract")
            }

            const { contractId } = await response.json()

            // Directly trigger the callback
            onContractPaid(contractId)
            toast.success("Contrat créé (mode dev) - prêt pour signature!")
        } catch (error) {
            console.error("Error creating contract:", error)
            toast.error("Erreur lors de la création du contrat")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] w-full max-w-6xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Créer un contrat officiel
                    </DialogTitle>
                    <DialogDescription>
                        Sélectionnez le type de contrat que vous souhaitez
                        créer. Tous nos contrats sont conformes aux
                        réglementations des ordres professionnels.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {templates.map((template) => {
                            const Icon = template.icon
                            const isSelected =
                                selectedTemplate?.id === template.id

                            return (
                                <Card
                                    key={template.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        isSelected
                                            ? "border-primary ring-2 ring-primary"
                                            : "hover:border-gray-300"
                                    }`}
                                    onClick={() =>
                                        setSelectedTemplate(template)
                                    }
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <Icon className="h-8 w-8 text-primary" />
                                            {isSelected && (
                                                <Badge variant="default">
                                                    Sélectionné
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg">
                                            {template.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">
                                            {template.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {selectedTemplate && (
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">
                                            Contrat sélectionné
                                        </h4>
                                        <p className="text-muted-foreground text-sm">
                                            {selectedTemplate.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 font-semibold text-lg">
                                        <Euro className="h-5 w-5" />
                                        5,00
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="rounded-lg bg-muted/50 p-4">
                        <h4 className="mb-2 font-medium">
                            Ce qui est inclus :
                        </h4>
                        <ul className="space-y-1 text-muted-foreground text-sm">
                            <li>
                                • Modèle conforme aux réglementations
                                professionnelles
                            </li>
                            <li>
                                • Pré-remplissage automatique avec vos données
                            </li>
                            <li>• Signature électronique des deux parties</li>
                            <li>• Stockage sécurisé et téléchargement PDF</li>
                            <li>• Suivi du statut en temps réel</li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>

                    {/* DEV: Show bypass button in development */}
                    {process.env.NODE_ENV === "development" && (
                        <Button
                            variant="secondary"
                            onClick={handleDevBypass}
                            disabled={!selectedTemplate || isLoading}
                            className="gap-2 border-2 border-orange-300 border-dashed bg-orange-50 text-orange-700 hover:bg-orange-100"
                        >
                            {isLoading ? "Création..." : "DEV: Bypass Payment"}
                        </Button>
                    )}

                    <Button
                        onClick={handleContinue}
                        disabled={!selectedTemplate || isLoading}
                        className="gap-2"
                    >
                        {isLoading ? (
                            "Traitement..."
                        ) : (
                            <>
                                Continuer
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
