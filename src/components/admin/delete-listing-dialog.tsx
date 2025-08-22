"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, DeleteIcon } from "lucide-react";

interface DeleteListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listingTitle: string;
  listingId: string;
  userName: string;
  loading?: boolean;
}

export function DeleteListingDialog({
  isOpen,
  onClose,
  onConfirm,
  listingTitle,
  listingId,
  userName,
  loading = false,
}: DeleteListingDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [step, setStep] = useState(1);

  const expectedConfirmation = "SUPPRIMER";
  const isConfirmationValid = confirmationText === expectedConfirmation;

  const handleClose = () => {
    setStep(1);
    setConfirmationText("");
    onClose();
  };

  const handleFirstConfirm = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && isConfirmationValid) {
      onConfirm();
    }
  };

  const handleBack = () => {
    setStep(1);
    setConfirmationText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DeleteIcon className="w-5 h-5 text-red-500" />
            {step === 1 ? "Supprimer l&apos;annonce" : "Confirmation finale"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? (
              "Vous êtes sur le point de supprimer définitivement cette annonce."
            ) : (
              "Cette action est irréversible. Veuillez confirmer en tapant le mot demandé."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="space-y-2">
                  <div>
                    <strong>Titre :</strong> {listingTitle}
                  </div>
                  <div>
                    <strong>ID :</strong> <code className="text-xs">{listingId}</code>
                  </div>
                  <div>
                    <strong>Propriétaire :</strong> {userName}
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800 mb-1">
                      Attention : Suppression définitive
                    </p>
                    <p className="text-red-700">
                      Cette annonce sera supprimée de manière permanente de la base de données.
                      Cette action ne peut pas être annulée.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Pour confirmer la suppression, tapez <strong>{expectedConfirmation}</strong> dans le champ ci-dessous :
                </p>
                <div className="space-y-2">
                  <Label htmlFor="confirmation">Confirmation</Label>
                  <Input
                    id="confirmation"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value.toUpperCase())}
                    placeholder={`Tapez "${expectedConfirmation}"`}
                    className="text-center font-mono"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button onClick={handleFirstConfirm} variant="destructive">
                Continuer
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleBack}>
                Retour
              </Button>
              <Button
                onClick={handleFirstConfirm}
                disabled={!isConfirmationValid || loading}
                variant="destructive"
              >
                {loading ? "Suppression..." : "Supprimer définitivement"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}