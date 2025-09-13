"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Map, Settings, Info, Eye, EyeOff } from "lucide-react"
import { type MapRef } from "@/components/map/interactive-map"
import { MedicalFieldSelector, type MedicalProfession } from "@/components/map/medical-field-selector"
import { ZonageFilter } from "@/components/map/zonage-filter"
import { MapLegend } from "@/components/map/map-legend"
import { CitySearchBox } from "@/components/map/city-search-box"
import { type ZonageLevel } from "@/lib/services/town-density-types"
import { type CityInfo } from "@/lib/services/city-service"

// Dynamic imports to prevent SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/map/interactive-map").then((mod) => ({ default: mod.InteractiveMap })),
  { ssr: false, loading: () => <MapSkeleton /> }
)

const TownDensityOverlay = dynamic(
  () => import("@/components/map/town-density-overlay").then((mod) => mod.TownDensityOverlay),
  { ssr: false }
)

const ListingMarkers = dynamic(
  () => import("@/components/map/listing-markers").then((mod) => mod.ListingMarkers),
  { ssr: false }
)

// Loading skeleton for the map
function MapSkeleton() {
  return (
    <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <Map className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  )
}

export default function MapPage() {
  const [selectedProfession, setSelectedProfession] = useState<MedicalProfession>('chirurgiens-dentistes')
  const [selectedZonages, setSelectedZonages] = useState<ZonageLevel[]>([])
  const [showLabels, setShowLabels] = useState(false)
  const [showListings, setShowListings] = useState(true)
  const [loading, setLoading] = useState(false)
  const [townCount, setTownCount] = useState(0)
  const mapRef = useRef<MapRef | null>(null)

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

  // Load stats when profession changes
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`/api/map/town-density?profession=${selectedProfession}&stats=true`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setStats(result.data)
          }
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    
    loadStats()
  }, [selectedProfession])

  const handleCitySelect = (city: CityInfo) => {
    if (mapRef.current) {
      mapRef.current.flyTo(city.lat, city.lng, city.zoom || 12)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Map className="w-6 h-6 text-blue-600" />
                Carte de Densité Médicale
              </h1>
              <p className="text-gray-600 mt-1">
                Explorez les zones de densité médicale par commune selon les données officielles ARS
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-700 border-green-200">
                Données ARS officielles
              </Badge>
              <Badge variant="secondary">
                ~35,000 communes
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profession Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">
                    Profession médicale
                  </label>
                  <MedicalFieldSelector
                    selectedProfession={selectedProfession}
                    onProfessionChange={setSelectedProfession}
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">
                    Filtrer par zonage
                  </label>
                  <ZonageFilter
                    selectedZonages={selectedZonages}
                    onZonageChange={setSelectedZonages}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLabels(!showLabels)}
                    className="w-full justify-start"
                  >
                    {showLabels ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showLabels ? 'Masquer les labels' : 'Afficher les labels'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowListings(!showListings)}
                    className="w-full justify-start"
                  >
                    {showListings ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {showListings ? 'Masquer les annonces' : 'Afficher les annonces'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {stats && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.totalTowns.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        communes analysées
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {stats.distribution.map((item) => (
                        <div key={item.zonage} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-sm"
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.label}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{item.count.toLocaleString()}</div>
                            <div className="text-gray-500">{item.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <MapLegend
              showDensityLegend={true}
              showListingTypes={showListings}
              densityMode="polygon"
            />
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="h-[80vh] relative">
              <CardContent className="p-0 h-full">
                <InteractiveMap
                  ref={mapRef}
                  center={[46.603354, 1.888334]}
                  zoom={6}
                  height="100%"
                  className="rounded-lg border-0"
                  mapStyle="geometric"
                >
                  <TownDensityOverlay
                    profession={selectedProfession}
                    zonageFilter={selectedZonages}
                    showLabels={showLabels}
                    maxTowns={selectedZonages.length > 0 ? 1000 : 200}
                    onTownClick={(town) => {
                      console.log('Town clicked:', town.name, town.zonage)
                    }}
                  />

                  {showListings && (
                    <ListingMarkers
                      listings={[]}
                      onMarkerClick={(listing) => {
                        console.log('Listing clicked:', listing.title)
                      }}
                    />
                  )}
                </InteractiveMap>

                {/* City Search - Top Right */}
                <div className="absolute top-4 right-4 z-[1000] w-80">
                  <CitySearchBox
                    onCitySelect={handleCitySelect}
                    placeholder="Rechercher une ville..."
                  />
                </div>

                {/* Map Status */}
                <div className="absolute bottom-4 left-4 z-[1000] space-y-2">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    Profession: {selectedProfession}
                  </Badge>

                  {selectedZonages.length > 0 && (
                    <Badge variant="secondary" className="bg-blue-100/90 text-blue-800 backdrop-blur-sm">
                      Zonages filtrés: {selectedZonages.length}
                    </Badge>
                  )}

                  {loading && (
                    <Badge variant="secondary" className="bg-yellow-100/90 text-yellow-800 backdrop-blur-sm">
                      Chargement...
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}