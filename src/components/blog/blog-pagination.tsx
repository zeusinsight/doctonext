"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

interface BlogPaginationProps {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export function BlogPagination({ 
    currentPage, 
    totalPages, 
    hasNextPage, 
    hasPreviousPage 
}: BlogPaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    
    const navigateToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        
        startTransition(() => {
            router.push(`/blog?${params.toString()}`)
        })
    }
    
    // Generate page numbers to show
    const getVisiblePages = () => {
        const pages: number[] = []
        const maxVisible = 5
        
        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Show pages around current page
            const start = Math.max(1, currentPage - 2)
            const end = Math.min(totalPages, currentPage + 2)
            
            // Always show first page
            if (start > 1) {
                pages.push(1)
                if (start > 2) {
                    pages.push(-1) // Ellipsis
                }
            }
            
            // Show pages around current
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }
            
            // Always show last page
            if (end < totalPages) {
                if (end < totalPages - 1) {
                    pages.push(-1) // Ellipsis
                }
                pages.push(totalPages)
            }
        }
        
        return pages
    }
    
    if (totalPages <= 1) return null
    
    const visiblePages = getVisiblePages()
    
    return (
        <div className="flex items-center justify-center space-x-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={!hasPreviousPage || isPending}
            >
                <ChevronLeft className="h-4 w-4" />
                Précédent
            </Button>
            
            <div className="flex items-center space-x-1">
                {visiblePages.map((page, index) => (
                    page === -1 ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                            ...
                        </span>
                    ) : (
                        <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => navigateToPage(page)}
                            disabled={isPending}
                            className="min-w-[40px]"
                        >
                            {page}
                        </Button>
                    )
                ))}
            </div>
            
            <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={!hasNextPage || isPending}
            >
                Suivant
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}