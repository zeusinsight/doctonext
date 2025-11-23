import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/database/db"
import { blogArticles } from "@/database/schema"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth-utils"
import slugify from "slugify"
import { z } from "zod"
import { getBlogArticlesService } from "@/lib/services/blog-service"

const createBlogSchema = z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    featuredImage: z.string().url().optional(),
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional(),
    tags: z.array(z.string()).default([]),
    isPublished: z.boolean().default(false)
})

// GET /api/blog - Get published articles (public) or all articles (admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "12")
        const search = searchParams.get("search") || undefined
        const category = searchParams.get("category") || undefined
        const includeUnpublished =
            searchParams.get("includeUnpublished") === "true"

        const result = await getBlogArticlesService({
            page,
            limit,
            search,
            category,
            includeUnpublished
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching blog articles:", error)
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        )
    }
}

// POST /api/blog - Create new article (admin only)
export async function POST(request: NextRequest) {
    try {
        const user = await requireAdmin()

        const body = await request.json()
        const validatedData = createBlogSchema.parse(body)

        // Generate slug from title
        const baseSlug = slugify(validatedData.title, {
            lower: true,
            strict: true
        })

        // Ensure slug is unique
        let slug = baseSlug
        let counter = 1
        while (true) {
            const existing = await db
                .select()
                .from(blogArticles)
                .where(eq(blogArticles.slug, slug))
                .limit(1)

            if (existing.length === 0) break

            slug = `${baseSlug}-${counter}`
            counter++
        }

        // Generate excerpt if not provided
        let excerpt = validatedData.excerpt
        if (!excerpt) {
            // Extract first 200 characters of content (stripped of HTML)
            const plainText = validatedData.content.replace(/<[^>]*>/g, "")
            excerpt =
                plainText.substring(0, 200) +
                (plainText.length > 200 ? "..." : "")
        }

        const articleData = {
            id: crypto.randomUUID(),
            title: validatedData.title,
            slug,
            content: validatedData.content,
            excerpt,
            featuredImage: validatedData.featuredImage,
            authorId: user.id,
            isPublished: validatedData.isPublished,
            seoTitle: validatedData.seoTitle || validatedData.title,
            seoDescription: validatedData.seoDescription || excerpt,
            tags: validatedData.tags,
            publishedAt: validatedData.isPublished ? new Date() : null,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const [newArticle] = await db
            .insert(blogArticles)
            .values(articleData)
            .returning()

        return NextResponse.json(newArticle, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error },
                { status: 400 }
            )
        }

        console.error("Error creating blog article:", error)
        return NextResponse.json(
            { error: "Failed to create article" },
            { status: 500 }
        )
    }
}
