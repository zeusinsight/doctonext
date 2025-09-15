// Web Worker for processing boundary data
import * as Comlink from "comlink"
import { simplify } from "@turf/simplify"

class BoundaryProcessor {
    constructor() {
        this.boundaryCache = new Map()
        this.simplificationCache = new Map()
    }

    // Simplify polygon coordinates based on zoom level
    simplifyPolygon(coordinates, type, zoomLevel) {
        const cacheKey = `${JSON.stringify(coordinates)}_${zoomLevel}`

        if (this.simplificationCache.has(cacheKey)) {
            return this.simplificationCache.get(cacheKey)
        }

        // Determine tolerance based on zoom level
        // Higher zoom = more detail, lower tolerance
        // Lower zoom = less detail, higher tolerance
        let tolerance
        if (zoomLevel >= 12) {
            tolerance = 0.0001 // High detail
        } else if (zoomLevel >= 8) {
            tolerance = 0.0005 // Medium detail
        } else if (zoomLevel >= 5) {
            tolerance = 0.002 // Low detail
        } else {
            tolerance = 0.005 // Very low detail
        }

        try {
            // Convert to GeoJSON feature for Turf.js
            const feature = {
                type: "Feature",
                properties: {},
                geometry: {
                    type,
                    coordinates
                }
            }

            // Simplify the geometry
            const simplified = simplify(feature, {
                tolerance,
                highQuality: false
            })
            const result = simplified.geometry.coordinates

            // Cache the result
            this.simplificationCache.set(cacheKey, result)

            return result
        } catch (error) {
            console.warn("Failed to simplify polygon:", error)
            return coordinates // Return original if simplification fails
        }
    }

    // Process town data with viewport culling and simplification
    processTownData(towns, viewport, zoomLevel) {
        const { north, south, east, west } = viewport
        const processedTowns = []

        for (const [code, town] of towns) {
            // Quick bounding box check
            const bounds = this.calculateBounds(town.boundary)

            if (this.boundsIntersectViewport(bounds, viewport)) {
                // Simplify the polygon based on zoom level
                const simplifiedCoordinates = this.simplifyPolygon(
                    town.boundary.coordinates,
                    town.boundary.type,
                    zoomLevel
                )

                processedTowns.push({
                    ...town,
                    boundary: {
                        ...town.boundary,
                        coordinates: simplifiedCoordinates
                    }
                })
            }
        }

        return processedTowns
    }

    // Calculate bounding box for polygon
    calculateBounds(boundary) {
        let minLat = Infinity,
            maxLat = -Infinity
        let minLng = Infinity,
            maxLng = -Infinity

        const processCoordinates = (coords) => {
            for (const [lng, lat] of coords) {
                if (lat < minLat) minLat = lat
                if (lat > maxLat) maxLat = lat
                if (lng < minLng) minLng = lng
                if (lng > maxLng) maxLng = lng
            }
        }

        try {
            if (boundary.type === "Polygon") {
                for (const ring of boundary.coordinates) {
                    processCoordinates(ring)
                }
            } else if (boundary.type === "MultiPolygon") {
                for (const polygon of boundary.coordinates) {
                    for (const ring of polygon) {
                        processCoordinates(ring)
                    }
                }
            }
        } catch (error) {
            return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0 }
        }

        return { minLat, maxLat, minLng, maxLng }
    }

    // Check if bounds intersect with viewport
    boundsIntersectViewport(bounds, viewport) {
        return !(
            bounds.maxLat < viewport.south ||
            bounds.minLat > viewport.north ||
            bounds.maxLng < viewport.west ||
            bounds.minLng > viewport.east
        )
    }

    // Batch process multiple requests
    async processBatch(requests) {
        const results = []
        for (const request of requests) {
            results.push(
                await this.processTownData(
                    request.towns,
                    request.viewport,
                    request.zoomLevel
                )
            )
        }
        return results
    }

    // Clear caches to free memory
    clearCaches() {
        this.boundaryCache.clear()
        this.simplificationCache.clear()
    }
}

// Export the worker
Comlink.expose(new BoundaryProcessor())
