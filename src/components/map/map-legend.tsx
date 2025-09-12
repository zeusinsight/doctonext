"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

interface MapLegendProps {
  showDensityLegend?: boolean
  showListingTypes?: boolean
  densityMode?: "polygon" | "heatmap"
  className?: string
}

export function MapLegend({ 
  showDensityLegend = true, 
  showListingTypes = true,
  densityMode = "polygon",
  className 
}: MapLegendProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Info className="h-4 w-4" />
          Légende
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showDensityLegend && (
          <div>
            <h4 className="text-xs font-medium mb-2">Zonage médical par commune</h4>
            {densityMode === "heatmap" ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-12 h-3 rounded" style={{ 
                    background: "linear-gradient(to right, #10b981 0%, #84cc16 25%, #f59e0b 50%, #ef4444 75%, #b91c1c 100%)" 
                  }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Très sous-dotée</span>
                  <span>Sur-dotée</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  * Basé sur les données ARS officielles
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-3 rounded" style={{ backgroundColor: "#10b981" }}></div>
                  <span>Très sous-dotée</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-3 rounded" style={{ backgroundColor: "#84cc16" }}></div>
                  <span>Sous-dotée</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-3 rounded" style={{ backgroundColor: "#f59e0b" }}></div>
                  <span>Intermédiaire</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-3 rounded" style={{ backgroundColor: "#ef4444" }}></div>
                  <span>Très dotée</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-3 rounded" style={{ backgroundColor: "#b91c1c" }}></div>
                  <span>Sur-dotée</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  * Classification officielle ARS par commune
                </div>
              </div>
            )}
          </div>
        )}

        {showListingTypes && (
          <div>
            <h4 className="text-xs font-medium mb-2">Types d'annonces</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: "#ef4444" }}></div>
                <span>Cession de cabinet</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: "#3b82f6" }}></div>
                <span>Remplacement</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: "#10b981" }}></div>
                <span>Collaboration</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs mt-2">
              <div className="relative">
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-gray-500"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 border border-white"></div>
              </div>
              <span>Annonce premium</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}