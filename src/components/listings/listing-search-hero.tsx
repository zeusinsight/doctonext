"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ListingSearchHeroProps {
    onSearch?: (query: string) => void
    onTabChange?: (tab: "all" | "sales" | "replacements") => void
    onFilterClick?: () => void
}

export function ListingSearchHero({ 
    onSearch, 
    onTabChange,
    onFilterClick 
}: ListingSearchHeroProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState<"all" | "sales" | "replacements">("all")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch?.(searchQuery)
    }

    const handleTabChange = (tab: "all" | "sales" | "replacements") => {
        setActiveTab(tab)
        onTabChange?.(tab)
    }

    const tabs = [
        { id: "all", label: "Toutes" },
        { id: "sales", label: "Ventes / Cessions" },
        { id: "replacements", label: "Remplacements" }
    ] as const

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-10 px-4">
            <div className="container mx-auto max-w-7xl">
                <h1 className="text-2xl font-semibold text-white mb-5">
                    Explorez nos annonces
                </h1>
                
                <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Rechercher par titre, lieu, spécialité..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-11 pl-10 pr-3 bg-white border-0 text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onFilterClick}
                        className="h-11 bg-white hover:bg-gray-50 text-gray-700 border-0"
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtres
                    </Button>
                </form>

                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                activeTab === tab.id
                                    ? "bg-white text-blue-600"
                                    : "bg-blue-500 text-white hover:bg-blue-400"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}