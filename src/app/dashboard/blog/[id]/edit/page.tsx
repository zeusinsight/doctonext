"use client";

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArticleEditor } from "@/components/blog/article-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, Eye, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";

interface EditArticlePageProps {
    params: Promise<{
        id: string
    }>
}

interface BlogArticle {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    featuredImage: string | null
    isPublished: boolean
    seoTitle: string | null
    seoDescription: string | null
    tags: string[] | null
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

interface ArticleForm {
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

export default function EditBlogArticlePage({ params }: EditArticlePageProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isLoading, setIsLoading] = useState(true)
    const [article, setArticle] = useState<BlogArticle | null>(null)
    const [newTag, setNewTag] = useState("")
    const [isImageUploading, setIsImageUploading] = useState(false)
    const [articleId, setArticleId] = useState<string>("")
    
    const [form, setForm] = useState<ArticleForm>({
        title: "",
        content: "",
        excerpt: "",
        featuredImage: "",
        seoTitle: "",
        seoDescription: "",
        tags: [],
        isPublished: false
    })

    // Resolve params promise
    useEffect(() => {
        params.then(resolvedParams => {
            setArticleId(resolvedParams.id)
        })
    }, [params])

    // Load article data
    useEffect(() => {
        if (!articleId) return
        async function loadArticle() {
            try {
                const response = await fetch(`/api/admin/blog/${articleId}`)
                if (!response.ok) {
                    throw new Error("Article not found")
                }
                
                const articleData = await response.json()
                setArticle(articleData)
                
                setForm({
                    title: articleData.title,
                    content: articleData.content,
                    excerpt: articleData.excerpt || "",
                    featuredImage: articleData.featuredImage || "",
                    seoTitle: articleData.seoTitle || "",
                    seoDescription: articleData.seoDescription || "",
                    tags: articleData.tags || [],
                    isPublished: articleData.isPublished
                })
            } catch (error) {
                console.error("Error loading article:", error)
                toast.error("Erreur lors du chargement de l&apos;article")
                router.push("/dashboard/blog")
            } finally {
                setIsLoading(false)
            }
        }

        loadArticle()
    }, [articleId, router])

    const updateForm = (field: keyof ArticleForm, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim().toLowerCase()
        if (trimmedTag && !form.tags.includes(trimmedTag)) {
            updateForm("tags", [...form.tags, trimmedTag])
        }
        setNewTag("")
    }

    const removeTag = (tagToRemove: string) => {
        updateForm("tags", form.tags.filter(tag => tag !== tagToRemove))
    }

    const handleSave = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            toast.error("Le titre et le contenu sont obligatoires")
            return
        }

        startTransition(async () => {
            try {
                const response = await fetch(`/api/admin/blog/${articleId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...form,
                        seoTitle: form.seoTitle || form.title,
                        seoDescription: form.seoDescription || form.excerpt
                    })
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.error || "Erreur lors de la sauvegarde")
                }

                const updatedArticle = await response.json()
                setArticle(updatedArticle)
                
                toast.success("Article sauvegardé avec succès")
            } catch (error) {
                console.error("Error saving article:", error)
                toast.error(error instanceof Error ? error.message : "Erreur lors de la sauvegarde")
            }
        })
    }

    const handlePublish = async (publish: boolean) => {
        startTransition(async () => {
            try {
                const response = await fetch(`/api/admin/blog/${articleId}/publish`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ isPublished: publish })
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.error || "Erreur lors de la publication")
                }

                const result = await response.json()
                setArticle(result.article)
                updateForm("isPublished", publish)
                
                toast.success(result.message)
            } catch (error) {
                console.error("Error publishing article:", error)
                toast.error(error instanceof Error ? error.message : "Erreur lors de la publication")
            }
        })
    }

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                const response = await fetch(`/api/admin/blog/${articleId}`, {
                    method: "DELETE"
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.error || "Erreur lors de la suppression")
                }

                toast.success("Article supprimé avec succès")
                router.push("/dashboard/blog")
            } catch (error) {
                console.error("Error deleting article:", error)
                toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression")
            }
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground text-white">Chargement de l&apos;article...</p>
                </div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
                <Link href="/dashboard/blog">
                    <Button>Retour au blog</Button>
                </Link>
            </div>
        )
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
                        <h1 className="text-2xl font-bold text-white">Modifier l&apos;article</h1>
                        <p className="text-muted-foreground text-white">
                            Créé le {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                            {article.publishedAt && (
                                <span> • Publié le {new Date(article.publishedAt).toLocaleDateString("fr-FR")}</span>
                            )}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <Link href={`/blog/${article.slug}`} target="_blank">
                        <Button variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={handleSave}
                        disabled={isPending}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                    </Button>
                    <Button
                        onClick={() => handlePublish(!form.isPublished)}
                        disabled={isPending}
                    >
                        {form.isPublished ? "Dépublier" : "Publier"}
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer l&apos;article</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Supprimer
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Contenu de l&apos;article</CardTitle>
                                <Badge variant={form.isPublished ? "default" : "secondary"}>
                                    {form.isPublished ? "Publié" : "Brouillon"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Titre *</Label>
                                <Input
                                    id="title"
                                    value={form.title}
                                    onChange={(e) => updateForm("title", e.target.value)}
                                    placeholder="Titre de votre article"
                                    className="text-lg"
                                />
                            </div>

                            <div>
                                <Label htmlFor="excerpt">Extrait</Label>
                                <Textarea
                                    id="excerpt"
                                    value={form.excerpt}
                                    onChange={(e) => updateForm("excerpt", e.target.value)}
                                    placeholder="Résumé court de votre article (optionnel)"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>Contenu *</Label>
                                <ArticleEditor
                                    content={form.content}
                                    onChange={(content) => updateForm("content", content)}
                                    placeholder="Rédigez le contenu de votre article..."
                                    className="mt-2"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Same as new article page */}
                <div className="space-y-6">
                    {/* Publication Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Publication</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="publish">Article publié</Label>
                                <Switch
                                    id="publish"
                                    checked={form.isPublished}
                                    onCheckedChange={(checked) => handlePublish(checked)}
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
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => updateForm("featuredImage", "")}
                                        className="w-full"
                                    >
                                        Supprimer l&apos;image
                                    </Button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                                                Ajouter une image à la une
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG jusqu&apos;à 10MB
                                            </p>
                                        </div>
                                        <UploadButton<OurFileRouter, "blogImageUploader">
                                            endpoint="blogImageUploader"
                                            onUploadBegin={() => {
                                                setIsImageUploading(true)
                                            }}
                                            onClientUploadComplete={(res) => {
                                                setIsImageUploading(false)
                                                updateForm("featuredImage", res[0]?.ufsUrl || "")
                                                toast.success("Image téléchargée !")
                                            }}
                                            onUploadError={(error) => {
                                                setIsImageUploading(false)
                                                toast.error(`Erreur: ${error.message}`)
                                            }}
                                            appearance={{
                                                button: `${isImageUploading 
                                                    ? "bg-gray-400 cursor-not-allowed" 
                                                    : "bg-blue-600 hover:bg-blue-700"
                                                } text-white px-4 py-2 rounded-md text-sm font-medium transition-colors`,
                                                allowedContent: "hidden",
                                            }}
                                            content={{
                                                button: ({ ready }) => (
                                                    <div className="flex items-center gap-2">
                                                        {isImageUploading ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                Téléchargement...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="w-4 h-4" />
                                                                {ready ? "Choisir un fichier" : "Préparation..."}
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
                                        onChange={(e) => setNewTag(e.target.value)}
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
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {PREDEFINED_TAGS.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant={form.tags.includes(tag) ? "default" : "outline"}
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
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {form.tags.map((tag) => (
                                            <Badge key={tag} variant="default" className="flex gap-1">
                                                {tag}
                                                <button
                                                    onClick={() => removeTag(tag)}
                                                    className="hover:bg-white/20 rounded"
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
                                    onChange={(e) => updateForm("seoTitle", e.target.value)}
                                    placeholder="Titre pour les moteurs de recherche"
                                    maxLength={60}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {form.seoTitle.length}/60 caractères
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="seo-description">Description SEO</Label>
                                <Textarea
                                    id="seo-description"
                                    value={form.seoDescription}
                                    onChange={(e) => updateForm("seoDescription", e.target.value)}
                                    placeholder="Description pour les moteurs de recherche"
                                    rows={3}
                                    maxLength={160}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
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