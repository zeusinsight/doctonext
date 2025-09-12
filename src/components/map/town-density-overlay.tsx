"use client"

import { useEffect, useState } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import { type MedicalProfession, type ZonageLevel } from "@/lib/services/town-density-types"

interface TownDensityData {
  code: string
  name: string
  zonage: ZonageLevel
  profession: MedicalProfession
  boundary: {
    name: string
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
  color: string
  densityScore: number
  label: string
}

interface TownDensityOverlayProps {
  profession: MedicalProfession
  zonageFilter?: ZonageLevel[]
  opacity?: number
  showLabels?: boolean
  maxTowns?: number
  onTownClick?: (town: TownDensityData) => void
}

// Convert GeoJSON coordinates to Leaflet format
function convertCoordinates(
  coordinates: number[][][] | number[][][][],
  type: 'Polygon' | 'MultiPolygon'
): L.LatLngExpression[] | L.LatLngExpression[][] {
  if (type === 'Polygon') {
    return (coordinates as number[][][]).map(ring =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    ) as L.LatLngExpression[][]
  } else {
    // MultiPolygon - flatten to array of polygons
    return (coordinates as number[][][][]).flatMap(polygon =>
      polygon.map(ring =>
        ring.map(([lng, lat]) => [lat, lng] as [number, number])
      )
    ) as L.LatLngExpression[][]
  }
}

export function TownDensityOverlay({
  profession,
  zonageFilter,
  opacity = 0.6,
  showLabels = false,
  maxTowns = 200,
  onTownClick
}: TownDensityOverlayProps) {
  const map = useMap()
  const [overlayLayers, setOverlayLayers] = useState<L.Layer[]>([])
  const [townsData, setTownsData] = useState<TownDensityData[]>([])
  const [loading, setLoading] = useState(false)

  // Load town density data
  useEffect(() => {
    let isCancelled = false
    
    const loadTownData = async () => {
      setLoading(true)
      
      try {
        const params = new URLSearchParams({
          profession,
          limit: maxTowns.toString()
        })
        
        if (zonageFilter?.length) {
          // For multiple zonage filters, we'll need to make separate requests
          // For now, just use the first one
          params.append('zonage', zonageFilter[0])
        }
        
        const response = await fetch(`/api/map/town-density?${params}`)
        if (!response.ok) throw new Error('Failed to load town data')
        
        const result = await response.json()
        
        if (!isCancelled && result.success) {
          const towns = result.data.towns || []
          console.log(`Loaded ${towns.length} towns for ${profession}`)
          setTownsData(towns)
        }
      } catch (error) {
        console.error('Error loading town density data:', error)
        if (!isCancelled) {
          setTownsData([])
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }
    
    loadTownData()
    
    return () => {
      isCancelled = true
    }
  }, [profession, zonageFilter, maxTowns])

  // Create map layers
  useEffect(() => {
    if (!map || !townsData.length || loading) return

    // Clear existing layers
    overlayLayers.forEach(layer => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer)
      }
    })

    const newLayers: L.Layer[] = []
    let processedCount = 0

    console.log(`Creating polygons for ${townsData.length} towns...`)

    townsData.forEach((town) => {
      try {
        // Convert coordinates to Leaflet format
        const latLngCoords = convertCoordinates(town.boundary.coordinates, town.boundary.type)
        
        // Create polygon(s)
        let polygon: L.Polygon
        
        if (town.boundary.type === 'Polygon') {
          polygon = L.polygon(latLngCoords as L.LatLngExpression[][], {
            color: town.color,
            fillColor: town.color,
            fillOpacity: opacity,
            weight: 1,
            opacity: 0.8
          })
        } else {
          // MultiPolygon - create first polygon (simplified for performance)
          const firstPolygon = (latLngCoords as L.LatLngExpression[][])[0]
          if (firstPolygon) {
            polygon = L.polygon([firstPolygon], {
              color: town.color,
              fillColor: town.color,
              fillOpacity: opacity,
              weight: 1,
              opacity: 0.8
            })
          } else {
            return // Skip if no valid coordinates
          }
        }

        // Add tooltip
        polygon.bindTooltip(
          `
            <div style="padding: 4px; min-width: 150px;">
              <div style="font-weight: 600; margin-bottom: 2px;">${town.name}</div>
              <div style="font-size: 12px;">
                <div>Zonage: <span style="color: ${town.color}; font-weight: 500;">${town.label}</span></div>
                <div>Profession: ${profession}</div>
                <div style="margin-top: 4px; font-size: 11px; color: #666;">
                  Code INSEE: ${town.code}
                </div>
              </div>
            </div>
          `,
          {
            sticky: true,
            className: "town-density-tooltip",
            direction: "top"
          }
        )

        // Add click handler
        polygon.on("click", (e) => {
          e.originalEvent.stopPropagation()
          
          if (onTownClick) {
            onTownClick(town)
          }
          
          // Show popup with detailed info
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`
              <div style="padding: 8px; min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; font-size: 16px;">${town.name}</h4>
                <div style="font-size: 13px; line-height: 1.4;">
                  <div style="margin-bottom: 4px;">
                    <strong>Statut:</strong> 
                    <span style="color: ${town.color}; font-weight: 600;">${town.label}</span>
                  </div>
                  <div style="margin-bottom: 4px;">
                    <strong>Profession:</strong> ${profession}
                  </div>
                  <div style="margin-bottom: 4px;">
                    <strong>Score densité:</strong> ${town.densityScore}/100
                  </div>
                  <div style="padding-top: 4px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
                    Code INSEE: ${town.code}
                  </div>
                </div>
              </div>
            `)
            .openOn(map)
        })

        polygon.addTo(map)
        newLayers.push(polygon)
        processedCount++

        // Add labels if enabled and not too many towns
        if (showLabels && townsData.length < 50) {
          const bounds = polygon.getBounds()
          const center = bounds.getCenter()

          const label = L.marker(center, {
            icon: L.divIcon({
              className: "town-label",
              html: `
                <div style="
                  background: rgba(255, 255, 255, 0.9);
                  padding: 1px 4px;
                  border-radius: 2px;
                  font-size: 10px;
                  font-weight: 500;
                  text-align: center;
                  border: 1px solid rgba(0, 0, 0, 0.1);
                  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                  white-space: nowrap;
                  max-width: 80px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">
                  ${town.name}
                </div>
              `,
              iconSize: [0, 0],
              iconAnchor: [0, 0]
            })
          })

          label.addTo(map)
          newLayers.push(label)
        }

      } catch (error) {
        console.warn(`Error creating polygon for town ${town.code}:`, error)
      }
    })

    console.log(`Successfully created ${processedCount} town polygons`)
    setOverlayLayers(newLayers)

    // Cleanup function
    return () => {
      newLayers.forEach(layer => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer)
        }
      })
    }
  }, [map, townsData, profession, opacity, showLabels, onTownClick, loading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      overlayLayers.forEach(layer => {
        if (map?.hasLayer(layer)) {
          map.removeLayer(layer)
        }
      })
    }
  }, [map, overlayLayers])

  // This component doesn't render anything directly
  return null
}