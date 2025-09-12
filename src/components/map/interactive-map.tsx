"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import { Map as LeafletMap } from "leaflet"
import L from "leaflet"
import { cn } from "@/lib/utils"

// Fix for Leaflet default markers in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  })
}

interface InteractiveMapProps {
  center?: [number, number]
  zoom?: number
  height?: string
  className?: string
  children?: React.ReactNode
  onMapReady?: (map: LeafletMap) => void
}

// Default center point for France
const DEFAULT_CENTER: [number, number] = [46.603354, 1.888334]
const DEFAULT_ZOOM = 6

export function InteractiveMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  height = "400px",
  className,
  children,
  onMapReady
}: InteractiveMapProps) {
  const mapRef = useRef<LeafletMap | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

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
      className={cn("relative overflow-hidden rounded-lg border", className)}
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
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
        />
        {children}
      </MapContainer>
    </div>
  )
}