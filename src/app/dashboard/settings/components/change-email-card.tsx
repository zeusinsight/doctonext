"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { RiLoader4Line, RiCheckLine, RiAlertLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

interface ChangeEmailCardProps {
    className?: string
}

export function ChangeEmailCard({ className }: ChangeEmailCardProps) {
    const { data: session } = authClient.useSession()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [pendingEmail, setPendingEmail] = useState<string | null>(null)

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!email.trim()) {
            toast.error("L'adresse email ne peut pas être vide")
            return
        }

        if (!isValidEmail(email)) {
            toast.error("Veuillez entrer une adresse email valide")
            return
        }

        if (email === session?.user?.email) {
            toast.error("Cette adresse email est déjà associée à votre compte")
            return
        }

        setIsLoading(true)

        try {
            await authClient.changeEmail({
                newEmail: email.trim(),
                callbackURL: "/dashboard/settings"
            })
            
            setPendingEmail(email.trim())
            setEmail("")
            toast.success("Email de vérification envoyé à votre nouvelle adresse")
        } catch (error: any) {
            console.error("Error changing email:", error)
            if (error.message?.includes("already exists")) {
                toast.error("Cette adresse email est déjà utilisée par un autre compte")
            } else {
                toast.error("Erreur lors du changement d'email")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendVerification = async () => {
        if (!pendingEmail) return

        setIsLoading(true)
        try {
            await authClient.changeEmail({
                newEmail: pendingEmail,
                callbackURL: "/dashboard/settings"
            })
            toast.success("Email de vérification renvoyé")
        } catch (error) {
            toast.error("Erreur lors de l'envoi de l'email")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Adresse email</CardTitle>
                <CardDescription>
                    Modifiez votre adresse email. Un email de vérification sera envoyé à votre nouvelle adresse.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <Label className="text-sm font-medium">Email actuel</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">{session?.user?.email}</span>
                            {session?.user?.emailVerified ? (
                                <Badge variant="secondary" className="text-green-700 bg-green-50">
                                    <RiCheckLine className="w-3 h-3 mr-1" />
                                    Vérifié
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-amber-700 bg-amber-50">
                                    <RiAlertLine className="w-3 h-3 mr-1" />
                                    Non vérifié
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {pendingEmail && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <RiAlertLine className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                                Changement d'email en attente
                            </span>
                        </div>
                        <p className="text-sm text-blue-700 mb-3">
                            Un email de vérification a été envoyé à <strong>{pendingEmail}</strong>. 
                            Cliquez sur le lien dans l'email pour confirmer le changement.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleResendVerification}
                            disabled={isLoading}
                        >
                            Renvoyer l'email
                        </Button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-email">Nouvelle adresse email</Label>
                        <Input
                            id="new-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nouvelle@email.com"
                            disabled={isLoading}
                            className="max-w-md"
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={isLoading || !email.trim() || !isValidEmail(email) || email === session?.user?.email}
                        >
                            {isLoading && <RiLoader4Line className="w-4 h-4 mr-2 animate-spin" />}
                            {isLoading ? "Envoi..." : "Changer l'email"}
                        </Button>
                        
                        {email && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEmail("")}
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