// Simple in-memory cache since IndexedDB is disabled for build compatibility
const communeCache = new Map<string, any>()

export interface CommuneGeometry {
  type: 'Polygon' | 'MultiPolygon'
  coordinates: number[][][] | number[][][][]
}

export interface CommuneFeature {
  type: 'Feature'
  properties: {
    nom: string
    code: string
  }
  geometry: CommuneGeometry
}

export interface CommuneData {
  code: string
  name: string
  geometry: CommuneGeometry
  departmentCode: string
}

const COMMUNE_CACHE_KEY_PREFIX = 'france-communes-dept-'

/**
 * Get department code from INSEE commune code
 * First 2 digits for metropolitan France, first 3 for overseas
 */
function getDepartmentCodeFromCommune(communeCode: string): string {
  // Overseas departments start with 97 or 98
  if (communeCode.startsWith('97') || communeCode.startsWith('98')) {
    return communeCode.substring(0, 3)
  }

  // Corsica departments (2A, 2B)
  if (communeCode.startsWith('2A') || communeCode.startsWith('2B')) {
    return communeCode.substring(0, 2)
  }

  // Metropolitan departments
  return communeCode.substring(0, 2)
}

/**
 * Fetch communes for a specific department
 */
export async function fetchCommunesForDepartment(departmentCode: string): Promise<CommuneData[]> {
  const cacheKey = `${COMMUNE_CACHE_KEY_PREFIX}${departmentCode}`

  try {
    // Try to get from cache first
    const cachedData = communeCache.get(cacheKey)
    if (cachedData) {
      console.log(`Loaded ${cachedData.length} communes for department ${departmentCode} from cache`)
      return cachedData
    }

    console.log(`Fetching communes for department ${departmentCode} from france-geojson...`)

    // Construct URL for department-specific communes
    const url = `https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/communes/${departmentCode}/communes-${departmentCode}-version-simplifiee.geojson`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch communes for department ${departmentCode}: ${response.status}`)
    }

    const geoJson = await response.json()
    const communes: CommuneData[] = []

    if (geoJson.features && Array.isArray(geoJson.features)) {
      for (const feature of geoJson.features as CommuneFeature[]) {
        if (feature.properties?.code && feature.properties?.nom && feature.geometry) {
          communes.push({
            code: feature.properties.code,
            name: feature.properties.nom,
            geometry: feature.geometry,
            departmentCode
          })
        }
      }
    }

    console.log(`Loaded ${communes.length} communes for department ${departmentCode}`)

    // Cache the data
    communeCache.set(cacheKey, communes)

    return communes
  } catch (error) {
    console.error(`Error fetching communes for department ${departmentCode}:`, error)

    // Fallback: try to get from the main communes file (less efficient)
    try {
      console.log(`Fallback: fetching from main communes file for department ${departmentCode}`)
      return await fetchCommunesFromMainFile(departmentCode)
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError)
      throw new Error(`Failed to load communes for department ${departmentCode}`)
    }
  }
}

/**
 * Fallback method: fetch from main communes file and filter by department
 */
async function fetchCommunesFromMainFile(departmentCode: string): Promise<CommuneData[]> {
  const cacheKey = `${COMMUNE_CACHE_KEY_PREFIX}${departmentCode}-fallback`

  try {
    const cachedData = communeCache.get(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const url = 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/communes-version-simplifiee.geojson'
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch main communes file: ${response.status}`)
    }

    const geoJson = await response.json()
    const communes: CommuneData[] = []

    if (geoJson.features && Array.isArray(geoJson.features)) {
      for (const feature of geoJson.features as CommuneFeature[]) {
        if (feature.properties?.code && feature.properties?.nom && feature.geometry) {
          const communeDepartmentCode = getDepartmentCodeFromCommune(feature.properties.code)

          if (communeDepartmentCode === departmentCode) {
            communes.push({
              code: feature.properties.code,
              name: feature.properties.nom,
              geometry: feature.geometry,
              departmentCode
            })
          }
        }
      }
    }

    // Cache the filtered results
    communeCache.set(cacheKey, communes)

    return communes
  } catch (error) {
    console.error('Error in fallback commune loading:', error)
    throw error
  }
}

/**
 * Get a specific commune by code
 */
export async function getCommuneByCode(communeCode: string): Promise<CommuneData | null> {
  const departmentCode = getDepartmentCodeFromCommune(communeCode)
  const communes = await fetchCommunesForDepartment(departmentCode)
  return communes.find(commune => commune.code === communeCode) || null
}

/**
 * Convert GeoJSON coordinates to Leaflet format
 */
export function convertCommuneCoordinatesToLeaflet(
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