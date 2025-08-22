"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const CATEGORIES = [
    { value: "procédures", label: "Procédures" },
    { value: "aide", label: "Aide" },
    { value: "témoignages", label: "Témoignages" },
    { value: "actualités", label: "Actualités" },
    { value: "transfert", label: "Transfert" },
    { value: "remplacement", label: "Remplacement" },
    { value: "collaboration", label: "Collaboration" }
]

export function BlogFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
    const currentCategory = searchParams.get("category")
    
    const updateURL = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        
        // Reset to first page when filtering
        params.delete("page")
        
        startTransition(() => {
            router.push(`/blog?${params.toString()}`)
        })
    }
    
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateURL("search", searchValue || null)
    }
    
    const clearSearch = () => {
        setSearchValue("")
        updateURL("search", null)
    }
    
    const clearCategory = () => {
        updateURL("category", null)
    }
    
    const clearAll = () => {
        setSearchValue("")
        startTransition(() => {
            router.push("/blog")
        })
    }
    
    const hasActiveFilters = searchParams.get("search") || searchParams.get("category")
    
    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Rechercher des articles..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-10 pr-10"
                />
                {searchValue && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </form>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                    <Button
                        key={category.value}
                        variant={currentCategory === category.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateURL("category", 
                            currentCategory === category.value ? null : category.value
                        )}
                        disabled={isPending}
                    >
                        {category.label}
                    </Button>
                ))}
            </div>
            
            {/* Active Filters */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                    
                    {searchParams.get("search") && (
                        <Badge variant="secondary" className="gap-1">
                            Recherche: "{searchParams.get("search")}"
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                className="h-auto p-0 hover:bg-transparent"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    
                    {currentCategory && (
                        <Badge variant="secondary" className="gap-1">
                            {CATEGORIES.find(c => c.value === currentCategory)?.label}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearCategory}
                                className="h-auto p-0 hover:bg-transparent"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Effacer tout
                    </Button>
                </div>
            )}
        </div>
    )
}