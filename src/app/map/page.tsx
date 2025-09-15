"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Map, Settings, Info, Eye, EyeOff, Layers } from "lucide-react"
import type { MapRef } from "@/components/map/interactive-map"
import {
    MedicalFieldSelector,
    type MedicalProfession
} from "@/components/map/medical-field-selector"
import { ZonageFilter } from "@/components/map/zonage-filter"
import { MapLegend } from "@/components/map/map-legend"
import { CitySearchBox } from "@/components/map/city-search-box"
import { MapNavigationControls } from "@/components/map/map-navigation-controls"
import { useMapNavigation } from "@/hooks/use-map-navigation"
import type { ZonageLevel } from "@/lib/services/town-density-types"
import type { CityInfo } from "@/lib/services/city-service"
import type { DepartmentData } from "@/lib/services/department-service"
import type { CommuneData } from "@/lib/services/commune-department-service"

// Dynamic imports to prevent SSR issues
const InteractiveMap = dynamic(
    () =>
        import("@/components/map/interactive-map").then((mod) => ({
            default: mod.InteractiveMap
        })),
    { ssr: false, loading: () => <MapSkeleton /> }
)

const TownDensityOverlay = dynamic(
    () =>
        import("@/components/map/town-density-overlay").then(
            (mod) => mod.TownDensityOverlay
        ),
    { ssr: false }
)

const DepartmentOverlay = dynamic(
    () =>
        import("@/components/map/department-overlay").then((mod) => ({
            default: mod.DepartmentOverlay
        })),
    { ssr: false }
)

const CommuneOverlay = dynamic(
    () =>
        import("@/components/map/commune-overlay").then((mod) => ({
            default: mod.CommuneOverlay
        })),
    { ssr: false }
)

const ListingMarkers = dynamic(
    () =>
        import("@/components/map/listing-markers").then(
            (mod) => mod.ListingMarkers
        ),
    { ssr: false }
)

// Loading skeleton for the map
function MapSkeleton() {
    return (
        <div className="flex h-full items-center justify-center rounded-lg bg-gray-100">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                    <Map className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Chargement de la carte...</p>
            </div>
        </div>
    )
}

export default function MapPage() {
    const [selectedProfession, setSelectedProfession] =
        useState<MedicalProfession>("chirurgiens-dentistes")
    const [selectedZonages, setSelectedZonages] = useState<ZonageLevel[]>([])
    const [showLabels, setShowLabels] = useState(false)
    const [showListings, setShowListings] = useState(true)
    const [showDepartments, setShowDepartments] = useState(true)
    const [showCommunes, setShowCommunes] = useState(false)
    const [showTownDensity, setShowTownDensity] = useState(false)
    const [loading, setLoading] = useState(false)
    const [departmentsLoading, setDepartmentsLoading] = useState(false)
    const [communesLoading, setCommunesLoading] = useState(false)
    const [mapError, setMapError] = useState<string | null>(null)
    const [townCount, setTownCount] = useState(0)
    const mapRef = useRef<MapRef | null>(null)

    // Navigation state
    const navigation = useMapNavigation(mapRef)

    // Stats state
    const [stats, setStats] = useState<{
        profession: string
        totalTowns: number
        distribution: Array<{
            zonage: ZonageLevel
            count: number
            percentage: number
            color: string
            label: string
        }>
    } | null>(null)

    // Load stats when profession changes (only if town density is enabled)
    useEffect(() => {
        if (!showTownDensity) {
            setStats(null)
            return
        }

        const loadStats = async () => {
            try {
                const response = await fetch(
                    `/api/map/town-density?profession=${selectedProfession}&stats=true`
                )
                if (response.ok) {
                    const result = await response.json()
                    if (result.success) {
                        setStats(result.data)
                    }
                }
            } catch (error) {
                console.error("Error loading stats:", error)
            }
        }

        loadStats()
    }, [selectedProfession, showTownDensity])

    // Manage layer visibility based on navigation level
    useEffect(() => {
        console.log(
            "Map page: Navigation level changed to:",
            navigation.state.level
        )

        switch (navigation.state.level) {
            case "country":
                setShowDepartments(true)
                setShowCommunes(false)
                console.log("Map page: Showing departments, hiding communes")
                break
            case "department":
                setShowDepartments(false)
                setShowCommunes(true)
                console.log(
                    "Map page: Hiding departments, showing communes for department:",
                    navigation.state.selectedDepartment?.code
                )
                break
            case "commune":
                setShowDepartments(false)
                setShowCommunes(true)
                console.log("Map page: Showing commune view")
                break
        }
    }, [navigation.state.level, navigation.state.selectedDepartment])

    const handleCitySelect = (city: CityInfo) => {
        if (mapRef.current) {
            mapRef.current.flyTo(city.lat, city.lng, city.zoom || 12)
        }
    }

    const handleDepartmentClick = (department: DepartmentData) => {
        console.log(
            "Map page: Department clicked:",
            department.name,
            department.code
        )
        setCommunesLoading(true)
        setMapError(null)
        navigation.navigateToDepartment(department)
        // Layer visibility will be handled by the useEffect above
    }

    const handleDepartmentHover = (department: DepartmentData | null) => {
        navigation.setHoveredLocation(department ? department.name : null)
    }

    const handleCommuneClick = (commune: CommuneData) => {
        navigation.navigateToCommune(commune)
    }

    const handleCommuneHover = (commune: CommuneData | null) => {
        navigation.setHoveredLocation(commune ? commune.name : null)
    }

    const handleNavigateToCountry = () => {
        console.log("Map page: Navigating to country view")
        navigation.navigateToCountry()
        // Layer visibility will be handled by the useEffect above
    }

    const handleNavigateToDepartment = () => {
        if (navigation.state.selectedDepartment) {
            console.log(
                "Map page: Navigating back to department view:",
                navigation.state.selectedDepartment.name
            )
            navigation.navigateToDepartment(navigation.state.selectedDepartment)
            // Layer visibility will be handled by the useEffect above
        }
    }

    // Auto-adjust layer visibility based on zoom level
    useEffect(() => {
        if (!mapRef.current) return

        const map = mapRef.current.getMap()
        if (!map) return

        const handleZoomEnd = () => {
            const zoom = map.getZoom()

            if (zoom >= 10) {
                // High zoom - show communes if in department view
                if (navigation.state.level === "department") {
                    setShowCommunes(true)
                    setShowDepartments(false)
                }
            } else if (zoom >= 7) {
                // Medium zoom - show departments
                if (navigation.state.level === "country") {
                    setShowDepartments(true)
                    setShowCommunes(false)
                }
            } else {
                // Low zoom - show country level
                setShowDepartments(true)
                setShowCommunes(false)
            }
        }

        map.on("zoomend", handleZoomEnd)
        return () => {
            map.off("zoomend", handleZoomEnd)
        }
    }, [navigation.state.level])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-gray-200 border-b bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 font-bold text-2xl text-gray-900">
                                <Map className="h-6 w-6 text-blue-600" />
                                Carte Interactive de France
                            </h1>
                            <p className="mt-1 text-gray-600">
                                Explorez la France par départements et communes
                                • Données officielles IGN/INSEE
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="border-green-200 text-green-700"
                            >
                                Données IGN/INSEE
                            </Badge>
                            <Badge variant="secondary">
                                101 départements • 34,968 communes
                            </Badge>
                            {navigation.state.level === "department" && (
                                <Badge
                                    variant="outline"
                                    className="border-blue-200 text-blue-700"
                                >
                                    {navigation.state.selectedDepartment?.name}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    {/* Controls Sidebar */}
                    <div className="space-y-4 lg:col-span-1">
                        {/* Profession Selector */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Settings className="h-4 w-4" />
                                    Paramètres
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="mb-2 block flex items-center gap-2 font-medium text-gray-700 text-xs">
                                        <Layers className="h-3 w-3" />
                                        Couches de données
                                    </label>
                                    <div className="space-y-2">
                                        <Button
                                            variant={
                                                showDepartments
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setShowDepartments(
                                                    !showDepartments
                                                )
                                            }
                                            className="w-full justify-start"
                                        >
                                            {showDepartments ? (
                                                <Eye className="mr-2 h-4 w-4" />
                                            ) : (
                                                <EyeOff className="mr-2 h-4 w-4" />
                                            )}
                                            Départements
                                        </Button>

                                        <Button
                                            variant={
                                                showCommunes
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setShowCommunes(!showCommunes)
                                            }
                                            className="w-full justify-start"
                                            disabled={
                                                navigation.state.level ===
                                                "country"
                                            }
                                        >
                                            {showCommunes ? (
                                                <Eye className="mr-2 h-4 w-4" />
                                            ) : (
                                                <EyeOff className="mr-2 h-4 w-4" />
                                            )}
                                            Communes
                                        </Button>

                                        <Button
                                            variant={
                                                showTownDensity
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setShowTownDensity(
                                                    !showTownDensity
                                                )
                                            }
                                            className="w-full justify-start"
                                        >
                                            {showTownDensity ? (
                                                <Eye className="mr-2 h-4 w-4" />
                                            ) : (
                                                <EyeOff className="mr-2 h-4 w-4" />
                                            )}
                                            Densité médicale
                                        </Button>
                                    </div>
                                </div>

                                {showTownDensity && (
                                    <>
                                        <div>
                                            <label className="mb-2 block font-medium text-gray-700 text-xs">
                                                Profession médicale
                                            </label>
                                            <MedicalFieldSelector
                                                selectedProfession={
                                                    selectedProfession
                                                }
                                                onProfessionChange={
                                                    setSelectedProfession
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block font-medium text-gray-700 text-xs">
                                                Filtrer par zonage
                                            </label>
                                            <ZonageFilter
                                                selectedZonages={
                                                    selectedZonages
                                                }
                                                onZonageChange={
                                                    setSelectedZonages
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    {showTownDensity && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setShowLabels(!showLabels)
                                            }
                                            className="w-full justify-start"
                                        >
                                            {showLabels ? (
                                                <EyeOff className="mr-2 h-4 w-4" />
                                            ) : (
                                                <Eye className="mr-2 h-4 w-4" />
                                            )}
                                            {showLabels
                                                ? "Masquer les labels"
                                                : "Afficher les labels"}
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setShowListings(!showListings)
                                        }
                                        className="w-full justify-start"
                                    >
                                        {showListings ? (
                                            <EyeOff className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Eye className="mr-2 h-4 w-4" />
                                        )}
                                        {showListings
                                            ? "Masquer les annonces"
                                            : "Afficher les annonces"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Navigation Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Info className="h-4 w-4" />
                                    Navigation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-center">
                                        <div className="font-bold text-blue-600 text-lg">
                                            {navigation.state.level ===
                                                "country" && "Vue nationale"}
                                            {navigation.state.level ===
                                                "department" &&
                                                navigation.state
                                                    .selectedDepartment?.name}
                                            {navigation.state.level ===
                                                "commune" &&
                                                navigation.state.selectedCommune
                                                    ?.name}
                                        </div>
                                        <div className="text-gray-600 text-xs">
                                            {navigation.state.level ===
                                                "country" && "101 départements"}
                                            {navigation.state.level ===
                                                "department" &&
                                                `Département ${navigation.state.selectedDepartment?.code}`}
                                            {navigation.state.level ===
                                                "commune" &&
                                                `Commune ${navigation.state.selectedCommune?.code}`}
                                        </div>
                                    </div>

                                    {navigation.state.hoveredLocation && (
                                        <div className="rounded bg-gray-50 p-2 text-center">
                                            <div className="font-medium text-gray-800 text-sm">
                                                {
                                                    navigation.state
                                                        .hoveredLocation
                                                }
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                Survolé
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistics for Medical Density */}
                        {showTownDensity && stats && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-sm">
                                        <Info className="h-4 w-4" />
                                        Statistiques médicales
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <div className="font-bold text-2xl text-blue-600">
                                                {stats.totalTowns.toLocaleString()}
                                            </div>
                                            <div className="text-gray-600 text-xs">
                                                communes analysées
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {stats.distribution.map((item) => (
                                                <div
                                                    key={item.zonage}
                                                    className="flex items-center justify-between text-xs"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="h-3 w-3 rounded-sm"
                                                            style={{
                                                                backgroundColor:
                                                                    item.color
                                                            }}
                                                        />
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">
                                                            {item.count.toLocaleString()}
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {item.percentage}%
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Legend */}
                        {showTownDensity && (
                            <MapLegend
                                showDensityLegend={true}
                                showListingTypes={showListings}
                                densityMode="polygon"
                            />
                        )}
                    </div>

                    {/* Map */}
                    <div className="lg:col-span-3">
                        <Card className="relative h-[80vh]">
                            <CardContent className="h-full p-0">
                                <InteractiveMap
                                    ref={mapRef}
                                    center={[46.603354, 1.888334]}
                                    zoom={6}
                                    height="100%"
                                    className="rounded-lg border-0"
                                    mapStyle="geometric"
                                >
                                    {/* Department Layer */}
                                    <DepartmentOverlay
                                        visible={showDepartments}
                                        onDepartmentClick={
                                            handleDepartmentClick
                                        }
                                        onDepartmentHover={
                                            handleDepartmentHover
                                        }
                                        onLoadingChange={setDepartmentsLoading}
                                        onError={setMapError}
                                        highlightedDepartment={
                                            navigation.state.selectedDepartment
                                                ?.code
                                        }
                                    />

                                    {/* Commune Layer */}
                                    <CommuneOverlay
                                        departmentCode={
                                            navigation.state.selectedDepartment
                                                ?.code || null
                                        }
                                        visible={showCommunes}
                                        onCommuneClick={handleCommuneClick}
                                        onCommuneHover={handleCommuneHover}
                                        onLoadingChange={(loading) => {
                                            setCommunesLoading(loading)
                                            if (!loading)
                                                setCommunesLoading(false) // Reset on completion
                                        }}
                                        onError={setMapError}
                                        highlightedCommune={
                                            navigation.state.selectedCommune
                                                ?.code
                                        }
                                    />

                                    {/* Town Density Overlay */}
                                    {showTownDensity && (
                                        <TownDensityOverlay
                                            profession={selectedProfession}
                                            zonageFilter={selectedZonages}
                                            showLabels={showLabels}
                                            maxTowns={
                                                selectedZonages.length > 0
                                                    ? 1000
                                                    : 200
                                            }
                                            onTownClick={(town) => {
                                                console.log(
                                                    "Town clicked:",
                                                    town.name,
                                                    town.zonage
                                                )
                                            }}
                                        />
                                    )}

                                    {showListings && (
                                        <ListingMarkers
                                            listings={[]}
                                            onMarkerClick={(listing) => {
                                                console.log(
                                                    "Listing clicked:",
                                                    listing.title
                                                )
                                            }}
                                        />
                                    )}
                                </InteractiveMap>

                                {/* Navigation Controls - Top Left */}
                                <div className="absolute top-4 left-4 z-[1000] max-w-sm">
                                    <MapNavigationControls
                                        currentLevel={{
                                            level: navigation.state.level,
                                            name:
                                                navigation.state.level ===
                                                "country"
                                                    ? "France"
                                                    : navigation.state.level ===
                                                        "department"
                                                      ? navigation.state
                                                            .selectedDepartment
                                                            ?.name ||
                                                        "Département"
                                                      : navigation.state
                                                            .selectedCommune
                                                            ?.name || "Commune",
                                            code:
                                                navigation.state.level ===
                                                "department"
                                                    ? navigation.state
                                                          .selectedDepartment
                                                          ?.code
                                                    : navigation.state.level ===
                                                        "commune"
                                                      ? navigation.state
                                                            .selectedCommune
                                                            ?.code
                                                      : undefined
                                        }}
                                        departmentName={
                                            navigation.state.selectedDepartment
                                                ?.name
                                        }
                                        departmentCode={
                                            navigation.state.selectedDepartment
                                                ?.code
                                        }
                                        communeName={
                                            navigation.state.selectedCommune
                                                ?.name
                                        }
                                        communeCode={
                                            navigation.state.selectedCommune
                                                ?.code
                                        }
                                        onNavigateToCountry={
                                            handleNavigateToCountry
                                        }
                                        onNavigateToDepartment={
                                            handleNavigateToDepartment
                                        }
                                        hoveredLocation={
                                            navigation.state.hoveredLocation
                                        }
                                    />
                                </div>

                                {/* City Search - Top Right */}
                                <div className="absolute top-4 right-4 z-[1000] w-80">
                                    <CitySearchBox
                                        onCitySelect={handleCitySelect}
                                        placeholder="Rechercher une ville..."
                                    />
                                </div>

                                {/* Map Status - Bottom Left */}
                                <div className="absolute bottom-4 left-4 z-[1000] space-y-2">
                                    {showTownDensity && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-white/90 backdrop-blur-sm"
                                        >
                                            Profession: {selectedProfession}
                                        </Badge>
                                    )}

                                    {showTownDensity &&
                                        selectedZonages.length > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-blue-100/90 text-blue-800 backdrop-blur-sm"
                                            >
                                                Zonages filtrés:{" "}
                                                {selectedZonages.length}
                                            </Badge>
                                        )}

                                    {loading && (
                                        <Badge
                                            variant="secondary"
                                            className="bg-yellow-100/90 text-yellow-800 backdrop-blur-sm"
                                        >
                                            Chargement...
                                        </Badge>
                                    )}

                                    {/* Layer Status */}
                                    <div className="flex flex-wrap gap-1">
                                        {showDepartments && (
                                            <Badge
                                                variant="outline"
                                                className="bg-blue-50/90 text-blue-700 text-xs backdrop-blur-sm"
                                            >
                                                Départements
                                            </Badge>
                                        )}
                                        {showCommunes && (
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50/90 text-green-700 text-xs backdrop-blur-sm"
                                            >
                                                Communes
                                            </Badge>
                                        )}
                                        {showTownDensity && (
                                            <Badge
                                                variant="outline"
                                                className="bg-purple-50/90 text-purple-700 text-xs backdrop-blur-sm"
                                            >
                                                Densité
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
