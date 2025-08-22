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
            <h4 className="text-xs font-medium mb-2">Densité médicale par région</h4>
            {densityMode === "heatmap" ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-12 h-3 rounded" style={{ 
                    background: "linear-gradient(to right, #10b981 0%, #84cc16 20%, #eab308 40%, #f59e0b 60%, #f97316 80%, #ef4444 100%)" 
                  }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Opportunité</span>
                  <span>Saturé</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  * Gradient de densité continue
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-3 rounded" style={{ backgroundColor: "#10b981" }}></div>
                  <span>Sous-densifié (0-30%)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-3 rounded" style={{ backgroundColor: "#f59e0b" }}></div>
                  <span>Densité modérée (31-70%)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-3 rounded" style={{ backgroundColor: "#ef4444" }}></div>
                  <span>Surdensifié (71-100%)</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  * Basé sur le ratio professionnels/population
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