// Server-side functions for medical density data
// Uses pre-processed JSON data instead of CSV files for Vercel compatibility

import type {
    MedicalProfession,
    TownDensityData,
    TownMedicalZones,
    ZonageLevel
} from "./town-density-types"
import densityData from "@/lib/data/town-density-data.json"

// Re-export client-safe types and utilities
export type {
    ZonageLevel,
    MedicalProfession,
    TownDensityData,
    TownMedicalZones
} from "./town-density-types"

export {
    getZonageDensityScore,
    getZonageLabel,
    getZonageColor
} from "./town-density-types"

/**
 * Get medical density data for a specific profession from pre-processed JSON
 */
export function parseMedicalDensityCSV(
    profession: MedicalProfession
): Promise<TownDensityData[]> {
    try {
        const data: TownDensityData[] = []
        const typedDensityData = densityData as TownMedicalZones

        // Extract data for the specific profession from all towns
        Object.entries(typedDensityData).forEach(([code, townData]) => {
            const zonage = townData.zones[profession]
            if (zonage && zonage !== "N/A - résultat non disponible") {
                data.push({
                    code,
                    name: townData.name,
                    zonage,
                    profession
                })
            }
        })

        return Promise.resolve(data)
    } catch (error) {
        console.error(`Error extracting data for ${profession}:`, error)
        return Promise.resolve([])
    }
}

/**
 * Load all medical density data for all professions
 */
export function loadAllMedicalDensityData(): Promise<TownMedicalZones> {
    try {
        // Return the pre-processed JSON data directly
        return Promise.resolve(densityData as TownMedicalZones)
    } catch (error) {
        console.error("Error loading medical density data:", error)
        return Promise.resolve({})
    }
}

/**
 * Get towns by zonage level for a specific profession
 */
export async function getTownsByZonage(
    profession: MedicalProfession,
    zonageLevel: ZonageLevel
): Promise<TownDensityData[]> {
    const data = await parseMedicalDensityCSV(profession)
    return data.filter((town) => town.zonage === zonageLevel)
}

/**
 * Get density statistics for a profession
 */
export async function getProfessionDensityStats(profession: MedicalProfession) {
    const data = await parseMedicalDensityCSV(profession)
    const total = data.length

    const stats = {
        total,
        byZonage: {} as Record<ZonageLevel, number>
    }

    for (const town of data) {
        stats.byZonage[town.zonage] = (stats.byZonage[town.zonage] || 0) + 1
    }

    return {
        profession,
        total,
        distribution: Object.entries(stats.byZonage).map(([zonage, count]) => ({
            zonage: zonage as ZonageLevel,
            count,
            percentage: Math.round((count / total) * 100)
        }))
    }
}

/**
 * Get cached medical density data (server-side only)
 * Now uses pre-processed JSON data - no caching needed as data is already in memory
 */
export function getCachedMedicalDensityData(): Promise<TownMedicalZones> {
    // Ensure this only runs on server side
    if (typeof window !== "undefined") {
        throw new Error(
            "getCachedMedicalDensityData can only be called on server side. Use the API routes instead."
        )
    }

    try {
        const data = densityData as TownMedicalZones
        console.log(
            `Loaded ${Object.keys(data).length} towns with medical density data`
        )
        return Promise.resolve(data)
    } catch (error) {
        console.error("Error accessing medical density data:", error)
        return Promise.resolve({})
    }
}
