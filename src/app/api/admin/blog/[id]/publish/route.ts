import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/database/db"
import { blogArticles } from "@/database/schema"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/auth-utils"
import { z } from "zod"

const publishSchema = z.object({
    isPublished: z.boolean()
})

// PATCH /api/admin/blog/[id]/publish - Publish/unpublish article (admin only)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()

        const { id } = await params
        const body = await request.json()
        const { isPublished } = publishSchema.parse(body)

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
            isPublished,
            updatedAt: new Date()
        }

        // Set publishedAt date when publishing for the first time
        if (isPublished && !existingArticle.publishedAt) {
            updateData.publishedAt = new Date()
        }

        // Clear publishedAt when unpublishing
        if (!isPublished) {
            updateData.publishedAt = null
        }

        const [updatedArticle] = await db
            .update(blogArticles)
            .set(updateData)
            .where(eq(blogArticles.id, id))
            .returning()

        return NextResponse.json({
            message: isPublished
                ? "Article published successfully"
                : "Article unpublished successfully",
            article: updatedArticle
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: error },
                { status: 400 }
            )
        }

        console.error("Error updating article publish status:", error)
        return NextResponse.json(
            { error: "Failed to update article status" },
            { status: 500 }
        )
    }
}
