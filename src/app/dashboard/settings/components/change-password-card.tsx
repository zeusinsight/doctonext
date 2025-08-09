"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { RiLoader4Line, RiEyeLine, RiEyeOffLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

interface ChangePasswordCardProps {
    className?: string
}

export function ChangePasswordCard({ className }: ChangePasswordCardProps) {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [revokeOtherSessions, setRevokeOtherSessions] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const isPasswordValid = (password: string) => {
        return password.length >= 8
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!currentPassword) {
            toast.error("Veuillez entrer votre mot de passe actuel")
            return
        }

        if (!newPassword) {
            toast.error("Veuillez entrer un nouveau mot de passe")
            return
        }

        if (!isPasswordValid(newPassword)) {
            toast.error("Le nouveau mot de passe doit contenir au moins 8 caractères")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas")
            return
        }

        if (currentPassword === newPassword) {
            toast.error("Le nouveau mot de passe doit être différent de l'ancien")
            return
        }

        setIsLoading(true)

        try {
            await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions
            })
            
            // Reset form
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            
            toast.success(
                revokeOtherSessions 
                    ? "Mot de passe modifié avec succès. Toutes les autres sessions ont été révoquées."
                    : "Mot de passe modifié avec succès"
            )
        } catch (error: any) {
            console.error("Error changing password:", error)
            
            if (error.message?.includes("current password")) {
                toast.error("Le mot de passe actuel est incorrect")
            } else if (error.message?.includes("fresh session")) {
                toast.error("Veuillez vous reconnecter pour changer votre mot de passe")
            } else {
                toast.error("Erreur lors du changement de mot de passe")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
    }

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Mot de passe</CardTitle>
                <CardDescription>
                    Modifiez votre mot de passe. Le nouveau mot de passe doit contenir au moins 8 caractères.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Mot de passe actuel</Label>
                        <div className="relative">
                            <Input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Entrez votre mot de passe actuel"
                                disabled={isLoading}
                                className="max-w-md pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                disabled={isLoading}
                            >
                                {showCurrentPassword ? (
                                    <RiEyeOffLine className="w-4 h-4" />
                                ) : (
                                    <RiEyeLine className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-password">Nouveau mot de passe</Label>
                        <div className="relative">
                            <Input
                                id="new-password"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Entrez votre nouveau mot de passe"
                                disabled={isLoading}
                                className="max-w-md pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                disabled={isLoading}
                            >
                                {showNewPassword ? (
                                    <RiEyeOffLine className="w-4 h-4" />
                                ) : (
                                    <RiEyeLine className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        {newPassword && !isPasswordValid(newPassword) && (
                            <p className="text-sm text-red-600">
                                Le mot de passe doit contenir au moins 8 caractères
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                        <div className="relative">
                            <Input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirmez votre nouveau mot de passe"
                                disabled={isLoading}
                                className="max-w-md pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <RiEyeOffLine className="w-4 h-4" />
                                ) : (
                                    <RiEyeLine className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-sm text-red-600">
                                Les mots de passe ne correspondent pas
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="revoke-sessions"
                            checked={revokeOtherSessions}
                            onCheckedChange={(checked) => setRevokeOtherSessions(!!checked)}
                            disabled={isLoading}
                        />
                        <Label htmlFor="revoke-sessions" className="text-sm font-normal">
                            Déconnecter tous les autres appareils après le changement
                        </Label>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={
                                isLoading || 
                                !currentPassword || 
                                !newPassword || 
                                !confirmPassword ||
                                !isPasswordValid(newPassword) ||
                                newPassword !== confirmPassword ||
                                currentPassword === newPassword
                            }
                        >
                            {isLoading && <RiLoader4Line className="w-4 h-4 mr-2 animate-spin" />}
                            {isLoading ? "Modification..." : "Changer le mot de passe"}
                        </Button>
                        
                        {(currentPassword || newPassword || confirmPassword) && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                                disabled={isLoading}
                            >
                                Annuler
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}