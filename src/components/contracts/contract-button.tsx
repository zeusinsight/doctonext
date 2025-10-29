"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Clock, Loader2 } from "lucide-react";
import { ContractPreviewModal } from "./contract-preview-modal";
import { ContractSigningModal } from "./contract-signing-modal";

interface ContractButtonProps {
  conversationId?: string;
  listingId: string;
  recipientId: string;
  senderId: string;
  listingType: string;
  userProfession?: string;
}

export function ContractButton({
  conversationId,
  listingId,
  recipientId,
  senderId,
  listingType,
  userProfession,
}: ContractButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showSigning, setShowSigning] = useState(false);
  const [contractId, setContractId] = useState<string>();

  // Check for existing contract in this conversation
  const { data: existingContract, isLoading } = useQuery({
    queryKey: ["conversation-contract", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const response = await fetch(
        `/api/conversations/${conversationId}/contract`,
      );
      if (!response.ok) {
        if (response.status === 404) return null; // No contract found
        throw new Error("Failed to fetch contract");
      }
      return response.json();
    },
    enabled: !!conversationId,
  });

  const handleContractPaid = (contractId: string) => {
    setContractId(contractId);
    setShowPreview(false);
    setShowSigning(true);
  };

  const handleExistingContractClick = () => {
    if (existingContract) {
      setContractId(existingContract.id);
      if (existingContract.status === "completed") {
        // For completed contracts, maybe open a view/download modal
        return;
      }
      setShowSigning(true);
    }
  };

  // Determine button state based on existing contract
  const getButtonConfig = () => {
    if (!existingContract) {
      return {
        text: "Créer un contrat",
        icon: FileText,
        variant: "default" as const,
        onClick: () => setShowPreview(true),
        disabled: false,
        className:
          "text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0",
        style: { backgroundColor: "#206dc5" },
      };
    }

    switch (existingContract.status) {
      case "completed":
        return {
          text: "Contrat signé ✓",
          icon: CheckCircle,
          variant: "outline" as const,
          onClick: handleExistingContractClick,
          disabled: false,
          className: "border-green-500 text-green-700 hover:bg-green-50",
        };
      case "in_progress":
        return {
          text: "Signature en cours",
          icon: Clock,
          variant: "outline" as const,
          onClick: handleExistingContractClick,
          disabled: false,
          className: "border-orange-500 text-orange-700 hover:bg-orange-50",
        };
      case "pending_signature":
        return {
          text: "Attente signature",
          icon: Clock,
          variant: "outline" as const,
          onClick: handleExistingContractClick,
          disabled: false,
          className:
            "border-care-evo-primary text-care-evo-primary hover:bg-care-evo-primary/10",
        };
      default:
        return {
          text: "Voir contrat",
          icon: FileText,
          variant: "outline" as const,
          onClick: handleExistingContractClick,
          disabled: false,
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <>
      <Button
        onClick={buttonConfig.onClick}
        variant={buttonConfig.variant}
        size="default"
        className={`w-full gap-2 ${buttonConfig.className || ""}`}
        style={buttonConfig.style}
        disabled={buttonConfig.disabled || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <buttonConfig.icon className="h-4 w-4" />
        )}
        {buttonConfig.text}
      </Button>

      <ContractPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        conversationId={conversationId}
        listingId={listingId}
        recipientId={recipientId}
        senderId={senderId}
        listingType={listingType}
        userProfession={userProfession}
        onContractPaid={handleContractPaid}
      />

      {contractId && (
        <ContractSigningModal
          isOpen={showSigning}
          onClose={() => setShowSigning(false)}
          contractId={contractId}
        />
      )}
    </>
  );
}
