import { indexedDBCache } from '@/lib/utils/indexed-db-cache'

export interface DepartmentGeometry {
  type: 'Polygon' | 'MultiPolygon'
  coordinates: number[][][] | number[][][][]
}

export interface DepartmentFeature {
  type: 'Feature'
  properties: {
    nom: string
    code: string
  }
  geometry: DepartmentGeometry
}

export interface DepartmentData {
  code: string
  name: string
  geometry: DepartmentGeometry
  bounds: {
    north: number
    south: number
    east: number
    west: number
  }
}

const DEPARTMENT_CACHE_KEY = 'france-departments'
const DEPARTMENT_GEOJSON_URL = 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson'
const CACHE_VERSION = 1

// Simple in-memory cache since IndexedDB is disabled
const departmentCache = new Map<string, any>()

/**
 * Calculate bounds from geometry coordinates
 */
function calculateBounds(geometry: DepartmentGeometry): { north: number; south: number; east: number; west: number } {
  let minLat = Infinity, maxLat = -Infinity
  let minLng = Infinity, maxLng = -Infinity

  const processCoordinates = (coords: number[][][]) => {
    coords.forEach(ring => {
      ring.forEach(([lng, lat]) => {
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
      })
    })
  }

  if (geometry.type === 'Polygon') {
    processCoordinates(geometry.coordinates as number[][][])
  } else if (geometry.type === 'MultiPolygon') {
    (geometry.coordinates as number[][][][]).forEach(polygon => {
      processCoordinates(polygon)
    })
  }

  return {
    north: maxLat,
    south: minLat,
    east: maxLng,
    west: minLng
  }
}

/**
 * Fetch and cache department data from france-geojson
 */
export async function fetchDepartments(): Promise<DepartmentData[]> {
  try {
    // Try to get from cache first
    const cachedData = departmentCache.get(DEPARTMENT_CACHE_KEY)
    if (cachedData) {
      console.log(`Loaded ${cachedData.length} departments from cache`)
      return cachedData
    }

    console.log('Fetching departments from france-geojson...')

    const response = await fetch(DEPARTMENT_GEOJSON_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.status}`)
    }

    const geoJson = await response.json()
    const departments: DepartmentData[] = []

    if (geoJson.features && Array.isArray(geoJson.features)) {
      for (const feature of geoJson.features as DepartmentFeature[]) {
        if (feature.properties?.code && feature.properties?.nom && feature.geometry) {
          const bounds = calculateBounds(feature.geometry)

          departments.push({
            code: feature.properties.code,
            name: feature.properties.nom,
            geometry: feature.geometry,
            bounds
          })
        }
      }
    }

    console.log(`Loaded ${departments.length} departments from API`)

    // Cache the data
    departmentCache.set(DEPARTMENT_CACHE_KEY, departments)

    return departments
  } catch (error) {
    console.error('Error fetching departments:', error)
    throw new Error('Failed to load department data')
  }
}

/**
 * Get a specific department by code
 */
export async function getDepartmentByCode(code: string): Promise<DepartmentData | null> {
  const departments = await fetchDepartments()
  return departments.find(dept => dept.code === code) || null
}

/**
 * Get departments within a specific geographical area
 */
export async function getDepartmentsInBounds(
  north: number,
  south: number,
  east: number,
  west: number
): Promise<DepartmentData[]> {
  const departments = await fetchDepartments()

  return departments.filter(dept => {
    const { bounds } = dept
    // Check if department bounds intersect with the given bounds
    return !(
      bounds.south > north ||
      bounds.north < south ||
      bounds.west > east ||
      bounds.east < west
    )
  })
}

/**
 * Convert GeoJSON coordinates to Leaflet format
 */
export function convertDepartmentCoordinatesToLeaflet(
  coordinates: number[][][] | number[][][][],
  type: 'Polygon' | 'MultiPolygon'
): L.LatLngExpression[] | L.LatLngExpression[][] {
  if (type === 'Polygon') {
    return (coordinates as number[][][]).map(ring =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    ) as L.LatLngExpression[][]
  } else {
    // MultiPolygon - flatten to array of polygons
    return (coordinates as number[][][][]).flatMap(polygon =>
      polygon.map(ring =>
        ring.map(([lng, lat]) => [lat, lng] as [number, number])
      )
    ) as L.LatLngExpression[][]
  }
}