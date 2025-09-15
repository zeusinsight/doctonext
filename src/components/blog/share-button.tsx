"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
    title: string
    excerpt?: string | null
    slug: string
}

export function ShareButton({ title, excerpt, slug }: ShareButtonProps) {
    const handleShare = async () => {
        const url = window.location.href

        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: excerpt || undefined,
                    url
                })
            } else {
                await navigator.clipboard.writeText(url)
                toast.success("Lien copié dans le presse-papiers")
            }
        } catch (error) {
            console.error("Error sharing:", error)
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(url)
                toast.success("Lien copié dans le presse-papiers")
            } catch (clipboardError) {
                toast.error("Impossible de partager ou copier le lien")
            }
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Partager
        </Button>
    )
}
