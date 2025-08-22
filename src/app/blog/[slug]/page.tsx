import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArticleContent } from "@/components/blog/article-content"
import { ArticleCard } from "@/components/blog/article-card";
import { ShareButton } from "@/components/blog/share-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { fr } from "date-fns/locale"

interface BlogArticlePageProps {
    params: Promise<{
        slug: string
    }>
}

interface BlogArticle {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    featuredImage: string | null
    authorId: string | null
    isPublished: boolean
    seoTitle: string | null
    seoDescription: string | null
    tags: string[] | null
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    readingTime?: string
    relatedArticles?: Array<{
        id: string
        title: string
        slug: string
        excerpt: string | null
        featuredImage: string | null
        publishedAt: Date | null
        tags: string[] | null
    }>
}

async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
    try {
        // Import database dependencies
        const { db } = await import("@/database/db")
        const { blogArticles } = await import("@/database/schema")
        const { eq, and, ne } = await import("drizzle-orm")
        const { getCurrentUser } = await import("@/lib/auth-utils")
        const readingTime = (await import("reading-time")).default
        
        const user = await getCurrentUser()
        const isAdmin = (user as any)?.role === "admin"
        
        // Build where conditions
        let conditions = [eq(blogArticles.slug, slug)]
        
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
            return null
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
        
        // Add reading time and related articles
        return {
            ...article,
            readingTime: readingTime(article.content).text,
            relatedArticles
        }
        
    } catch (error) {
        console.error("Error fetching blog article:", error)
        return null
    }
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
    const { slug } = await params
    const article = await getBlogArticle(slug)
    
    if (!article) {
        return {
            title: "Article non trouvé - Doctonext",
            description: "L'article demandé n'existe pas ou n'est plus disponible."
        }
    }
    
    const title = article.seoTitle || article.title
    const description = article.seoDescription || article.excerpt || "Découvrez cet article sur Doctonext"
    
    return {
        title: `${title} - Blog Doctonext`,
        description,
        keywords: article.tags?.join(", "),
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime: article.publishedAt?.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
            images: article.featuredImage ? [
                {
                    url: article.featuredImage,
                    width: 1200,
                    height: 630,
                    alt: article.title
                }
            ] : undefined,
            tags: article.tags || undefined
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: article.featuredImage ? [article.featuredImage] : undefined
        }
    }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
    const { slug } = await params
    const article = await getBlogArticle(slug)
    
    if (!article) {
        notFound()
    }
    
    const publishedDate = article.publishedAt ? new Date(article.publishedAt) : null
    
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <div className="mb-6">
                <Link href="/blog">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour au blog
                    </Button>
                </Link>
            </div>
            
            <div className="max-w-4xl mx-auto">
                {/* Article Header */}
                <header className="mb-8">
                    {/* Article Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        {publishedDate && (
                            <>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {format(publishedDate, "d MMMM yyyy", { locale: fr })}
                                    </span>
                                </div>
                                <span>·</span>
                                <span>
                                    {formatDistanceToNow(publishedDate, { 
                                        addSuffix: true, 
                                        locale: fr 
                                    })}
                                </span>
                            </>
                        )}
                        {article.readingTime && (
                            <>
                                <span>·</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{article.readingTime}</span>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-4xl font-bold mb-4 leading-tight">
                        {article.title}
                    </h1>
                    
                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}
                    
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {article.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    
                    {/* Featured Image */}
                    {article.featuredImage && (
                        <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
                            <Image
                                src={article.featuredImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                    
                    {/* Share Button */}
                    <div className="flex justify-end mb-6">
                        <ShareButton 
                            title={article.title}
                            excerpt={article.excerpt}
                            slug={article.slug}
                        />
                    </div>
                </header>
                
                <Separator className="mb-8" />
                
                {/* Article Content */}
                <main className="mb-12">
                    <ArticleContent content={article.content} />
                </main>
                
                <Separator className="mb-8" />
                
                {/* Related Articles */}
                {article.relatedArticles && article.relatedArticles.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Articles recommandés</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {article.relatedArticles.map((relatedArticle) => (
                                <ArticleCard 
                                    key={relatedArticle.id} 
                                    article={relatedArticle} 
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}