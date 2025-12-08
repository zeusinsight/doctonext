"use client"

import { useQuery } from "@tanstack/react-query"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow, isToday, format } from "date-fns"
import { fr } from "date-fns/locale"
import { Search, X } from "lucide-react"
import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { OnlineStatus } from "./online-status"
import { EmptyState } from "./empty-state"

interface Conversation {
    id: string
    listingId: string | null
    lastMessageAt: string | null
    lastMessageContent: string | null
    createdAt: string
    unreadCount?: number
    otherParticipant: {
        id: string
        name: string
        avatar: string | null
        avatarUrl: string | null
        isOnline?: boolean
        lastSeen?: string | null
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

function getListingTypeLabel(listingType: string): string {
    switch (listingType) {
        case "replacement":
            return "Remplacement"
        case "transfer":
            return "Cession"
        case "collaboration":
            return "Collaboration"
        default:
            return listingType
    }
}

function getListingTypeBadgeClass(listingType: string): string {
    switch (listingType) {
        case "replacement":
            return "bg-amber-50 text-amber-700 border-amber-200"
        case "transfer":
            return "bg-emerald-50 text-emerald-700 border-emerald-200"
        case "collaboration":
            return "bg-violet-50 text-violet-700 border-violet-200"
        default:
            return "bg-gray-50 text-gray-700 border-gray-200"
    }
}

function formatMessageTime(dateString: string): string {
    const date = new Date(dateString)
    if (isToday(date)) {
        return format(date, "HH:mm", { locale: fr })
    }
    return formatDistanceToNow(date, { addSuffix: false, locale: fr })
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

function ConversationSkeleton() {
    return (
        <div className="flex items-start gap-3 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-full" />
            </div>
        </div>
    )
}

export function ConversationList({
    selectedConversationId,
    onSelectConversation
}: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const listRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

    const {
        data: response,
        isLoading,
        error
    } = useQuery({
        queryKey: ["conversations"],
        queryFn: fetchConversations,
        refetchInterval: 5000,
        staleTime: 30 * 1000
    })

    const conversations = response?.data || []

    // Filter conversations based on search
    const filteredConversations = conversations.filter((conv) => {
        if (!searchQuery.trim()) return true
        const query = searchQuery.toLowerCase()
        return (
            conv.otherParticipant?.name.toLowerCase().includes(query) ||
            conv.listing?.title.toLowerCase().includes(query) ||
            conv.lastMessageContent?.toLowerCase().includes(query)
        )
    })

    // Keyboard navigation handler
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            const maxIndex = filteredConversations.length - 1

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault()
                    setFocusedIndex((prev) =>
                        prev < maxIndex ? prev + 1 : 0
                    )
                    break
                case "ArrowUp":
                    e.preventDefault()
                    setFocusedIndex((prev) =>
                        prev > 0 ? prev - 1 : maxIndex
                    )
                    break
                case "Enter":
                    if (focusedIndex >= 0 && filteredConversations[focusedIndex]) {
                        onSelectConversation(filteredConversations[focusedIndex].id)
                    }
                    break
                case "Escape":
                    setSearchQuery("")
                    setFocusedIndex(-1)
                    break
            }
        },
        [filteredConversations, focusedIndex, onSelectConversation]
    )

    // Focus management
    useEffect(() => {
        if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
            itemRefs.current[focusedIndex]?.focus()
        }
    }, [focusedIndex])

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-red-600 font-medium">Erreur de chargement</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Impossible de charger les conversations
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col" onKeyDown={handleKeyDown}>
            {/* Search bar */}
            <div className="p-3 border-b border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                            "pl-9 pr-9 h-10 bg-gray-50/80 border-gray-200",
                            "focus:bg-white focus:ring-2 focus:ring-blue-500/20",
                            "placeholder:text-gray-400 text-sm transition-all"
                        )}
                        aria-label="Rechercher dans les conversations"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                            aria-label="Effacer la recherche"
                        >
                            <X className="h-3.5 w-3.5 text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Conversation list */}
            {isLoading ? (
                <div className="flex-1">
                    <ConversationSkeleton />
                    <ConversationSkeleton />
                    <ConversationSkeleton />
                </div>
            ) : filteredConversations.length === 0 ? (
                searchQuery ? (
                    <EmptyState
                        variant="no-results"
                        onAction={() => setSearchQuery("")}
                    />
                ) : (
                    <EmptyState variant="no-conversations" />
                )
            ) : (
                <ScrollArea className="flex-1">
                    <div
                        ref={listRef}
                        role="listbox"
                        aria-label="Liste des conversations"
                        className="divide-y divide-gray-50"
                    >
                        {filteredConversations.map((conversation, index) => {
                            const isSelected = selectedConversationId === conversation.id
                            const isFocused = focusedIndex === index
                            const hasUnread = (conversation.unreadCount ?? 0) > 0

                            return (
                                <button
                                    key={conversation.id}
                                    ref={(el) => { itemRefs.current[index] = el }}
                                    onClick={() => onSelectConversation(conversation.id)}
                                    role="option"
                                    aria-selected={isSelected}
                                    tabIndex={isFocused ? 0 : -1}
                                    className={cn(
                                        "w-full text-left p-4 transition-all duration-200 outline-none",
                                        "hover:bg-gray-50/80 focus-visible:bg-gray-50",
                                        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500",
                                        isSelected && [
                                            "bg-blue-50/70 border-l-4 border-l-blue-600",
                                            "hover:bg-blue-50"
                                        ],
                                        !isSelected && "border-l-4 border-l-transparent",
                                        hasUnread && !isSelected && "bg-blue-50/30"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar with online indicator */}
                                        <div className="relative flex-shrink-0">
                                            <Avatar className={cn(
                                                "h-12 w-12 ring-2 ring-white shadow-sm transition-transform duration-200",
                                                isSelected && "ring-blue-100"
                                            )}>
                                                {conversation.otherParticipant?.avatarUrl ||
                                                    conversation.otherParticipant?.avatar ||
                                                    (conversation.otherParticipant?.name &&
                                                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(conversation.otherParticipant.name)}`) ? (
                                                    <img
                                                        src={
                                                            conversation.otherParticipant.avatarUrl ||
                                                            conversation.otherParticipant.avatar ||
                                                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(conversation.otherParticipant?.name || "User")}`
                                                        }
                                                        alt=""
                                                        className="h-full w-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 font-semibold text-blue-700">
                                                        {conversation.otherParticipant?.name?.charAt(0).toUpperCase() || "?"}
                                                    </div>
                                                )}
                                            </Avatar>
                                            {/* Online status dot */}
                                            {conversation.otherParticipant?.isOnline && (
                                                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="min-w-0 flex-1 overflow-hidden">
                                            {/* Header row */}
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h3 className={cn(
                                                    "truncate text-sm",
                                                    hasUnread ? "font-semibold text-gray-900" : "font-medium text-gray-800"
                                                )}>
                                                    {conversation.otherParticipant?.name || "Utilisateur"}
                                                </h3>
                                                {conversation.lastMessageAt && (
                                                    <span className={cn(
                                                        "flex-shrink-0 text-xs",
                                                        hasUnread ? "text-blue-600 font-medium" : "text-gray-400"
                                                    )}>
                                                        {formatMessageTime(conversation.lastMessageAt)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Listing badge */}
                                            {conversation.listing && (
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-[10px] px-1.5 py-0 h-5 font-medium border flex-shrink-0",
                                                            getListingTypeBadgeClass(conversation.listing.listingType)
                                                        )}
                                                    >
                                                        {getListingTypeLabel(conversation.listing.listingType)}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {conversation.listing.title.length > 20
                                                            ? `${conversation.listing.title.slice(0, 20)}...`
                                                            : conversation.listing.title}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Last message preview */}
                                            <div className="flex items-center gap-2">
                                                {conversation.lastMessageContent && (
                                                    <p className={cn(
                                                        "text-sm",
                                                        hasUnread ? "text-gray-700" : "text-gray-500"
                                                    )}>
                                                        {conversation.lastMessageContent.length > 50
                                                            ? `${conversation.lastMessageContent.slice(0, 50)}...`
                                                            : conversation.lastMessageContent}
                                                    </p>
                                                )}
                                                {hasUnread && (
                                                    <span className="flex-shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                                                        {conversation.unreadCount! > 99 ? "99+" : conversation.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </ScrollArea>
            )}
        </div>
    )
}
