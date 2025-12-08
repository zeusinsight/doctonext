"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import { isSameDay, parseISO } from "date-fns"
import { MessageBubble } from "./message-bubble"
import { DateSeparator } from "./date-separator"
import { EmptyState } from "./empty-state"
import { ScrollToBottom } from "./scroll-to-bottom"

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

interface MessageGroup {
    type: "date" | "messages"
    date?: Date
    messages?: Message[]
    senderId?: string
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

function MessageSkeleton({ isOwn }: { isOwn: boolean }) {
    return (
        <div className={cn("flex gap-2 mb-3", isOwn ? "justify-end" : "justify-start")}>
            {!isOwn && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
            <div className={cn("space-y-1", isOwn ? "items-end" : "items-start")}>
                <Skeleton className={cn("h-16 rounded-2xl", isOwn ? "w-48" : "w-56")} />
                <Skeleton className="h-3 w-12" />
            </div>
            {isOwn && <div className="w-8 flex-shrink-0" />}
        </div>
    )
}

export function MessageList({
    conversationId,
    currentUserId
}: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [isNearBottom, setIsNearBottom] = useState(true)
    const prevMessageCountRef = useRef(0)

    const {
        data: response,
        isLoading,
        error
    } = useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => fetchMessages(conversationId),
        refetchInterval: 3000,
        enabled: !!conversationId
    })

    const messages = useMemo(() => response?.data || [], [response?.data])

    // Group messages by date and sender for visual grouping
    const groupedMessages = useMemo(() => {
        if (messages.length === 0) return []

        const reversed = [...messages].reverse() // oldest first
        const groups: MessageGroup[] = []
        let currentDate: Date | null = null
        let currentSenderId: string | null = null
        let currentMessages: Message[] = []

        reversed.forEach((message, index) => {
            const messageDate = parseISO(message.createdAt)

            // Check if we need a date separator
            if (!currentDate || !isSameDay(currentDate, messageDate)) {
                // Push existing messages group if any
                if (currentMessages.length > 0) {
                    groups.push({
                        type: "messages",
                        messages: currentMessages,
                        senderId: currentSenderId!
                    })
                    currentMessages = []
                }

                // Add date separator
                groups.push({
                    type: "date",
                    date: messageDate
                })
                currentDate = messageDate
                currentSenderId = null
            }

            // Check if sender changed (start new group)
            if (currentSenderId !== message.senderId) {
                if (currentMessages.length > 0) {
                    groups.push({
                        type: "messages",
                        messages: currentMessages,
                        senderId: currentSenderId!
                    })
                }
                currentMessages = [message]
                currentSenderId = message.senderId
            } else {
                currentMessages.push(message)
            }
        })

        // Push final group
        if (currentMessages.length > 0) {
            groups.push({
                type: "messages",
                messages: currentMessages,
                senderId: currentSenderId!
            })
        }

        return groups
    }, [messages])

    // Scroll handling
    const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior
            })
        }
    }, [])

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight
        const threshold = 100

        setIsNearBottom(distanceFromBottom < threshold)
        setShowScrollButton(distanceFromBottom > threshold)
    }, [])

    // Auto-scroll on new messages (only if near bottom)
    useEffect(() => {
        const messageCount = messages.length
        if (messageCount > prevMessageCountRef.current) {
            if (isNearBottom) {
                scrollToBottom()
            }
        }
        prevMessageCountRef.current = messageCount
    }, [messages, isNearBottom, scrollToBottom])

    // Initial scroll to bottom
    useEffect(() => {
        if (!isLoading && messages.length > 0) {
            setTimeout(() => scrollToBottom("instant"), 50)
        }
    }, [isLoading, conversationId])

    // Mark unread messages as read
    useEffect(() => {
        const unreadMessages = messages.filter(
            (msg) => !msg.isRead && msg.recipientId === currentUserId
        )

        if (unreadMessages.length === 0) return

        const markAsRead = async () => {
            for (const msg of unreadMessages) {
                try {
                    await markMessageAsRead(msg.id)
                } catch (error) {
                    console.error("Error marking message as read:", error)
                }
            }
            // Batch invalidate after all marks
            queryClient.invalidateQueries({
                queryKey: ["messages", conversationId]
            })
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            queryClient.invalidateQueries({
                queryKey: ["messages", "unread-count"]
            })
        }

        markAsRead()
    }, [messages, currentUserId, conversationId, queryClient])

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-red-600 font-medium">Erreur de chargement</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Impossible de charger les messages
                    </p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex-1 p-4 space-y-4">
                <MessageSkeleton isOwn={false} />
                <MessageSkeleton isOwn={true} />
                <MessageSkeleton isOwn={false} />
                <MessageSkeleton isOwn={true} />
            </div>
        )
    }

    if (messages.length === 0) {
        return <EmptyState variant="no-messages" />
    }

    return (
        <div className="relative flex-1 overflow-hidden">
            {/* Live region for screen readers */}
            <div
                role="log"
                aria-live="polite"
                aria-label="Messages de la conversation"
                className="sr-only"
            >
                {messages.length} messages
            </div>

            <ScrollArea
                className="h-full"
                ref={scrollAreaRef}
            >
                <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto px-4 py-6"
                    onScroll={handleScroll}
                >
                    <div className="space-y-1 max-w-3xl mx-auto">
                        {groupedMessages.map((group, groupIndex) => {
                            if (group.type === "date" && group.date) {
                                return (
                                    <DateSeparator
                                        key={`date-${group.date.toISOString()}`}
                                        date={group.date}
                                    />
                                )
                            }

                            if (group.type === "messages" && group.messages) {
                                const isOwnMessages = group.senderId === currentUserId

                                return (
                                    <div key={`group-${groupIndex}`} className="space-y-0.5">
                                        {group.messages.map((message, messageIndex) => {
                                            const isFirst = messageIndex === 0
                                            const isLast = messageIndex === group.messages!.length - 1

                                            return (
                                                <MessageBubble
                                                    key={message.id}
                                                    content={message.content}
                                                    timestamp={message.createdAt}
                                                    isOwn={isOwnMessages}
                                                    isRead={message.isRead}
                                                    sender={message.sender}
                                                    showAvatar={!isOwnMessages}
                                                    isFirstInGroup={isFirst}
                                                    isLastInGroup={isLast}
                                                />
                                            )
                                        })}
                                    </div>
                                )
                            }

                            return null
                        })}
                    </div>
                </div>
            </ScrollArea>

            {/* Scroll to bottom button */}
            <ScrollToBottom
                visible={showScrollButton}
                onClick={() => scrollToBottom()}
                unreadCount={0}
            />
        </div>
    )
}
