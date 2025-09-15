"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { RiUploadLine, RiLoader4Line } from "@remixicon/react"
import { cn } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"

interface UpdateAvatarCardProps {
    className?: string
}

export function UpdateAvatarCard({ className }: UpdateAvatarCardProps) {
    const { data: session } = authClient.useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const { startUpload, isUploading } = useUploadThing("avatarUploader", {
        onClientUploadComplete: (res) => {
            if (res?.[0]?.ufsUrl) {
                handleAvatarUpdate(res[0].ufsUrl)
            }
        },
        onUploadError: (error: Error) => {
            toast.error(`Erreur lors du téléchargement: ${error.message}`)
            setIsLoading(false)
        }
    })

    const handleAvatarUpdate = async (avatarUrl: string) => {
        try {
            await authClient.updateUser({
                image: avatarUrl
            })
            setPreviewUrl(avatarUrl)
            toast.success("Photo de profil mise à jour avec succès")
        } catch (error) {
            console.error("Error updating avatar:", error)
            toast.error("Erreur lors de la mise à jour de la photo de profil")
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Veuillez sélectionner une image valide")
            return
        }

        // Validate file size (max 4MB to match UploadThing config)
        if (file.size > 4 * 1024 * 1024) {
            toast.error("L'image ne doit pas dépasser 4 MB")
            return
        }

        setIsLoading(true)

        // Create preview URL
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)

        try {
            await startUpload([file])
        } catch (error) {
            console.error("Error starting upload:", error)
            toast.error("Erreur lors du téléchargement")
            setPreviewUrl(null)
            setIsLoading(false)
        }
    }

    const userInitials =
        session?.user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U"

    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle>Photo de profil</CardTitle>
                <CardDescription>
                    Modifiez votre photo de profil. Formats acceptés : JPG, PNG.
                    Taille max : 5 MB.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage
                            src={previewUrl || session?.user?.image || ""}
                            alt={session?.user?.name || "Avatar"}
                        />
                        <AvatarFallback className="text-lg">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <Label
                            htmlFor="avatar-upload"
                            className="cursor-pointer"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading || isUploading}
                                className="w-full sm:w-auto"
                                asChild
                            >
                                <span>
                                    {isLoading || isUploading ? (
                                        <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <RiUploadLine className="mr-2 h-4 w-4" />
                                    )}
                                    {isLoading || isUploading
                                        ? "Téléchargement..."
                                        : "Choisir une photo"}
                                </span>
                            </Button>
                        </Label>
                        <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isLoading || isUploading}
                            className="sr-only"
                        />

                        {session?.user?.image && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="mt-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                disabled={isLoading || isUploading}
                                onClick={async () => {
                                    setIsLoading(true)
                                    try {
                                        await authClient.updateUser({
                                            image: ""
                                        })
                                        setPreviewUrl(null)
                                        toast.success(
                                            "Photo de profil supprimée"
                                        )
                                    } catch (error) {
                                        toast.error(
                                            "Erreur lors de la suppression"
                                        )
                                    } finally {
                                        setIsLoading(false)
                                    }
                                }}
                            >
                                Supprimer la photo
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
