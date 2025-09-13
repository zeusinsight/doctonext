"use client"

import { useState, useEffect, Suspense, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { ListingSearchHero } from "@/components/listings/listing-search-hero"
import { SponsoredListingCard } from "@/components/listings/sponsored-listing-card"
import {
    ListingsFilterModal,
    type ListingFilters
} from "@/components/listings/listings-filter-modal"
import type { PublicListing } from "@/types/listing"
import type { MapListing } from "@/components/map/listing-markers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Check } from "lucide-react"
import { createSavedSearch } from "@/lib/actions/saved-searches"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { type MedicalProfession } from "@/lib/services/town-density-types"
import { CitySearchBox } from "@/components/map/city-search-box"
import { type CityInfo } from "@/lib/services/city-service"
import { type MapRef } from "@/components/map/interactive-map"
import { PerformanceMonitor, usePerformanceMonitoring } from "@/components/performance/performance-monitor"

// Mapping from medical professions to listing specialties
const getMedicalProfessionSpecialties = (profession: MedicalProfession): string[] => {
    switch (profession) {
        case 'chirurgiens-dentistes':
            return ['Dentiste']
        case 'infirmier':
            return ['Infirmier(ère)']
        case 'masseurs-kinésithérapeutes':
            return ['Kinésithérapeute']
        case 'orthophonistes':
            return ['Orthophoniste']
        case 'sages-femmes':
            return ['Sage-femme']
        default:
            return []
    }
}

// Dynamic imports to prevent SSR issues
const InteractiveMap = dynamic(
    () => import("@/components/map/interactive-map").then((mod) => mod.InteractiveMap),
    { ssr: false }
)


const ClusteredListingMarkers = dynamic(
    () => import("@/components/map/clustered-listing-markers").then((mod) => mod.ClusteredListingMarkers),
    { ssr: false }
)

const OptimizedTownOverlay = dynamic(
    () => import("@/components/map/optimized-town-overlay").then((mod) => mod.OptimizedTownOverlay),
    { ssr: false }
)

const MedicalFieldSelector = dynamic(
    () => import("@/components/map/medical-field-selector").then((mod) => mod.MedicalFieldSelector),
    { ssr: false }
)

function ListingsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [listings, setListings] = useState<PublicListing[]>([])
    const [filteredListings, setFilteredListings] = useState<PublicListing[]>(
        []
    )
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState<
        "all" | "sales" | "replacements" | "collaborations"
    >("all")
    const [viewMode, setViewMode] = useState<"list" | "map">("list")
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [filters, setFilters] = useState<ListingFilters>({
        specialties: [],
        regions: [],
        listingTypes: [],
        collaborationTypes: [],
        isBoostPlus: undefined
    })
    const [showSaveSearch, setShowSaveSearch] = useState(false)
    const [searchName, setSearchName] = useState("")
    const [emailAlerts, setEmailAlerts] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [mapListings, setMapListings] = useState<MapListing[]>([])
    const [mapLoading, setMapLoading] = useState(false)
    const [selectedProfession, setSelectedProfession] = useState<MedicalProfession>('chirurgiens-dentistes')
    const [townDataLoading, setTownDataLoading] = useState(false)
    const [visibleTownCount, setVisibleTownCount] = useState(0)
    const { data: session } = authClient.useSession()
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const mapRef = useRef<MapRef | null>(null)
    const { isMonitoring, toggleMonitoring } = usePerformanceMonitoring()

    useEffect(() => {
        // Set initial search query from URL
        const urlSearchQuery = searchParams.get("search") || ""
        setSearchQuery(urlSearchQuery)
        fetchListings()
    }, [])

    useEffect(() => {
        filterListings()
    }, [listings, searchQuery, activeTab, filters])

    useEffect(() => {
        if (viewMode === "map") {
            fetchMapListings()
        }
    }, [viewMode, searchQuery, activeTab, filters, selectedProfession])

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

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

    const fetchMapListings = useCallback(async () => {
        console.log("🗺️ fetchMapListings called", { viewMode, activeTab, filters, searchQuery, selectedProfession })
        setMapLoading(true)
        try {
            // Build query parameters based on current filters
            const params = new URLSearchParams()
            
            // Filter by listing type based on active tab
            if (activeTab === "sales") {
                params.append("type", "transfer")
            } else if (activeTab === "replacements") {
                params.append("type", "replacement")  
            } else if (activeTab === "collaborations") {
                params.append("type", "collaboration")
            }
            
            // Add specialty filters from both manual filters and selected medical profession
            const medicalProfessionSpecialties = getMedicalProfessionSpecialties(selectedProfession)
            const allSpecialties = [...filters.specialties, ...medicalProfessionSpecialties]
            const uniqueSpecialties = [...new Set(allSpecialties)]
            
            if (uniqueSpecialties.length > 0) {
                // For now, take the first specialty - API might need to be updated for multiple
                params.append("specialty", uniqueSpecialties[0])
            }
            
            // Add region filters  
            if (filters.regions.length > 0) {
                // For now, take the first region - API might need to be updated for multiple
                params.append("region", filters.regions[0])
            }

            const queryString = params.toString()
            const url = `/api/map/listings${queryString ? `?${queryString}` : ""}`
            
            console.log("🗺️ Fetching map listings from:", url)
            
            const response = await fetch(url)
            console.log("🗺️ Response status:", response.status)
            
            const data = await response.json()
            console.log("🗺️ Response data:", data)
            
            // Let's also check if we can see listings data from the regular API for comparison
            if (data.data?.listings?.length === 0) {
                console.log("🗺️ No map listings found. Regular listings count:", sortedListings.length)
                console.log("🗺️ Sample regular listing location:", sortedListings[0]?.location)
            }

            if (data.success && data.data) {
                let mapResults = data.data.listings || []
                console.log("🗺️ Raw map results:", mapResults.length, "listings")
                
                // Apply search query client-side (since API doesn't support text search yet)
                if (searchQuery) {
                    const query = searchQuery.toLowerCase()
                    mapResults = mapResults.filter((listing: MapListing) =>
                        listing.title.toLowerCase().includes(query) ||
                        listing.specialty?.toLowerCase().includes(query) ||
                        listing.location.city.toLowerCase().includes(query)
                    )
                    console.log("🗺️ After search filter:", mapResults.length, "listings")
                }
                
                setMapListings(mapResults)
                console.log("🗺️ Map listings set:", mapResults.length)
            } else {
                console.log("🗺️ API response not successful or no data:", data)
                setMapListings([])
            }
        } catch (error) {
            console.error("🗺️ Error fetching map listings:", error)
            setMapListings([])
        } finally {
            setMapLoading(false)
            console.log("🗺️ fetchMapListings complete")
        }
    }, [activeTab, filters.specialties, filters.regions, searchQuery, selectedProfession])

    // Handle medical profession changes
    const handleProfessionChange = useCallback((profession: MedicalProfession) => {
        setSelectedProfession(profession)
    }, [])

    // Handle city selection from search box
    const handleCitySelect = useCallback((city: CityInfo) => {
        if (mapRef.current) {
            mapRef.current.flyTo(city.lat, city.lng, city.zoom || 12)
        }
    }, [])

    const filterListings = () => {
        let filtered = [...listings]

        // Filter by tab
        if (activeTab === "sales") {
            filtered = filtered.filter((l) => l.listingType === "transfer")
        } else if (activeTab === "replacements") {
            filtered = filtered.filter((l) => l.listingType === "replacement")
        } else if (activeTab === "collaborations") {
            filtered = filtered.filter((l) => l.listingType === "collaboration")
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (l) =>
                    l.title.toLowerCase().includes(query) ||
                    l.description?.toLowerCase().includes(query) ||
                    l.specialty?.toLowerCase().includes(query) ||
                    l.location?.city?.toLowerCase().includes(query)
            )
        }

        // Filter by specialties
        if (filters.specialties.length > 0) {
            filtered = filtered.filter(
                (l) => l.specialty && filters.specialties.includes(l.specialty)
            )
        }

        // Filter by regions
        if (filters.regions.length > 0) {
            filtered = filtered.filter(
                (l) =>
                    l.location?.region &&
                    filters.regions.includes(l.location.region)
            )
        }

        // Filter by listing types
        if (filters.listingTypes.length > 0) {
            filtered = filtered.filter((l) =>
                filters.listingTypes.includes(l.listingType)
            )
        }

        // Filter by collaboration types (only if collaboration is in listing types and specific subtypes are selected)
        if (
            filters.collaborationTypes.length > 0 &&
            filters.listingTypes.includes("collaboration")
        ) {
            filtered = filtered.filter(
                (l) =>
                    l.listingType === "collaboration" &&
                    l.collaborationType &&
                    filters.collaborationTypes.includes(l.collaborationType)
            )
        }

        // Filter by Boost Plus
        if (filters.isBoostPlus === true) {
            filtered = filtered.filter((l) => l.isBoostPlus)
        }

        setFilteredListings(filtered)
    }

    const handleSearch = useCallback((query: string) => {
        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        // Set new timeout for debounced search - reduced from 600ms to 300ms
        searchTimeoutRef.current = setTimeout(() => {
            setSearchQuery(query)
            // Reset URL search params when performing a new search
            router.push("/annonces", { scroll: false })
        }, 300) // 300ms debounce delay for faster response
    }, [router])

    const handleTabChange = (
        tab: "all" | "sales" | "replacements" | "collaborations"
    ) => {
        setActiveTab(tab)
    }

    const handleFilterClick = () => {
        setIsFilterModalOpen(true)
    }

    const handleFiltersChange = (newFilters: ListingFilters) => {
        setFilters(newFilters)
    }

    const handleSaveSearch = async () => {
        if (!searchName.trim()) {
            toast.error("Veuillez entrer un nom pour votre recherche")
            return
        }

        if (!session?.user) {
            toast.error("Vous devez être connecté pour sauvegarder une recherche")
            return
        }

        setIsSaving(true)
        try {
            // Create search criteria with current search state
            const searchCriteria = {
                ...filters,
                searchQuery: searchQuery || undefined,
                activeTab: activeTab !== "all" ? activeTab : undefined
            }

            const result = await createSavedSearch(searchName, searchCriteria as ListingFilters, emailAlerts)
            if (result.success) {
                toast.success("Recherche sauvegardée avec succès")
                setShowSaveSearch(false)
                setSearchName("")
            } else {
                toast.error(result.error || "Erreur lors de la sauvegarde")
            }
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde de la recherche")
        } finally {
            setIsSaving(false)
        }
    }


    // Calculate active filters count
    const activeFiltersCount =
        filters.specialties.length +
        filters.regions.length +
        filters.listingTypes.length +
        filters.collaborationTypes.length +
        (filters.isBoostPlus ? 1 : 0)

    // Sort listings to show boosted ones first
    const sortedListings = [...filteredListings].sort((a, b) => {
        // If one has isBoostPlus and the other doesn't, prioritize the boosted one
        if (a.isBoostPlus && !b.isBoostPlus) return -1
        if (!a.isBoostPlus && b.isBoostPlus) return 1
        // If both are the same boost status, maintain original order
        return 0
    })

    return (
        <>
            <ListingSearchHero
                initialSearch={searchQuery}
                onSearch={handleSearch}
                onTabChange={handleTabChange}
                onFilterClick={handleFilterClick}
                activeFiltersCount={activeFiltersCount}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
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
                            <div className="mb-6 h-8 w-64 animate-pulse rounded bg-gray-200" />
                            {viewMode === "list" ? (
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="overflow-hidden rounded-xl border border-gray-100 bg-white"
                                        >
                                            {/* Image skeleton */}
                                            <div className="relative aspect-[4/3] bg-gray-200 animate-pulse">
                                                {/* Badge skeletons */}
                                                <div className="absolute top-2 left-2">
                                                    <div className="h-5 w-16 bg-gray-300 rounded-full animate-pulse" />
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                    <div className="h-5 w-14 bg-gray-300 rounded-full animate-pulse" />
                                                </div>
                                                {/* Favorite button skeleton */}
                                                <div className="absolute bottom-2 right-2">
                                                    <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                            
                                            {/* Content skeleton */}
                                            <div className="p-4 space-y-2">
                                                {/* Title and price */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse shrink-0" />
                                                </div>
                                                
                                                {/* Description */}
                                                <div className="space-y-1">
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                                                </div>
                                                
                                                {/* Location */}
                                                <div className="pt-1">
                                                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-[600px] bg-gray-200 animate-pulse rounded-lg" />
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {(viewMode === "list" && sortedListings.length > 0) || (viewMode === "map") ? (
                            <div>
                                <h2 className="mb-6 font-bold text-2xl">
                                    {viewMode === "list" 
                                        ? `Toutes les annonces (${sortedListings.length})` 
                                        : mapLoading 
                                            ? "Carte des annonces (chargement...)"
                                            : `Carte des annonces (${mapListings.length})`
                                    }
                                </h2>
                                
                                {viewMode === "list" ? (
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                        {sortedListings.map((listing) => (
                                            <SponsoredListingCard
                                                key={listing.id}
                                                listing={listing}
                                                orientation="vertical"
                                                className="h-full"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-[600px] w-full relative">
                                        {/* Medical field selector overlay */}
                                        <div 
                                            className="absolute top-4 left-4 z-[1001] max-w-xs"
                                            style={{ zIndex: 1001 }}
                                        >
                                            <MedicalFieldSelector
                                                selectedProfession={selectedProfession}
                                                onProfessionChange={handleProfessionChange}
                                            />
                                        </div>

                                        {/* Map legend */}
                                        <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg p-3 max-w-xs">
                                            <div className="text-xs font-medium text-gray-700 mb-2">Zonage médical (ARS)</div>
                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10b981" }}></div>
                                                    <span>Très sous-dotée</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: "#84cc16" }}></div>
                                                    <span>Sous-dotée</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: "#f59e0b" }}></div>
                                                    <span>Intermédiaire</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: "#ef4444" }}></div>
                                                    <span>Très dotée</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: "#b91c1c" }}></div>
                                                    <span>Sur-dotée</span>
                                                </div>
                                            </div>
                                        </div>

                                        <InteractiveMap
                                            ref={mapRef}
                                            center={[46.603354, 1.888334]}
                                            zoom={6}
                                            height="600px"
                                            className="w-full h-full"
                                            mapStyle="geometric"
                                        >
                                            {/* Optimized town density overlay */}
                                            <OptimizedTownOverlay
                                                profession={selectedProfession}
                                                opacity={0.6}
                                                showLabels={true}
                                                onLoadingChange={setTownDataLoading}
                                                onTownCountChange={setVisibleTownCount}
                                                onTownClick={(town) => {
                                                    console.log('Town clicked:', town.name, town.zonage)
                                                }}
                                            />
                                            <ClusteredListingMarkers
                                                listings={mapListings}
                                                onMarkerClick={(listing) => {
                                                    window.open(`/annonces/${listing.id}`, "_blank")
                                                }}
                                            />
                                        </InteractiveMap>

                                        {/* City Search - Top Right */}
                                        <div className="absolute top-4 right-4 z-[1003] w-80">
                                            <CitySearchBox
                                                onCitySelect={handleCitySelect}
                                                placeholder="Rechercher une ville..."
                                            />
                                        </div>

                                        {/* Loading overlays */}
                                        {mapLoading && (
                                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-[1001]">
                                                <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-lg">
                                                    <div className="h-5 w-5 animate-spin border-2 border-primary border-t-transparent rounded-full" />
                                                    <span className="text-sm">Chargement des annonces...</span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {townDataLoading && (
                                            <div className="absolute top-4 right-4 z-[1002] bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg p-3 flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />
                                                <span className="text-sm font-medium">Chargement des communes...</span>
                                            </div>
                                        )}
                                        
                                        {/* Town count display and performance toggle */}
                                        <div className="absolute top-20 left-4 z-[1002] bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg p-3 max-w-xs">
                                            <div className="text-xs font-medium text-gray-700">
                                                Communes affichées: <span className="text-blue-600">{visibleTownCount.toLocaleString()}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Profession: {selectedProfession}
                                            </div>
                                            <button
                                                onClick={toggleMonitoring}
                                                className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                                                title="Toggle performance monitor"
                                            >
                                                {isMonitoring ? 'Hide' : 'Show'} Perf Monitor
                                            </button>
                                        </div>
                                        
                                        {!mapLoading && mapListings.length === 0 && (
                                            <div className="absolute bottom-4 left-4 bg-white/95 rounded-lg shadow-lg p-3 max-w-sm">
                                                <div className="text-center">
                                                    <p className="font-medium text-sm">
                                                        Aucune annonce avec coordonnées
                                                    </p>
                                                    {session?.user && (
                                                        <Button
                                                            size="sm"
                                                            onClick={async () => {
                                                                try {
                                                                    const response = await fetch("/api/map/geocode-batch", {
                                                                        method: "POST"
                                                                    })
                                                                    const result = await response.json()
                                                                    if (result.success) {
                                                                        toast.success(result.data.message)
                                                                        // Refetch map data
                                                                        fetchMapListings()
                                                                    } else {
                                                                        toast.error("Erreur lors du géocodage")
                                                                    }
                                                                } catch (error) {
                                                                    toast.error("Erreur lors du géocodage")
                                                                }
                                                            }}
                                                            className="mt-2 w-full"
                                                        >
                                                            Générer les coordonnées GPS
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="font-medium text-lg">
                                    Aucune annonce trouvée
                                </p>
                                <p className="mt-2 text-muted-foreground">
                                    Essayez de modifier vos critères de
                                    recherche
                                </p>
                                
                                {/* Save Search Section */}
                                {session?.user && (searchQuery || activeFiltersCount > 0) && (
                                    <div className="mt-8 w-full max-w-md">
                                        {!showSaveSearch ? (
                                            <Button
                                                variant="default"
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={() => setShowSaveSearch(true)}
                                            >
                                                <Bell className="w-4 h-4 mr-2" />
                                                Sauvegarder cette recherche et recevoir des alertes
                                            </Button>
                                        ) : (
                                            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="search-name">Nom de la recherche</Label>
                                                    <Input
                                                        id="search-name"
                                                        value={searchName}
                                                        onChange={(e) => setSearchName(e.target.value)}
                                                        placeholder="Ex: Cabinets de généralistes en Île-de-France"
                                                        disabled={isSaving}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="email-alerts" className="cursor-pointer">
                                                        Recevoir des alertes par email
                                                    </Label>
                                                    <Switch
                                                        id="email-alerts"
                                                        checked={emailAlerts}
                                                        onCheckedChange={setEmailAlerts}
                                                        disabled={isSaving}
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowSaveSearch(false)
                                                            setSearchName("")
                                                        }}
                                                        disabled={isSaving}
                                                        className="flex-1"
                                                    >
                                                        Annuler
                                                    </Button>
                                                    <Button 
                                                        onClick={handleSaveSearch}
                                                        disabled={isSaving}
                                                        className="flex-1"
                                                    >
                                                        {isSaving ? (
                                                            "Sauvegarde..."
                                                        ) : (
                                                            <>
                                                                <Check className="w-4 h-4 mr-2" />
                                                                Sauvegarder
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Performance Monitor */}
            <PerformanceMonitor
                isVisible={isMonitoring}
                polygonCount={visibleTownCount}
                markerCount={mapListings.length}
            />
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
                viewMode="list"
                onViewModeChange={() => {}}
            />

            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="space-y-8">
                    <div>
                        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200" />
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-64 animate-pulse rounded-lg bg-gray-100"
                                />
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
