"use client"

import { useQuery } from "@tanstack/react-query"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface Conversation {
    id: string
    listingId: string | null
    lastMessageAt: string | null
    lastMessageContent: string | null
    createdAt: string
    otherParticipant: {
        id: string
        name: string
        avatar: string | null
        avatarUrl: string | null
    } | null
    listing: {
        id: string
        title: string
        listingType: string
    } | null
}

interface ConversationListProps {
    selectedConversationId?: string
    onSelectConversation: (conversationId: string) => void
}

async function fetchConversations(): Promise<{
    success: boolean
    data: Conversation[]
}> {
    const response = await fetch("/api/conversations")
    if (!response.ok) {
        throw new Error("Failed to fetch conversations")
    }
    return response.json()
}

export function ConversationList({
    selectedConversationId,
    onSelectConversation
}: ConversationListProps) {
    const {
        data: response,
        isLoading,
        error
    } = useQuery({
        queryKey: ["conversations"],
        queryFn: fetchConversations,
        refetchInterval: 5000, // Poll every 5 seconds
        staleTime: 30 * 1000 // 30 seconds
    })

    const conversations = response?.data || []

    if (error) {
        return (
            <div className="p-4 text-center text-red-600">
                Erreur lors du chargement des conversations
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="p-4 text-center">
                <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2" />
                <p className="text-gray-500 text-sm">Chargement...</p>
            </div>
        )
    }

    if (conversations.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                <p>Aucune conversation pour le moment</p>
                <p className="mt-1 text-sm">
                    Contactez des vendeurs depuis leurs annonces pour commencer
                    à échanger
                </p>
            </div>
        )
    }

    return (
        <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-100">
                {conversations.map((conversation) => (
                    <button
                        key={conversation.id}
                        onClick={() => onSelectConversation(conversation.id)}
                        className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                            selectedConversationId === conversation.id
                                ? "border-blue-600 border-r-2 bg-blue-50"
                                : ""
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                                {conversation.otherParticipant?.avatarUrl ||
                                conversation.otherParticipant?.avatar ||
                                (conversation.otherParticipant?.name &&
                                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(conversation.otherParticipant.name)}`) ? (
                                    <img
                                        src={
                                            conversation.otherParticipant
                                                .avatarUrl ||
                                            conversation.otherParticipant
                                                .avatar ||
                                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(conversation.otherParticipant?.name || "User")}`
                                        }
                                        alt={
                                            conversation.otherParticipant
                                                ?.name || "Avatar"
                                        }
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 font-medium text-gray-600 text-sm">
                                        {conversation.otherParticipant?.name
                                            ?.charAt(0)
                                            .toUpperCase() || "?"}
                                    </div>
                                )}
                            </Avatar>

                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex items-center justify-between">
                                    <h3 className="truncate font-medium text-gray-900">
                                        {conversation.otherParticipant?.name ||
                                            "Utilisateur"}
                                    </h3>
                                    {conversation.lastMessageAt && (
                                        <span className="flex-shrink-0 text-gray-500 text-xs">
                                            {formatDistanceToNow(
                                                new Date(
                                                    conversation.lastMessageAt
                                                ),
                                                {
                                                    addSuffix: true,
                                                    locale: fr
                                                }
                                            )}
                                        </span>
                                    )}
                                </div>

                                {conversation.listing && (
                                    <div className="mb-1 flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {conversation.listing.listingType}
                                        </Badge>
                                        <span className="truncate text-gray-500 text-xs">
                                            {conversation.listing.title}
                                        </span>
                                    </div>
                                )}

                                {conversation.lastMessageContent && (
                                    <p className="truncate text-gray-600 text-sm">
                                        {conversation.lastMessageContent}
                                    </p>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </ScrollArea>
    )
}
