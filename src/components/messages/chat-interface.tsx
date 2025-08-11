"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ConversationList } from "./conversation-list"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MessageSquare, MapPin, Building, Euro, Calendar, Users, Stethoscope, CheckCircle, Clock, Briefcase } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

export function ChatInterface() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>()
    const [showMobileConversations, setShowMobileConversations] = useState(true)
    const queryClient = useQueryClient()
    
    const { data: session } = useQuery({
        queryKey: ["auth", "session"],
        queryFn: () => authClient.getSession(),
    })

    const handleSelectConversation = (conversationId: string) => {
        setSelectedConversationId(conversationId)
        setShowMobileConversations(false) // Hide conversation list on mobile
    }

    const handleMessageSent = () => {
        // Refresh conversations and messages
        queryClient.invalidateQueries({ queryKey: ["conversations"] })
        queryClient.invalidateQueries({ queryKey: ["messages", "unread-count"] })
        if (selectedConversationId) {
            queryClient.invalidateQueries({ queryKey: ["messages", selectedConversationId] })
        }
    }

    // Fetch selected conversation details
    const { data: conversationsResponse } = useQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
            const response = await fetch("/api/conversations")
            if (!response.ok) throw new Error("Failed to fetch conversations")
            return response.json()
        },
        refetchInterval: 5000,
    })

    const selectedConversation = selectedConversationId 
        ? conversationsResponse?.data?.find((conv: any) => conv.id === selectedConversationId)
        : null

    // Fetch detailed listing information for selected conversation
    const { data: listingDetailsResponse } = useQuery({
        queryKey: ["conversation-listing", selectedConversationId],
        queryFn: async () => {
            if (!selectedConversationId) return null
            const response = await fetch(`/api/conversations/${selectedConversationId}/listing`)
            if (!response.ok) throw new Error("Failed to fetch listing details")
            return response.json()
        },
        enabled: !!selectedConversationId,
    })

    const listingDetails = listingDetailsResponse?.data

    const handleBackToConversations = () => {
        setShowMobileConversations(true)
        setSelectedConversationId(undefined)
    }

    const formatPrice = (price: number | null | undefined) => {
        if (!price) return null
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0
        }).format(price)
    }

    if (!session?.data?.user) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Vous devez être connecté pour accéder aux messages</p>
            </div>
        )
    }

    return (
        <div className="h-[800px] border rounded-lg overflow-hidden bg-white flex">
            {/* Conversation List - Hidden on mobile when a conversation is selected */}
            <div className={`w-full md:w-80 lg:w-96 border-r flex flex-col ${
                !showMobileConversations && selectedConversationId ? 'hidden md:flex' : 'flex'
            }`}>
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Conversations
                    </h2>
                </div>
                
                <ConversationList
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={handleSelectConversation}
                />
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${
                showMobileConversations && !selectedConversationId ? 'hidden md:flex' : 'flex'
            }`}>
                {selectedConversationId ? (
                    <>
                        {/* Mobile header with back button */}
                        <div className="md:hidden p-4 border-b bg-gray-50 flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBackToConversations}
                                className="p-1"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h3 className="font-semibold">Messages</h3>
                        </div>

                        {/* Messages */}
                        <MessageList
                            conversationId={selectedConversationId}
                            currentUserId={session.data.user.id}
                        />

                        {/* Message Input */}
                        <MessageInput
                            conversationId={selectedConversationId}
                            onMessageSent={handleMessageSent}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>Sélectionnez une conversation pour commencer</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Listing Details Panel - Hidden on mobile, shown when conversation selected */}
            {selectedConversationId && listingDetails && (
                <div className="hidden md:flex md:w-80 lg:w-96 border-l flex-col bg-gray-50">
                    <div className="p-4 border-b bg-white">
                        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Détails de l'annonce
                        </h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Main listing info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base leading-tight">
                                    {listingDetails.listing.title}
                                </CardTitle>
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="outline">
                                        {listingDetails.listing.listingType === "transfer" ? "Cession" :
                                         listingDetails.listing.listingType === "replacement" ? "Remplacement" :
                                         "Collaboration"}
                                    </Badge>
                                    {listingDetails.listing.specialty && (
                                        <Badge variant="secondary" className="text-xs">
                                            {listingDetails.listing.specialty}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Description */}
                                {listingDetails.listing.description && (
                                    <div>
                                        <p className="text-sm text-gray-700 line-clamp-4">
                                            {listingDetails.listing.description}
                                        </p>
                                    </div>
                                )}

                                {/* Location */}
                                {listingDetails.location && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm">
                                            <p className="font-medium">
                                                {listingDetails.location.city} ({listingDetails.location.postalCode})
                                            </p>
                                            <p className="text-gray-600">
                                                {listingDetails.location.region}
                                                {listingDetails.location.department && `, ${listingDetails.location.department}`}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Published date */}
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                        Publié le {new Date(listingDetails.listing.publishedAt || listingDetails.listing.createdAt).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Owner info */}
                        {listingDetails.owner && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Propriétaire</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                                            {(listingDetails.owner.avatarUrl || 
                                              listingDetails.owner.avatar || 
                                              (listingDetails.owner.name && `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(listingDetails.owner.name)}`)) ? (
                                                <img
                                                    src={listingDetails.owner.avatarUrl || 
                                                         listingDetails.owner.avatar || 
                                                         `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(listingDetails.owner.name || 'User')}`}
                                                    alt={listingDetails.owner.name || "Avatar"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-600">
                                                    {listingDetails.owner.name?.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{listingDetails.owner.name}</p>
                                            {listingDetails.owner.profession && (
                                                <p className="text-xs text-gray-600">{listingDetails.owner.profession}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {listingDetails.owner.isVerifiedProfessional && (
                                        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-xs font-medium">Professionnel vérifié</span>
                                        </div>
                                    )}

                                    {listingDetails.owner.specialty && (
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">{listingDetails.owner.specialty}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Type-specific details */}
                        {listingDetails.details && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">
                                        {listingDetails.listing.listingType === "transfer" ? "Détails de la cession" :
                                         listingDetails.listing.listingType === "replacement" ? "Détails du remplacement" :
                                         "Détails de la collaboration"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* Transfer details */}
                                    {listingDetails.listing.listingType === "transfer" && (
                                        <div className="space-y-3">
                                            {listingDetails.details.practiceType && (
                                                <div className="flex items-start gap-2">
                                                    <Building className="h-4 w-4 text-gray-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium">Type de pratique</p>
                                                        <p className="text-xs text-gray-600">
                                                            {listingDetails.details.practiceType === "solo" ? "Cabinet individuel" :
                                                             listingDetails.details.practiceType === "group" ? "Cabinet de groupe" :
                                                             "Clinique"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {listingDetails.details.salePrice && (
                                                <div className="flex items-start gap-2">
                                                    <Euro className="h-4 w-4 text-gray-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium">Prix de cession</p>
                                                        <p className="text-xs text-gray-600">
                                                            {formatPrice(listingDetails.details.salePrice)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {listingDetails.details.annualTurnover && (
                                                <div className="flex items-start gap-2">
                                                    <Euro className="h-4 w-4 text-gray-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium">CA annuel</p>
                                                        <p className="text-xs text-gray-600">
                                                            {formatPrice(listingDetails.details.annualTurnover)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {listingDetails.details.patientBaseSize && (
                                                <div className="flex items-start gap-2">
                                                    <Users className="h-4 w-4 text-gray-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium">Patientèle</p>
                                                        <p className="text-xs text-gray-600">
                                                            {listingDetails.details.patientBaseSize} patients
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Replacement details */}
                                    {listingDetails.listing.listingType === "replacement" && (
                                        <div className="space-y-3">
                                            {listingDetails.details.replacementType && (
                                                <div className="flex items-start gap-2">
                                                    <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium">Type</p>
                                                        <p className="text-xs text-gray-600">
                                                            {listingDetails.details.replacementType === "temporary" ? "Temporaire" :
                                                             listingDetails.details.replacementType === "long_term" ? "Long terme" :
                                                             "Week-end"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {listingDetails.details.startDate && (
                                                <div className="flex items-start gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium">Période</p>
                                                        <p className="text-xs text-gray-600">
                                                            Du {new Date(listingDetails.details.startDate).toLocaleDateString("fr-FR")}
                                                            {listingDetails.details.endDate && ` au ${new Date(listingDetails.details.endDate).toLocaleDateString("fr-FR")}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {listingDetails.details.dailyRate && (
                                                <div className="flex items-start gap-2">
                                                    <Euro className="h-4 w-4 text-gray-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium">Tarif journalier</p>
                                                        <p className="text-xs text-gray-600">
                                                            {formatPrice(listingDetails.details.dailyRate)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Collaboration details */}
                                    {listingDetails.listing.listingType === "collaboration" && (
                                        <div className="space-y-3">
                                            {listingDetails.details.collaborationType && (
                                                <div className="flex items-start gap-2">
                                                    <Briefcase className="h-4 w-4 text-gray-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium">Type de collaboration</p>
                                                        <p className="text-xs text-gray-600">
                                                            {listingDetails.details.collaborationType === "association" ? "Association" :
                                                             listingDetails.details.collaborationType === "partnership" ? "Partenariat" :
                                                             listingDetails.details.collaborationType === "group_practice" ? "Pratique de groupe" :
                                                             "Espace partagé"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {listingDetails.details.durationExpectation && (
                                                <div className="flex items-start gap-2">
                                                    <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-medium">Durée attendue</p>
                                                        <p className="text-xs text-gray-600">
                                                            {listingDetails.details.durationExpectation === "short_term" ? "Court terme" :
                                                             listingDetails.details.durationExpectation === "long_term" ? "Long terme" :
                                                             "Permanent"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Other participant info */}
                        {selectedConversation?.otherParticipant && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Conversation avec</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedConversation.otherParticipant.name}
                                    </p>
                                    <div className="text-xs text-gray-600 space-y-1 mt-2">
                                        <p>
                                            Conversation créée le{' '}
                                            {new Date(selectedConversation.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                        {selectedConversation.lastMessageAt && (
                                            <p>
                                                Dernier message le{' '}
                                                {new Date(selectedConversation.lastMessageAt).toLocaleDateString('fr-FR')}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button asChild size="sm" className="w-full">
                                <Link href={`/listings/${listingDetails.listing.id}`}>
                                    Voir l'annonce complète
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}