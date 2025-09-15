"use client"

import { ChevronRight, Home, MapPin, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MapNavigationLevel {
    level: "country" | "department" | "commune"
    name: string
    code?: string
}

interface MapNavigationControlsProps {
    currentLevel: MapNavigationLevel
    departmentName?: string
    departmentCode?: string
    communeName?: string
    communeCode?: string
    onNavigateToCountry?: () => void
    onNavigateToDepartment?: () => void
    onNavigateToCommune?: () => void
    className?: string
    hoveredLocation?: string | null
}

export function MapNavigationControls({
    currentLevel,
    departmentName,
    departmentCode,
    communeName,
    communeCode,
    onNavigateToCountry,
    onNavigateToDepartment,
    onNavigateToCommune,
    className,
    hoveredLocation
}: MapNavigationControlsProps) {
    return (
        <div
            className={cn(
                "rounded-lg border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm",
                className
            )}
        >
            {/* Breadcrumb Navigation */}
            <div className="mb-2 flex items-center space-x-2">
                {/* France Level */}
                <Button
                    variant={
                        currentLevel.level === "country" ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={onNavigateToCountry}
                    className="h-7 px-2 text-xs"
                >
                    <Home className="mr-1 h-3 w-3" />
                    France
                </Button>

                {/* Department Level */}
                {(departmentName || currentLevel.level !== "country") && (
                    <>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <Button
                            variant={
                                currentLevel.level === "department"
                                    ? "default"
                                    : "ghost"
                            }
                            size="sm"
                            onClick={onNavigateToDepartment}
                            disabled={!departmentName}
                            className="h-7 px-2 text-xs"
                        >
                            <Building className="mr-1 h-3 w-3" />
                            {departmentName || "Département"}
                        </Button>
                    </>
                )}

                {/* Commune Level */}
                {(communeName || currentLevel.level === "commune") && (
                    <>
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                        <Button
                            variant={
                                currentLevel.level === "commune"
                                    ? "default"
                                    : "ghost"
                            }
                            size="sm"
                            onClick={onNavigateToCommune}
                            disabled={!communeName}
                            className="h-7 px-2 text-xs"
                        >
                            <MapPin className="mr-1 h-3 w-3" />
                            {communeName || "Commune"}
                        </Button>
                    </>
                )}
            </div>

            {/* Current Location Badge */}
            <div className="flex items-center space-x-2">
                <Badge
                    variant="secondary"
                    className="border-blue-200 bg-blue-100 text-blue-800 text-xs"
                >
                    {currentLevel.level === "country" && "Vue nationale"}
                    {currentLevel.level === "department" &&
                        `Département ${departmentCode || ""}`}
                    {currentLevel.level === "commune" &&
                        `${communeName || "Commune"} (${communeCode || ""})`}
                </Badge>

                {/* Hovered Location */}
                {hoveredLocation && (
                    <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-600 text-xs"
                    >
                        {hoveredLocation}
                    </Badge>
                )}
            </div>

            {/* Quick Stats */}
            <div className="mt-2 flex items-center space-x-3 text-gray-600 text-xs">
                {currentLevel.level === "country" && (
                    <span>101 départements • 34,968 communes</span>
                )}
                {currentLevel.level === "department" && departmentCode && (
                    <span>Communes du département {departmentCode}</span>
                )}
                {currentLevel.level === "commune" && communeCode && (
                    <span>Code commune: {communeCode}</span>
                )}
            </div>
        </div>
    )
}
