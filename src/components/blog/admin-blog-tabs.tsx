"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Eye, Edit3 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface BlogArticle {
    id: string
    title: string
    slug: string
    excerpt: string | null
    featuredImage: string | null
    isPublished: boolean
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    tags: string[] | null
    readingTime?: string
}

interface AdminBlogTabsProps {
    allArticles: BlogArticle[]
    publishedArticles: BlogArticle[]
    draftArticles: BlogArticle[]
    stats: {
        total: number
        published: number
        drafts: number
    }
}

export function AdminBlogTabs({
    allArticles,
    publishedArticles,
    draftArticles,
    stats
}: AdminBlogTabsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activeTab = searchParams.get("tab") || "all"

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            params.delete("tab")
        } else {
            params.set("tab", value)
        }
        router.push(`/dashboard/blog?${params.toString()}`)
    }

    return (
        <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-4"
        >
            <TabsList>
                <TabsTrigger value="all">
                    Tous les articles ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="published">
                    Publiés ({stats.published})
                </TabsTrigger>
                <TabsTrigger value="drafts">
                    Brouillons ({stats.drafts})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
                <ArticlesList articles={allArticles} showStatus />
            </TabsContent>

            <TabsContent value="published" className="space-y-4">
                <ArticlesList articles={publishedArticles} showStatus />
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
                <ArticlesList articles={draftArticles} showStatus />
            </TabsContent>
        </Tabs>
    )
}

function ArticlesList({
    articles,
    showStatus
}: {
    articles: BlogArticle[]
    showStatus?: boolean
}) {
    if (articles.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 font-semibold text-lg">
                        Aucun article
                    </h3>
                    <p className="mb-4 text-center text-muted-foreground">
                        Vous n&apos;avez pas encore d&apos;article dans cette
                        catégorie.
                    </p>
                    <Link href="/dashboard/blog/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Créer un article
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {articles.map((article) => (
                <Card key={article.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="mb-2 flex items-center gap-2">
                                <h3 className="truncate font-semibold text-lg">
                                    {article.title}
                                </h3>
                                {showStatus && (
                                    <Badge
                                        variant={
                                            article.isPublished
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {article.isPublished
                                            ? "Publié"
                                            : "Brouillon"}
                                    </Badge>
                                )}
                            </div>

                            {article.excerpt && (
                                <p className="mb-3 line-clamp-2 text-muted-foreground">
                                    {article.excerpt}
                                </p>
                            )}

                            <div className="flex items-center gap-4 text-muted-foreground text-sm">
                                <span>
                                    Créé le{" "}
                                    {new Date(
                                        article.createdAt
                                    ).toLocaleDateString("fr-FR")}
                                </span>
                                {article.publishedAt && (
                                    <span>
                                        Publié le{" "}
                                        {new Date(
                                            article.publishedAt
                                        ).toLocaleDateString("fr-FR")}
                                    </span>
                                )}
                                {article.readingTime && (
                                    <span>{article.readingTime}</span>
                                )}
                            </div>

                            {article.tags && article.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {article.tags.slice(0, 3).map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                    {article.tags.length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +{article.tags.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={`/blog/${article.slug}`}
                                target="_blank"
                            >
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href={`/dashboard/blog/${article.id}/edit`}>
                                <Button variant="outline" size="sm">
                                    <Edit3 className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
