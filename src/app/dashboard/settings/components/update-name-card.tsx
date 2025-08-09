"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { RiLoader4Line } from "@remixicon/react"
import { cn } from "@/lib/utils"

interface UpdateNameCardProps {
    className?: string
}

export function UpdateNameCard({ className }: UpdateNameCardProps) {
    const { data: session } = authClient.useSession()
    const [name, setName] = useState(session?.user?.name || "")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!name.trim()) {
            toast.error("Le nom ne peut pas être vide")
            return
        }

        if (name === session?.user?.name) {
            toast.error("Le nom n'a pas été modifié")
            return
        }

        setIsLoading(true)

        try {
            await authClient.updateUser({
                name: name.trim()
            })
            
            toast.success("Nom mis à jour avec succès")
        } catch (error) {
            console.error("Error updating name:", error)
            toast.error("Erreur lors de la mise à jour du nom")
            // Reset to original name on error
            setName(session?.user?.name || "")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Nom complet</CardTitle>
                <CardDescription>
                    Modifiez votre nom complet. Ce nom sera affiché sur votre profil.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Entrez votre nom complet"
                            disabled={isLoading}
                            className="max-w-md"
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={isLoading || !name.trim() || name === session?.user?.name}
                        >
                            {isLoading && <RiLoader4Line className="w-4 h-4 mr-2 animate-spin" />}
                            {isLoading ? "Mise à jour..." : "Mettre à jour"}
                        </Button>
                        
                        {name !== session?.user?.name && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setName(session?.user?.name || "")}
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