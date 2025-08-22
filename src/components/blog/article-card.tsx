import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import Image from "next/image"

interface BlogArticle {
    id: string
    title: string
    slug: string
    excerpt: string | null
    featuredImage: string | null
    publishedAt: Date | null
    tags: string[] | null
    readingTime?: string
}

interface ArticleCardProps {
    article: BlogArticle
    showStatus?: boolean
    isPublished?: boolean
}

export function ArticleCard({ article, showStatus = false, isPublished }: ArticleCardProps) {
    const publishedDate = article.publishedAt ? new Date(article.publishedAt) : null
    
    return (
        <Card className="group hover:shadow-lg transition-shadow duration-200 py-0 pb-4">
            <Link href={`/blog/${article.slug}`} className="block">
                {article.featuredImage && (
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                        <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                    </div>
                )}
                
                <CardHeader className="pb-3">
                    <div className="space-y-2">
                        {showStatus && (
                            <div className="flex items-center gap-2">
                                <Badge variant={isPublished ? "default" : "secondary"}>
                                    {isPublished ? "Publié" : "Brouillon"}
                                </Badge>
                            </div>
                        )}
                        
                        <h3 className="font-semibold text-lg pt-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {publishedDate && (
                                <span>
                                    {formatDistanceToNow(publishedDate, { 
                                        addSuffix: true, 
                                        locale: fr 
                                    })}
                                </span>
                            )}
                            {article.readingTime && (
                                <span>{article.readingTime}</span>
                            )}
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                    {article.excerpt && (
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                            {article.excerpt}
                        </p>
                    )}
                    
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {article.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{article.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Link>
        </Card>
    )
}