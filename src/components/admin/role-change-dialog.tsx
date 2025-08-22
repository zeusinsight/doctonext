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
import { AlertTriangle, ShieldUser } from "lucide-react";

interface RoleChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
  currentRole: string;
  targetRole: string;
  loading?: boolean;
}

export function RoleChangeDialog({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
  currentRole,
  targetRole,
  loading = false,
}: RoleChangeDialogProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [step, setStep] = useState(1);

  const isPromotingToAdmin = targetRole === "admin";
  const expectedConfirmation = isPromotingToAdmin ? "PROMOUVOIR" : "RETIRER";
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
            {isPromotingToAdmin ? (
              <ShieldUser className="w-5 h-5 text-orange-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
            {step === 1 ? "Confirmation requise" : "Confirmation finale"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? (
              <>
                Vous êtes sur le point de{" "}
                <strong>
                  {isPromotingToAdmin ? "promouvoir" : "rétrograder"}
                </strong>{" "}
                cet utilisateur.
              </>
            ) : (
              "Veuillez confirmer cette action en tapant le mot demandé."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="space-y-2">
                  <div>
                    <strong>Utilisateur :</strong> {userName}
                  </div>
                  <div>
                    <strong>Email :</strong> {userEmail}
                  </div>
                  <div>
                    <strong>Rôle actuel :</strong>{" "}
                    <span className="capitalize">
                      {currentRole === "admin" ? "Administrateur" : "Utilisateur"}
                    </span>
                  </div>
                  <div>
                    <strong>Nouveau rôle :</strong>{" "}
                    <span className="capitalize font-semibold text-orange-600">
                      {targetRole === "admin" ? "Administrateur" : "Utilisateur"}
                    </span>
                  </div>
                </div>
              </div>

              {isPromotingToAdmin && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-orange-800 mb-1">
                        Attention : Privilèges d&apos;administrateur
                      </p>
                      <p className="text-orange-700">
                        Cet utilisateur aura accès à toutes les fonctions administratives,
                        y compris la gestion d&apos;autres utilisateurs.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Pour confirmer, tapez <strong>{expectedConfirmation}</strong> dans le champ ci-dessous :
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
              <Button 
                onClick={handleFirstConfirm}
                variant={isPromotingToAdmin ? "default" : "destructive"}
              >
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
                variant={isPromotingToAdmin ? "default" : "destructive"}
              >
                {loading ? "Traitement..." : "Confirmer"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}