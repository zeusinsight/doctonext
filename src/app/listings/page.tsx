"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ListingSearchHero } from "@/components/listings/listing-search-hero"
import { SponsoredListingsCarousel } from "@/components/listings/sponsored-listings-carousel"
import { SponsoredListingCard } from "@/components/listings/sponsored-listing-card"
import { ListingsFilterModal, type ListingFilters } from "@/components/listings/listings-filter-modal"
import type { PublicListing } from "@/types/listing"

function ListingsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [listings, setListings] = useState<PublicListing[]>([])
    const [filteredListings, setFilteredListings] = useState<PublicListing[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState<"all" | "sales" | "replacements" | "collaborations">("all")
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [filters, setFilters] = useState<ListingFilters>({
        specialties: [],
        regions: [],
        listingTypes: [],
        collaborationTypes: [],
        isBoostPlus: undefined
    })

    useEffect(() => {
        // Set initial search query from URL
        const urlSearchQuery = searchParams.get("search") || ""
        setSearchQuery(urlSearchQuery)
        fetchListings()
    }, [])

    useEffect(() => {
        filterListings()
    }, [listings, searchQuery, activeTab, filters])

    const fetchListings = async () => {
        try {
            const response = await fetch("/api/listings")
            const data = await response.json()
            
            if (data.success && data.data) {
                setListings(data.data.listings || [])
            }
        } catch (error) {
            console.error("Error fetching listings:", error)
        } finally {
            setLoading(false)
        }
    }

    const filterListings = () => {
        let filtered = [...listings]

        // Filter by tab
        if (activeTab === "sales") {
            filtered = filtered.filter(l => l.listingType === "transfer")
        } else if (activeTab === "replacements") {
            filtered = filtered.filter(l => l.listingType === "replacement")
        } else if (activeTab === "collaborations") {
            filtered = filtered.filter(l => l.listingType === "collaboration")
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(l => 
                l.title.toLowerCase().includes(query) ||
                l.description?.toLowerCase().includes(query) ||
                l.specialty?.toLowerCase().includes(query) ||
                l.location?.city?.toLowerCase().includes(query)
            )
        }

        // Filter by specialties
        if (filters.specialties.length > 0) {
            filtered = filtered.filter(l => 
                l.specialty && filters.specialties.includes(l.specialty)
            )
        }

        // Filter by regions
        if (filters.regions.length > 0) {
            filtered = filtered.filter(l => 
                l.location?.region && filters.regions.includes(l.location.region)
            )
        }

        // Filter by listing types
        if (filters.listingTypes.length > 0) {
            filtered = filtered.filter(l => 
                filters.listingTypes.includes(l.listingType)
            )
        }

        // Filter by collaboration types (only if collaboration is in listing types and specific subtypes are selected)
        if (filters.collaborationTypes.length > 0 && filters.listingTypes.includes("collaboration")) {
            filtered = filtered.filter(l => 
                l.listingType === "collaboration" && 
                l.collaborationType && 
                filters.collaborationTypes.includes(l.collaborationType)
            )
        }

        // Filter by Boost Plus
        if (filters.isBoostPlus === true) {
            filtered = filtered.filter(l => l.isBoostPlus)
        }

        setFilteredListings(filtered)
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        // Reset URL search params when performing a new search
        router.push('/listings', { scroll: false })
    }

    const handleTabChange = (tab: "all" | "sales" | "replacements" | "collaborations") => {
        setActiveTab(tab)
    }

    const handleFilterClick = () => {
        setIsFilterModalOpen(true)
    }

    const handleFiltersChange = (newFilters: ListingFilters) => {
        setFilters(newFilters)
    }

    // Calculate active filters count
    const activeFiltersCount = 
        filters.specialties.length +
        filters.regions.length +
        filters.listingTypes.length +
        filters.collaborationTypes.length +
        (filters.isBoostPlus ? 1 : 0)

    // Separate sponsored and regular listings
    const sponsoredListings = filteredListings.filter(l => l.isBoostPlus)
    const regularListings = filteredListings.filter(l => !l.isBoostPlus)

    // For demo, if no sponsored listings, use first 6 regular ones
    const displaySponsoredListings = sponsoredListings.length > 0 
        ? sponsoredListings 
        : regularListings.slice(0, 6)

    const displayRegularListings = sponsoredListings.length > 0
        ? regularListings
        : regularListings.slice(6)

    return (
        <>
            <ListingSearchHero
                initialSearch={searchQuery}
                onSearch={handleSearch}
                onTabChange={handleTabChange}
                onFilterClick={handleFilterClick}
                activeFiltersCount={activeFiltersCount}
            />

            <ListingsFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {loading ? (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Sponsorisées</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Sponsored Listings Section */}
                        <div className="mb-12">
                            <SponsoredListingsCarousel listings={displaySponsoredListings} />
                        </div>

                        {/* Regular Listings Grid */}
                        {displayRegularListings.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Toutes les annonces</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {displayRegularListings.map((listing) => (
                                        <SponsoredListingCard 
                                            key={listing.id} 
                                            listing={listing}
                                            orientation="vertical"
                                            className="h-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredListings.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-lg font-medium">Aucune annonce trouvée</p>
                                <p className="mt-2 text-muted-foreground">
                                    Essayez de modifier vos critères de recherche
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

function ListingsPageFallback() {
    return (
        <>
            <ListingSearchHero
                initialSearch=""
                onSearch={() => {}}
                onTabChange={() => {}}
                onFilterClick={() => {}}
            />
            
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="space-y-8">
                    <div>
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function ListingsPage() {
    return (
        <Suspense fallback={<ListingsPageFallback />}>
            <ListingsContent />
        </Suspense>
    )
}