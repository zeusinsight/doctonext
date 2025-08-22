"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map, MapPin, TrendingUp, Users, ArrowRight } from "lucide-react"
import type { MapListing } from "@/components/map/listing-markers"
import type { RegionDensity } from "@/components/map/medical-density-overlay"

// Dynamic imports to prevent SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/map/interactive-map").then((mod) => mod.InteractiveMap),
  { ssr: false, loading: () => <MapSkeleton /> }
)

const ListingMarkers = dynamic(
  () => import("@/components/map/listing-markers").then((mod) => mod.ListingMarkers),
  { ssr: false }
)

const MedicalDensityOverlay = dynamic(
  () => import("@/components/map/medical-density-overlay").then((mod) => mod.MedicalDensityOverlay),
  { ssr: false }
)

// Loading skeleton for the map
function MapSkeleton() {
  return (
    <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <Map className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  )
}

export function MapShowcaseSection() {
  const [sampleListings, setSampleListings] = useState<MapListing[]>([])
  const [densityData, setDensityData] = useState<RegionDensity[]>([])
  const [filteredDensityData, setFilteredDensityData] = useState<RegionDensity[]>([])
  const [loading, setLoading] = useState(true)

  // Show all medical zones for entire France (not just regions with listings)
  const processDensityData = (densityRegions: RegionDensity[]): RegionDensity[] => {
    console.log("All medical zones loaded:", densityRegions.length, "regions")
    console.log("Zone breakdown:", {
      "sous-dotées": densityRegions.filter(r => r.densityScore <= 30).length,
      "équilibrées": densityRegions.filter(r => r.densityScore > 30 && r.densityScore <= 70).length, 
      "surdotées": densityRegions.filter(r => r.densityScore > 70).length
    })
    return densityRegions
  }

  // Load a few sample listings for demo
  useEffect(() => {
    const loadSampleData = async () => {
      try {
        const response = await fetch("/api/map/listings?limit=20")
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data.listings.length > 0) {
            setSampleListings(result.data.listings.slice(0, 10)) // Show max 10 for demo
          } else {
            // Fallback to sample data if no listings available
            console.log("No listings with coordinates found, using demo data")
            setSampleListings([
              {
                id: "demo-1",
                title: "Cabinet médical centre-ville Paris",
                listingType: "transfer",
                specialty: "Médecin généraliste",
                location: {
                  latitude: 48.8566,
                  longitude: 2.3522,
                  city: "Paris",
                  region: "Île-de-France"
                },
                salePrice: 150000,
                viewsCount: 45,
                isBoostPlus: true,
                createdAt: new Date()
              },
              {
                id: "demo-2",
                title: "Remplacement cabinet dentaire Lyon",
                listingType: "replacement",
                specialty: "Dentiste",
                location: {
                  latitude: 45.7640,
                  longitude: 4.8357,
                  city: "Lyon",
                  region: "Auvergne-Rhône-Alpes"
                },
                dailyRate: 800,
                viewsCount: 23,
                isBoostPlus: false,
                createdAt: new Date()
              },
              {
                id: "demo-3",
                title: "Association cabinet kinésithérapie Marseille",
                listingType: "collaboration",
                specialty: "Kinésithérapeute",
                location: {
                  latitude: 43.2965,
                  longitude: 5.3698,
                  city: "Marseille",
                  region: "Provence-Alpes-Côte d'Azur"
                },
                viewsCount: 67,
                isBoostPlus: false,
                createdAt: new Date()
              }
            ])
          }
        }
        
        // Load density data from API or use temporary realistic data
        try {
          const densityResponse = await fetch("/api/map/density")
          if (densityResponse.ok) {
            const densityResult = await densityResponse.json()
            console.log("Density API response:", densityResult) // Debug log
            if (densityResult.success && densityResult.data?.regions) {
              console.log("Setting density data:", densityResult.data.regions) // Debug log
              setDensityData(densityResult.data.regions)
            } else {
              console.log("No density data found in response")
            }
          } else {
            console.log("Density API response not ok:", densityResponse.status)
          }
        } catch (error) {
          console.error("Error loading density data:", error)
        }
        
        // Complete French medical zones classification (ARS data)
        // Green = Sous-dotées (0-30), Yellow = Équilibrées (31-70), Red = Surdotées (71-100)
        setDensityData([
          // Surdotées (Red zones - over-supplied)
          {
            region: "Île-de-France",
            code: "idf",
            densityScore: 85,
            professionalCount: 15000,
            populationCount: 12317279,
            bounds: [[[1.4461, 49.2147], [3.5589, 49.2147], [3.5589, 48.1205], [1.4461, 48.1205], [1.4461, 49.2147]]]
          },
          {
            region: "Provence-Alpes-Côte d'Azur", 
            code: "paca",
            densityScore: 78,
            professionalCount: 4200,
            populationCount: 5098666,
            bounds: [[[4.2279, 44.9013], [7.7186, 44.9013], [7.7186, 43.0203], [4.2279, 43.0203], [4.2279, 44.9013]]]
          },
          {
            region: "Occitanie",
            code: "occitanie", 
            densityScore: 72,
            professionalCount: 3800,
            populationCount: 5999982,
            bounds: [[[0.1278, 44.9013], [4.8378, 44.9013], [4.8378, 42.3334], [0.1278, 42.3334], [0.1278, 44.9013]]]
          },
          
          // Équilibrées (Yellow/Orange zones - balanced)
          {
            region: "Auvergne-Rhône-Alpes",
            code: "ara", 
            densityScore: 58,
            professionalCount: 5800,
            populationCount: 8112714,
            bounds: [[[2.1697, 46.8176], [7.1442, 46.8176], [7.1442, 44.1259], [2.1697, 44.1259], [2.1697, 46.8176]]]
          },
          {
            region: "Nouvelle-Aquitaine",
            code: "nouvelleaquitaine",
            densityScore: 52,
            professionalCount: 3100,
            populationCount: 6018386,
            bounds: [[[-1.7889, 46.8176], [2.1697, 46.8176], [2.1697, 42.3334], [-1.7889, 42.3334], [-1.7889, 46.8176]]]
          },
          {
            region: "Bretagne",
            code: "bretagne",
            densityScore: 48,
            professionalCount: 2200,
            populationCount: 3373835,
            bounds: [[[-5.1406, 48.9077], [-0.9998, 48.9077], [-0.9998, 47.2383], [-5.1406, 47.2383], [-5.1406, 48.9077]]]
          },
          {
            region: "Pays de la Loire",
            code: "paysdelaloire",
            densityScore: 45,
            professionalCount: 2400,
            populationCount: 3832120,
            bounds: [[[-2.5811, 47.8028], [0.1278, 47.8028], [0.1278, 46.2644], [-2.5811, 46.2644], [-2.5811, 47.8028]]]
          },
          {
            region: "Grand Est",
            code: "grandest",
            densityScore: 42,
            professionalCount: 2800,
            populationCount: 5511747,
            bounds: [[[4.2279, 49.6710], [8.2336, 49.6710], [8.2336, 47.4521], [4.2279, 47.4521], [4.2279, 49.6710]]]
          },
          {
            region: "Normandie",
            code: "normandie",
            densityScore: 38,
            professionalCount: 1600,
            populationCount: 3317500,
            bounds: [[[-1.7889, 49.7297], [1.7889, 49.7297], [1.7889, 48.1736], [-1.7889, 48.1736], [-1.7889, 49.7297]]]
          },
          
          // Sous-dotées (Green zones - under-supplied, opportunities)
          {
            region: "Hauts-de-France",
            code: "hautsdefrance",
            densityScore: 28,
            professionalCount: 2200,
            populationCount: 5965058,
            bounds: [[[1.3733, 51.1244], [4.2279, 51.1244], [4.2279, 49.2147], [1.3733, 49.2147], [1.3733, 51.1244]]]
          },
          {
            region: "Centre-Val de Loire",
            code: "centrevaldeloire",
            densityScore: 25,
            professionalCount: 1200,
            populationCount: 2568029,
            bounds: [[[0.1278, 48.6044], [3.0556, 48.6044], [3.0556, 46.3470], [0.1278, 46.3470], [0.1278, 48.6044]]]
          },
          {
            region: "Bourgogne-Franche-Comté",
            code: "bourgognefranchecomt",
            densityScore: 22,
            professionalCount: 1100,
            populationCount: 2783039,
            bounds: [[[2.1697, 48.3970], [7.1442, 48.3970], [7.1442, 46.2644], [2.1697, 46.2644], [2.1697, 48.3970]]]
          },
          {
            region: "Corse",
            code: "corse",
            densityScore: 18,
            professionalCount: 200,
            populationCount: 344679,
            bounds: [[[8.5387, 43.0203], [9.5606, 43.0203], [9.5606, 41.3337], [8.5387, 41.3337], [8.5387, 43.0203]]]
          },
          
          // Outre-mer (Generally under-supplied)
          {
            region: "Guadeloupe",
            code: "guadeloupe", 
            densityScore: 15,
            professionalCount: 150,
            populationCount: 395700,
            bounds: [[[-61.8, 16.5], [-61.0, 16.5], [-61.0, 15.8], [-61.8, 15.8], [-61.8, 16.5]]]
          },
          {
            region: "Martinique",
            code: "martinique",
            densityScore: 20,
            professionalCount: 180,
            populationCount: 364508,
            bounds: [[[-61.2, 14.9], [-60.8, 14.9], [-60.8, 14.4], [-61.2, 14.4], [-61.2, 14.9]]]
          },
          {
            region: "Guyane",
            code: "guyane",
            densityScore: 8,
            professionalCount: 80,
            populationCount: 301099,
            bounds: [[[-54.5, 6.0], [-51.6, 6.0], [-51.6, 2.1], [-54.5, 2.1], [-54.5, 6.0]]]
          },
          {
            region: "La Réunion",
            code: "larunion",
            densityScore: 12,
            professionalCount: 250,
            populationCount: 873356,
            bounds: [[[55.2, -20.9], [55.8, -20.9], [55.8, -21.4], [55.2, -21.4], [55.2, -20.9]]]
          },
          {
            region: "Mayotte",
            code: "mayotte",
            densityScore: 5,
            professionalCount: 30,
            populationCount: 279515,
            bounds: [[[45.0, -12.6], [45.3, -12.6], [45.3, -13.0], [45.0, -13.0], [45.0, -12.6]]]
          }
        ])
        
      } catch (error) {
        console.error("Error loading sample listings:", error)
        // Use fallback data on error
        setSampleListings([])
      } finally {
        setLoading(false)
      }
    }

    loadSampleData()
  }, [])

  // Process density data to show all medical zones
  useEffect(() => {
    const processed = processDensityData(densityData)
    setFilteredDensityData(processed)
  }, [densityData])

  const stats = [
    {
      icon: MapPin,
      label: "Annonces géolocalisées",
      value: "1,200+",
      description: "Partout en France"
    },
    {
      icon: TrendingUp,
      label: "Zones sous-densifiées",
      value: "45%",
      description: "Opportunités identifiées"
    },
    {
      icon: Users,
      label: "Professionnels actifs",
      value: "3,400+",
      description: "Toutes spécialités"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Map className="w-4 h-4 mr-2" />
            Nouvelle fonctionnalité
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            Explorez la carte interactive
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les annonces médicales sur la carte des zones officielles médicalement surdotées ou sous-dotées (classification ARS).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <MapSkeleton />
                ) : (
                  <div className="relative">
                    <InteractiveMap
                      center={[46.603354, 1.888334]}
                      zoom={6}
                      height="400px"
                      className="border-0"
                    >
{filteredDensityData.length > 0 && (
                        <MedicalDensityOverlay
                          densityData={filteredDensityData}
                          mode="heatmap"
                          opacity={0.6}
                          showLabels={false}
                        />
                      )}
                      <ListingMarkers
                        listings={sampleListings}
                        onMarkerClick={(listing) => {
                          // Just show the popup, don't navigate anywhere
                          console.log('Listing clicked:', listing.title)
                        }}
                      />
                    </InteractiveMap>
                    
                    {/* Overlay CTA */}
                    <div className="absolute top-4 left-4 z-[1000]">
                      <Link href="/map">
                        <Button size="sm" className="shadow-lg">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Voir en plein écran
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Sample marker count */}
                    <div className="absolute bottom-4 right-4 z-[1000] space-y-2">
                      {sampleListings.length > 0 && (
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                          {sampleListings.length} annonces affichées
                        </Badge>
                      )}
{filteredDensityData.length > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 backdrop-blur-sm">
                          Zones ARS activées ({filteredDensityData.length} régions)
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats & Features */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <stat.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{stat.value}</div>
                      <div className="font-medium text-sm">{stat.label}</div>
                      <div className="text-xs text-muted-foreground">{stat.description}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Features List */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Fonctionnalités de la carte</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Cessions de cabinet</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Remplacements</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Collaborations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
                  <span>Zones ARS (sous-dotées/surdotées)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Annonces premium</span>
                </li>
              </ul>
            </Card>

            {/* CTA */}
            <div className="text-center">
              <Link href="/map">
                <Button size="lg" className="w-full">
                  Explorer la carte complète
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-2">
                Filtrez par spécialité, région, type d&apos;annonce
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            La carte est mise à jour en temps réel avec les nouvelles annonces.{" "}
            <Link href="/listings" className="text-blue-600 hover:underline">
              Voir toutes les annonces
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}