"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { useQuery } from "@tanstack/react-query"

interface ContactSellerButtonProps {
    listingId: string
    sellerId: string
    sellerName: string
    listingTitle: string
    className?: string
}

export function ContactSellerButton({ 
    listingId, 
    sellerId, 
    sellerName, 
    listingTitle,
    className 
}: ContactSellerButtonProps) {
    const [isCreatingConversation, setIsCreatingConversation] = useState(false)
    const router = useRouter()

    const { data: session } = useQuery({
        queryKey: ["auth", "session"],
        queryFn: () => authClient.getSession(),
    })

    const handleContact = async () => {
        if (!session?.data?.user) {
            toast.error("Vous devez être connecté pour contacter le vendeur")
            router.push("/login")
            return
        }

        if (session.data.user.id === sellerId) {
            toast.error("Vous ne pouvez pas vous contacter vous-même")
            return
        }

        setIsCreatingConversation(true)

        try {
            const response = await fetch("/api/conversations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    listingId,
                    participantId: sellerId,
                }),
            })

            const result = await response.json()

            if (result.success) {
                if (result.existing) {
                    toast.success("Conversation existante trouvée")
                } else {
                    toast.success(`Conversation créée avec ${sellerName}`)
                }
                
                // Redirect to messages page
                router.push("/dashboard/messages")
            } else {
                toast.error(result.error || "Erreur lors de la création de la conversation")
            }
        } catch (error) {
            console.error("Error creating conversation:", error)
            toast.error("Erreur lors de la création de la conversation")
        } finally {
            setIsCreatingConversation(false)
        }
    }

    return (
        <>
            <Button 
                className={className || "w-full"} 
                size="lg"
                onClick={handleContact}
                disabled={isCreatingConversation}
            >
                <MessageCircle className="mr-2 h-4 w-4" />
                {isCreatingConversation ? "Création..." : "Contacter le vendeur"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
                {session?.data?.user 
                    ? "Démarrez une conversation sécurisée" 
                    : "Connectez-vous pour contacter le vendeur"
                }
            </p>
        </>
    )
}