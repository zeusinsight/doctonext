"use client"

import { useEffect, useState, useRef } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import {
    fetchCommunesForDepartment,
    convertCommuneCoordinatesToLeaflet,
    type CommuneData
} from "@/lib/services/commune-department-service"

interface CommuneOverlayProps {
    departmentCode: string | null
    onCommuneClick?: (commune: CommuneData) => void
    onCommuneHover?: (commune: CommuneData | null) => void
    onLoadingChange?: (loading: boolean) => void
    onError?: (error: string | null) => void
    visible?: boolean
    opacity?: number
    highlightedCommune?: string | null
}

export function CommuneOverlay({
    departmentCode,
    onCommuneClick,
    onCommuneHover,
    onLoadingChange,
    onError,
    visible = true,
    opacity = 0.2,
    highlightedCommune = null
}: CommuneOverlayProps) {
    const map = useMap()
    const [communes, setCommunes] = useState<CommuneData[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const layerGroupRef = useRef<L.LayerGroup | null>(null)

    // Load communes when department changes
    useEffect(() => {
        if (!departmentCode) {
            setCommunes([])
            return
        }

        let isCancelled = false

        const loadCommunes = async () => {
            setLoading(true)
            setError(null)
            onLoadingChange?.(true)
            onError?.(null)

            try {
                const communeData =
                    await fetchCommunesForDepartment(departmentCode)

                if (!isCancelled) {
                    setCommunes(communeData)
                    console.log(
                        `CommuneOverlay: Loaded ${communeData.length} communes for department ${departmentCode}`
                    )
                }
            } catch (error) {
                console.error("CommuneOverlay: Error loading communes:", error)
                if (!isCancelled) {
                    const errorMessage =
                        error instanceof Error
                            ? error.message
                            : "Failed to load communes"
                    setError(errorMessage)
                    onError?.(errorMessage)
                    setCommunes([])
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false)
                    onLoadingChange?.(false)
                }
            }
        }

        loadCommunes()

        return () => {
            isCancelled = true
        }
    }, [departmentCode])

    // Create and update commune polygons
    useEffect(() => {
        if (!map || communes.length === 0) {
            // Clear existing layers if no communes
            if (layerGroupRef.current) {
                map.removeLayer(layerGroupRef.current)
                layerGroupRef.current = null
            }
            return
        }

        // Clear existing layers
        if (layerGroupRef.current) {
            map.removeLayer(layerGroupRef.current)
        }

        // Create new layer group
        const layerGroup = L.layerGroup()
        layerGroupRef.current = layerGroup

        communes.forEach((commune) => {
            try {
                const coordinates = convertCommuneCoordinatesToLeaflet(
                    commune.geometry.coordinates,
                    commune.geometry.type
                )

                let polygon: L.Polygon

                if (commune.geometry.type === "Polygon") {
                    polygon = L.polygon(coordinates as L.LatLngExpression[][], {
                        color: "#059669",
                        weight: 1,
                        opacity: 0.6,
                        fillColor:
                            highlightedCommune === commune.code
                                ? "#10b981"
                                : "#34d399",
                        fillOpacity:
                            highlightedCommune === commune.code ? 0.4 : opacity,
                        className: `commune-${commune.code}`
                    })
                } else {
                    // MultiPolygon (already flattened by convertCommuneCoordinatesToLeaflet)
                    polygon = L.polygon(
                        coordinates as L.LatLngExpression[][],
                        {
                            color: "#059669",
                            weight: 1,
                            opacity: 0.6,
                            fillColor:
                                highlightedCommune === commune.code
                                    ? "#10b981"
                                    : "#34d399",
                            fillOpacity:
                                highlightedCommune === commune.code
                                    ? 0.4
                                    : opacity,
                            className: `commune-${commune.code}`
                        }
                    )
                }

                // Add hover effects
                polygon.on("mouseover", (e) => {
                    const layer = e.target
                    layer.setStyle({
                        weight: 2,
                        fillOpacity: 0.4,
                        fillColor: "#10b981"
                    })

                    // Bring to front
                    layer.bringToFront()

                    onCommuneHover?.(commune)
                })

                polygon.on("mouseout", (e) => {
                    const layer = e.target
                    const isHighlighted = highlightedCommune === commune.code

                    layer.setStyle({
                        weight: 1,
                        fillOpacity: isHighlighted ? 0.4 : opacity,
                        fillColor: isHighlighted ? "#10b981" : "#34d399"
                    })

                    onCommuneHover?.(null)
                })

                // Add click handler
                polygon.on("click", () => {
                    onCommuneClick?.(commune)
                })

                // Add to layer group
                layerGroup.addLayer(polygon)
            } catch (error) {
                console.error(
                    `Error creating polygon for commune ${commune.code}:`,
                    error
                )
            }
        })

        // Add to map if visible
        if (visible) {
            map.addLayer(layerGroup)
        }

        // Cleanup on unmount
        return () => {
            if (layerGroupRef.current && map.hasLayer(layerGroupRef.current)) {
                map.removeLayer(layerGroupRef.current)
            }
        }
    }, [
        map,
        communes,
        visible,
        opacity,
        highlightedCommune,
        onCommuneClick,
        onCommuneHover
    ])

    // Handle visibility changes
    useEffect(() => {
        if (!map || !layerGroupRef.current) return

        if (visible) {
            if (!map.hasLayer(layerGroupRef.current)) {
                map.addLayer(layerGroupRef.current)
            }
        } else {
            if (map.hasLayer(layerGroupRef.current)) {
                map.removeLayer(layerGroupRef.current)
            }
        }
    }, [map, visible])

    // Update highlighting when highlightedCommune changes
    useEffect(() => {
        if (!layerGroupRef.current) return

        layerGroupRef.current.eachLayer((layer) => {
            if (layer instanceof L.Polygon) {
                const className =
                    (layer.getElement() as HTMLElement)?.className || ""
                const communeCode = className.match(/commune-(\d{5})/)?.[1]

                if (communeCode) {
                    const isHighlighted = highlightedCommune === communeCode

                    layer.setStyle({
                        fillColor: isHighlighted ? "#10b981" : "#34d399",
                        fillOpacity: isHighlighted ? 0.4 : opacity
                    })
                }
            }
        })
    }, [highlightedCommune, opacity])

    if (loading) {
        console.log(`Loading communes for department ${departmentCode}...`)
    }

    if (error) {
        console.error("Commune overlay error:", error)
    }

    return null
}
