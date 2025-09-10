"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ContractSigningModal } from "./contract-signing-modal"
import { toast } from "sonner"

export function ContractSuccessHandler() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showSigningModal, setShowSigningModal] = useState(false)
    const [contractId, setContractId] = useState<string>()

    useEffect(() => {
        const contractSuccess = searchParams.get("contract_success")
        const sessionId = searchParams.get("session_id")
        const contractCancelled = searchParams.get("contract_cancelled")
        const contractResume = searchParams.get("contract_resume")

        if (contractSuccess && sessionId) {
            // Payment successful, show signing modal
            setContractId(contractSuccess)
            setShowSigningModal(true)
            toast.success("Paiement effectué avec succès! Vous pouvez maintenant signer le contrat.")
            
            // Clean up URL parameters
            const cleanUrl = window.location.pathname
            router.replace(cleanUrl, { scroll: false })
        }

        if (contractResume) {
            // User clicked email link to resume signing
            setContractId(contractResume)
            setShowSigningModal(true)
            toast.info("Contrat ouvert depuis votre email. Vous pouvez continuer la signature.")
            
            // Clean up URL parameters
            const cleanUrl = window.location.pathname
            router.replace(cleanUrl, { scroll: false })
        }

        if (contractCancelled) {
            toast.error("Paiement annulé. Le contrat n'a pas été créé.")
            
            // Clean up URL parameters
            const cleanUrl = window.location.pathname
            router.replace(cleanUrl, { scroll: false })
        }
    }, [searchParams, router])

    if (!contractId) return null

    return (
        <ContractSigningModal
            isOpen={showSigningModal}
            onClose={() => setShowSigningModal(false)}
            contractId={contractId}
        />
    )
}