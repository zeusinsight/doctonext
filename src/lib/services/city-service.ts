// City service adapter for france-cities-js library
import { searchCity } from "france-cities-js"

// Keep compatibility with existing CityInfo interface
export interface CityInfo {
  name: string
  priority: 1 | 2 | 3 | 4
  minZoom: number
  lat: number
  lng: number
  zoom?: number
  code: string
}

// City data structure from france-cities-js
interface FranceCitiesJSCity {
  id: number
  department_code: string
  insee_code: string
  zip_code: string
  name: string
  slug: string
  gps_lat: number
  gps_lng: number
}

// Cache for search results to improve performance
const searchCache = new Map<string, CityInfo[]>()
const CACHE_TIMEOUT = 5 * 60 * 1000 // 5 minutes

// Assign priority based on city characteristics
function determineCityPriority(city: FranceCitiesJSCity): 1 | 2 | 3 | 4 {
  // Major cities (population-based heuristic using common patterns)
  const majorCities = [
    'paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes',
    'strasbourg', 'montpellier', 'bordeaux', 'lille'
  ]

  const regionalCities = [
    'rennes', 'reims', 'le-havre', 'saint-etienne', 'toulon', 'grenoble',
    'dijon', 'angers', 'nimes', 'aix-en-provence', 'nancy', 'poitiers',
    'boulogne-sur-mer', 'la-rochelle', 'vannes'
  ]

  const slug = city.slug.toLowerCase()

  if (majorCities.includes(slug)) {
    return 1 // Major cities
  } else if (regionalCities.includes(slug)) {
    return 2 // Regional cities
  } else if (city.department_code && parseInt(city.department_code) <= 95) {
    // Metropolitan France departments
    return 3 // Regional centers
  } else {
    return 4 // Other communes
  }
}

// Convert france-cities-js format to our CityInfo format
function convertToCity(city: FranceCitiesJSCity): CityInfo {
  const priority = determineCityPriority(city)

  return {
    name: city.name,
    priority,
    minZoom: getMinZoomForPriority(priority),
    lat: city.gps_lat,
    lng: city.gps_lng,
    zoom: getDefaultZoomForPriority(priority),
    code: city.insee_code
  }
}

function getMinZoomForPriority(priority: number): number {
  switch (priority) {
    case 1: return 6
    case 2: return 7
    case 3: return 8
    default: return 9
  }
}

function getDefaultZoomForPriority(priority: number): number {
  switch (priority) {
    case 1: return 10
    case 2: return 11
    case 3: return 12
    default: return 13
  }
}

// Search cities by name with caching
export function searchCities(query: string): CityInfo[] {
  if (!query.trim()) return []

  const normalizedQuery = query.toLowerCase().trim()
  const cacheKey = normalizedQuery

  // Check cache first
  if (searchCache.has(cacheKey)) {
    const cached = searchCache.get(cacheKey)!
    return cached
  }

  try {
    // Use france-cities-js to search cities
    const results = searchCity.byName(normalizedQuery, 50) as FranceCitiesJSCity[]

    // Convert to our format and sort by priority
    const cities = results
      .map(convertToCity)
      .sort((a, b) => {
        // Priority sort (lower priority number = higher priority)
        if (a.priority !== b.priority) {
          return a.priority - b.priority
        }
        // Then alphabetical
        return a.name.localeCompare(b.name)
      })
      .slice(0, 10) // Limit to 10 results

    // Cache the results
    searchCache.set(cacheKey, cities)

    // Clear cache after timeout
    setTimeout(() => {
      searchCache.delete(cacheKey)
    }, CACHE_TIMEOUT)

    return cities
  } catch (error) {
    console.error('Error searching cities:', error)
    return []
  }
}

// Get all cities (for backwards compatibility, though not recommended with 36k+ cities)
export function getAllCities(): CityInfo[] {
  console.warn('getAllCities() not recommended with france-cities-js due to large dataset size')
  return []
}

// Priority labels and colors (keep existing logic)
export function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 1: return "Grande ville"
    case 2: return "Ville régionale"
    case 3: return "Chef-lieu"
    default: return "Commune"
  }
}

export function getPriorityColor(priority: number): string {
  switch (priority) {
    case 1: return "text-blue-600"
    case 2: return "text-green-600"
    case 3: return "text-gray-600"
    default: return "text-gray-500"
  }
}

// Check if a city should be shown at current zoom level
export function shouldShowCityLabel(cityCode: string, zoom: number): boolean {
  // This would require looking up the city from the database
  // For now, use a simple heuristic based on zoom level
  return zoom >= 6
}

// Get label style based on priority (keep existing implementation)
export function getCityLabelStyle(priority: number, zoom: number): {
  fontSize: number
  fontWeight: string
  background: string
  padding: string
  border: string
  boxShadow: string
} {
  switch (priority) {
    case 1: // Major cities
      return {
        fontSize: Math.min(16, 10 + zoom * 0.8),
        fontWeight: "bold",
        background: "rgba(255, 255, 255, 0.95)",
        padding: "6px 10px",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
      }
    case 2: // Regional cities
      return {
        fontSize: Math.min(14, 8 + zoom * 0.6),
        fontWeight: "600",
        background: "rgba(255, 255, 255, 0.92)",
        padding: "4px 8px",
        border: "1px solid rgba(0, 0, 0, 0.18)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)"
      }
    case 3: // Smaller cities
      return {
        fontSize: Math.min(12, 6 + zoom * 0.5),
        fontWeight: "500",
        background: "rgba(255, 255, 255, 0.88)",
        padding: "3px 6px",
        border: "1px solid rgba(0, 0, 0, 0.15)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
      }
    default: // All other communes
      return {
        fontSize: Math.min(11, 5 + zoom * 0.4),
        fontWeight: "normal",
        background: "rgba(255, 255, 255, 0.85)",
        padding: "2px 5px",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)"
      }
  }
}