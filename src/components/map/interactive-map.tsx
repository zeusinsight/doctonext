"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import type { Map as LeafletMap } from "leaflet"
import L from "leaflet"
import { cn } from "@/lib/utils"

// Fix for Leaflet default markers in Next.js
if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
    })
}

type MapStyle = "standard" | "minimal" | "geometric" | "light"

interface InteractiveMapProps {
    center?: [number, number]
    zoom?: number
    height?: string
    className?: string
    children?: React.ReactNode
    onMapReady?: (map: LeafletMap) => void
    mapStyle?: MapStyle
}

export interface MapRef {
    flyTo: (lat: number, lng: number, zoom?: number) => void
    setView: (lat: number, lng: number, zoom?: number) => void
    fitBounds: (bounds: [[number, number], [number, number]], options?: L.FitBoundsOptions) => void
    getMap: () => LeafletMap | null
}

// Default center point for France
const DEFAULT_CENTER: [number, number] = [46.603354, 1.888334]
const DEFAULT_ZOOM = 6

// Tile layer configurations for different map styles
const TILE_CONFIGS = {
    standard: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    },
    minimal: {
        url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
    },
    light: {
        url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png",
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
    },
    geometric: null // No base tiles for pure geometric view
}

export const InteractiveMap = forwardRef<MapRef, InteractiveMapProps>(
    function InteractiveMap(
        {
            center = DEFAULT_CENTER,
            zoom = DEFAULT_ZOOM,
            height = "400px",
            className,
            children,
            onMapReady,
            mapStyle = "standard"
        },
        ref
    ) {
        const mapRef = useRef<LeafletMap | null>(null)
        const containerRef = useRef<HTMLDivElement | null>(null)

        // Get tile configuration for the selected style
        const tileConfig = TILE_CONFIGS[mapStyle]

        // Expose map control methods via ref
        useImperativeHandle(
            ref,
            () => ({
                flyTo: (lat: number, lng: number, zoom?: number) => {
                    if (mapRef.current) {
                        mapRef.current.flyTo(
                            [lat, lng],
                            zoom || mapRef.current.getZoom(),
                            {
                                duration: 1.5,
                                easeLinearity: 0.1
                            }
                        )
                    }
                },
                setView: (lat: number, lng: number, zoom?: number) => {
                    if (mapRef.current) {
                        mapRef.current.setView(
                            [lat, lng],
                            zoom || mapRef.current.getZoom()
                        )
                    }
                },
                fitBounds: (bounds: [[number, number], [number, number]], options?: L.FitBoundsOptions) => {
                    if (mapRef.current) {
                        mapRef.current.fitBounds(bounds, {
                            padding: [50, 50],
                            duration: 1.5,
                            ...options
                        })
                    }
                },
                getMap: () => mapRef.current
            }),
            []
        )

        useEffect(() => {
            if (mapRef.current && onMapReady) {
                onMapReady(mapRef.current)
            }
        }, [onMapReady])

        // Ensure Leaflet knows its size when container becomes visible/resizes
        useEffect(() => {
            const map = mapRef.current
            const container = containerRef.current
            if (!map || !container) return

            const invalidate = () => map.invalidateSize({ animate: false })

            // Invalidate right after mount
            const t = setTimeout(invalidate, 0)

            // Observe container size changes
            const ro = new ResizeObserver(() => invalidate())
            ro.observe(container)

            // Also listen to window resize
            window.addEventListener("resize", invalidate)

            return () => {
                clearTimeout(t)
                ro.disconnect()
                window.removeEventListener("resize", invalidate)
            }
        }, [])

        return (
            <div
                ref={containerRef}
                className={cn(
                    "relative overflow-hidden rounded-lg border",
                    className
                )}
                style={{ height }}
            >
                <MapContainer
                    center={center}
                    zoom={zoom}
                    className="h-full w-full"
                    ref={mapRef}
                    scrollWheelZoom={true}
                    zoomControl={true}
                    preferCanvas={true}
                    style={{
                        height: "100%",
                        width: "100%",
                        backgroundColor:
                            mapStyle === "geometric" ? "#f8f9fa" : "transparent"
                    }}
                    maxBounds={[
                        [41.0, -5.5], // Southwest corner of France
                        [51.5, 10.0] // Northeast corner of France
                    ]}
                    maxBoundsViscosity={1.0}
                    worldCopyJump={false}
                    inertia={true}
                    inertiaDeceleration={3000}
                    inertiaMaxSpeed={1500}
                    zoomAnimation={true}
                    zoomAnimationThreshold={4}
                    fadeAnimation={true}
                    markerZoomAnimation={true}
                >
                    {tileConfig && (
                        <TileLayer
                            attribution={tileConfig.attribution}
                            url={tileConfig.url}
                            maxZoom={tileConfig.maxZoom}
                            opacity={mapStyle === "light" ? 0.4 : 1}
                        />
                    )}
                    {children}
                </MapContainer>
            </div>
        )
    }
)
