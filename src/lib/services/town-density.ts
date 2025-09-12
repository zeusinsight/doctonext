// Server-side functions for processing CSV files and medical density data

import { MedicalProfession, TownDensityData, TownMedicalZones, ZonageLevel } from './town-density-types'

// Re-export client-safe types and utilities
export type {
  ZonageLevel,
  MedicalProfession,
  TownDensityData,
  TownMedicalZones
} from './town-density-types'

export {
  getZonageDensityScore,
  getZonageLabel,
  getZonageColor
} from './town-density-types'

/**
 * Parse a single CSV file for medical density data
 */
export async function parseMedicalDensityCSV(profession: MedicalProfession): Promise<TownDensityData[]> {
  try {
    // Only import fs and path on server side
    if (typeof window !== 'undefined') {
      throw new Error('CSV parsing is only available on server side')
    }
    
    // Dynamic import with variable to prevent webpack from bundling
    const fsModule = 'fs'
    const pathModule = 'path'
    const fs = await import(/* webpackIgnore: true */ fsModule)
    const path = await import(/* webpackIgnore: true */ pathModule)
    
    const filePath = path.join(process.cwd(), 'public', 'data', 'Zonage_Doctonext', `${profession}.csv`)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    const lines = fileContent.split('\n')
    const data: TownDensityData[] = []
    
    // Skip header lines (first 3 lines are metadata/headers)
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const parts = line.split(';')
      if (parts.length >= 3) {
        const code = parts[0].trim()
        const name = parts[1].trim()
        const zonage = parts[2].trim() as ZonageLevel
        
        // Skip invalid entries
        if (code && name && zonage && zonage !== 'N/A - résultat non disponible') {
          data.push({
            code,
            name,
            zonage,
            profession
          })
        }
      }
    }
    
    return data
  } catch (error) {
    console.error(`Error parsing CSV for ${profession}:`, error)
    return []
  }
}

/**
 * Load all medical density data for all professions
 */
export async function loadAllMedicalDensityData(): Promise<TownMedicalZones> {
  const professions: MedicalProfession[] = [
    'chirurgiens-dentistes',
    'infirmier', 
    'masseurs-kinésithérapeutes',
    'orthophonistes',
    'sages-femmes'
  ]
  
  const allData: TownMedicalZones = {}
  
  for (const profession of professions) {
    const data = await parseMedicalDensityCSV(profession)
    
    for (const entry of data) {
      if (!allData[entry.code]) {
        allData[entry.code] = {
          name: entry.name,
          zones: {}
        }
      }
      allData[entry.code].zones[entry.profession] = entry.zonage
    }
  }
  
  return allData
}

/**
 * Get towns by zonage level for a specific profession
 */
export async function getTownsByZonage(
  profession: MedicalProfession, 
  zonageLevel: ZonageLevel
): Promise<TownDensityData[]> {
  const data = await parseMedicalDensityCSV(profession)
  return data.filter(town => town.zonage === zonageLevel)
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

// Cache for loaded data
let cachedData: TownMedicalZones | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

/**
 * Get cached medical density data (server-side only)
 */
export async function getCachedMedicalDensityData(): Promise<TownMedicalZones> {
  // Ensure this only runs on server side
  if (typeof window !== 'undefined') {
    throw new Error('getCachedMedicalDensityData can only be called on server side. Use the API routes instead.')
  }
  
  if (!cachedData || Date.now() - cacheTimestamp > CACHE_DURATION) {
    console.log('Loading medical density data from CSV files...')
    cachedData = await loadAllMedicalDensityData()
    cacheTimestamp = Date.now()
    console.log(`Loaded ${Object.keys(cachedData).length} towns with medical density data`)
  }
  return cachedData
}