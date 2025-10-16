import type { Metadata } from "next"
import Link from "next/link"
import { requireAdmin, getCurrentUser } from "@/lib/auth-utils"
import { AdminBlogTabs } from "@/components/blog/admin-blog-tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, Eye, Edit3 } from "lucide-react"

interface DashboardBlogPageProps {
    searchParams: Promise<{
        tab?: string
    }>
}

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

interface BlogResponse {
    articles: BlogArticle[]
    pagination: {
        total: number
    }
}

async function getBlogArticles(
    includeUnpublished = false
): Promise<BlogResponse> {
    try {
        // Import database dependencies
        const { db } = await import("@/database/db")
        const { blogArticles } = await import("@/database/schema")
        const { eq, desc, and } = await import("drizzle-orm")
        const readingTime = (await import("reading-time")).default

        const conditions = []

        // Only show published articles unless includeUnpublished is true
        if (!includeUnpublished) {
            conditions.push(eq(blogArticles.isPublished, true))
        }
        // If includeUnpublished is true, show all articles (no filter)

        const whereClause =
            conditions.length > 0 ? and(...conditions) : undefined

        const articles = await db
            .select()
            .from(blogArticles)
            .where(whereClause)
            .orderBy(
                desc(blogArticles.publishedAt),
                desc(blogArticles.createdAt)
            )

        // Transform articles with reading time
        const articlesWithReadingTime = articles.map((article) => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            content: article.content,
            excerpt: article.excerpt,
            featuredImage: article.featuredImage,
            authorId: article.authorId,
            isPublished: article.isPublished,
            seoTitle: article.seoTitle,
            seoDescription: article.seoDescription,
            tags: article.tags,
            publishedAt: article.publishedAt,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            readingTime: readingTime(article.content).text
        }))

        return {
            articles: articlesWithReadingTime,
            pagination: { total: articlesWithReadingTime.length }
        }
    } catch (error) {
        console.error("Error fetching blog articles:", error)
        return {
            articles: [],
            pagination: { total: 0 }
        }
    }
}

export const metadata: Metadata = {
    title: "Gestion du Blog - Dashboard Care Evo",
    description:
        "Gérez vos articles de blog, créez du contenu et suivez les performances."
}

export default async function DashboardBlogPage({
    searchParams
}: DashboardBlogPageProps) {
    // Debug: Check current user first
    const currentUser = await getCurrentUser()

    // Require admin access
    await requireAdmin()

    const { articles: allArticles } = await getBlogArticles(true)

    const publishedArticles = allArticles.filter(
        (article) => article.isPublished
    )
    const draftArticles = allArticles.filter((article) => !article.isPublished)

    const stats = {
        total: allArticles.length,
        published: publishedArticles.length,
        drafts: draftArticles.length
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl text-white">
                        Gestion du Blog
                    </h1>
                    <p className="text-muted-foreground text-white">
                        Créez, modifiez et publiez vos articles de blog
                    </p>
                </div>
                <Link href="/dashboard/blog/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nouvel article
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Total des articles
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Articles publiés
                        </CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl text-green-600">
                            {stats.published}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Brouillons
                        </CardTitle>
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl text-orange-600">
                            {stats.drafts}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Articles Tabs */}
            <AdminBlogTabs
                allArticles={allArticles}
                publishedArticles={publishedArticles}
                draftArticles={draftArticles}
                stats={stats}
            />
        </div>
    )
}
