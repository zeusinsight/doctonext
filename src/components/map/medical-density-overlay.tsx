"use client"

import { useEffect, useState } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"
import { HeatmapDensityOverlay } from "./heatmap-density-overlay";
import { px } from "framer-motion";

export interface RegionDensity {
  region: string
  code: string
  densityScore: number // 0-100, where 0 is under-served, 100 is over-served
  professionalCount: number
  populationCount: number
  bounds: number[][][] // Polygon coordinates
}

interface MedicalDensityOverlayProps {
  densityData: RegionDensity[]
  specialty?: string
  opacity?: number
  showLabels?: boolean
  mode?: "polygon" | "heatmap"
}

// Color mapping based on density score
const getDensityColor = (score: number): string => {
  if (score <= 30) return "#10b981" // Green - Under-served, high opportunity
  if (score <= 70) return "#f59e0b" // Yellow - Moderate density
  return "#ef4444" // Red - Over-served, saturated
}

// Get density category label
const getDensityCategory = (score: number): string => {
  if (score <= 30) return "Sous-densifié"
  if (score <= 70) return "Densité modérée"
  return "Surdensifié"
}

export function MedicalDensityOverlay({
  densityData,
  specialty,
  opacity = 0.4,
  showLabels = true,
  mode = "polygon"
}: MedicalDensityOverlayProps) {
  const map = useMap()
  const [overlayLayers, setOverlayLayers] = useState<L.Layer[]>([])

  useEffect(() => {
    // If heatmap mode is selected, don't create polygon overlays
    if (mode === "heatmap") return
    if (!map || !densityData.length) return

    // Clear existing overlay layers
    overlayLayers.forEach(layer => map.removeLayer(layer))

    const newLayers: L.Layer[] = []

    densityData.forEach((region) => {
      // Create polygon for each region
      if (region.bounds && region.bounds.length > 0) {
        const polygon = L.polygon(region.bounds as L.LatLngExpression[][], {
          color: getDensityColor(region.densityScore),
          fillColor: getDensityColor(region.densityScore),
          fillOpacity: opacity,
          weight: 2,
          opacity: 0.8
        })

        // Add tooltip with region information
        polygon.bindTooltip(
          `
            <div className="p-2">
              <div className="font-medium">${region.region}</div>
              <div className="text-sm space-y-1">
                <div>Statut: <span className="font-medium">${getDensityCategory(region.densityScore)}</span></div>
                <div>Score de densité: ${region.densityScore}/100</div>
                <div>Professionnels: ${region.professionalCount.toLocaleString()}</div>
                <div>Population: ${region.populationCount.toLocaleString()}</div>
                ${specialty ? `<div>Spécialité: ${specialty}</div>` : ''}
              </div>
            </div>
          `,
          {
            sticky: true,
            className: "density-tooltip"
          }
        )

        // Add click handler for more detailed information
        polygon.on("click", (e) => {
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`
              <div className="p-3 min-w-[250px]">
                <h3 className="font-semibold text-base mb-2">${region.region}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Statut médical:</span>
                    <span className="font-medium" style={{ color: getDensityColor(region.densityScore) }}>${getDensityCategory(region.densityScore)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Score de densité:</span>
                    <span className="font-medium">${region.densityScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professionnels:</span>
                    <span>${region.professionalCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Population:</span>
                    <span>${region.populationCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ratio (prof/10k hab):</span>
                    <span>${((region.professionalCount / region.populationCount) * 10000).toFixed(1)}</span>
                  </div>
                  ${specialty ? `
                    <div className="pt-1 border-t">
                      <span className="text-xs text-muted-foreground">Filtré par: ${specialty}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            `)
            .openOn(map)
        })

        polygon.addTo(map)
        newLayers.push(polygon)

        // Add region labels if enabled
        if (showLabels && region.bounds.length > 0) {
          // Calculate center point of region for label placement
          const bounds = L.polygon(region.bounds as L.LatLngExpression[][]).getBounds()
          const center = bounds.getCenter()

          const label = L.marker(center, {
            icon: L.divIcon({
              className: "region-label",
              html: `
                <div style="
                  background: rgba(255, 255, 255, 0.9);
                  padding: 2px 6px;
                  border-radius: 4px;
                  font-size: 11px;
                  font-weight: 500;
                  text-align: center;
                  border: 1px solid rgba(0, 0, 0, 0.1);
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                  white-space: nowrap;
                ">
                  ${region.region}
                </div>
              `,
              iconSize: [0, 0],
              iconAnchor: [0, 0]
            })
          })

          label.addTo(map)
          newLayers.push(label)
        }
      }
    })

    setOverlayLayers(newLayers)

    // Cleanup function
    return () => {
      newLayers.forEach(layer => {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer)
        }
      })
    }
  }, [map, densityData, specialty, opacity, showLabels, mode])

  // If heatmap mode is selected, render the heatmap component
  if (mode === "heatmap") {
    return (
      <HeatmapDensityOverlay 
        densityData={densityData}
        opacity={opacity}
      />
    )
  }

  // This component doesn't render anything directly
  // It only manages map layers via side effects
  return null
}