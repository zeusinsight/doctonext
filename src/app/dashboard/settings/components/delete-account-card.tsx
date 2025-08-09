"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { 
    RiLoader4Line, 
    RiAlarmWarningLine,
    RiEyeLine,
    RiEyeOffLine
} from "@remixicon/react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface DeleteAccountCardProps {
    className?: string
}

export function DeleteAccountCard({ className }: DeleteAccountCardProps) {
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const [password, setPassword] = useState("")
    const [confirmText, setConfirmText] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [hasConfirmed, setHasConfirmed] = useState(false)

    const CONFIRMATION_TEXT = "SUPPRIMER MON COMPTE"
    const isOAuthUser = !session?.user?.email || session.user.email.includes("@oauth.")

    const handleDeleteAccount = async () => {
        if (!hasConfirmed) {
            toast.error("Veuillez cocher la case de confirmation")
            return
        }

        if (confirmText !== CONFIRMATION_TEXT) {
            toast.error(`Veuillez taper exactement "${CONFIRMATION_TEXT}"`)
            return
        }

        if (!isOAuthUser && !password) {
            toast.error("Veuillez entrer votre mot de passe")
            return
        }

        setIsLoading(true)

        try {
            const deleteParams: any = {
                callbackURL: "/"
            }

            // Only add password for non-OAuth users
            if (!isOAuthUser) {
                deleteParams.password = password
            }

            await authClient.deleteUser(deleteParams)
            
            toast.success("Compte supprimé avec succès")
            
            // Redirect to home page after successful deletion
            setTimeout(() => {
                router.push("/")
            }, 2000)
            
        } catch (error: any) {
            console.error("Error deleting account:", error)
            
            if (error.message?.includes("password")) {
                toast.error("Mot de passe incorrect")
            } else if (error.message?.includes("fresh session")) {
                toast.error("Veuillez vous reconnecter pour supprimer votre compte")
            } else if (error.message?.includes("verification required")) {
                toast.info("Un email de vérification a été envoyé à votre adresse")
            } else {
                toast.error("Erreur lors de la suppression du compte")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setPassword("")
        setConfirmText("")
        setHasConfirmed(false)
        setShowConfirmation(false)
    }

    if (!showConfirmation) {
        return (
            <Card className={cn(className, "border-red-200")}>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <RiAlarmWarningLine className="w-5 h-5 text-red-500" />
                        <CardTitle className="text-red-900">Supprimer le compte</CardTitle>
                    </div>
                    <CardDescription>
                        Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="text-sm font-medium text-red-900 mb-2">
                                Que va-t-il se passer ?
                            </h4>
                            <ul className="text-sm text-red-700 space-y-1">
                                <li>• Votre compte sera définitivement supprimé</li>
                                <li>• Toutes vos données personnelles seront effacées</li>
                                <li>• Vos sessions actives seront révoquées</li>
                                <li>• Cette action ne peut pas être annulée</li>
                            </ul>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                onClick={() => setShowConfirmation(true)}
                            >
                                Je comprends, supprimer mon compte
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={cn(className, "border-red-200")}>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <RiAlarmWarningLine className="w-5 h-5 text-red-500" />
                    <CardTitle className="text-red-900">Confirmer la suppression</CardTitle>
                </div>
                <CardDescription>
                    Veuillez confirmer que vous souhaitez vraiment supprimer votre compte.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium mb-2">
                        ⚠️ Attention : Cette action est irréversible !
                    </p>
                    <p className="text-sm text-red-700">
                        Une fois supprimé, votre compte et toutes vos données seront définitivement perdus.
                    </p>
                </div>

                <div className="space-y-4">
                    {!isOAuthUser && (
                        <div className="space-y-2">
                            <Label htmlFor="delete-password">
                                Mot de passe actuel <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="delete-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Entrez votre mot de passe"
                                    disabled={isLoading}
                                    className="max-w-md pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <RiEyeOffLine className="w-4 h-4" />
                                    ) : (
                                        <RiEyeLine className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="confirm-text">
                            Pour confirmer, tapez <strong>"{CONFIRMATION_TEXT}"</strong> dans le champ ci-dessous <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="confirm-text"
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder={CONFIRMATION_TEXT}
                            disabled={isLoading}
                            className="max-w-md font-mono"
                        />
                    </div>

                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="confirm-deletion"
                            checked={hasConfirmed}
                            onCheckedChange={(checked) => setHasConfirmed(!!checked)}
                            disabled={isLoading}
                        />
                        <Label htmlFor="confirm-deletion" className="text-sm leading-relaxed">
                            Je comprends que cette action est irréversible et que toutes mes données seront 
                            définitivement supprimées <span className="text-red-500">*</span>
                        </Label>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={
                            isLoading || 
                            (!isOAuthUser && !password) ||
                            confirmText !== CONFIRMATION_TEXT ||
                            !hasConfirmed
                        }
                    >
                        {isLoading && <RiLoader4Line className="w-4 h-4 mr-2 animate-spin" />}
                        {isLoading ? "Suppression..." : "Supprimer définitivement mon compte"}
                    </Button>
                    
                    <Button
                        variant="outline"
                        onClick={resetForm}
                        disabled={isLoading}
                    >
                        Annuler
                    </Button>
                </div>

                {isOAuthUser && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                            <strong>Note :</strong> Un email de vérification peut être requis pour confirmer 
                            la suppression de votre compte connecté via un fournisseur externe.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}