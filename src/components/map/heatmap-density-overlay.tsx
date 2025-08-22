"use client"

import { useEffect, useRef } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet.heat"

export interface RegionDensity {
  region: string
  code: string
  densityScore: number // 0-100, where 0 is under-served, 100 is over-served
  professionalCount: number
  populationCount: number
  bounds: number[][][] // Polygon coordinates
}

interface HeatmapDensityOverlayProps {
  densityData: RegionDensity[]
  intensity?: number
  radius?: number
  blur?: number
  opacity?: number
  minOpacity?: number
}

// Convert density score to heat intensity (inverted: low density = high heat/opportunity)
const getHeatIntensity = (densityScore: number): number => {
  // Invert the score: 0 density = 1.0 intensity (high opportunity)
  // 100 density = 0.1 intensity (low opportunity/saturated)
  return Math.max(0.1, 1.0 - (densityScore / 100))
}

// Calculate polygon centroid
const getPolygonCentroid = (coordinates: number[][][]): [number, number] => {
  if (!coordinates || coordinates.length === 0) return [0, 0]
  
  let totalLat = 0
  let totalLng = 0
  let totalPoints = 0
  
  // coordinates is number[][][] which means polygon[ring[point[]]]
  // Each polygon contains rings, each ring contains points [lng, lat]
  coordinates.forEach(ring => {
    ring.forEach(([lng, lat]) => {
      totalLat += lat
      totalLng += lng
      totalPoints++
    })
  })
  
  return totalPoints > 0 
    ? [totalLat / totalPoints, totalLng / totalPoints]
    : [0, 0]
}

// Generate additional points within polygon bounds for better heat distribution
const generatePolygonPoints = (region: RegionDensity, pointsCount: number = 5): Array<[number, number, number]> => {
  if (!region.bounds || region.bounds.length === 0) return []
  
  const centroid = getPolygonCentroid(region.bounds)
  const intensity = getHeatIntensity(region.densityScore)
  const points: Array<[number, number, number]> = []
  
  // Add main centroid point with full intensity
  points.push([centroid[0], centroid[1], intensity])
  
  // Calculate bounds for random point generation
  let minLat = Infinity, maxLat = -Infinity
  let minLng = Infinity, maxLng = -Infinity
  
  region.bounds.forEach(ring => {
    ring.forEach(([lng, lat]) => {
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
    })
  })
  
  // Generate additional scattered points within bounds
  for (let i = 0; i < pointsCount - 1; i++) {
    const lat = minLat + (maxLat - minLat) * Math.random()
    const lng = minLng + (maxLng - minLng) * Math.random()
    // Use slightly reduced intensity for scattered points
    points.push([lat, lng, intensity * 0.7])
  }
  
  return points
}

export function HeatmapDensityOverlay({
  densityData,
  intensity = 0.8,
  radius = 80,
  blur = 15,
  opacity = 1.0,
  minOpacity = 0.3
}: HeatmapDensityOverlayProps) {
  const map = useMap()
  const heatmapLayerRef = useRef<L.HeatLayer | null>(null)

  useEffect(() => {
    if (!map || !densityData.length) return

    // Remove existing heatmap layer
    if (heatmapLayerRef.current) {
      map.removeLayer(heatmapLayerRef.current)
    }

    // Convert region data to heat points
    const heatPoints: Array<[number, number, number]> = []
    
    densityData.forEach(region => {
      // Generate multiple points per region for better coverage
      const regionPoints = generatePolygonPoints(region, 8)
      heatPoints.push(...regionPoints)
    })

    if (heatPoints.length === 0) return

    // Create heatmap layer
    const heatmapLayer = (L as any).heatLayer(heatPoints, {
      radius,
      blur,
      maxZoom: 18,
      max: 1.0,
      gradient: {
        0.0: "#ef4444",   // Red for high density (saturated)
        0.2: "#f97316",   // Orange
        0.4: "#f59e0b",   // Amber
        0.6: "#eab308",   // Yellow
        0.8: "#84cc16",   // Lime
        1.0: "#10b981"    // Green for low density (opportunity)
      },
      opacity,
      minOpacity
    }) as L.HeatLayer

    // Add to map
    heatmapLayer.addTo(map)
    heatmapLayerRef.current = heatmapLayer

    // Cleanup function
    return () => {
      if (heatmapLayerRef.current && map.hasLayer(heatmapLayerRef.current)) {
        map.removeLayer(heatmapLayerRef.current)
      }
    }
  }, [map, densityData, intensity, radius, blur, opacity, minOpacity])

  return null
}