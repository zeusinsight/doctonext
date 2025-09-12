import { getCachedMedicalDensityData, type MedicalProfession, type ZonageLevel, getZonageColor, getZonageDensityScore, getZonageLabel } from './town-density'
import { getCommuneBoundaries, convertCoordinatesToLeaflet, type CommuneWithBoundary } from './commune-boundaries'
import type { CommuneBoundary } from '@/lib/data/commune-boundaries.d'

export interface TownDensityWithBoundary {
  code: string
  name: string
  zonage: ZonageLevel
  profession: MedicalProfession
  boundary: CommuneBoundary
  color: string
  densityScore: number
  label: string
}

export interface TownDensityFilter {
  profession?: MedicalProfession
  zonageLevels?: ZonageLevel[]
  viewport?: {
    north: number
    south: number
    east: number
    west: number
  }
  maxResults?: number
}

// Compute a simple bounding box for a commune boundary
function computeBoundaryBBox(boundary: CommuneBoundary): {
  minLat: number; minLng: number; maxLat: number; maxLng: number
} {
  let minLat = Infinity, maxLat = -Infinity
  let minLng = Infinity, maxLng = -Infinity

  if (boundary.type === 'Polygon') {
    const coords = boundary.coordinates as number[][][]
    for (const ring of coords) {
      for (const [lng, lat] of ring) {
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
      }
    }
  } else {
    const mcoords = boundary.coordinates as number[][][][]
    for (const polygon of mcoords) {
      for (const ring of polygon) {
        for (const [lng, lat] of ring) {
          if (lat < minLat) minLat = lat
          if (lat > maxLat) maxLat = lat
          if (lng < minLng) minLng = lng
          if (lng > maxLng) maxLng = lng
        }
      }
    }
  }

  return { minLat, minLng, maxLat, maxLng }
}

// Basic bbox-viewport intersection test
function bboxIntersectsViewport(
  bbox: { minLat: number; minLng: number; maxLat: number; maxLng: number },
  viewport: { north: number; south: number; east: number; west: number }
): boolean {
  return (
    bbox.maxLat >= viewport.south &&
    bbox.minLat <= viewport.north &&
    bbox.maxLng >= viewport.west &&
    bbox.minLng <= viewport.east
  )
}

/**
 * Get town medical density data with geographic boundaries
 */
export async function getTownMedicalDensityWithBoundaries(
  profession: MedicalProfession,
  options: TownDensityFilter = {}
): Promise<TownDensityWithBoundary[]> {
  try {
    console.log(`Loading town density data for ${profession}...`)
    
    // Get all medical density data
    const densityData = await getCachedMedicalDensityData()
    
    // Filter towns that have data for the specified profession
    const townCodes = Object.keys(densityData).filter(code => {
      const town = densityData[code]
      return town.zones[profession] !== undefined
    })
    
    console.log(`Found ${townCodes.length} towns with ${profession} data`)
    
    // Apply zonage level filtering
    let filteredCodes = townCodes
    if (options.zonageLevels?.length) {
      filteredCodes = townCodes.filter(code => {
        const zonage = densityData[code].zones[profession]
        return zonage && options.zonageLevels!.includes(zonage)
      })
    }
    
    console.log(`Processing ${filteredCodes.length} filtered towns...`)
    
    // Get boundary data (this might be memory intensive, so we'll batch it)
    const batchSize = 100
    const result: TownDensityWithBoundary[] = []
    let reachedLimit = false
    
    for (let i = 0; i < filteredCodes.length; i += batchSize) {
      const batch = filteredCodes.slice(i, i + batchSize)
      const boundaries = await getCommuneBoundaries(batch)
      
      // Create boundary lookup for this batch
      const boundaryMap = new Map<string, CommuneWithBoundary>()
      boundaries.forEach(boundary => boundaryMap.set(boundary.code, boundary))
      
      // Combine density and boundary data
      for (const code of batch) {
        const town = densityData[code]
        const boundary = boundaryMap.get(code)
        const zonage = town.zones[profession]
        
        if (boundary && zonage) {
          // If a viewport was provided, only include communes intersecting it
          if (options.viewport) {
            const bbox = computeBoundaryBBox(boundary.boundary)
            if (!bboxIntersectsViewport(bbox, options.viewport)) {
              continue
            }
          }

          result.push({
            code,
            name: town.name,
            zonage,
            profession,
            boundary: boundary.boundary,
            color: getZonageColor(zonage),
            densityScore: getZonageDensityScore(zonage),
            label: getZonageLabel(zonage)
          })

          // Respect maxResults after viewport filtering
          if (options.maxResults && result.length >= options.maxResults) {
            reachedLimit = true
            break
          }
        }
      }
      if (reachedLimit) {
        break
      }
      
      if ((i + batchSize) % 500 === 0) {
        console.log(`Processed ${Math.min(i + batchSize, filteredCodes.length)}/${filteredCodes.length} towns...`)
      }
    }
    
    console.log(`Successfully loaded ${result.length} towns with boundaries`)
    return result
    
  } catch (error) {
    console.error('Error getting town density with boundaries:', error)
    return []
  }
}

/**
 * Get simplified density data for viewport-based rendering
 */
export async function getTownDensityForViewport(
  profession: MedicalProfession,
  viewport: { north: number; south: number; east: number; west: number },
  maxTowns = 500
): Promise<TownDensityWithBoundary[]> {
  // For now, we'll return a subset of data
  // In a production app, this would use spatial indexing
  return getTownMedicalDensityWithBoundaries(profession, {
    viewport,
    maxResults: maxTowns
  })
}

/**
 * Get density statistics for a profession across all towns
 */
export async function getTownDensityStatistics(profession: MedicalProfession) {
  const densityData = await getCachedMedicalDensityData()
  
  const stats = {
    profession,
    totalTowns: 0,
    distribution: new Map<ZonageLevel, number>(),
    townsByZonage: new Map<ZonageLevel, string[]>()
  }
  
  // Count towns by zonage level
  Object.entries(densityData).forEach(([code, town]) => {
    const zonage = town.zones[profession]
    if (zonage) {
      stats.totalTowns++
      
      const currentCount = stats.distribution.get(zonage) || 0
      stats.distribution.set(zonage, currentCount + 1)
      
      const currentTowns = stats.townsByZonage.get(zonage) || []
      currentTowns.push(code)
      stats.townsByZonage.set(zonage, currentTowns)
    }
  })
  
  return {
    profession,
    totalTowns: stats.totalTowns,
    distribution: Array.from(stats.distribution.entries()).map(([zonage, count]) => ({
      zonage,
      count,
      percentage: Math.round((count / stats.totalTowns) * 100),
      color: getZonageColor(zonage),
      label: getZonageLabel(zonage)
    })),
    townsByZonage: Object.fromEntries(stats.townsByZonage.entries())
  }
}

/**
 * Convert town boundary to Leaflet polygon coordinates
 */
export function convertTownBoundaryToLeaflet(town: TownDensityWithBoundary): L.LatLngExpression[] | L.LatLngExpression[][] {
  return convertCoordinatesToLeaflet(town.boundary.coordinates, town.boundary.type)
}

/**
 * Get towns by zonage level for a profession (useful for filtering)
 */
export async function getTownsByZonageLevel(
  profession: MedicalProfession,
  zonageLevel: ZonageLevel,
  maxResults = 100
): Promise<TownDensityWithBoundary[]> {
  return getTownMedicalDensityWithBoundaries(profession, {
    zonageLevels: [zonageLevel],
    maxResults
  })
}

/**
 * Progressive loading class for large datasets
 */
export class TownDensityLoader {
  private loadedTowns = new Map<string, TownDensityWithBoundary>()
  private isLoading = false
  
  async loadTownsProgressively(
    profession: MedicalProfession,
    batchSize = 50,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<Map<string, TownDensityWithBoundary>> {
    if (this.isLoading) {
      console.log('Loading already in progress...')
      return this.loadedTowns
    }
    
    this.isLoading = true
    
    try {
      const densityData = await getCachedMedicalDensityData()
      const townCodes = Object.keys(densityData).filter(code => 
        densityData[code].zones[profession] !== undefined
      )
      
      const total = townCodes.length
      let loaded = 0
      
      console.log(`Starting progressive load of ${total} towns...`)
      
      for (let i = 0; i < townCodes.length; i += batchSize) {
        const batch = townCodes.slice(i, i + batchSize)
        const boundaries = await getCommuneBoundaries(batch)
        
        const boundaryMap = new Map<string, CommuneWithBoundary>()
        boundaries.forEach(boundary => boundaryMap.set(boundary.code, boundary))
        
        for (const code of batch) {
          const town = densityData[code]
          const boundary = boundaryMap.get(code)
          const zonage = town.zones[profession]
          
          if (boundary && zonage) {
            this.loadedTowns.set(code, {
              code,
              name: town.name,
              zonage,
              profession,
              boundary: boundary.boundary,
              color: getZonageColor(zonage),
              densityScore: getZonageDensityScore(zonage),
              label: getZonageLabel(zonage)
            })
          }
          
          loaded++
          if (onProgress && loaded % 100 === 0) {
            onProgress(loaded, total)
          }
        }
        
        // Add a small delay to prevent blocking the main thread
        if (i % 200 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10))
        }
      }
      
      console.log(`Progressive loading complete: ${this.loadedTowns.size} towns loaded`)
      return this.loadedTowns
      
    } finally {
      this.isLoading = false
    }
  }
  
  getTownByCode(code: string): TownDensityWithBoundary | undefined {
    return this.loadedTowns.get(code)
  }
  
  getTownsByZonage(zonage: ZonageLevel): TownDensityWithBoundary[] {
    return Array.from(this.loadedTowns.values()).filter(town => town.zonage === zonage)
  }
  
  clear(): void {
    this.loadedTowns.clear()
  }
}