"use client"

import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchWithHistory } from "@/components/ui/search-with-history"
import { cn } from "@/lib/utils"

interface ListingSearchHeroProps {
    initialSearch?: string
    onSearch?: (query: string) => void
    onTabChange?: (tab: "all" | "sales" | "replacements") => void
    onFilterClick?: () => void
}

export function ListingSearchHero({ 
    initialSearch = "",
    onSearch, 
    onTabChange,
    onFilterClick 
}: ListingSearchHeroProps) {
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [activeTab, setActiveTab] = useState<"all" | "sales" | "replacements">("all")

    useEffect(() => {
        setSearchQuery(initialSearch)
    }, [initialSearch])

    const handleSearch = (query: string) => {
        onSearch?.(query)
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
                
                <div className="flex gap-3 mb-6">
                    <SearchWithHistory
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={handleSearch}
                        placeholder="Rechercher par titre, lieu, spécialité..."
                        className="flex-1"
                        inputClassName="h-11 bg-white border-0 text-gray-900 placeholder:text-gray-400"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onFilterClick}
                        className="h-11 bg-white hover:bg-gray-50 text-gray-700 border-0"
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtres
                    </Button>
                </div>

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