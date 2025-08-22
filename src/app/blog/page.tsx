import { Metadata } from "next"
import { ArticleCard } from "@/components/blog/article-card"
import { BlogFilters } from "@/components/blog/blog-filters"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface BlogPageProps {
    searchParams: Promise<{
        page?: string
        search?: string
        category?: string
    }>
}

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

interface BlogResponse {
    articles: BlogArticle[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }
}

async function getBlogArticles(
    searchParams: Awaited<BlogPageProps["searchParams"]>
): Promise<BlogResponse> {
    const params = new URLSearchParams()
    
    if (searchParams.page) params.set("page", searchParams.page)
    if (searchParams.search) params.set("search", searchParams.search)
    if (searchParams.category) params.set("category", searchParams.category)
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    
    try {
        const response = await fetch(`${baseUrl}/api/blog?${params.toString()}`, {
            next: { revalidate: 300 } // Revalidate every 5 minutes
        })
        
        if (!response.ok) {
            throw new Error("Failed to fetch blog articles")
        }
        
        const data: BlogResponse = await response.json()
        return data
    } catch (error) {
        console.error("Error fetching blog articles:", error)
        return {
            articles: [],
            pagination: {
                page: 1,
                limit: 12,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false
            }
        }
    }
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
    const params = await searchParams
    const baseTitle = "Blog - Doctonext"
    const baseDescription = "Découvrez nos articles sur les transferts de patientèle, remplacements et collaborations médicales. Conseils, procédures et témoignages pour les professionnels de santé."
    
    let title = baseTitle
    let description = baseDescription
    
    if (params.search) {
        title = `Recherche: "${params.search}" - ${baseTitle}`
        description = `Résultats de recherche pour "${params.search}" sur ${baseDescription}`
    }
    
    if (params.category) {
        const categoryLabels: Record<string, string> = {
            "procédures": "Procédures",
            "aide": "Aide", 
            "témoignages": "Témoignages",
            "actualités": "Actualités",
            "transfert": "Transfert",
            "remplacement": "Remplacement",
            "collaboration": "Collaboration"
        }
        const categoryLabel = categoryLabels[params.category] || params.category
        title = `${categoryLabel} - ${baseTitle}`
        description = `Articles dans la catégorie ${categoryLabel}. ${baseDescription}`
    }
    
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website"
        }
    }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const params = await searchParams
    const { articles, pagination } = await getBlogArticles(params)
    
    const hasActiveFilters = params.search || params.category
    
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    Blog Doctonext
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Découvrez nos conseils, guides et témoignages pour réussir 
                    vos transferts de patientèle et collaborations médicales
                </p>
            </div>
            
            {/* Filters */}
            <div className="mb-8">
                <BlogFilters  />
            </div>
            
            {/* Results Summary */}
            {hasActiveFilters && (
                <div className="mb-6">
                    <p className="text-muted-foreground">
                        {pagination.total} article{pagination.total !== 1 ? "s" : ""} trouvé{pagination.total !== 1 ? "s" : ""}
                        {params.search && ` pour "${params.search}"`}
                        {params.category && ` dans la catégorie "${params.category}"`}
                    </p>
                </div>
            )}
            
            {/* Articles Grid */}
            {articles.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {articles.map((article) => (
                            <ArticleCard 
                                key={article.id} 
                                article={article} 
                            />
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    <BlogPagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        hasNextPage={pagination.hasNextPage}
                        hasPreviousPage={pagination.hasPreviousPage}
                    />
                </>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {hasActiveFilters ? "Aucun article trouvé" : "Aucun article publié"}
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            {hasActiveFilters 
                                ? "Essayez de modifier vos critères de recherche ou supprimez les filtres actifs."
                                : "Les premiers articles seront bientôt disponibles. Revenez plus tard !"}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}