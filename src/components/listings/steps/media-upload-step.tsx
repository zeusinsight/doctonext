"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Upload, X, FileText, Loader2 } from "lucide-react"
import { MediaUploadData } from "@/types/listing"
import { useUploadThing } from "@/lib/uploadthing"
import { toast } from "sonner"

interface MediaUploadStepProps {
    data?: MediaUploadData
    onDataChange: (data: MediaUploadData) => void
    onNext: () => void
    onPrevious: () => void
}

export function MediaUploadStep({ data, onDataChange, onNext, onPrevious }: MediaUploadStepProps) {
    const [files, setFiles] = useState<Array<{
        url: string
        name: string
        type: string
        size: number
    }>>(data?.files || [])
    const [isUploading, setIsUploading] = useState(false)

    const { startUpload, isUploading: uploadThingUploading } = useUploadThing("listingMediaUploader", {
        onClientUploadComplete: (res) => {
            const newFiles = res.map(file => ({
                url: file.ufsUrl || file.url,
                name: file.name,
                type: file.type || "",
                size: file.size
            }))
            
            setFiles(prev => [...prev, ...newFiles])
            setIsUploading(false)
            toast.success(`${res.length} fichier(s) téléchargé(s) avec succès`)
        },
        onUploadError: (error) => {
            console.error("Upload error:", error)
            setIsUploading(false)
            toast.error("Erreur lors du téléchargement")
        },
    })

    const handleDataChange = useCallback((newFiles: Array<{url: string, name: string, type: string, size: number}>) => {
        onDataChange({ files: newFiles })
    }, [onDataChange])

    useEffect(() => {
        handleDataChange(files)
    }, [files, handleDataChange])

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
        document.getElementById('file-upload')?.click()
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }


    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Photos et documents</h3>
                <p className="text-muted-foreground">
                    Ajoutez des photos de votre cabinet et des documents utiles (optionnel)
                </p>
            </div>

            {/* File Upload Area */}
            <Card 
                className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={triggerFileSelect}
            >
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="p-4 rounded-full">
                            {(isUploading || uploadThingUploading) ? (
                                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                            ) : (
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            {(isUploading || uploadThingUploading) ? (
                                <>
                                    <p className="text-lg font-medium">Téléchargement en cours...</p>
                                    <p className="text-sm text-muted-foreground">
                                        Veuillez patienter
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg font-medium">Glissez vos fichiers ici</p>
                                    <p className="text-sm text-muted-foreground">
                                        ou cliquez pour sélectionner des fichiers
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Formats acceptés: JPG, PNG, PDF • Taille max: 10MB par fichier
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
                            {(isUploading || uploadThingUploading) ? "Téléchargement..." : "Choisir des fichiers"}
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {files.map((file, index) => (
                            <div key={index} className="relative group overflow-hidden">
                                <div className="aspect-square relative">
                                    {file.type.startsWith('image/') ? (
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md">
                                            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-xs text-center px-2 text-muted-foreground">
                                                {file.name}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Overlay with file info */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end rounded-md">
                                        <div className="p-2 text-white w-full">
                                            <p className="text-xs font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Remove button */}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    <div className="text-sm space-y-2">
                        <p className="font-medium">Conseils pour de meilleures photos :</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Prenez des photos bien éclairées de votre cabinet</li>
                            <li>Incluez la salle d'attente, les consultations, l'accueil</li>
                            <li>Évitez les photos floues ou sombres</li>
                            <li>Les documents peuvent inclure : diplômes, certifications, plan du cabinet</li>
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