import { type CommuneBoundary } from '@/lib/data/commune-boundaries.d'

// Lazy-loaded boundary data to avoid loading 23MB upfront
let boundaryData: Record<string, CommuneBoundary> | null = null

export interface CommuneWithBoundary {
  code: string
  name: string
  boundary: CommuneBoundary
}

/**
 * Load commune boundary data (lazy-loaded)
 */
async function loadBoundaryData(): Promise<Record<string, CommuneBoundary>> {
  if (boundaryData) return boundaryData
  
  try {
    // Check if we're running on the server or client
    if (typeof window === 'undefined') {
      // Server-side: load directly from file system
      const fs = await import('fs')
      const path = await import('path')
      
      const dataPath = path.join(process.cwd(), 'src', 'lib', 'data', 'commune-boundaries.json')
      const rawData = fs.readFileSync(dataPath, 'utf8')
      boundaryData = JSON.parse(rawData)
      
      console.log(`Loaded ${Object.keys(boundaryData || {}).length} commune boundaries from file system`)
    } else {
      // Client-side: use fetch with absolute URL
      const response = await fetch('/api/map/commune-boundaries')
      if (!response.ok) throw new Error('Failed to load boundary data')
      
      boundaryData = await response.json()
      console.log(`Loaded ${Object.keys(boundaryData || {}).length} commune boundaries from API`)
    }
    
    return boundaryData || {}
  } catch (error) {
    console.error('Error loading commune boundary data:', error)
    // Return empty object as fallback
    boundaryData = {}
    return boundaryData
  }
}

/**
 * Get boundary data for specific commune codes
 */
export async function getCommuneBoundaries(codes: string[]): Promise<CommuneWithBoundary[]> {
  const data = await loadBoundaryData()
  const result: CommuneWithBoundary[] = []
  
  for (const code of codes) {
    if (data[code]) {
      result.push({
        code,
        name: data[code].name,
        boundary: data[code]
      })
    }
  }
  
  return result
}

/**
 * Get boundary data for a single commune
 */
export async function getCommuneBoundary(code: string): Promise<CommuneWithBoundary | null> {
  const data = await loadBoundaryData()
  
  if (!data[code]) return null
  
  return {
    code,
    name: data[code].name,
    boundary: data[code]
  }
}

/**
 * Convert GeoJSON-style coordinates to Leaflet format
 */
export function convertCoordinatesToLeaflet(
  coordinates: number[][][] | number[][][][],
  type: 'Polygon' | 'MultiPolygon'
): L.LatLngExpression[] | L.LatLngExpression[][] {
  if (type === 'Polygon') {
    return (coordinates as number[][][]).map(ring =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    ) as L.LatLngExpression[][]
  } else {
    // MultiPolygon
    return (coordinates as number[][][][]).flatMap(polygon =>
      polygon.map(ring =>
        ring.map(([lng, lat]) => [lat, lng] as [number, number])
      )
    ) as L.LatLngExpression[][]
  }
}

/**
 * Check if a point is roughly within France bounds (performance optimization)
 */
export function isPointInFranceBounds(lat: number, lng: number): boolean {
  // Rough bounds of France (including overseas territories)
  const metropolitanBounds = {
    north: 51.1,
    south: 41.3,
    east: 9.6,
    west: -5.2
  }
  
  // Check metropolitan France
  if (lat >= metropolitanBounds.south && lat <= metropolitanBounds.north &&
      lng >= metropolitanBounds.west && lng <= metropolitanBounds.east) {
    return true
  }
  
  // Check major overseas territories (rough bounds)
  const overseasBounds = [
    // Martinique
    { north: 14.9, south: 14.4, east: -60.8, west: -61.2 },
    // Guadeloupe
    { north: 16.5, south: 15.8, east: -61.0, west: -61.8 },
    // Guyane
    { north: 6.0, south: 2.1, east: -51.6, west: -54.5 },
    // Réunion
    { north: -20.9, south: -21.4, east: 55.8, west: 55.2 },
    // Mayotte
    { north: -12.6, south: -13.0, east: 45.3, west: 45.0 }
  ]
  
  return overseasBounds.some(bounds =>
    lat >= bounds.south && lat <= bounds.north &&
    lng >= bounds.west && lng <= bounds.east
  )
}

/**
 * Batch load boundaries for multiple codes with viewport filtering
 */
export async function getBoundariesInViewport(
  codes: string[],
  viewport: { north: number; south: number; east: number; west: number }
): Promise<CommuneWithBoundary[]> {
  // This would be implemented with spatial indexing in a real app
  // For now, just return all requested boundaries
  return getCommuneBoundaries(codes)
}

/**
 * Memory-efficient boundary loader for large datasets
 */
export class BoundaryCache {
  private cache = new Map<string, CommuneWithBoundary>()
  private maxCacheSize = 1000 // Keep max 1000 boundaries in memory
  private accessOrder: string[] = []
  
  async getBoundary(code: string): Promise<CommuneWithBoundary | null> {
    // Check cache first
    if (this.cache.has(code)) {
      // Move to end of access order (LRU)
      this.accessOrder = this.accessOrder.filter(c => c !== code)
      this.accessOrder.push(code)
      return this.cache.get(code)!
    }
    
    // Load from source
    const boundary = await getCommuneBoundary(code)
    if (!boundary) return null
    
    // Add to cache
    this.cache.set(code, boundary)
    this.accessOrder.push(code)
    
    // Evict oldest entries if cache is full
    if (this.cache.size > this.maxCacheSize) {
      const oldestCode = this.accessOrder.shift()!
      this.cache.delete(oldestCode)
    }
    
    return boundary
  }
  
  clearCache(): void {
    this.cache.clear()
    this.accessOrder = []
  }
}

// Global boundary cache instance
export const boundaryCache = new BoundaryCache()