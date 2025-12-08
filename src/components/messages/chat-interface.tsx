"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { ConversationList } from "./conversation-list";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    setShowMobileConversations(false); // Hide conversation list on mobile

    // Update URL to reflect selected conversation
    router.push(`/dashboard/messages/${conversationId}`);
  };

  const handleMessageSent = () => {
    // Refresh conversations and messages
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

    // Navigate back to messages list
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
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">
          Vous devez être connecté pour accéder aux messages
        </p>
      </div>
    );
  }

  // Safe current user after auth guard
  const currentUser = session!.data!.user!;

  // Shared listing details content for desktop panel and mobile sheet
  const ListingDetailsContent = () => {
    if (!selectedConversationId || !listingDetails) return null;
    return (
      <>
        {/* Main listing info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base leading-tight">
              {listingDetails.listing.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
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
            {/* Description */}
            {listingDetails.listing.description && (
              <div>
                <p className="line-clamp-4 text-gray-700 text-sm">
                  {listingDetails.listing.description}
                </p>
              </div>
            )}

            {/* Location */}
            {listingDetails.location && (
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium">
                    {listingDetails.location.city} (
                    {listingDetails.location.postalCode})
                  </p>
                  <p className="text-gray-600">
                    {listingDetails.location.region}
                    {listingDetails.location.department &&
                      `, ${listingDetails.location.department}`}
                  </p>
                </div>
              </div>
            )}

            {/* Published date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 text-sm">
                Publié le{" "}
                {new Date(
                  listingDetails.listing.publishedAt ||
                    listingDetails.listing.createdAt,
                ).toLocaleDateString("fr-FR")}
              </span>
            </div>
            {/* Contract Generation Button - Only for replacement listings */}
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
            <Button asChild size="sm" className="w-full">
              <Link href={`/annonces/${listingDetails.listing.id}`}>
                Voir l'annonce complète
              </Link>
            </Button>
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
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                  {listingDetails.owner.avatarUrl ||
                  listingDetails.owner.avatar ||
                  (listingDetails.owner.name &&
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(listingDetails.owner.name)}`) ? (
                    <img
                      src={
                        listingDetails.owner.avatarUrl ||
                        listingDetails.owner.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(listingDetails.owner.name || "User")}`
                      }
                      alt={listingDetails.owner.name || "Avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-medium text-gray-600 text-sm">
                      {listingDetails.owner.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {listingDetails.owner.name}
                  </p>
                  {listingDetails.owner.profession && (
                    <p className="text-gray-600 text-xs">
                      {listingDetails.owner.profession}
                    </p>
                  )}
                </div>
              </div>

              {listingDetails.owner.isVerifiedProfessional && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium text-xs">
                    Professionnel vérifié
                  </span>
                </div>
              )}

              {listingDetails.owner.specialty && (
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {listingDetails.owner.specialty}
                  </span>
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
                <div className="space-y-3">
                  {listingDetails.details.practiceType && (
                    <div className="flex items-start gap-2">
                      <Building className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-xs">Type de pratique</p>
                        <p className="text-gray-600 text-xs">
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
                      <Euro className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-xs">Prix de cession</p>
                        <p className="text-gray-600 text-xs">
                          {formatPrice(listingDetails.details.salePrice)}
                        </p>
                      </div>
                    </div>
                  )}

                  {listingDetails.details.annualTurnover && (
                    <div className="flex items-start gap-2">
                      <Euro className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-xs">CA annuel</p>
                        <p className="text-gray-600 text-xs">
                          {formatPrice(listingDetails.details.annualTurnover)}
                        </p>
                      </div>
                    </div>
                  )}

                  {listingDetails.details.patientBaseSize && (
                    <div className="flex items-start gap-2">
                      <Users className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-xs">Patientèle</p>
                        <p className="text-gray-600 text-xs">
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
                      <Clock className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-xs">Type</p>
                        <p className="text-gray-600 text-xs">
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
                      <Calendar className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-xs">Période</p>
                        <p className="text-gray-600 text-xs">
                          Du {new Date(listingDetails.details.startDate).toLocaleDateString("fr-FR")}
                          {listingDetails.details.endDate &&
                            ` au ${new Date(listingDetails.details.endDate).toLocaleDateString("fr-FR")}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {listingDetails.details.dailyRate && (
                    <div className="flex items-start gap-2">
                      <Euro className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-xs">Tarif journalier</p>
                        <p className="text-gray-600 text-xs">
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
                      <Briefcase className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-xs">Type de collaboration</p>
                        <p className="text-gray-600 text-xs">
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
                      <Clock className="mt-0.5 h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-xs">Durée attendue</p>
                        <p className="text-gray-600 text-xs">
                          {listingDetails.details.durationExpectation === "short_term"
                            ? "Court terme"
                            : listingDetails.details.durationExpectation === "long_term"
                              ? "Long terme"
                              : "Permanent"}
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
              <p className="font-medium text-gray-900 text-sm">
                {selectedConversation.otherParticipant.name}
              </p>
              <div className="mt-2 space-y-1 text-gray-600 text-xs">
                <p>
                  Conversation créée le{" "}
                  {new Date(selectedConversation.createdAt).toLocaleDateString("fr-FR")}
                </p>
                {selectedConversation.lastMessageAt && (
                  <p>
                    Dernier message le{" "}
                    {new Date(selectedConversation.lastMessageAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-2"></div>
      </>
    );
  };

  return (
    <div className="relative w-full">
      <div className="flex h-[800px] overflow-hidden rounded-lg border bg-white w-full">
        {/* Conversation List - Hidden on mobile when a conversation is selected */}
        <div
          className={`flex w-full flex-col border-r md:w-72 lg:w-80 ${
            !showMobileConversations && selectedConversationId
              ? "hidden md:flex"
              : "flex"
          }`}
        >
          <div className="border-b bg-gray-50 p-4">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900">
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
        <div
          className={`flex flex-1 flex-col ${
            showMobileConversations && !selectedConversationId
              ? "hidden md:flex"
              : "flex"
          }`}
        >
          {selectedConversationId ? (
            <>
              {/* Mobile header with back button */}
              <div className="flex items-center gap-3 border-b bg-gray-50 p-4 md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToConversations}
                  className="p-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold">Messages</h3>
                <div className="ml-auto" />
                {listingDetails && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">Détails</Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-sm">
                      <SheetHeader>
                        <SheetTitle>Détails de l'annonce</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4 flex-1 space-y-4 overflow-y-auto pb-6">
                        <ListingDetailsContent />
                      </div>
                    </SheetContent>
                  </Sheet>
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
            <div className="flex flex-1 items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            </div>
          )}
        </div>

        {/* Listing Details Panel - Always reserve space */}
        <div className="hidden md:block md:w-72 lg:w-80">
          {selectedConversationId && listingDetails ? (
            <div className="flex flex-col h-full border-l bg-gray-50">
              <div className="border-b bg-white p-4">
                <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                  <Building className="h-5 w-5" />
                  Détails de l'annonce
                </h2>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                <ListingDetailsContent />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
