"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map, MapPin, TrendingUp, Users, ArrowRight } from "lucide-react"
import type { MapListing } from "@/components/map/listing-markers"
import type { MedicalProfession } from "@/lib/services/town-density-types"

// Dynamic imports to prevent SSR issues
const InteractiveMap = dynamic(
  () => import("@/components/map/interactive-map").then((mod) => mod.InteractiveMap),
  { ssr: false, loading: () => <MapSkeleton /> }
)

const ListingMarkers = dynamic(
  () => import("@/components/map/listing-markers").then((mod) => mod.ListingMarkers),
  { ssr: false }
)

const ViewportOptimizedTownOverlay = dynamic(
  () => import("@/components/map/viewport-optimized-town-overlay").then((mod) => mod.ViewportOptimizedTownOverlay),
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
  const [selectedProfession] = useState<MedicalProfession>('chirurgiens-dentistes')
  const [loading, setLoading] = useState(true)

  // Town density is now handled directly by the TownDensityOverlay component

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
        
        // Town density data is now loaded by the TownDensityOverlay component
        
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


  const stats = [
    {
      icon: MapPin,
      label: "Communes analysées",
      value: "35,000+",
      description: "Toute la France"
    },
    {
      icon: TrendingUp,
      label: "Zones sous-dotées",
      value: "70%",
      description: "Opportunités chirurgiens-dentistes"
    },
    {
      icon: Users,
      label: "Professions médicales",
      value: "5",
      description: "Données ARS officielles"
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
            Explorez la densité médicale par commune avec les données officielles ARS. Identifiez les opportunités d'installation pour chaque profession médicale.
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
<ViewportOptimizedTownOverlay
                        profession={selectedProfession}
                        opacity={0.6}
                        showLabels={false}
                        onTownClick={(town) => {
                          console.log('Town clicked:', town.name)
                        }}
                      />
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
<Badge variant="secondary" className="bg-green-100 text-green-800 backdrop-blur-sm">
                        Densité par commune • {selectedProfession}
                      </Badge>
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
                  <span>Zonage médical par commune (ARS)</span>
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