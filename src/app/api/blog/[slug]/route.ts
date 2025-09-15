import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/database/db"
import { blogArticles } from "@/database/schema"
import { eq, and, ne } from "drizzle-orm"
import { getCurrentUser } from "@/lib/auth-utils"
import readingTime from "reading-time"

// GET /api/blog/[slug] - Get single article by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const user = await getCurrentUser()
        const isAdmin = (user as any)?.role === "admin"

        // Build where conditions
        const conditions = [eq(blogArticles.slug, slug)]

        // Only show published articles unless user is admin
        if (!isAdmin) {
            conditions.push(eq(blogArticles.isPublished, true))
        }

        const [article] = await db
            .select()
            .from(blogArticles)
            .where(and(...conditions))
            .limit(1)

        if (!article) {
            return NextResponse.json(
                { error: "Article not found" },
                { status: 404 }
            )
        }

        // Get related articles (same tags, excluding current article)
        const relatedArticles = await db
            .select({
                id: blogArticles.id,
                title: blogArticles.title,
                slug: blogArticles.slug,
                excerpt: blogArticles.excerpt,
                featuredImage: blogArticles.featuredImage,
                publishedAt: blogArticles.publishedAt,
                tags: blogArticles.tags
            })
            .from(blogArticles)
            .where(
                and(
                    eq(blogArticles.isPublished, true),
                    ne(blogArticles.id, article.id)
                )
            )
            .limit(3)

        // Add reading time
        const articleWithReadingTime = {
            ...article,
            readingTime: readingTime(article.content).text,
            relatedArticles
        }

        return NextResponse.json(articleWithReadingTime)
    } catch (error) {
        console.error("Error fetching blog article:", error)
        return NextResponse.json(
            { error: "Failed to fetch article" },
            { status: 500 }
        )
    }
}
