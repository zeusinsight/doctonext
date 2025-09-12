"use client"

import { useEffect, useState, useRef } from "react"
import { useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { type MedicalProfession, type ZonageLevel } from "@/lib/services/town-density-types"
import { TownDensityLoader } from "@/lib/services/town-medical-density"

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

interface ViewportOptimizedTownOverlayProps {
  profession: MedicalProfession
  zonageFilter?: ZonageLevel[]
  opacity?: number
  showLabels?: boolean
  onTownClick?: (town: TownDensityData) => void
  onLoadingChange?: (loading: boolean) => void
  onTownCountChange?: (count: number) => void
}

// Convert coordinates helper (same as before)
function convertCoordinates(
  coordinates: number[][][] | number[][][][],
  type: 'Polygon' | 'MultiPolygon'
): L.LatLngExpression[] | L.LatLngExpression[][] {
  if (type === 'Polygon') {
    return (coordinates as number[][][]).map(ring =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    ) as L.LatLngExpression[][]
  } else {
    return (coordinates as number[][][][]).flatMap(polygon =>
      polygon.map(ring =>
        ring.map(([lng, lat]) => [lat, lng] as [number, number])
      )
    ) as L.LatLngExpression[][]
  }
}

export function ViewportOptimizedTownOverlay({
  profession,
  zonageFilter,
  opacity = 0.6,
  showLabels = false,
  onTownClick,
  onLoadingChange,
  onTownCountChange
}: ViewportOptimizedTownOverlayProps) {
  const map = useMap()
  const [overlayLayers, setOverlayLayers] = useState<L.Layer[]>([])
  const [visibleTowns, setVisibleTowns] = useState<TownDensityData[]>([])
  const [allTowns, setAllTowns] = useState<Map<string, TownDensityData>>(new Map())
  const [loading, setLoading] = useState(false)
  
  const loaderRef = useRef<TownDensityLoader | null>(null)
  const currentViewportRef = useRef<L.LatLngBounds | null>(null)

  // Initialize loader
  useEffect(() => {
    loaderRef.current = new TownDensityLoader()
    return () => {
      loaderRef.current?.clear()
    }
  }, [])

  // Load all town data progressively when profession changes
  useEffect(() => {
    if (!loaderRef.current) return

    let isCancelled = false
    
    const loadData = async () => {
      setLoading(true)
      onLoadingChange?.(true)
      
      try {
        console.log(`Starting progressive load for ${profession}...`)
        
        // Load town data via API instead of direct file access
        const response = await fetch(`/api/map/town-density?profession=${profession}&limit=50000`)
        if (!response.ok) throw new Error('Failed to load town data')
        
        const result = await response.json()
        if (!result.success) throw new Error('API returned error')
        
        // Convert API response to Map format expected by component
        const townsMap = new Map<string, TownDensityData>()
        const towns = result.data.towns || []
        
        towns.forEach((town: any) => {
          townsMap.set(town.code, {
            code: town.code,
            name: town.name,
            zonage: town.zonage,
            profession: town.profession,
            boundary: town.boundary,
            color: town.color,
            densityScore: town.densityScore,
            label: town.label
          })
        })
        
        if (!isCancelled) {
          setAllTowns(townsMap)
          console.log(`Finished loading ${townsMap.size} towns for ${profession}`)
          
          // Trigger viewport update
          if (currentViewportRef.current) {
            updateVisibleTowns(currentViewportRef.current, townsMap)
          }
        }
      } catch (error) {
        console.error('Error loading town data:', error)
      } finally {
        if (!isCancelled) {
          setLoading(false)
          onLoadingChange?.(false)
        }
      }
    }
    
    loadData()
    
    return () => {
      isCancelled = true
    }
  }, [profession, onLoadingChange])

  // Update visible towns based on viewport and filters
  const updateVisibleTowns = (
    bounds: L.LatLngBounds, 
    townsData: Map<string, TownDensityData> = allTowns
  ) => {
    if (!townsData.size) return

    const visibleTownsList: TownDensityData[] = []
    // Show ALL towns - no artificial limit based on zoom
    const maxTownsToRender = 50000 // High limit to effectively show all

    let count = 0
    for (const town of townsData.values()) {
      if (count >= maxTownsToRender) break
      
      // Apply zonage filter
      if (zonageFilter?.length && !zonageFilter.includes(town.zonage)) {
        continue
      }
      
      // Simple bounds check - get first coordinate of first polygon
      let lat = 0, lng = 0
      if (town.boundary.type === 'Polygon') {
        const coords = town.boundary.coordinates as number[][][]
        if (coords[0]?.[0]) {
          [lng, lat] = coords[0][0]
        }
      } else {
        const coords = town.boundary.coordinates as number[][][][]
        if (coords[0]?.[0]?.[0]) {
          [lng, lat] = coords[0][0][0]
        }
      }
      
      if (bounds.contains([lat, lng])) {
        visibleTownsList.push(town)
        count++
      }
    }

    console.log(`Showing ${visibleTownsList.length} towns in viewport (zoom: ${map.getZoom()})`)
    setVisibleTowns(visibleTownsList)
    onTownCountChange?.(visibleTownsList.length)
  }

  // Map event handlers
  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds()
      currentViewportRef.current = bounds
      updateVisibleTowns(bounds)
    },
    zoomend: () => {
      const bounds = map.getBounds()
      currentViewportRef.current = bounds
      updateVisibleTowns(bounds)
    }
  })

  // Update visible towns when filters change
  useEffect(() => {
    if (currentViewportRef.current) {
      updateVisibleTowns(currentViewportRef.current)
    }
  }, [zonageFilter])

  // Initial viewport setup
  useEffect(() => {
    if (map && allTowns.size > 0) {
      const bounds = map.getBounds()
      currentViewportRef.current = bounds
      updateVisibleTowns(bounds)
    }
  }, [map, allTowns])

  // Create map polygons for visible towns
  useEffect(() => {
    if (!map || loading) return

    // Clear existing layers
    overlayLayers.forEach(layer => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer)
      }
    })

    if (!visibleTowns.length) {
      setOverlayLayers([])
      return
    }

    const newLayers: L.Layer[] = []
    let processedCount = 0

    console.log(`Rendering ${visibleTowns.length} town polygons...`)

    visibleTowns.forEach((town) => {
      try {
        const latLngCoords = convertCoordinates(town.boundary.coordinates, town.boundary.type)
        
        let polygon: L.Polygon
        
        // Adjust stroke weight based on zoom for performance and clarity
        const currentZoom = map.getZoom()
        const strokeWeight = currentZoom > 12 ? 1.5 : currentZoom > 8 ? 1 : 0.5
        const strokeOpacity = currentZoom > 10 ? 0.8 : 0.6
        
        if (town.boundary.type === 'Polygon') {
          polygon = L.polygon(latLngCoords as L.LatLngExpression[][], {
            color: town.color,
            fillColor: town.color,
            fillOpacity: opacity,
            weight: strokeWeight,
            opacity: strokeOpacity
          })
        } else {
          const firstPolygon = (latLngCoords as L.LatLngExpression[][])[0]
          if (!firstPolygon) return
          
          polygon = L.polygon([firstPolygon], {
            color: town.color,
            fillColor: town.color,
            fillOpacity: opacity,
            weight: strokeWeight,
            opacity: strokeOpacity
          })
        }

        // Tooltip
        polygon.bindTooltip(
          `
            <div style="padding: 4px; min-width: 150px;">
              <div style="font-weight: 600; margin-bottom: 2px;">${town.name}</div>
              <div style="font-size: 12px;">
                <div>Zonage: <span style="color: ${town.color}; font-weight: 500;">${town.label}</span></div>
                <div>Code: ${town.code}</div>
              </div>
            </div>
          `,
          {
            sticky: true,
            className: "town-density-tooltip",
            direction: "top"
          }
        )

        // Click handler
        polygon.on("click", (e) => {
          e.originalEvent.stopPropagation()
          onTownClick?.(town)
          
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

        // Add labels for high zoom levels only
        if (showLabels && map.getZoom() > 9 && visibleTowns.length < 100) {
          const bounds = polygon.getBounds()
          const center = bounds.getCenter()

          const label = L.marker(center, {
            icon: L.divIcon({
              className: "town-label",
              html: `
                <div style="
                  background: rgba(255, 255, 255, 0.95);
                  padding: 1px 3px;
                  border-radius: 2px;
                  font-size: 9px;
                  font-weight: 500;
                  text-align: center;
                  border: 1px solid rgba(0, 0, 0, 0.1);
                  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                  white-space: nowrap;
                  max-width: 60px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">
                  ${town.name.length > 8 ? town.name.substring(0, 8) + '...' : town.name}
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

    console.log(`Successfully rendered ${processedCount} town polygons`)
    setOverlayLayers(newLayers)

    return () => {
      newLayers.forEach(layer => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer)
        }
      })
    }
  }, [map, visibleTowns, profession, opacity, showLabels, onTownClick, loading])

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

  return null
}