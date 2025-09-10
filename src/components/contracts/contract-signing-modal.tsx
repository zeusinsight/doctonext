"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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

    useEffect(() => {
        if (isOpen && contractId) {
            fetchContract()
        }
    }, [isOpen, contractId])

    const fetchContract = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/contracts/${contractId}/status`)
            
            if (!response.ok) {
                throw new Error("Failed to fetch contract")
            }

            const contractData = await response.json()
            setContract(contractData)

            // If contract is ready for signing but no submission exists, create it
            if (contractData.status === "pending_signature" && !contractData.docusealSubmissionId) {
                await createDocusealSubmission(contractId)
            } else if (contractData.status === "in_progress" && contractData.docusealSubmissionId) {
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
            const response = await fetch(`/api/contracts/${contractId}/create-submission`, {
                method: "POST",
            })

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
            const response = await fetch(`/api/contracts/${contractId}/embed-url`)

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
            const response = await fetch(`/api/contracts/${contractId}/download`)
            
            if (!response.ok) {
                throw new Error("Failed to download contract")
            }

            const { url, filename } = await response.json()
            
            // Create download link
            const link = document.createElement('a')
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
                        <div className="text-center space-y-2">
                            <Clock className="h-8 w-8 animate-spin mx-auto text-primary" />
                            <p>Chargement du contrat...</p>
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
                        <div className="text-center space-y-2">
                            <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
                            <p>Contrat non trouvé</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-[95vw] md:max-w-[92vw] lg:max-w-[1100px] xl:max-w-[1280px] max-h-[95vh] overflow-hidden p-4 sm:p-5">
                <DialogHeader className={(contract.status === "pending_signature" || contract.status === "in_progress") && embedUrl ? "pb-2 border-b" : undefined}>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {getContractTypeLabel(contract.contractType)}
                    </DialogTitle>
                    <DialogDescription>
                        Contrat pour "{contract.contractData.listingTitle}"
                    </DialogDescription>
                </DialogHeader>


                {/* Show DocuSeal form layout when ready */}
                {(contract.status === "pending_signature" || contract.status === "in_progress") && embedUrl ? (
                    <div className="flex gap-3 sm:gap-4 h-[calc(95vh-7rem)] min-h-0 overflow-hidden">
                        {/* DocuSeal Contract Form - Left Side (Primary) */}
                        <div className="flex-1 min-w-0 min-h-0 overflow-y-auto">
                            <div className="rounded-lg border h-full overflow-auto bg-background">
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
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                <div className="text-center space-y-3">
                                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Statut du contrat</h3>
                                        <Badge 
                                            className={`${getStatusColor(contract.status)} text-white px-4 py-2 text-sm`}
                                        >
                                            {getStatusText(contract.status)}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Créé le {new Date(contract.createdAt).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                        {contract.signedAt && (
                                            <div className="flex items-center justify-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span>Signé le {new Date(contract.signedAt).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contract Details */}
                            <Card className="border-gray-200">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Building className="h-4 w-4 text-gray-500" />
                                        Détails du contrat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{contract.contractData.listingTitle}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span>{contract.contractData.location}</span>
                                        </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-sm flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            Parties impliquées
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                                <p className="text-xs font-medium text-green-700 mb-1">Initiateur</p>
                                                <p className="text-sm font-medium">{contract.parties.initiator.name}</p>
                                                <p className="text-xs text-gray-600">{contract.parties.initiator.email}</p>
                                            </div>
                                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                <p className="text-xs font-medium text-blue-700 mb-1">Destinataire</p>
                                                <p className="text-sm font-medium">{contract.parties.recipient.name}</p>
                                                <p className="text-xs text-gray-600">{contract.parties.recipient.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 max-h-[calc(95vh-8rem)] overflow-y-auto">
                        {/* Contract Status */}
                        <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Statut du contrat</CardTitle>
                                <Badge 
                                    variant="secondary" 
                                    className={`${getStatusColor(contract.status)} text-white`}
                                >
                                    {getStatusText(contract.status)}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Créé le {new Date(contract.createdAt).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                {contract.signedAt && (
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm">
                                            Signé le {new Date(contract.signedAt).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contract Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Détails du contrat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{contract.contractData.listingTitle}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{contract.contractData.location}</span>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-3">
                                <h4 className="font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Parties impliquées
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-primary">Initiateur</p>
                                        <p className="text-sm">{contract.parties.initiator.name}</p>
                                        <p className="text-xs text-muted-foreground">{contract.parties.initiator.email}</p>
                                        {contract.parties.initiator.profession && (
                                            <p className="text-xs text-muted-foreground">{contract.parties.initiator.profession}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-primary">Destinataire</p>
                                        <p className="text-sm">{contract.parties.recipient.name}</p>
                                        <p className="text-xs text-muted-foreground">{contract.parties.recipient.email}</p>
                                        {contract.parties.recipient.profession && (
                                            <p className="text-xs text-muted-foreground">{contract.parties.recipient.profession}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                        {/* Loading or Status Messages */}
                        {!embedUrl && (contract.status === "pending_signature" || contract.status === "in_progress") && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center space-y-2">
                                        <Clock className="h-8 w-8 animate-spin mx-auto text-primary" />
                                        <p>Chargement du formulaire de signature...</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    {/* Download Section */}
                    {contract.status === "completed" && contract.documentUrl && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Contrat complété
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Le contrat a été signé par toutes les parties. 
                                    Vous pouvez maintenant télécharger la version finale.
                                </p>
                                <Button onClick={downloadContract} className="gap-2">
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