"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { ConversationList } from "./conversation-list";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { EmptyState } from "./empty-state";
import { OnlineStatus } from "./online-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MessageSquare,
  MapPin,
  Building,
  Euro,
  Calendar,
  Users,
  Stethoscope,
  CheckCircle,
  Clock,
  Briefcase,
  Info,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { ContractButton } from "@/components/contracts/contract-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  initialConversationId?: string;
}

export function ChatInterface({
  initialConversationId,
}: ChatInterfaceProps = {}) {
  const router = useRouter();
  const params = useParams();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | undefined
  >(initialConversationId);
  const [showMobileConversations, setShowMobileConversations] = useState(
    !initialConversationId,
  );
  const queryClient = useQueryClient();

  // Update selected conversation when URL changes or initialConversationId changes
  useEffect(() => {
    const conversationId = initialConversationId || (params?.id as string);
    if (conversationId && conversationId !== selectedConversationId) {
      setSelectedConversationId(conversationId);
      setShowMobileConversations(false);
    }
  }, [initialConversationId, params?.id, selectedConversationId]);

  const { data: session } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => authClient.getSession(),
  });

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowMobileConversations(false);
    router.push(`/dashboard/messages/${conversationId}`);
  };

  const handleMessageSent = () => {
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    queryClient.invalidateQueries({
      queryKey: ["messages", "unread-count"],
    });
    if (selectedConversationId) {
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversationId],
      });
    }
  };

  // Fetch selected conversation details
  const { data: conversationsResponse } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await fetch("/api/conversations");
      if (!response.ok) throw new Error("Failed to fetch conversations");
      return response.json();
    },
    refetchInterval: 5000,
  });

  const selectedConversation = selectedConversationId
    ? conversationsResponse?.data?.find(
        (conv: any) => conv.id === selectedConversationId,
      )
    : null;

  // Fetch detailed listing information for selected conversation
  const { data: listingDetailsResponse } = useQuery({
    queryKey: ["conversation-listing", selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return null;
      const response = await fetch(
        `/api/conversations/${selectedConversationId}/listing`,
      );
      if (!response.ok) throw new Error("Failed to fetch listing details");
      return response.json();
    },
    enabled: !!selectedConversationId,
  });

  const listingDetails = listingDetailsResponse?.data;

  const handleBackToConversations = () => {
    setShowMobileConversations(true);
    setSelectedConversationId(undefined);
    router.push("/dashboard/messages");
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!session?.data?.user) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">
            Vous devez être connecté pour accéder aux messages
          </p>
        </div>
      </div>
    );
  }

  const currentUser = session!.data!.user!;

  // Shared listing details content for desktop panel and mobile sheet
  const ListingDetailsContent = () => {
    if (!selectedConversationId || !listingDetails) return null;
    return (
      <div className="space-y-4">
        {/* Main listing info */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base leading-tight">
              {listingDetails.listing.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={cn(
                "text-xs font-medium",
                listingDetails.listing.listingType === "transfer" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                listingDetails.listing.listingType === "replacement" && "bg-amber-50 text-amber-700 border-amber-200",
                listingDetails.listing.listingType === "collaboration" && "bg-violet-50 text-violet-700 border-violet-200"
              )}>
                {listingDetails.listing.listingType === "transfer"
                  ? "Cession"
                  : listingDetails.listing.listingType === "replacement"
                    ? "Remplacement"
                    : "Collaboration"}
              </Badge>
              {listingDetails.listing.specialty && (
                <Badge variant="secondary" className="text-xs">
                  {listingDetails.listing.specialty}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {listingDetails.listing.description && (
              <p className="line-clamp-4 text-gray-600 text-sm leading-relaxed">
                {listingDetails.listing.description}
              </p>
            )}

            {listingDetails.location && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {listingDetails.location.city} ({listingDetails.location.postalCode})
                  </p>
                  <p className="text-gray-500">
                    {listingDetails.location.region}
                    {listingDetails.location.department && `, ${listingDetails.location.department}`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500 text-sm">
                Publié le{" "}
                {new Date(
                  listingDetails.listing.publishedAt || listingDetails.listing.createdAt,
                ).toLocaleDateString("fr-FR")}
              </span>
            </div>

            {selectedConversation && listingDetails.listing.listingType === "replacement" && (
              <ContractButton
                conversationId={selectedConversationId}
                listingId={listingDetails.listing.id}
                recipientId={
                  selectedConversation.participant1Id === currentUser.id
                    ? selectedConversation.participant2Id
                    : selectedConversation.participant1Id
                }
                senderId={currentUser.id}
                listingType={listingDetails.listing.listingType}
                userProfession={listingDetails.listing.specialty}
              />
            )}

            <Button asChild size="sm" className="w-full shadow-sm">
              <Link href={`/annonces/${listingDetails.listing.id}`}>
                Voir l'annonce complète
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Owner info */}
        {listingDetails.owner && (
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Propriétaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                  {listingDetails.owner.avatarUrl ||
                  listingDetails.owner.avatar ||
                  listingDetails.owner.name ? (
                    <img
                      src={
                        listingDetails.owner.avatarUrl ||
                        listingDetails.owner.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(listingDetails.owner.name || "User")}`
                      }
                      alt=""
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 font-semibold text-blue-700 text-sm">
                      {listingDetails.owner.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {listingDetails.owner.name}
                  </p>
                  {listingDetails.owner.profession && (
                    <p className="text-gray-500 text-xs">
                      {listingDetails.owner.profession}
                    </p>
                  )}
                </div>
              </div>

              {listingDetails.owner.isVerifiedProfessional && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-emerald-700 border border-emerald-100">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium text-xs">Professionnel vérifié</span>
                </div>
              )}

              {listingDetails.owner.specialty && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Stethoscope className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{listingDetails.owner.specialty}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Type-specific details */}
        {listingDetails.details && (
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">
                {listingDetails.listing.listingType === "transfer"
                  ? "Détails de la cession"
                  : listingDetails.listing.listingType === "replacement"
                    ? "Détails du remplacement"
                    : "Détails de la collaboration"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Transfer details */}
              {listingDetails.listing.listingType === "transfer" && (
                <>
                  {listingDetails.details.practiceType && (
                    <div className="flex items-start gap-2">
                      <Building className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-xs text-gray-600">Type de pratique</p>
                        <p className="text-gray-900 text-sm">
                          {listingDetails.details.practiceType === "solo"
                            ? "Cabinet individuel"
                            : listingDetails.details.practiceType === "group"
                              ? "Cabinet de groupe"
                              : "Clinique"}
                        </p>
                      </div>
                    </div>
                  )}
                  {listingDetails.details.salePrice && (
                    <div className="flex items-start gap-2">
                      <Euro className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-xs text-gray-600">Prix de cession</p>
                        <p className="text-gray-900 text-sm font-semibold">
                          {formatPrice(listingDetails.details.salePrice)}
                        </p>
                      </div>
                    </div>
                  )}
                  {listingDetails.details.annualTurnover && (
                    <div className="flex items-start gap-2">
                      <Euro className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-xs text-gray-600">CA annuel</p>
                        <p className="text-gray-900 text-sm">
                          {formatPrice(listingDetails.details.annualTurnover)}
                        </p>
                      </div>
                    </div>
                  )}
                  {listingDetails.details.patientBaseSize && (
                    <div className="flex items-start gap-2">
                      <Users className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-xs text-gray-600">Patientèle</p>
                        <p className="text-gray-900 text-sm">
                          {listingDetails.details.patientBaseSize} patients
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Replacement details */}
              {listingDetails.listing.listingType === "replacement" && (
                <>
                  {listingDetails.details.replacementType && (
                    <div className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-xs text-gray-600">Type</p>
                        <p className="text-gray-900 text-sm">
                          {listingDetails.details.replacementType === "temporary"
                            ? "Temporaire"
                            : listingDetails.details.replacementType === "long_term"
                              ? "Long terme"
                              : "Week-end"}
                        </p>
                      </div>
                    </div>
                  )}
                  {listingDetails.details.startDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-xs text-gray-600">Période</p>
                        <p className="text-gray-900 text-sm">
                          Du {new Date(listingDetails.details.startDate).toLocaleDateString("fr-FR")}
                          {listingDetails.details.endDate &&
                            ` au ${new Date(listingDetails.details.endDate).toLocaleDateString("fr-FR")}`}
                        </p>
                      </div>
                    </div>
                  )}
                  {listingDetails.details.dailyRate && (
                    <div className="flex items-start gap-2">
                      <Euro className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-xs text-gray-600">Tarif journalier</p>
                        <p className="text-gray-900 text-sm font-semibold">
                          {formatPrice(listingDetails.details.dailyRate)}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Collaboration details */}
              {listingDetails.listing.listingType === "collaboration" && (
                <>
                  {listingDetails.details.collaborationType && (
                    <div className="flex items-start gap-2">
                      <Briefcase className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-xs text-gray-600">Type de collaboration</p>
                        <p className="text-gray-900 text-sm">
                          {listingDetails.details.collaborationType === "association"
                            ? "Association"
                            : listingDetails.details.collaborationType === "partnership"
                              ? "Partenariat"
                              : listingDetails.details.collaborationType === "group_practice"
                                ? "Pratique de groupe"
                                : "Espace partagé"}
                        </p>
                      </div>
                    </div>
                  )}
                  {listingDetails.details.durationExpectation && (
                    <div className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-xs text-gray-600">Durée attendue</p>
                        <p className="text-gray-900 text-sm">
                          {listingDetails.details.durationExpectation === "short_term"
                            ? "Court terme"
                            : listingDetails.details.durationExpectation === "long_term"
                              ? "Long terme"
                              : "Permanent"}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div className={cn(
        "flex overflow-hidden rounded-2xl border bg-gray-50/50 w-full",
        "h-[calc(100vh-12rem)] min-h-[600px]",
        "shadow-xl shadow-gray-200/50"
      )}>
        {/* Conversation List - Hidden on mobile when a conversation is selected */}
        <div
          className={cn(
            "flex w-full flex-col border-r border-gray-100 bg-white md:w-72 lg:w-80",
            !showMobileConversations && selectedConversationId
              ? "hidden md:flex"
              : "flex"
          )}
        >
          {/* Conversations header with glassmorphism */}
          <div className="relative border-b border-gray-100 bg-white/80 backdrop-blur-xl p-4">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none" />
            <h2 className="relative flex items-center gap-2 font-semibold text-gray-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              Messages
            </h2>
          </div>

          <ConversationList
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Chat Area */}
        <div
          className={cn(
            "flex flex-1 flex-col bg-gradient-to-b from-gray-50 to-white",
            showMobileConversations && !selectedConversationId
              ? "hidden md:flex"
              : "flex"
          )}
        >
          {selectedConversationId ? (
            <>
              {/* Mobile header with back button and glassmorphism */}
              <div className="flex items-center gap-3 border-b border-gray-100 bg-white/80 backdrop-blur-xl p-4 md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToConversations}
                  className="h-8 w-8 rounded-lg hover:bg-gray-100"
                  aria-label="Retour aux conversations"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                {selectedConversation?.otherParticipant && (
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                      {selectedConversation.otherParticipant.avatarUrl ||
                      selectedConversation.otherParticipant.avatar ? (
                        <img
                          src={
                            selectedConversation.otherParticipant.avatarUrl ||
                            selectedConversation.otherParticipant.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedConversation.otherParticipant.name || "User")}`
                          }
                          alt=""
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 font-semibold text-blue-700 text-sm">
                          {selectedConversation.otherParticipant.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {selectedConversation.otherParticipant.name}
                      </h3>
                      <OnlineStatus
                        isOnline={selectedConversation.otherParticipant.isOnline}
                        lastSeen={selectedConversation.otherParticipant.lastSeen}
                        size="sm"
                      />
                    </div>
                  </div>
                )}

                {listingDetails && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                        <Info className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Détails de l'annonce</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4 pb-6">
                        <ListingDetailsContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>

              {/* Desktop header */}
              <div className="hidden md:flex items-center gap-4 border-b border-gray-100 bg-white/80 backdrop-blur-xl p-4">
                {selectedConversation?.otherParticipant && (
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                      {selectedConversation.otherParticipant.avatarUrl ||
                      selectedConversation.otherParticipant.avatar ? (
                        <img
                          src={
                            selectedConversation.otherParticipant.avatarUrl ||
                            selectedConversation.otherParticipant.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedConversation.otherParticipant.name || "User")}`
                          }
                          alt=""
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 font-semibold text-blue-700">
                          {selectedConversation.otherParticipant.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.otherParticipant.name}
                      </h3>
                      <OnlineStatus
                        isOnline={selectedConversation.otherParticipant.isOnline}
                        lastSeen={selectedConversation.otherParticipant.lastSeen}
                        size="sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <MessageList
                conversationId={selectedConversationId}
                currentUserId={currentUser.id}
              />

              {/* Message Input */}
              <MessageInput
                conversationId={selectedConversationId}
                onMessageSent={handleMessageSent}
              />
            </>
          ) : (
            <EmptyState variant="no-selection" />
          )}
        </div>

        {/* Listing Details Panel - Desktop only */}
        <div className="hidden lg:block lg:w-80 border-l border-gray-100 bg-gray-50/80 overflow-y-auto">
          {selectedConversationId && listingDetails ? (
            <div className="p-4">
              {/* Panel header */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                  <Building className="h-4 w-4 text-gray-600" />
                </div>
                <h2 className="font-semibold text-gray-900 text-sm">Détails de l'annonce</h2>
              </div>
              <ListingDetailsContent />
            </div>
          ) : selectedConversationId ? (
            <div className="flex h-full items-center justify-center p-4">
              <p className="text-sm text-gray-400 text-center">
                Chargement des détails...
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
