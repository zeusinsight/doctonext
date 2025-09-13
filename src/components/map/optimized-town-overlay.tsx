"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import { useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import * as Comlink from "comlink"
import { type MedicalProfession, type ZonageLevel } from "@/lib/services/town-density-types"
import { SpatialIndex, calculatePolygonBounds, leafletBoundsToViewport, type IndexedItem } from "@/lib/utils/spatial-index"
import { MAJOR_CITIES, shouldShowCityLabel, getCityLabelStyle, type CityInfo } from "@/lib/data/major-cities"

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

interface OptimizedTownOverlayProps {
  profession: MedicalProfession
  zonageFilter?: ZonageLevel[]
  opacity?: number
  showLabels?: boolean
  onTownClick?: (town: TownDensityData) => void
  onLoadingChange?: (loading: boolean) => void
  onTownCountChange?: (count: number) => void
}

// Convert coordinates helper with memoization
const coordinateCache = new Map<string, L.LatLngExpression[] | L.LatLngExpression[][]>()

function convertCoordinates(
  coordinates: number[][][] | number[][][][],
  type: 'Polygon' | 'MultiPolygon'
): L.LatLngExpression[] | L.LatLngExpression[][] {
  const cacheKey = `${JSON.stringify(coordinates)}_${type}`

  if (coordinateCache.has(cacheKey)) {
    return coordinateCache.get(cacheKey)!
  }

  let result: L.LatLngExpression[] | L.LatLngExpression[][]

  if (type === 'Polygon') {
    result = (coordinates as number[][][]).map(ring =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    ) as L.LatLngExpression[][]
  } else {
    result = (coordinates as number[][][][]).flatMap(polygon =>
      polygon.map(ring =>
        ring.map(([lng, lat]) => [lat, lng] as [number, number])
      )
    ) as L.LatLngExpression[][]
  }

  // Cache with size limit
  if (coordinateCache.size > 1000) {
    const firstKey = coordinateCache.keys().next().value
    if (firstKey) {
      coordinateCache.delete(firstKey)
    }
  }

  coordinateCache.set(cacheKey, result)
  return result
}

// Memoized polygon component
const MemoizedPolygon = React.memo<{
  town: TownDensityData
  opacity: number
  onTownClick?: (town: TownDensityData) => void
  strokeWeight: number
  strokeOpacity: number
}>(({ town, opacity, onTownClick, strokeWeight, strokeOpacity }) => {
  const map = useMap()
  const polygonRef = useRef<L.Polygon | null>(null)

  useEffect(() => {
    if (!map) return

    try {
      const latLngCoords = convertCoordinates(town.boundary.coordinates, town.boundary.type)

      let polygon: L.Polygon

      if (town.boundary.type === 'Polygon') {
        polygon = L.polygon(latLngCoords as L.LatLngExpression[][], {
          color: town.color,
          fillColor: town.color,
          fillOpacity: opacity,
          weight: strokeWeight,
          opacity: strokeOpacity,
          pane: 'overlayPane' // Use specific pane for better performance
        })
      } else {
        const firstPolygon = (latLngCoords as L.LatLngExpression[][])[0]
        if (!firstPolygon) return

        polygon = L.polygon([firstPolygon], {
          color: town.color,
          fillColor: town.color,
          fillOpacity: opacity,
          weight: strokeWeight,
          opacity: strokeOpacity,
          pane: 'overlayPane'
        })
      }

      // Efficient tooltip
      polygon.bindTooltip(
        `<div class="town-tooltip">
          <div class="town-name">${town.name}</div>
          <div class="town-info">
            <div>Zonage: <span style="color: ${town.color};">${town.label}</span></div>
            <div>Code: ${town.code}</div>
          </div>
        </div>`,
        {
          sticky: true,
          className: "town-density-tooltip",
          direction: "top",
          permanent: false,
          opacity: 0.9
        }
      )

      // Click handler
      polygon.on("click", (e) => {
        e.originalEvent.stopPropagation()
        onTownClick?.(town)

        // Use reusable popup
        const popupContent = `
          <div class="town-popup">
            <h4>${town.name}</h4>
            <div class="town-details">
              <div><strong>Statut:</strong> <span style="color: ${town.color};">${town.label}</span></div>
              <div><strong>Profession:</strong> ${town.profession}</div>
              <div><strong>Score densité:</strong> ${town.densityScore}/100</div>
              <div class="town-code">Code INSEE: ${town.code}</div>
            </div>
          </div>
        `

        L.popup({ maxWidth: 300 })
          .setLatLng(e.latlng)
          .setContent(popupContent)
          .openOn(map)
      })

      polygon.addTo(map)
      polygonRef.current = polygon

      return () => {
        if (polygonRef.current && map.hasLayer(polygonRef.current)) {
          map.removeLayer(polygonRef.current)
        }
      }
    } catch (error) {
      console.warn(`Error creating polygon for town ${town.code}:`, error)
    }
  }, [map, town, opacity, onTownClick, strokeWeight, strokeOpacity])

  return null
})

MemoizedPolygon.displayName = 'MemoizedPolygon'

export function OptimizedTownOverlay({
  profession,
  zonageFilter,
  opacity = 0.6,
  showLabels = false,
  onTownClick,
  onLoadingChange,
  onTownCountChange
}: OptimizedTownOverlayProps) {
  const map = useMap()
  const [visibleTowns, setVisibleTowns] = useState<TownDensityData[]>([])
  const [loading, setLoading] = useState(false)
  const [spatialIndex, setSpatialIndex] = useState<SpatialIndex | null>(null)

  const workerRef = useRef<Comlink.Remote<any> | null>(null)
  const currentViewportRef = useRef<any>(null)
  const townsDataRef = useRef<Map<string, TownDensityData>>(new Map())
  const lastUpdateRef = useRef<number>(0)

  // Initialize Web Worker
  useEffect(() => {
    const initWorker = async () => {
      try {
        // Check if Web Workers are supported and we're in browser
        if (typeof Worker !== 'undefined' && typeof window !== 'undefined') {
          // For now, disable Web Worker in Next.js build - can be re-enabled with proper webpack config
          console.log('Web Worker initialization skipped for Next.js compatibility')
          // const worker = new Worker('/workers/boundary-processor.js')
          // workerRef.current = Comlink.wrap(worker)
        }
      } catch (error) {
        console.warn('Could not initialize Web Worker:', error)
      }
    }

    initWorker()

    return () => {
      if (workerRef.current) {
        workerRef.current[Comlink.releaseProxy]()
      }
    }
  }, [])

  // Load and index town data
  useEffect(() => {
    let isCancelled = false

    const loadData = async () => {
      setLoading(true)
      onLoadingChange?.(true)

      try {
        const response = await fetch(`/api/map/town-density?profession=${profession}&limit=50000`)
        if (!response.ok) throw new Error('Failed to load town data')

        const result = await response.json()
        if (!result.success) throw new Error('API returned error')

        if (isCancelled) return

        const townsData = new Map<string, TownDensityData>()
        const towns = result.data.towns || []

        // Create spatial index with slightly expanded France bounds
        const index = new SpatialIndex({
          minLat: 40.0, maxLat: 52.0, // Expanded France bounds
          minLng: -6.0, maxLng: 11.0
        }, 20, 6) // Increase maxItems and maxDepth for better granularity

        // Index all towns
        towns.forEach((town: TownDensityData) => {
          townsData.set(town.code, town)

          const bounds = calculatePolygonBounds(town.boundary.coordinates, town.boundary.type)
          index.insert({
            id: town.code,
            bounds,
            data: town
          })
        })

        if (!isCancelled) {
          townsDataRef.current = townsData
          setSpatialIndex(index)
          console.log(`Indexed ${townsData.size} towns for ${profession}`)
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

  // Update visible towns with throttling
  const updateVisibleTowns = useCallback(
    async (bounds: L.LatLngBounds) => {
      if (!spatialIndex || loading) return

      const now = Date.now()
      if (now - lastUpdateRef.current < 100) { // Throttle updates
        return
      }
      lastUpdateRef.current = now

      const viewport = leafletBoundsToViewport(bounds)
      const zoomLevel = map.getZoom()

      let processedTowns: TownDensityData[]

      // At low zoom levels (country/region view), use simple bounds checking instead of spatial index
      // This ensures complete coverage without gaps
      if (zoomLevel <= 7) {
        console.log(`Low zoom (${zoomLevel}): using simple viewport filtering for complete coverage`)

        processedTowns = []
        for (const town of townsDataRef.current.values()) {
          // Simple bounds check with padding
          const bounds = calculatePolygonBounds(town.boundary.coordinates, town.boundary.type)
          const padding = 0.5 // More generous padding for low zoom

          if (!(bounds.maxLat < (viewport.south - padding) ||
                bounds.minLat > (viewport.north + padding) ||
                bounds.maxLng < (viewport.west - padding) ||
                bounds.minLng > (viewport.east + padding))) {
            processedTowns.push(town)
          }
        }

        console.log(`Low zoom: found ${processedTowns.length} towns with simple filtering`)
      } else {
        // For higher zoom levels, use spatial index for performance
        const visibleItems: IndexedItem[] = spatialIndex.query(viewport)

        if (workerRef.current) {
          try {
            processedTowns = await workerRef.current.processTownData(
              new Map(visibleItems.map(item => [item.id, item.data])),
              viewport,
              zoomLevel
            )
          } catch (error) {
            console.warn('Web Worker processing failed, falling back to main thread:', error)
            processedTowns = visibleItems.map(item => item.data)
          }
        } else {
          processedTowns = visibleItems.map(item => item.data)
        }
      }

      // Apply zonage filter
      if (zonageFilter?.length) {
        processedTowns = processedTowns.filter(town => zonageFilter.includes(town.zonage))
      }

      // Only limit at very high zoom levels to prevent performance issues
      // At low zoom, show all towns in viewport for complete coverage
      if (zoomLevel > 12 && processedTowns.length > 10000) {
        console.warn(`High zoom: limiting ${processedTowns.length} towns to 10000 for performance`)
        processedTowns = processedTowns.slice(0, 10000)
      }

      setVisibleTowns(processedTowns)
      onTownCountChange?.(processedTowns.length)

      console.log(`Rendered ${processedTowns.length} towns (zoom: ${zoomLevel})`)
    },
    [spatialIndex, loading, zonageFilter, map, onTownCountChange]
  )

  // Map event handlers with debouncing
  useMapEvents({
    moveend: useCallback(() => {
      const bounds = map.getBounds()
      currentViewportRef.current = bounds
      updateVisibleTowns(bounds)
    }, [map, updateVisibleTowns]),

    zoomend: useCallback(() => {
      const bounds = map.getBounds()
      currentViewportRef.current = bounds
      updateVisibleTowns(bounds)
    }, [map, updateVisibleTowns])
  })

  // Initial viewport setup
  useEffect(() => {
    if (map && spatialIndex && !loading) {
      const bounds = map.getBounds()
      currentViewportRef.current = bounds
      updateVisibleTowns(bounds)
    }
  }, [map, spatialIndex, loading, updateVisibleTowns])

  // Calculate dynamic rendering properties based on zoom
  const currentZoom = map.getZoom()
  const strokeWeight = currentZoom > 12 ? 1.5 : currentZoom > 8 ? 1 : 0.5
  const strokeOpacity = currentZoom > 10 ? 0.8 : 0.6

  return (
    <>
      {/* Render polygons */}
      {visibleTowns.map((town) => (
        <MemoizedPolygon
          key={town.code}
          town={town}
          opacity={opacity}
          onTownClick={onTownClick}
          strokeWeight={strokeWeight}
          strokeOpacity={strokeOpacity}
        />
      ))}

      {/* Render labels */}
      {showLabels && visibleTowns.length < 500 && visibleTowns.map((town) => {
        const cityInfo = MAJOR_CITIES[town.code]
        const shouldShowLabel =
          (cityInfo && shouldShowCityLabel(town.code, currentZoom)) ||
          (!cityInfo && currentZoom > 9 && visibleTowns.length < 200)

        if (!shouldShowLabel) return null

        return (
          <CityLabel
            key={`label-${town.code}`}
            town={town}
            cityInfo={cityInfo}
            currentZoom={currentZoom}
          />
        )
      })}
    </>
  )
}

// Memoized city label component
const CityLabel = React.memo<{
  town: TownDensityData
  cityInfo?: CityInfo
  currentZoom: number
}>(({ town, cityInfo, currentZoom }) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // Calculate approximate center from boundary
    const bounds = calculatePolygonBounds(town.boundary.coordinates, town.boundary.type)
    const center: [number, number] = [
      (bounds.minLat + bounds.maxLat) / 2,
      (bounds.minLng + bounds.maxLng) / 2
    ]

    const priority = cityInfo?.priority || 4
    const labelStyle = getCityLabelStyle(priority, currentZoom)
    const displayName = cityInfo?.name || town.name

    const label = L.marker(center, {
      icon: L.divIcon({
        className: `town-label-container town-label priority-${priority}`,
        html: `<div class="town-label-content" style="
          background: ${labelStyle.background};
          padding: ${labelStyle.padding};
          font-size: ${labelStyle.fontSize}px;
          font-weight: ${labelStyle.fontWeight};
          border: ${labelStyle.border};
          box-shadow: ${labelStyle.boxShadow};
          border-radius: 4px;
          white-space: nowrap;
        ">${displayName}</div>`,
        iconSize: null as unknown as L.PointExpression | undefined,
      }),
      interactive: false, // Labels don't need interaction
      pane: 'markerPane' // Render above overlay polygons
    })

    label.addTo(map)

    return () => {
      if (map.hasLayer(label)) {
        map.removeLayer(label)
      }
    }
  }, [map, town, cityInfo, currentZoom])

  return null
})

CityLabel.displayName = 'CityLabel'