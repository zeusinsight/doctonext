"use client"

import { useEffect, useState, useRef } from "react"
import { useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import type {
    MedicalProfession,
    ZonageLevel
} from "@/lib/services/town-density-types"
import { TownDensityLoader } from "@/lib/services/town-medical-density"
import {
    MAJOR_CITIES,
    shouldShowCityLabel,
    getCityLabelStyle
} from "@/lib/data/major-cities"

interface TownDensityData {
    code: string
    name: string
    zonage: ZonageLevel
    profession: MedicalProfession
    boundary: {
        name: string
        type: "Polygon" | "MultiPolygon"
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
    type: "Polygon" | "MultiPolygon"
): L.LatLngExpression[] | L.LatLngExpression[][] {
    if (type === "Polygon") {
        return (coordinates as number[][][]).map((ring) =>
            ring.map(([lng, lat]) => [lat, lng] as [number, number])
        ) as L.LatLngExpression[][]
    } else {
        return (coordinates as number[][][][]).flatMap((polygon) =>
            polygon.map((ring) =>
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
    const [allTowns, setAllTowns] = useState<Map<string, TownDensityData>>(
        new Map()
    )
    const [loading, setLoading] = useState(false)

    const loaderRef = useRef<TownDensityLoader | null>(null)
    const currentViewportRef = useRef<L.LatLngBounds | null>(null)

    // Calculate bounds of a polygon
    const calculatePolygonBounds = (
        boundary: any
    ): { minLat: number; maxLat: number; minLng: number; maxLng: number } => {
        let minLat = Infinity,
            maxLat = -Infinity,
            minLng = Infinity,
            maxLng = -Infinity

        try {
            if (boundary.type === "Polygon") {
                const coords = boundary.coordinates as number[][][]
                for (const ring of coords) {
                    for (const [lng, lat] of ring) {
                        if (lat < minLat) minLat = lat
                        if (lat > maxLat) maxLat = lat
                        if (lng < minLng) minLng = lng
                        if (lng > maxLng) maxLng = lng
                    }
                }
            } else if (boundary.type === "MultiPolygon") {
                const coords = boundary.coordinates as number[][][][]
                for (const polygon of coords) {
                    for (const ring of polygon) {
                        for (const [lng, lat] of ring) {
                            if (lat < minLat) minLat = lat
                            if (lat > maxLat) maxLat = lat
                            if (lng < minLng) minLng = lng
                            if (lng > maxLng) maxLng = lng
                        }
                    }
                }
            }
        } catch (error) {
            console.warn("Error calculating polygon bounds:", error)
            return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 }
        }

        return { minLat, maxLat, minLng, maxLng }
    }

    // Check if polygon bounds intersect with viewport bounds
    const boundsIntersect = (
        polygonBounds: {
            minLat: number
            maxLat: number
            minLng: number
            maxLng: number
        },
        viewportBounds: L.LatLngBounds
    ): boolean => {
        const vpSouth = viewportBounds.getSouth()
        const vpNorth = viewportBounds.getNorth()
        const vpWest = viewportBounds.getWest()
        const vpEast = viewportBounds.getEast()

        // Check if bounds overlap
        return !(
            polygonBounds.maxLat < vpSouth ||
            polygonBounds.minLat > vpNorth ||
            polygonBounds.maxLng < vpWest ||
            polygonBounds.minLng > vpEast
        )
    }

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
                const response = await fetch(
                    `/api/map/town-density?profession=${profession}&limit=50000`
                )
                if (!response.ok) throw new Error("Failed to load town data")

                const result = await response.json()
                if (!result.success) throw new Error("API returned error")

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
                    console.log(
                        `Finished loading ${townsMap.size} towns for ${profession}`
                    )

                    // Trigger viewport update
                    if (currentViewportRef.current) {
                        updateVisibleTowns(currentViewportRef.current, townsMap)
                    }
                }
            } catch (error) {
                console.error("Error loading town data:", error)
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

            // Check if polygon bounds intersect with viewport
            const polygonBounds = calculatePolygonBounds(town.boundary)

            if (boundsIntersect(polygonBounds, bounds)) {
                visibleTownsList.push(town)
                count++
            }
        }

        console.log(
            `Showing ${visibleTownsList.length} towns in viewport (zoom: ${map.getZoom()})`
        )
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
        overlayLayers.forEach((layer) => {
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
                const latLngCoords = convertCoordinates(
                    town.boundary.coordinates,
                    town.boundary.type
                )

                let polygon: L.Polygon

                // Adjust stroke weight based on zoom for performance and clarity
                const currentZoom = map.getZoom()
                const strokeWeight =
                    currentZoom > 12 ? 1.5 : currentZoom > 8 ? 1 : 0.5
                const strokeOpacity = currentZoom > 10 ? 0.8 : 0.6

                if (town.boundary.type === "Polygon") {
                    polygon = L.polygon(
                        latLngCoords as L.LatLngExpression[][],
                        {
                            color: town.color,
                            fillColor: town.color,
                            fillOpacity: opacity,
                            weight: strokeWeight,
                            opacity: strokeOpacity
                        }
                    )
                } else {
                    const firstPolygon = (
                        latLngCoords as L.LatLngExpression[][]
                    )[0]
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

                // Add labels based on city priority and zoom level
                const cityInfo = MAJOR_CITIES[town.code]
                const shouldShowLabel =
                    showLabels &&
                    // Major cities: show based on priority and minZoom
                    ((cityInfo &&
                        shouldShowCityLabel(town.code, currentZoom)) ||
                        // Regular communes: show at higher zoom levels with more liberal limits
                        (!cityInfo &&
                            currentZoom > 10 &&
                            visibleTowns.length < 500) ||
                        // Show even more communes at very high zoom
                        (!cityInfo &&
                            currentZoom > 12 &&
                            visibleTowns.length < 1000))

                if (shouldShowLabel) {
                    const bounds = polygon.getBounds()
                    const center = bounds.getCenter()

                    // Get label style based on priority
                    const priority = cityInfo?.priority || 4
                    const labelStyle = getCityLabelStyle(priority, currentZoom)

                    // For major cities, use the display name from our database
                    const displayName = cityInfo?.name || town.name

                    const label = L.marker(center, {
                        icon: L.divIcon({
                            className: `town-label priority-${priority}`,
                            html: `
                <div style="
                  background: ${labelStyle.background};
                  padding: ${labelStyle.padding};
                  border-radius: 4px;
                  font-size: ${labelStyle.fontSize}px;
                  font-weight: ${labelStyle.fontWeight};
                  text-align: center;
                  border: ${labelStyle.border};
                  box-shadow: ${labelStyle.boxShadow};
                  color: #1a1a1a;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                  display: inline-block;
                  line-height: 1.2;
                  letter-spacing: -0.02em;
                  user-select: none;
                  pointer-events: none;
                  white-space: nowrap;
                ">
                  ${displayName}
                </div>
              `,
                            iconSize: undefined, // Let Leaflet calculate size
                            iconAnchor: undefined // Use default anchor (centered)
                        })
                    })

                    label.addTo(map)
                    newLayers.push(label)
                }
            } catch (error) {
                console.warn(
                    `Error creating polygon for town ${town.code}:`,
                    error
                )
            }
        })

        console.log(`Successfully rendered ${processedCount} town polygons`)
        setOverlayLayers(newLayers)

        return () => {
            newLayers.forEach((layer) => {
                if (map.hasLayer(layer)) {
                    map.removeLayer(layer)
                }
            })
        }
    }, [
        map,
        visibleTowns,
        profession,
        opacity,
        showLabels,
        onTownClick,
        loading
    ])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            overlayLayers.forEach((layer) => {
                if (map?.hasLayer(layer)) {
                    map.removeLayer(layer)
                }
            })
        }
    }, [map, overlayLayers])

    return null
}
