import { NextRequest, NextResponse } from "next/server"
import { db } from "@/database/db"
import { blogArticles } from "@/database/schema"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth-utils"
import slugify from "slugify"
import { z } from "zod"

const updateBlogSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    excerpt: z.string().optional(),
    featuredImage: z.string().url().optional(),
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional()
})

// GET /api/admin/blog/[id] - Get article by ID (admin only)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()
        
        const { id } = await params
        
        const [article] = await db
            .select()
            .from(blogArticles)
            .where(eq(blogArticles.id, id))
            .limit(1)
        
        if (!article) {
            return NextResponse.json(
                { error: "Article not found" },
                { status: 404 }
            )
        }
        
        return NextResponse.json(article)
        
    } catch (error) {
        console.error("Error fetching blog article:", error)
        return NextResponse.json(
            { error: "Failed to fetch article" },
            { status: 500 }
        )
    }
}

// PUT /api/admin/blog/[id] - Update article (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()
        
        const { id } = await params
        const body = await request.json()
        const validatedData = updateBlogSchema.parse(body)
        
        // Check if article exists
        const [existingArticle] = await db
            .select()
            .from(blogArticles)
            .where(eq(blogArticles.id, id))
            .limit(1)
        
        if (!existingArticle) {
            return NextResponse.json(
                { error: "Article not found" },
                { status: 404 }
            )
        }
        
        // Prepare update data
        const updateData: any = {
            updatedAt: new Date()
        }
        
        // Handle title change (regenerate slug)
        if (validatedData.title && validatedData.title !== existingArticle.title) {
            const baseSlug = slugify(validatedData.title, { 
                lower: true, 
                strict: true 
            })
            
            // Ensure slug is unique (excluding current article)
            let slug = baseSlug
            let counter = 1
            while (true) {
                const existing = await db
                    .select()
                    .from(blogArticles)
                    .where(eq(blogArticles.slug, slug))
                    .limit(1)
                
                if (existing.length === 0 || existing[0].id === id) break
                
                slug = `${baseSlug}-${counter}`
                counter++
            }
            
            updateData.title = validatedData.title
            updateData.slug = slug
        }
        
        // Handle other fields
        if (validatedData.content !== undefined) {
            updateData.content = validatedData.content
            
            // Auto-generate excerpt if not provided and content changed
            if (!validatedData.excerpt) {
                const plainText = validatedData.content.replace(/<[^>]*>/g, '')
                updateData.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '')
            }
        }
        
        if (validatedData.excerpt !== undefined) updateData.excerpt = validatedData.excerpt
        if (validatedData.featuredImage !== undefined) updateData.featuredImage = validatedData.featuredImage
        if (validatedData.seoTitle !== undefined) updateData.seoTitle = validatedData.seoTitle
        if (validatedData.seoDescription !== undefined) updateData.seoDescription = validatedData.seoDescription
        if (validatedData.tags !== undefined) updateData.tags = validatedData.tags
        
        // Handle publishing status
        if (validatedData.isPublished !== undefined) {
            updateData.isPublished = validatedData.isPublished
            
            // Set publishedAt date when publishing for the first time
            if (validatedData.isPublished && !existingArticle.publishedAt) {
                updateData.publishedAt = new Date()
            }
            
            // Clear publishedAt when unpublishing
            if (!validatedData.isPublished) {
                updateData.publishedAt = null
            }
        }
        
        const [updatedArticle] = await db
            .update(blogArticles)
            .set(updateData)
            .where(eq(blogArticles.id, id))
            .returning()
        
        return NextResponse.json(updatedArticle)
        
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error },
                { status: 400 }
            )
        }
        
        console.error("Error updating blog article:", error)
        return NextResponse.json(
            { error: "Failed to update article" },
            { status: 500 }
        )
    }
}

// DELETE /api/admin/blog/[id] - Delete article (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()
        
        const { id } = await params
        
        // Check if article exists
        const [existingArticle] = await db
            .select()
            .from(blogArticles)
            .where(eq(blogArticles.id, id))
            .limit(1)
        
        if (!existingArticle) {
            return NextResponse.json(
                { error: "Article not found" },
                { status: 404 }
            )
        }
        
        await db
            .delete(blogArticles)
            .where(eq(blogArticles.id, id))
        
        return NextResponse.json({ message: "Article deleted successfully" })
        
    } catch (error) {
        console.error("Error deleting blog article:", error)
        return NextResponse.json(
            { error: "Failed to delete article" },
            { status: 500 }
        )
    }
}