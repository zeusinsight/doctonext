"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
    ArrowLeft,
    ArrowRight,
    Upload,
    X,
    FileText,
    Loader2
} from "lucide-react"
import type { MediaUploadData } from "@/types/listing"
import { useUploadThing } from "@/lib/uploadthing"
import { toast } from "sonner"

interface MediaUploadStepProps {
    data?: MediaUploadData
    onDataChange: (data: MediaUploadData) => void
    onNext: () => void
    onPrevious: () => void
}

export function MediaUploadStep({
    data,
    onDataChange,
    onNext,
    onPrevious
}: MediaUploadStepProps) {
    const [files, setFiles] = useState<
        Array<{
            url: string
            name: string
            type: string
            size: number
        }>
    >(data?.files || [])
    const [isUploading, setIsUploading] = useState(false)

    const { startUpload, isUploading: uploadThingUploading } = useUploadThing(
        "listingMediaUploader",
        {
            onClientUploadComplete: (res) => {
                const newFiles = res.map((file) => ({
                    url: file.ufsUrl || file.url,
                    name: file.name,
                    type: file.type || "",
                    size: file.size
                }))

                const updatedFiles = [...files, ...newFiles]
                setFiles(updatedFiles)
                onDataChange({ files: updatedFiles })
                setIsUploading(false)
                toast.success(
                    `${res.length} fichier(s) téléchargé(s) avec succès`
                )
            },
            onUploadError: (error) => {
                console.error("Upload error:", error)
                setIsUploading(false)
                toast.error("Erreur lors du téléchargement")
            }
        }
    )

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])

        if (selectedFiles.length > 0) {
            setIsUploading(true)
            await startUpload(selectedFiles)
        }

        // Clear the input
        e.target.value = ""
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const droppedFiles = Array.from(e.dataTransfer.files)

        if (droppedFiles.length > 0) {
            setIsUploading(true)
            await startUpload(droppedFiles)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const triggerFileSelect = () => {
        document.getElementById("file-upload")?.click()
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg">Photos et documents</h3>
                <p className="text-muted-foreground">
                    Ajoutez des photos de votre cabinet et des documents utiles
                    (optionnel)
                </p>
            </div>

            {/* File Upload Area */}
            <Card
                className="cursor-pointer border-2 border-muted-foreground/25 border-dashed transition-colors hover:border-muted-foreground/50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={triggerFileSelect}
            >
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="rounded-full p-4">
                            {isUploading || uploadThingUploading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            ) : (
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            {isUploading || uploadThingUploading ? (
                                <>
                                    <p className="font-medium text-lg">
                                        Téléchargement en cours...
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Veuillez patienter
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="font-medium text-lg">
                                        Glissez vos fichiers ici
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        ou cliquez pour sélectionner des
                                        fichiers
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="text-muted-foreground text-xs">
                            Formats acceptés: JPG, PNG, PDF • Taille max: 10MB
                            par fichier
                        </div>
                        <Button
                            variant="outline"
                            type="button"
                            disabled={isUploading || uploadThingUploading}
                            onClick={(e) => {
                                e.stopPropagation()
                                triggerFileSelect()
                            }}
                        >
                            {isUploading || uploadThingUploading
                                ? "Téléchargement..."
                                : "Choisir des fichiers"}
                        </Button>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading || uploadThingUploading}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Media Grid */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <Label>Fichiers téléchargés ({files.length})</Label>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden"
                            >
                                <div className="relative aspect-square">
                                    {file.type.startsWith("image/") ? (
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="h-full w-full rounded-md object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-muted-foreground/25 border-dashed">
                                            <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
                                            <p className="px-2 text-center text-muted-foreground text-xs">
                                                {file.name}
                                            </p>
                                        </div>
                                    )}

                                    {/* Overlay with file info */}
                                    <div className="absolute inset-0 flex items-end rounded-md bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                        <div className="w-full p-2 text-white">
                                            <p className="truncate font-medium text-xs">
                                                {file.name}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Remove button */}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Guidelines */}
            <Card className="border-2">
                <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                        <p className="font-medium">
                            Conseils pour de meilleures photos :
                        </p>
                        <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                            <li>
                                Prenez des photos bien éclairées de votre
                                cabinet
                            </li>
                            <li>
                                Incluez la salle d'attente, les consultations,
                                l'accueil
                            </li>
                            <li>Évitez les photos floues ou sombres</li>
                            <li>
                                Les documents peuvent inclure : diplômes,
                                certifications, plan du cabinet
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                </Button>
                <Button type="button" onClick={onNext}>
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
