"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArticleEditor } from "@/components/blog/article-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    ArrowLeft,
    Save,
    Eye,
    X,
    Upload,
    Image as ImageIcon
} from "lucide-react"
import { toast } from "sonner"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import Image from "next/image"

interface NewArticleForm {
    title: string
    content: string
    excerpt: string
    featuredImage: string
    seoTitle: string
    seoDescription: string
    tags: string[]
    isPublished: boolean
}

const PREDEFINED_TAGS = [
    "procédures",
    "aide",
    "témoignages",
    "actualités",
    "transfert",
    "remplacement",
    "collaboration",
    "médecin",
    "dentiste",
    "kinésithérapeute",
    "infirmier"
]

export default function NewBlogArticlePage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isPreviewMode, setIsPreviewMode] = useState(false)
    const [newTag, setNewTag] = useState("")
    const [isImageUploading, setIsImageUploading] = useState(false)

    const [form, setForm] = useState<NewArticleForm>({
        title: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        seoTitle: "",
        seoDescription: "",
        tags: [],
        isPublished: false
    })

    const updateForm = (field: keyof NewArticleForm, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim().toLowerCase()
        if (trimmedTag && !form.tags.includes(trimmedTag)) {
            updateForm("tags", [...form.tags, trimmedTag])
        }
        setNewTag("")
    }

    const removeTag = (tagToRemove: string) => {
        updateForm(
            "tags",
            form.tags.filter((tag) => tag !== tagToRemove)
        )
    }

    const handleSubmit = async (asDraft = false) => {
        if (!form.title.trim() || !form.content.trim()) {
            toast.error("Le titre et le contenu sont obligatoires")
            return
        }

        startTransition(async () => {
            try {
                const response = await fetch("/api/blog", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...form,
                        isPublished: !asDraft && form.isPublished,
                        seoTitle: form.seoTitle || form.title,
                        seoDescription: form.seoDescription || form.excerpt
                    })
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.error || "Erreur lors de la création")
                }

                const article = await response.json()

                toast.success(
                    asDraft
                        ? "Article sauvegardé en brouillon"
                        : form.isPublished
                          ? "Article publié avec succès"
                          : "Article créé"
                )

                router.push(`/dashboard/blog/${article.id}/edit`)
            } catch (error) {
                console.error("Error creating article:", error)
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de la création"
                )
            }
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/blog">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 text-white" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-2xl text-white">
                            Nouvel article
                        </h1>
                        <p className="text-muted-foreground text-white">
                            Créez un nouvel article pour votre blog
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        {isPreviewMode ? "Éditer" : "Aperçu"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit(true)}
                        disabled={isPending}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Brouillon
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={
                            isPending ||
                            !form.title.trim() ||
                            !form.content.trim()
                        }
                    >
                        {form.isPublished ? "Publier" : "Créer"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contenu de l'article</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Titre *</Label>
                                <Input
                                    id="title"
                                    value={form.title}
                                    onChange={(e) =>
                                        updateForm("title", e.target.value)
                                    }
                                    placeholder="Titre de votre article"
                                    className="text-lg"
                                />
                            </div>

                            <div>
                                <Label htmlFor="excerpt">Extrait</Label>
                                <Textarea
                                    id="excerpt"
                                    value={form.excerpt}
                                    onChange={(e) =>
                                        updateForm("excerpt", e.target.value)
                                    }
                                    placeholder="Résumé court de votre article (optionnel)"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>Contenu *</Label>
                                <ArticleEditor
                                    content={form.content}
                                    onChange={(content) =>
                                        updateForm("content", content)
                                    }
                                    placeholder="Rédigez le contenu de votre article..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publication Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Publication</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="publish">
                                    Publier immédiatement
                                </Label>
                                <Switch
                                    id="publish"
                                    checked={form.isPublished}
                                    onCheckedChange={(checked) =>
                                        updateForm("isPublished", checked)
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Featured Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Image à la une</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {form.featuredImage ? (
                                <div className="space-y-2">
                                    <div className="relative aspect-video">
                                        <Image
                                            src={form.featuredImage}
                                            alt="Image à la une"
                                            fill
                                            className="rounded object-cover"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            updateForm("featuredImage", "")
                                        }
                                        className="w-full"
                                    >
                                        Supprimer l&apos;image
                                    </Button>
                                </div>
                            ) : (
                                <div className="rounded-lg border-2 border-gray-300 border-dashed p-6 text-center transition-colors hover:border-gray-400">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                            <ImageIcon className="h-6 w-6 text-gray-500" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 font-medium text-gray-900 text-sm">
                                                Ajouter une image à la une
                                            </h3>
                                            <p className="text-gray-500 text-xs">
                                                PNG, JPG jusqu'à 10MB
                                            </p>
                                        </div>
                                        <UploadButton<
                                            OurFileRouter,
                                            "blogImageUploader"
                                        >
                                            endpoint="blogImageUploader"
                                            onUploadBegin={() => {
                                                setIsImageUploading(true)
                                            }}
                                            onClientUploadComplete={(res) => {
                                                setIsImageUploading(false)
                                                updateForm(
                                                    "featuredImage",
                                                    res[0]?.ufsUrl || ""
                                                )
                                                toast.success(
                                                    "Image téléchargée !"
                                                )
                                            }}
                                            onUploadError={(error) => {
                                                setIsImageUploading(false)
                                                toast.error(
                                                    `Erreur: ${error.message}`
                                                )
                                            }}
                                            appearance={{
                                                button: `${
                                                    isImageUploading
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-blue-600 hover:bg-blue-700"
                                                } text-white px-4 py-2 rounded-md text-sm font-medium transition-colors`,
                                                allowedContent: "hidden"
                                            }}
                                            content={{
                                                button: ({ ready }) => (
                                                    <div className="flex items-center gap-2">
                                                        {isImageUploading ? (
                                                            <>
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                                Téléchargement...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="h-4 w-4" />
                                                                {ready
                                                                    ? "Choisir un fichier"
                                                                    : "Préparation..."}
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="new-tag">Ajouter un tag</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="new-tag"
                                        value={newTag}
                                        onChange={(e) =>
                                            setNewTag(e.target.value)
                                        }
                                        placeholder="Nouveau tag"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                addTag(newTag)
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addTag(newTag)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label>Tags suggérés</Label>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {PREDEFINED_TAGS.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant={
                                                form.tags.includes(tag)
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className="cursor-pointer"
                                            onClick={() => {
                                                if (form.tags.includes(tag)) {
                                                    removeTag(tag)
                                                } else {
                                                    addTag(tag)
                                                }
                                            }}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {form.tags.length > 0 && (
                                <div>
                                    <Label>Tags sélectionnés</Label>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {form.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="default"
                                                className="gap-1"
                                            >
                                                {tag}
                                                <button
                                                    onClick={() =>
                                                        removeTag(tag)
                                                    }
                                                    className="rounded hover:bg-white/20"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* SEO Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="seo-title">Titre SEO</Label>
                                <Input
                                    id="seo-title"
                                    value={form.seoTitle}
                                    onChange={(e) =>
                                        updateForm("seoTitle", e.target.value)
                                    }
                                    placeholder="Titre pour les moteurs de recherche"
                                    maxLength={60}
                                />
                                <p className="mt-1 text-muted-foreground text-xs">
                                    {form.seoTitle.length}/60 caractères
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="seo-description">
                                    Description SEO
                                </Label>
                                <Textarea
                                    id="seo-description"
                                    value={form.seoDescription}
                                    onChange={(e) =>
                                        updateForm(
                                            "seoDescription",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Description pour les moteurs de recherche"
                                    rows={3}
                                    maxLength={160}
                                />
                                <p className="mt-1 text-muted-foreground text-xs">
                                    {form.seoDescription.length}/160 caractères
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
