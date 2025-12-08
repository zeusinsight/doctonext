"use client"

import { useState, useRef, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MessageInputProps {
    conversationId: string
    onMessageSent: () => void
}

const MAX_CHARS = 2000

export function MessageInput({
    conversationId,
    onMessageSent
}: MessageInputProps) {
    const [content, setContent] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const queryClient = useQueryClient()

    const charCount = content.length
    const isOverLimit = charCount > MAX_CHARS
    const isEmpty = !content.trim()

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault()

        if (isEmpty || isSending || isOverLimit) return

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
                queryClient.invalidateQueries({
                    queryKey: ["messages", "unread-count"]
                })
                // Focus back on textarea after sending
                textareaRef.current?.focus()
            } else {
                toast.error(result.error || "Erreur lors de l'envoi")
            }
        } catch (error) {
            console.error("Error sending message:", error)
            toast.error("Erreur lors de l'envoi du message")
        } finally {
            setIsSending(false)
        }
    }, [content, isEmpty, isSending, isOverLimit, conversationId, onMessageSent, queryClient])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }, [handleSubmit])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
    }, [])

    return (
        <div
            className={cn(
                "relative border-t transition-all duration-300",
                // Glassmorphism effect
                "bg-white/80 backdrop-blur-xl",
                isFocused && "bg-white shadow-lg shadow-blue-500/5"
            )}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative p-4">
                <div className={cn(
                    "flex gap-3 items-end",
                    "rounded-2xl border-2 transition-all duration-200",
                    "bg-white shadow-sm",
                    isFocused
                        ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
                        : "border-gray-200 hover:border-gray-300",
                    isOverLimit && "border-red-300"
                )}>
                    {/* Textarea */}
                    <Textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Écrivez votre message..."
                        className={cn(
                            "flex-1 min-h-[44px] max-h-32 py-3 px-4",
                            "bg-transparent border-0 resize-none",
                            "text-sm leading-relaxed",
                            "placeholder:text-gray-400",
                            "focus:ring-0 focus:outline-none focus-visible:ring-0",
                            "disabled:opacity-50"
                        )}
                        disabled={isSending}
                        aria-label="Écrivez votre message"
                        aria-describedby={charCount > MAX_CHARS * 0.9 ? "char-count" : undefined}
                    />

                    {/* Send button */}
                    <div className="flex-shrink-0 p-2">
                        <Button
                            type="submit"
                            disabled={isEmpty || isSending || isOverLimit}
                            size="icon"
                            className={cn(
                                "h-10 w-10 rounded-xl transition-all duration-200",
                                "bg-gradient-to-br from-blue-600 to-blue-700",
                                "hover:from-blue-500 hover:to-blue-600",
                                "shadow-lg shadow-blue-500/30",
                                "disabled:opacity-40 disabled:shadow-none",
                                "disabled:from-gray-400 disabled:to-gray-500",
                                isSending && "animate-pulse"
                            )}
                            aria-label={isSending ? "Envoi en cours..." : "Envoyer le message"}
                        >
                            {isSending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className={cn(
                                    "h-5 w-5 transition-transform duration-200",
                                    !isEmpty && !isOverLimit && "translate-x-0.5 -translate-y-0.5"
                                )} />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Character count - show when approaching limit */}
                {charCount > MAX_CHARS * 0.8 && (
                    <div
                        id="char-count"
                        className={cn(
                            "absolute -top-6 right-4 text-xs font-medium transition-colors",
                            isOverLimit ? "text-red-500" : "text-gray-400"
                        )}
                        role="status"
                        aria-live="polite"
                    >
                        {charCount}/{MAX_CHARS}
                    </div>
                )}

                {/* Hint text */}
                <p className="mt-2 text-[10px] text-gray-400 text-center">
                    Appuyez sur <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">Entrée</kbd> pour envoyer, <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">Maj+Entrée</kbd> pour un retour à la ligne
                </p>
            </form>
        </div>
    )
}
