import { NextRequest, NextResponse } from "next/server"
import { db } from "@/database/db"
import { blogArticles } from "@/database/schema"
import { eq, desc, and, ilike, or, sql } from "drizzle-orm"
import { getCurrentUser, requireAdmin } from "@/lib/auth-utils"
import slugify from "slugify"
import readingTime from "reading-time"
import { z } from "zod"

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
        const search = searchParams.get("search")
        const category = searchParams.get("category")
        const includeUnpublished = searchParams.get("includeUnpublished") === "true"
        
        const offset = (page - 1) * limit
        
        // Check if user is admin for unpublished content
        const user = await getCurrentUser()
        const isAdmin = (user as any)?.role === "admin"
        
        let conditions = []
        
        // Only show published articles unless user is admin and specifically requests unpublished
        if (!includeUnpublished) {
            conditions.push(eq(blogArticles.isPublished, true))
        } else if (!isAdmin) {
            // Non-admin users can never see unpublished articles
            conditions.push(eq(blogArticles.isPublished, true))
        }
        // If includeUnpublished is true AND user is admin, show all articles (no filter)
        
        // Search functionality
        if (search) {
            conditions.push(
                or(
                    ilike(blogArticles.title, `%${search}%`),
                    ilike(blogArticles.content, `%${search}%`),
                    ilike(blogArticles.excerpt, `%${search}%`)
                )
            )
        }
        
        // Category filtering (using tags)
        if (category) {
            // Use SQL array contains operator for PostgreSQL
            conditions.push(sql`${blogArticles.tags} @> ARRAY[${category}]::text[]`)
        }
        
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        
        const articles = await db
            .select()
            .from(blogArticles)
            .where(whereClause)
            .orderBy(desc(blogArticles.publishedAt), desc(blogArticles.createdAt))
            .limit(limit)
            .offset(offset)
        
        // Get total count for pagination
        const totalResult = await db
            .select({ count: blogArticles.id })
            .from(blogArticles)
            .where(whereClause)
        
        const total = totalResult.length
        const totalPages = Math.ceil(total / limit)
        
        // Add reading time to articles and transform field names
        const articlesWithReadingTime = articles.map(article => ({
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
        
        return NextResponse.json({
            articles: articlesWithReadingTime,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        })
        
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
            const plainText = validatedData.content.replace(/<[^>]*>/g, '')
            excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '')
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