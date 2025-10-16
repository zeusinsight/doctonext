"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Share2,
    Link2,
    Mail,
    MessageCircle,
    Linkedin,
    Facebook,
    Check
} from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
    url?: string
    title?: string
    description?: string
    className?: string
    variant?: "default" | "outline" | "ghost" | "secondary"
    size?: "default" | "sm" | "lg" | "icon"
}

export function ShareButton({
    url,
    title = "Découvrez cette annonce",
    description = "Annonce médicale sur Care Evo",
    className,
    variant = "outline",
    size = "icon"
}: ShareButtonProps) {
    const [copied, setCopied] = useState(false)
    const shareUrl =
        url || (typeof window !== "undefined" ? window.location.href : "")

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            toast.success("Lien copié dans le presse-papier")
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            toast.error("Impossible de copier le lien")
        }
    }

    const handleEmailShare = () => {
        const subject = encodeURIComponent(title)
        const body = encodeURIComponent(
            `${description}\n\nDécouvrez cette annonce : ${shareUrl}`
        )
        window.open(`mailto:?subject=${subject}&body=${body}`, "_blank")
    }

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent(`${title}\n${description}\n${shareUrl}`)
        window.open(`https://wa.me/?text=${text}`, "_blank")
    }

    const handleLinkedInShare = () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        window.open(linkedinUrl, "_blank", "width=600,height=400")
    }

    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        window.open(facebookUrl, "_blank", "width=600,height=400")
    }

    // Always show dropdown menu (no native share)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} className={className}>
                    <Share2 className="h-4 w-4" />
                    {size !== "icon" && <span className="ml-2">Partager</span>}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleCopyLink}>
                    {copied ? (
                        <>
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            <span className="text-green-600">Lien copié !</span>
                        </>
                    ) : (
                        <>
                            <Link2 className="mr-2 h-4 w-4" />
                            Copier le lien
                        </>
                    )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleWhatsAppShare}>
                    <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
                    WhatsApp
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleEmailShare}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLinkedInShare}>
                    <Linkedin className="mr-2 h-4 w-4 text-blue-600" />
                    LinkedIn
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleFacebookShare}>
                    <Facebook className="mr-2 h-4 w-4 text-blue-700" />
                    Facebook
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
