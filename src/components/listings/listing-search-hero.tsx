"use client"

import { useState, useEffect } from "react"
import { Filter, List, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchWithHistory } from "@/components/ui/search-with-history"
import { cn } from "@/lib/utils"

interface ListingSearchHeroProps {
    initialSearch?: string
    onSearch?: (query: string) => void
    onTabChange?: (
        tab: "all" | "sales" | "replacements" | "collaborations"
    ) => void
    onFilterClick?: () => void
    activeFiltersCount?: number
    viewMode?: "list" | "map"
    onViewModeChange?: (mode: "list" | "map") => void
}

export function ListingSearchHero({
    initialSearch = "",
    onSearch,
    onTabChange,
    onFilterClick,
    activeFiltersCount = 0,
    viewMode = "list",
    onViewModeChange
}: ListingSearchHeroProps) {
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [activeTab, setActiveTab] = useState<
        "all" | "sales" | "replacements" | "collaborations"
    >("all")

    useEffect(() => {
        setSearchQuery(initialSearch)
    }, [initialSearch])

    const handleSearch = (query: string) => {
        onSearch?.(query)
    }

    const handleInputChange = (query: string) => {
        setSearchQuery(query)
        // Trigger real-time search as user types
        onSearch?.(query)
    }

    const handleTabChange = (
        tab: "all" | "sales" | "replacements" | "collaborations"
    ) => {
        setActiveTab(tab)
        onTabChange?.(tab)
    }

    const tabs = [
        { id: "all", label: "Toutes" },
        { id: "sales", label: "Ventes / Cessions" },
        { id: "replacements", label: "Remplacements" },
        { id: "collaborations", label: "Association / Collaboration" }
    ] as const

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-10">
            <div className="container mx-auto max-w-7xl">
                <h1 className="mb-5 font-semibold text-2xl text-white">
                    Explorez nos annonces
                </h1>

                <div className="mb-6 flex gap-3">
                    <SearchWithHistory
                        value={searchQuery}
                        onChange={handleInputChange}
                        onSubmit={handleSearch}
                        placeholder="Rechercher par titre, lieu, spécialité..."
                        className="flex-1"
                        inputClassName="h-11 bg-white border-0 text-gray-900 placeholder:text-gray-400"
                    />

                    {/* View Mode Toggle */}
                    <div className="flex rounded-lg border border-white/20 bg-white/10 p-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewModeChange?.("list")}
                            className={cn(
                                "h-9 px-3 font-medium text-xs transition-colors",
                                viewMode === "list"
                                    ? "bg-white text-gray-900 shadow-sm hover:bg-white/90"
                                    : "text-white hover:bg-white/10"
                            )}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewModeChange?.("map")}
                            className={cn(
                                "h-9 px-3 font-medium text-xs transition-colors",
                                viewMode === "map"
                                    ? "bg-white text-gray-900 shadow-sm hover:bg-white/90"
                                    : "text-white hover:bg-white/10"
                            )}
                        >
                            <Map className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={onFilterClick}
                        className={cn(
                            "relative h-11 border-0 bg-white text-gray-700 hover:bg-gray-50",
                            activeFiltersCount > 0 &&
                                "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        )}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtres
                        {activeFiltersCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-2 py-1 font-bold text-white text-xs leading-none">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                </div>

                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={cn(
                                "rounded-md px-4 py-2 font-medium text-sm transition-colors",
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
