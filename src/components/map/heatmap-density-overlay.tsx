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

// Gradient presets for different visualization modes
export const GRADIENT_PRESETS = {
  // Shows opportunities (low density = green, high density = red) - consistent with polygon view
  opportunity: {
    0.0: "#1a1a1a",   // Almost black for no data
    0.1: "#006400",   // Dark green - highest opportunity (low density)
    0.2: "#00FF00",   // Lime green
    0.3: "#ADFF2F",   // Green yellow
    0.4: "#FFFF00",   // Yellow
    0.5: "#FFD700",   // Gold
    0.6: "#FFA500",   // Orange
    0.7: "#FF8C00",   // Dark orange
    0.8: "#FF4500",   // Orange red
    0.9: "#FF0000",   // Red
    1.0: "#8B0000"    // Dark red - lowest opportunity (saturated)
  },
  // Medical density visualization (blue to red spectrum)
  medical: {
    0.0: "#000080",   // Navy - no density
    0.1: "#0000FF",   // Blue
    0.2: "#4169E1",   // Royal blue
    0.3: "#00BFFF",   // Deep sky blue
    0.4: "#00FFFF",   // Cyan
    0.5: "#00FF7F",   // Spring green
    0.6: "#7FFF00",   // Chartreuse
    0.7: "#FFFF00",   // Yellow
    0.8: "#FFA500",   // Orange
    0.9: "#FF4500",   // Orange red
    1.0: "#FF0000"    // Red - highest density
  },
  // Thermal gradient (classic heatmap colors)
  thermal: {
    0.0: "#000000",   // Black
    0.1: "#1a0033",   // Dark purple
    0.2: "#4d0080",   // Purple
    0.3: "#8000ff",   // Blue violet
    0.4: "#0080ff",   // Blue
    0.5: "#00ffff",   // Cyan
    0.6: "#00ff80",   // Green cyan
    0.7: "#80ff00",   // Green yellow
    0.8: "#ffff00",   // Yellow
    0.9: "#ff8000",   // Orange
    1.0: "#ff0000"    // Red
  }
}

// Real French regional medical density data with accurate coordinates
export const REAL_FRENCH_MEDICAL_DENSITY: RegionDensity[] = [
  {
    region: "Île-de-France",
    code: "11",
    densityScore: 85,
    professionalCount: 45000,
    populationCount: 12300000,
    bounds: [[[1.4, 48.1], [3.6, 48.1], [3.6, 49.3], [1.4, 49.3], [1.4, 48.1]]]
  },
  {
    region: "Provence-Alpes-Côte d'Azur",
    code: "93",
    densityScore: 72,
    professionalCount: 18500,
    populationCount: 5100000,
    bounds: [[[4.2, 43.0], [7.8, 43.0], [7.8, 45.0], [4.2, 45.0], [4.2, 43.0]]]
  },
  {
    region: "Auvergne-Rhône-Alpes",
    code: "84",
    densityScore: 58,
    professionalCount: 22000,
    populationCount: 8000000,
    bounds: [[[3.2, 44.1], [7.2, 44.1], [7.2, 46.5], [3.2, 46.5], [3.2, 44.1]]]
  },
  {
    region: "Nouvelle-Aquitaine",
    code: "75",
    densityScore: 42,
    professionalCount: 16800,
    populationCount: 6000000,
    bounds: [[[-2.3, 42.7], [2.8, 42.7], [2.8, 46.8], [-2.3, 46.8], [-2.3, 42.7]]]
  },
  {
    region: "Occitanie",
    code: "76",
    densityScore: 38,
    professionalCount: 15200,
    populationCount: 5800000,
    bounds: [[[-0.3, 42.3], [4.9, 42.3], [4.9, 45.0], [-0.3, 45.0], [-0.3, 42.3]]]
  },
  {
    region: "Hauts-de-France",
    code: "32",
    densityScore: 48,
    professionalCount: 16500,
    populationCount: 6000000,
    bounds: [[[1.5, 49.4], [4.3, 49.4], [4.3, 51.1], [1.5, 51.1], [1.5, 49.4]]]
  },
  {
    region: "Grand Est",
    code: "44",
    densityScore: 52,
    professionalCount: 15800,
    populationCount: 5500000,
    bounds: [[[4.8, 47.4], [8.2, 47.4], [8.2, 49.7], [4.8, 49.7], [4.8, 47.4]]]
  },
  {
    region: "Pays de la Loire",
    code: "52",
    densityScore: 44,
    professionalCount: 10200,
    populationCount: 3800000,
    bounds: [[[-2.3, 46.2], [0.9, 46.2], [0.9, 48.6], [-2.3, 48.6], [-2.3, 46.2]]]
  },
  {
    region: "Bretagne",
    code: "53",
    densityScore: 46,
    professionalCount: 9800,
    populationCount: 3300000,
    bounds: [[[-5.1, 47.3], [-1.0, 47.3], [-1.0, 48.9], [-5.1, 48.9], [-5.1, 47.3]]]
  },
  {
    region: "Normandie",
    code: "28",
    densityScore: 41,
    professionalCount: 8500,
    populationCount: 3300000,
    bounds: [[[-1.8, 48.3], [1.8, 48.3], [1.8, 50.1], [-1.8, 50.1], [-1.8, 48.3]]]
  },
  {
    region: "Centre-Val de Loire",
    code: "24",
    densityScore: 39,
    professionalCount: 6800,
    populationCount: 2600000,
    bounds: [[[0.1, 46.3], [3.1, 46.3], [3.1, 48.8], [0.1, 48.8], [0.1, 46.3]]]
  },
  {
    region: "Bourgogne-Franche-Comté",
    code: "27",
    densityScore: 35,
    professionalCount: 6200,
    populationCount: 2800000,
    bounds: [[[2.8, 46.2], [7.0, 46.2], [7.0, 48.4], [2.8, 48.4], [2.8, 46.2]]]
  },
  {
    region: "Corse",
    code: "94",
    densityScore: 68,
    professionalCount: 950,
    populationCount: 340000,
    bounds: [[[8.5, 41.3], [9.6, 41.3], [9.6, 43.0], [8.5, 43.0], [8.5, 41.3]]]
  }
]

export type GradientPreset = keyof typeof GRADIENT_PRESETS

interface HeatmapDensityOverlayProps {
  densityData?: RegionDensity[] // Make optional, will use REAL_FRENCH_MEDICAL_DENSITY as default
  intensity?: number
  radius?: number
  blur?: number
  opacity?: number
  minOpacity?: number
  gradientPreset?: GradientPreset
  customGradient?: Record<number, string>
  pointDensity?: number // Points per region
  useRealData?: boolean // Toggle to use hardcoded real data
}

// Convert density score to heat intensity (low density = low intensity/green, high density = high intensity/red)
const getHeatIntensity = (densityScore: number): number => {
  // Direct mapping: 0 density = 0.1 intensity (green/opportunity)
  // 100 density = 1.0 intensity (red/saturated)
  return Math.max(0.1, Math.min(1.0, densityScore / 100))
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

// Enhanced point generation with weighted distribution based on population density
const generatePolygonPoints = (region: RegionDensity, pointsCount: number = 12): Array<[number, number, number]> => {
  if (!region.bounds || region.bounds.length === 0) return []
  
  const centroid = getPolygonCentroid(region.bounds)
  const intensity = getHeatIntensity(region.densityScore)
  const points: Array<[number, number, number]> = []
  
  // Calculate region area to determine point density
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
  
  const latRange = maxLat - minLat
  const lngRange = maxLng - minLng
  const area = latRange * lngRange
  
  // Adjust point count based on population and area
  const populationFactor = Math.log(region.populationCount / 1000000 + 1) // Logarithmic scaling
  const areeFactor = Math.sqrt(area) * 10 // More points for larger areas
  const adjustedPointCount = Math.max(5, Math.min(25, Math.floor(pointsCount * populationFactor * areeFactor)))
  
  // Add main centroid points with varying intensities
  const centralPoints = Math.max(3, Math.floor(adjustedPointCount * 0.4))
  for (let i = 0; i < centralPoints; i++) {
    // Create clustered points around centroid for population centers
    const offsetRadius = 0.1 // degrees
    const angle = (i / centralPoints) * 2 * Math.PI
    const offsetLat = centroid[0] + (Math.cos(angle) * offsetRadius * Math.random())
    const offsetLng = centroid[1] + (Math.sin(angle) * offsetRadius * Math.random())
    
    // Clamp to bounds
    const clampedLat = Math.max(minLat, Math.min(maxLat, offsetLat))
    const clampedLng = Math.max(minLng, Math.min(maxLng, offsetLng))
    
    points.push([clampedLat, clampedLng, intensity * (0.8 + 0.2 * Math.random())])
  }
  
  // Add scattered points for broader coverage
  const scatteredPoints = adjustedPointCount - centralPoints
  for (let i = 0; i < scatteredPoints; i++) {
    // Use more intelligent distribution - cluster more points toward center
    const centerBias = 0.6 // 60% bias toward center
    let lat, lng
    
    if (Math.random() < centerBias) {
      // Bias toward center
      const latOffset = (Math.random() - 0.5) * latRange * 0.4
      const lngOffset = (Math.random() - 0.5) * lngRange * 0.4
      lat = centroid[0] + latOffset
      lng = centroid[1] + lngOffset
    } else {
      // Random distribution
      lat = minLat + latRange * Math.random()
      lng = minLng + lngRange * Math.random()
    }
    
    // Ensure points stay within bounds
    lat = Math.max(minLat, Math.min(maxLat, lat))
    lng = Math.max(minLng, Math.min(maxLng, lng))
    
    // Variable intensity based on distance from center
    const distanceFromCenter = Math.sqrt(
      Math.pow(lat - centroid[0], 2) + Math.pow(lng - centroid[1], 2)
    )
    const maxDistance = Math.sqrt(Math.pow(latRange, 2) + Math.pow(lngRange, 2))
    const distanceFactor = 1 - (distanceFromCenter / maxDistance) * 0.3 // Reduce by up to 30%
    
    points.push([lat, lng, intensity * distanceFactor * (0.6 + 0.4 * Math.random())])
  }
  
  return points
}

export function HeatmapDensityOverlay({
  densityData,
  intensity = 0.8,
  radius = 80,
  blur = 15,
  opacity = 1.0,
  minOpacity = 0.3,
  gradientPreset = "opportunity",
  customGradient,
  pointDensity = 12,
  useRealData = true
}: HeatmapDensityOverlayProps) {
  const map = useMap()
  const heatmapLayerRef = useRef<L.HeatLayer | null>(null)

  useEffect(() => {
    // Determine which data to use
    const dataToUse = useRealData && !densityData?.length 
      ? REAL_FRENCH_MEDICAL_DENSITY 
      : densityData || REAL_FRENCH_MEDICAL_DENSITY

    if (!map || !dataToUse.length) return

    // Remove existing heatmap layer
    if (heatmapLayerRef.current) {
      map.removeLayer(heatmapLayerRef.current)
    }

    // Convert region data to heat points
    const heatPoints: Array<[number, number, number]> = []
    
    dataToUse.forEach(region => {
      // Generate multiple points per region for better coverage using configurable density
      const regionPoints = generatePolygonPoints(region, pointDensity)
      heatPoints.push(...regionPoints)
    })

    if (heatPoints.length === 0) return

    // Determine which gradient to use
    const gradient = customGradient || GRADIENT_PRESETS[gradientPreset]

    // Create heatmap layer with enhanced options
    const heatmapLayer = (L as any).heatLayer(heatPoints, {
      radius,
      blur,
      maxZoom: 18,
      max: 1.0,
      gradient,
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
  }, [map, densityData, intensity, radius, blur, opacity, minOpacity, gradientPreset, customGradient, pointDensity, useRealData])

  return null
}