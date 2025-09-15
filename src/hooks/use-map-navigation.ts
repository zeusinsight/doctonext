"use client"

import { useState, useCallback, useRef } from "react"
import type { DepartmentData } from "@/lib/services/department-service"
import type { CommuneData } from "@/lib/services/commune-department-service"

export type MapLevel = "country" | "department" | "commune"

export interface MapNavigationState {
    level: MapLevel
    selectedDepartment: DepartmentData | null
    selectedCommune: CommuneData | null
    hoveredLocation: string | null
}

export interface MapNavigationControls {
    state: MapNavigationState
    navigateToCountry: () => void
    navigateToDepartment: (department: DepartmentData) => void
    navigateToCommune: (commune: CommuneData) => void
    setHoveredLocation: (location: string | null) => void
    resetToCurrentLevel: () => void
}

export function useMapNavigation(
    mapRef: React.RefObject<{
        flyTo: (lat: number, lng: number, zoom?: number) => void
    } | null>
): MapNavigationControls {
    const [state, setState] = useState<MapNavigationState>({
        level: "country",
        selectedDepartment: null,
        selectedCommune: null,
        hoveredLocation: null
    })

    // Track previous state for navigation
    const previousStateRef = useRef<MapNavigationState>(state)

    const navigateToCountry = useCallback(() => {
        previousStateRef.current = state

        setState({
            level: "country",
            selectedDepartment: null,
            selectedCommune: null,
            hoveredLocation: null
        })

        // Fly to France overview
        if (mapRef.current) {
            mapRef.current.flyTo(46.603354, 1.888334, 6)
        }
    }, [mapRef, state])

    const navigateToDepartment = useCallback(
        (department: DepartmentData) => {
            previousStateRef.current = state

            setState((prev) => ({
                ...prev,
                level: "department",
                selectedDepartment: department,
                selectedCommune: null,
                hoveredLocation: null
            }))

            // Calculate center from bounds and fly to department
            if (mapRef.current) {
                const centerLat =
                    (department.bounds.north + department.bounds.south) / 2
                const centerLng =
                    (department.bounds.east + department.bounds.west) / 2

                // Calculate appropriate zoom level based on bounds
                const latDiff =
                    department.bounds.north - department.bounds.south
                const lngDiff = department.bounds.east - department.bounds.west
                const maxDiff = Math.max(latDiff, lngDiff)

                // Heuristic for zoom level based on bounds size
                let zoom = 9
                if (maxDiff < 0.5) zoom = 11
                else if (maxDiff < 1) zoom = 10
                else if (maxDiff < 2) zoom = 9
                else if (maxDiff < 4) zoom = 8
                else zoom = 7

                mapRef.current.flyTo(centerLat, centerLng, zoom)
            }
        },
        [mapRef, state]
    )

    const navigateToCommune = useCallback(
        (commune: CommuneData) => {
            previousStateRef.current = state

            setState((prev) => ({
                ...prev,
                level: "commune",
                selectedCommune: commune,
                hoveredLocation: null
            }))

            // For commune navigation, we'd need to calculate bounds from geometry
            // For now, just use a higher zoom level
            if (mapRef.current) {
                // This is a simplified approach - in practice you'd calculate the commune center
                // from its geometry coordinates
                mapRef.current.flyTo(46.603354, 1.888334, 12)
            }
        },
        [mapRef, state]
    )

    const setHoveredLocation = useCallback((location: string | null) => {
        setState((prev) => ({
            ...prev,
            hoveredLocation: location
        }))
    }, [])

    const resetToCurrentLevel = useCallback(() => {
        const previousState = previousStateRef.current

        setState((prev) => ({
            ...prev,
            hoveredLocation: null
        }))

        // Navigate based on current level
        if (state.level === "department" && state.selectedDepartment) {
            navigateToDepartment(state.selectedDepartment)
        } else if (state.level === "commune" && state.selectedCommune) {
            navigateToCommune(state.selectedCommune)
        } else {
            navigateToCountry()
        }
    }, [state, navigateToCountry, navigateToDepartment, navigateToCommune])

    return {
        state,
        navigateToCountry,
        navigateToDepartment,
        navigateToCommune,
        setHoveredLocation,
        resetToCurrentLevel
    }
}
