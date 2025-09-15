"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { toast } from "sonner"

interface MessageInputProps {
    conversationId: string
    onMessageSent: () => void
}

export function MessageInput({
    conversationId,
    onMessageSent
}: MessageInputProps) {
    const [content, setContent] = useState("")
    const [isSending, setIsSending] = useState(false)
    const queryClient = useQueryClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!content.trim() || isSending) return

        setIsSending(true)

        try {
            const response = await fetch(
                `/api/conversations/${conversationId}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ content: content.trim() })
                }
            )

            const result = await response.json()

            if (result.success) {
                setContent("")
                onMessageSent()
                // Update unread count for other users
                queryClient.invalidateQueries({
                    queryKey: ["messages", "unread-count"]
                })
                toast.success("Message envoyé")
            } else {
                toast.error(result.error || "Erreur lors de l'envoi")
            }
        } catch (error) {
            console.error("Error sending message:", error)
            toast.error("Erreur lors de l'envoi du message")
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="border-t bg-white p-4">
            <div className="flex gap-2">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Écrivez votre message..."
                    className="max-h-32 min-h-[60px] flex-1 resize-none"
                    disabled={isSending}
                />
                <Button
                    type="submit"
                    disabled={!content.trim() || isSending}
                    size="sm"
                    className="px-3"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </form>
    )
}
