// Spatial indexing utility for fast viewport queries
export interface Bounds {
    minLat: number
    maxLat: number
    minLng: number
    maxLng: number
}

export interface IndexedItem {
    id: string
    bounds: Bounds
    data: any
}

export interface Viewport {
    north: number
    south: number
    east: number
    west: number
}

// Simple quadtree implementation for spatial indexing
export class SpatialIndex {
    private bounds: Bounds
    private maxItems: number
    private maxDepth: number
    private items: IndexedItem[]
    private nodes: SpatialIndex[]
    private depth: number

    constructor(bounds: Bounds, maxItems = 10, maxDepth = 5, depth = 0) {
        this.bounds = bounds
        this.maxItems = maxItems
        this.maxDepth = maxDepth
        this.depth = depth
        this.items = []
        this.nodes = []
    }

    // Insert an item into the spatial index
    insert(item: IndexedItem): void {
        // If we have subnodes, try to insert into them
        if (this.nodes.length > 0) {
            const index = this.getIndex(item.bounds)
            if (index !== -1) {
                this.nodes[index].insert(item)
                return
            }
        }

        // Add to this node
        this.items.push(item)

        // Check if we need to split
        if (this.items.length > this.maxItems && this.depth < this.maxDepth) {
            if (this.nodes.length === 0) {
                this.split()
            }

            // Redistribute items to subnodes
            let i = 0
            while (i < this.items.length) {
                const index = this.getIndex(this.items[i].bounds)
                if (index !== -1) {
                    this.nodes[index].insert(this.items.splice(i, 1)[0])
                } else {
                    i++
                }
            }
        }
    }

    // Query items that intersect with the given viewport
    query(viewport: Viewport): IndexedItem[] {
        const result: IndexedItem[] = []

        // Check if this node's bounds intersect with the viewport
        if (!this.intersects(this.bounds, viewport)) {
            return result
        }

        // Add items from this node that intersect
        for (const item of this.items) {
            if (this.intersects(item.bounds, viewport)) {
                result.push(item)
            }
        }

        // Query subnodes
        for (const node of this.nodes) {
            result.push(...node.query(viewport))
        }

        return result
    }

    // Split the node into 4 quadrants
    private split(): void {
        const { minLat, maxLat, minLng, maxLng } = this.bounds
        const midLat = (minLat + maxLat) / 2
        const midLng = (minLng + maxLng) / 2

        // Top-right
        this.nodes[0] = new SpatialIndex(
            { minLat: midLat, maxLat, minLng: midLng, maxLng },
            this.maxItems,
            this.maxDepth,
            this.depth + 1
        )

        // Top-left
        this.nodes[1] = new SpatialIndex(
            { minLat: midLat, maxLat, minLng, maxLng: midLng },
            this.maxItems,
            this.maxDepth,
            this.depth + 1
        )

        // Bottom-left
        this.nodes[2] = new SpatialIndex(
            { minLat, maxLat: midLat, minLng, maxLng: midLng },
            this.maxItems,
            this.maxDepth,
            this.depth + 1
        )

        // Bottom-right
        this.nodes[3] = new SpatialIndex(
            { minLat, maxLat: midLat, minLng: midLng, maxLng },
            this.maxItems,
            this.maxDepth,
            this.depth + 1
        )
    }

    // Get the index of the quadrant that can completely contain the bounds
    private getIndex(bounds: Bounds): number {
        const { minLat, maxLat, minLng, maxLng } = this.bounds
        const midLat = (minLat + maxLat) / 2
        const midLng = (minLng + maxLng) / 2

        const topQuadrant = bounds.minLat >= midLat
        const bottomQuadrant = bounds.maxLat <= midLat
        const leftQuadrant = bounds.maxLng <= midLng
        const rightQuadrant = bounds.minLng >= midLng

        if (topQuadrant) {
            if (rightQuadrant) return 0 // Top-right
            if (leftQuadrant) return 1 // Top-left
        }

        if (bottomQuadrant) {
            if (leftQuadrant) return 2 // Bottom-left
            if (rightQuadrant) return 3 // Bottom-right
        }

        return -1 // Cannot fit completely in any quadrant
    }

    // Check if bounds intersect with viewport - more generous intersection
    private intersects(bounds: Bounds, viewport: Viewport): boolean {
        // Add small buffer to prevent edge cases from being filtered out
        const buffer = 0.001
        return !(
            bounds.maxLat < viewport.south - buffer ||
            bounds.minLat > viewport.north + buffer ||
            bounds.maxLng < viewport.west - buffer ||
            bounds.minLng > viewport.east + buffer
        )
    }

    // Clear the index
    clear(): void {
        this.items = []
        this.nodes = []
    }

    // Get statistics about the index
    getStats(): { totalItems: number; totalNodes: number; maxDepth: number } {
        let totalItems = this.items.length
        let totalNodes = 1
        let maxDepth = this.depth

        for (const node of this.nodes) {
            const stats = node.getStats()
            totalItems += stats.totalItems
            totalNodes += stats.totalNodes
            maxDepth = Math.max(maxDepth, stats.maxDepth)
        }

        return { totalItems, totalNodes, maxDepth }
    }
}

// Utility function to calculate bounds for a polygon
export function calculatePolygonBounds(
    coordinates: number[][][] | number[][][][],
    type: "Polygon" | "MultiPolygon"
): Bounds {
    let minLat = Infinity,
        maxLat = -Infinity
    let minLng = Infinity,
        maxLng = -Infinity

    const processCoordinates = (coords: number[][]) => {
        for (const [lng, lat] of coords) {
            if (lat < minLat) minLat = lat
            if (lat > maxLat) maxLat = lat
            if (lng < minLng) minLng = lng
            if (lng > maxLng) maxLng = lng
        }
    }

    try {
        if (type === "Polygon") {
            for (const ring of coordinates as number[][][]) {
                processCoordinates(ring)
            }
        } else if (type === "MultiPolygon") {
            for (const polygon of coordinates as number[][][][]) {
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

// Utility to convert Leaflet bounds to viewport
export function leafletBoundsToViewport(bounds: any): Viewport {
    return {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
    }
}
