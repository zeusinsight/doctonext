"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface MapLegendProps {
  showDensityLegend?: boolean;
  showListingTypes?: boolean;
  densityMode?: "polygon" | "heatmap";
  className?: string;
}

export function MapLegend({
  showDensityLegend = true,
  showListingTypes = true,
  densityMode = "polygon",
  className,
}: MapLegendProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Info className="h-4 w-4" />
          Légende
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showDensityLegend && (
          <div>
            <h4 className="mb-2 font-medium text-xs">
              Zonage médical par commune
            </h4>
            {densityMode === "heatmap" ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="h-3 w-12 rounded"
                    style={{
                      background:
                        "linear-gradient(to right, #10b981 0%, #84cc16 25%, #f59e0b 50%, #ef4444 75%, #b91c1c 100%)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Très sous-dotée</span>
                  <span>Sur-dotée</span>
                </div>
                <div className="text-muted-foreground text-xs">
                  * Basé sur les données ARS officielles
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="h-3 w-4 rounded"
                    style={{ backgroundColor: "#10b981" }}
                  />
                  <span>Très sous-dotée</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="h-3 w-4 rounded"
                    style={{ backgroundColor: "#84cc16" }}
                  />
                  <span>Sous-dotée</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="h-3 w-4 rounded"
                    style={{ backgroundColor: "#f59e0b" }}
                  />
                  <span>Intermédiaire</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="h-3 w-4 rounded"
                    style={{ backgroundColor: "#ef4444" }}
                  />
                  <span>Très dotée</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="h-3 w-4 rounded"
                    style={{ backgroundColor: "#b91c1c" }}
                  />
                  <span>Sur-dotée</span>
                </div>
                <div className="mt-2 text-muted-foreground text-xs">
                  * Classification officielle ARS par commune
                </div>
              </div>
            )}
          </div>
        )}

        {showListingTypes && (
          <div>
            <h4 className="mb-2 font-medium text-xs">Types d'annonces</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div
                  className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: "#ef4444" }}
                />
                <span>Cession de cabinet</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div
                  className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: "#4a8dd9" }}
                />
                <span>Remplacement</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div
                  className="h-4 w-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: "#10b981" }}
                />
                <span>Collaboration</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <div className="relative">
                <div className="h-4 w-4 rounded-full border-2 border-white bg-gray-500 shadow-sm" />
                <div className="-top-1 -right-1 absolute h-3 w-3 rounded-full border border-white bg-yellow-400" />
              </div>
              <span>Annonce premium</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
