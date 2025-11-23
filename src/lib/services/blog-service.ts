import { db } from "@/database/db"
import { blogArticles } from "@/database/schema"
import { eq, desc, and, ilike, or, sql } from "drizzle-orm"
import { getCurrentUser } from "@/lib/auth-utils"
import readingTime from "reading-time"

export type GetBlogArticlesParams = {
  page?: number
  limit?: number
  search?: string
  category?: string
  includeUnpublished?: boolean
}

export async function getBlogArticlesService({
  page = 1,
  limit = 12,
  search,
  category,
  includeUnpublished = false,
}: GetBlogArticlesParams) {
  const offset = (page - 1) * limit

  // Check if user is admin for unpublished content
  const user = await getCurrentUser()
  const isAdmin = (user as any)?.role === "admin"

  const conditions = []

  // Only show published articles unless user is admin and specifically requests unpublished
  if (!includeUnpublished) {
    conditions.push(eq(blogArticles.isPublished, true))
  } else if (!isAdmin) {
    // Non-admin users can never see unpublished articles
    conditions.push(eq(blogArticles.isPublished, true))
  }

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
    readingTime: readingTime(article.content).text,
  }))

  return {
    articles: articlesWithReadingTime,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}
