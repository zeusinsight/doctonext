import { db } from "@/database/db"
import { users, listings, listingLocations } from "@/database/schema"
import { eq, and, count, sql } from "drizzle-orm"
import type { RegionDensity } from "@/components/map/medical-density-overlay"

// French region population data (2023 estimates)
const REGION_POPULATION_DATA = {
  "Île-de-France": 12317279,
  "Auvergne-Rhône-Alpes": 8112714,
  "Hauts-de-France": 5965058,
  "Nouvelle-Aquitaine": 6018386,
  "Occitanie": 5999982,
  "Grand Est": 5511747,
  "Provence-Alpes-Côte d'Azur": 5098666,
  "Pays de la Loire": 3832120,
  "Normandie": 3317500,
  "Bretagne": 3373835,
  "Bourgogne-Franche-Comté": 2783039,
  "Centre-Val de Loire": 2568029,
  "Corse": 344679,
  "Guadeloupe": 395700,
  "Martinique": 364508,
  "Guyane": 301099,
  "La Réunion": 873356,
  "Mayotte": 279515,
}

// Simplified polygon coordinates for French regions (for visualization)
// In a real implementation, these would come from a geographic data service
const REGION_BOUNDARIES = {
  "Île-de-France": [
    [
      [1.4461, 49.2147],
      [3.5589, 49.2147],
      [3.5589, 48.1205],
      [1.4461, 48.1205],
      [1.4461, 49.2147]
    ]
  ],
  "Auvergne-Rhône-Alpes": [
    [
      [2.1697, 46.8176],
      [7.1442, 46.8176],
      [7.1442, 44.1259],
      [2.1697, 44.1259],
      [2.1697, 46.8176]
    ]
  ],
  "Provence-Alpes-Côte d'Azur": [
    [
      [4.2279, 44.9013],
      [7.7186, 44.9013],
      [7.7186, 43.0203],
      [4.2279, 43.0203],
      [4.2279, 44.9013]
    ]
  ],
  "Nouvelle-Aquitaine": [
    [
      [-1.7889, 46.8176],
      [2.1697, 46.8176],
      [2.1697, 42.3334],
      [-1.7889, 42.3334],
      [-1.7889, 46.8176]
    ]
  ],
  "Occitanie": [
    [
      [0.1278, 44.9013],
      [4.8378, 44.9013],
      [4.8378, 42.3334],
      [0.1278, 42.3334],
      [0.1278, 44.9013]
    ]
  ],
  "Hauts-de-France": [
    [
      [1.3733, 51.1244],
      [4.2279, 51.1244],
      [4.2279, 49.2147],
      [1.3733, 49.2147],
      [1.3733, 51.1244]
    ]
  ],
  "Grand Est": [
    [
      [4.2279, 49.6710],
      [8.2336, 49.6710],
      [8.2336, 47.4521],
      [4.2279, 47.4521],
      [4.2279, 49.6710]
    ]
  ],
  "Pays de la Loire": [
    [
      [-2.5811, 47.8028],
      [0.1278, 47.8028],
      [0.1278, 46.2644],
      [-2.5811, 46.2644],
      [-2.5811, 47.8028]
    ]
  ],
  "Bretagne": [
    [
      [-5.1406, 48.9077],
      [-0.9998, 48.9077],
      [-0.9998, 47.2383],
      [-5.1406, 47.2383],
      [-5.1406, 48.9077]
    ]
  ],
  "Normandie": [
    [
      [-1.7889, 49.7297],
      [1.7889, 49.7297],
      [1.7889, 48.1736],
      [-1.7889, 48.1736],
      [-1.7889, 49.7297]
    ]
  ],
  "Centre-Val de Loire": [
    [
      [0.1278, 48.6044],
      [3.0556, 48.6044],
      [3.0556, 46.3470],
      [0.1278, 46.3470],
      [0.1278, 48.6044]
    ]
  ],
  "Bourgogne-Franche-Comté": [
    [
      [2.1697, 48.3970],
      [7.1442, 48.3970],
      [7.1442, 46.2644],
      [2.1697, 46.2644],
      [2.1697, 48.3970]
    ]
  ],
  "Corse": [
    [
      [8.5387, 43.0203],
      [9.5606, 43.0203],
      [9.5606, 41.3337],
      [8.5387, 41.3337],
      [8.5387, 43.0203]
    ]
  ]
}

interface MedicalDensityFilters {
  specialty?: string
  profession?: string
}

/**
 * Calculate medical density by region
 */
export async function calculateMedicalDensityByRegion(
  filters: MedicalDensityFilters = {}
): Promise<RegionDensity[]> {
  try {
    // Build the query conditions
    const conditions = []
    if (filters.specialty) {
      conditions.push(eq(users.specialty, filters.specialty))
    }
    if (filters.profession) {
      conditions.push(eq(users.profession, filters.profession))
    }

    // Get professional counts by region
    const professionalsByRegion = await db
      .select({
        region: listingLocations.region,
        professionalCount: count(users.id)
      })
      .from(users)
      .innerJoin(listings, eq(listings.userId, users.id))
      .innerJoin(listingLocations, eq(listingLocations.listingId, listings.id))
      .where(
        and(
          eq(users.isVerifiedProfessional, true),
          ...conditions
        )
      )
      .groupBy(listingLocations.region)

    // Calculate density scores for each region
    const densityData: RegionDensity[] = professionalsByRegion.map((region) => {
      const population = REGION_POPULATION_DATA[region.region as keyof typeof REGION_POPULATION_DATA] || 1000000
      const professionalCount = region.professionalCount || 0
      
      // Calculate professionals per 10,000 inhabitants
      const professionalsPerTenThousand = (professionalCount / population) * 10000
      
      // Convert to density score (0-100)
      // Adjust these thresholds based on medical standards for different specialties
      const maxExpectedRatio = filters.specialty === "Médecin généraliste" ? 12 : 8
      const densityScore = Math.min(100, (professionalsPerTenThousand / maxExpectedRatio) * 100)

      return {
        region: region.region,
        code: region.region.toLowerCase().replace(/[^a-z]/g, ''),
        densityScore: Math.round(densityScore),
        professionalCount,
        populationCount: population,
        bounds: (REGION_BOUNDARIES[region.region as keyof typeof REGION_BOUNDARIES] || []) as number[][][]
      }
    })

    // Add regions with no professionals (0 density)
    const regionsWithData = new Set(densityData.map(d => d.region))
    Object.keys(REGION_POPULATION_DATA).forEach(region => {
      if (!regionsWithData.has(region)) {
        densityData.push({
          region,
          code: region.toLowerCase().replace(/[^a-z]/g, ''),
          densityScore: 0,
          professionalCount: 0,
          populationCount: REGION_POPULATION_DATA[region as keyof typeof REGION_POPULATION_DATA],
          bounds: (REGION_BOUNDARIES[region as keyof typeof REGION_BOUNDARIES] || []) as number[][][]
        })
      }
    })

    return densityData.sort((a, b) => a.region.localeCompare(b.region))
  } catch (error) {
    console.error("Error calculating medical density:", error)
    return []
  }
}

/**
 * Get medical density statistics overview
 */
export async function getMedicalDensityStats(filters: MedicalDensityFilters = {}) {
  try {
    const densityData = await calculateMedicalDensityByRegion(filters)
    
    const totalProfessionals = densityData.reduce((sum, region) => sum + region.professionalCount, 0)
    const totalPopulation = densityData.reduce((sum, region) => sum + region.populationCount, 0)
    
    const averageDensity = densityData.reduce((sum, region) => sum + region.densityScore, 0) / densityData.length
    
    const underServed = densityData.filter(region => region.densityScore <= 30).length
    const moderateDensity = densityData.filter(region => region.densityScore > 30 && region.densityScore <= 70).length
    const overServed = densityData.filter(region => region.densityScore > 70).length

    return {
      totalProfessionals,
      totalPopulation,
      averageDensity: Math.round(averageDensity),
      nationalRatio: (totalProfessionals / totalPopulation) * 10000,
      regionBreakdown: {
        underServed,
        moderateDensity,
        overServed
      }
    }
  } catch (error) {
    console.error("Error getting medical density stats:", error)
    return null
  }
}

/**
 * Cache medical density data to improve performance
 */
let densityCache = new Map<string, { data: RegionDensity[]; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export async function getCachedMedicalDensity(filters: MedicalDensityFilters = {}) {
  const cacheKey = JSON.stringify(filters || {})
  const cached = densityCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  
  const data = await calculateMedicalDensityByRegion(filters)
  densityCache.set(cacheKey, { data, timestamp: Date.now() })
  
  // Clean old cache entries
  if (densityCache.size > 50) {
    const oldestKey = densityCache.keys().next().value
    if (oldestKey) {
      densityCache.delete(oldestKey)
    }
  }
  
  return data
}