"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useEffect, useRef } from "react"
import { Check, CheckCheck } from "lucide-react"

interface Message {
    id: string
    conversationId: string
    senderId: string
    recipientId: string
    listingId: string | null
    content: string
    isRead: boolean
    createdAt: string
    updatedAt: string
    sender: {
        id: string
        name: string
        avatar: string | null
        avatarUrl: string | null
    } | null
}

interface MessageListProps {
    conversationId: string
    currentUserId: string
}

async function fetchMessages(
    conversationId: string
): Promise<{ success: boolean; data: Message[] }> {
    const response = await fetch(
        `/api/conversations/${conversationId}/messages`
    )
    if (!response.ok) {
        throw new Error("Failed to fetch messages")
    }
    return response.json()
}

async function markMessageAsRead(messageId: string) {
    const response = await fetch(`/api/messages/${messageId}/read`, {
        method: "PATCH"
    })
    if (!response.ok) {
        throw new Error("Failed to mark message as read")
    }
    return response.json()
}

export function MessageList({
    conversationId,
    currentUserId
}: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()

    const {
        data: response,
        isLoading,
        error
    } = useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => fetchMessages(conversationId),
        refetchInterval: 3000, // Poll every 3 seconds for new messages
        enabled: !!conversationId
    })

    const messages = response?.data || []

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    // Mark unread messages as read
    useEffect(() => {
        const unreadMessages = messages.filter(
            (msg) => !msg.isRead && msg.recipientId === currentUserId
        )

        unreadMessages.forEach(async (msg) => {
            try {
                await markMessageAsRead(msg.id)
                // Refresh the messages to update read status
                queryClient.invalidateQueries({
                    queryKey: ["messages", conversationId]
                })
                queryClient.invalidateQueries({ queryKey: ["conversations"] })
                queryClient.invalidateQueries({
                    queryKey: ["messages", "unread-count"]
                })
            } catch (error) {
                console.error("Error marking message as read:", error)
            }
        })
    }, [messages, currentUserId, conversationId, queryClient])

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center text-red-600">
                Erreur lors du chargement des messages
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2" />
                    <p className="text-gray-500 text-sm">
                        Chargement des messages...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
                {messages.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        <p>Aucun message dans cette conversation</p>
                        <p className="mt-1 text-sm">
                            Envoyez votre premier message !
                        </p>
                    </div>
                ) : (
                    messages
                        .slice()
                        .reverse() // Reverse to show oldest first
                        .map((message) => {
                            const isOwnMessage =
                                message.senderId === currentUserId

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`flex max-w-[70%] gap-3 ${
                                            isOwnMessage
                                                ? "flex-row-reverse"
                                                : "flex-row"
                                        }`}
                                    >
                                        {!isOwnMessage && (
                                            <Avatar className="h-8 w-8 flex-shrink-0">
                                                {message.sender?.avatarUrl ||
                                                message.sender?.avatar ||
                                                (message.sender?.name &&
                                                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(message.sender.name)}`) ? (
                                                    <img
                                                        src={
                                                            message.sender
                                                                .avatarUrl ||
                                                            message.sender
                                                                .avatar ||
                                                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(message.sender?.name || "User")}`
                                                        }
                                                        alt={
                                                            message.sender
                                                                ?.name ||
                                                            "Avatar"
                                                        }
                                                        className="h-full w-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 font-medium text-gray-600 text-xs">
                                                        {message.sender?.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            "?"}
                                                    </div>
                                                )}
                                            </Avatar>
                                        )}

                                        <div
                                            className={`rounded-lg p-3 ${
                                                isOwnMessage
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-900"
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap text-sm">
                                                {message.content}
                                            </p>

                                            <div
                                                className={`mt-1 flex items-center gap-1 text-xs ${
                                                    isOwnMessage
                                                        ? "text-blue-100"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                <span>
                                                    {formatDistanceToNow(
                                                        new Date(
                                                            message.createdAt
                                                        ),
                                                        {
                                                            addSuffix: true,
                                                            locale: fr
                                                        }
                                                    )}
                                                </span>

                                                {isOwnMessage && (
                                                    <div className="ml-1">
                                                        {message.isRead ? (
                                                            <CheckCheck className="h-3 w-3" />
                                                        ) : (
                                                            <Check className="h-3 w-3" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                )}
            </div>
        </ScrollArea>
    )
}
