// Medical density data utilities
import type { RegionDensity } from '@/components/map/medical-density-overlay'
import medicalDensityData from '../../media-density.json'

// Regional bounds for French regions (approximate polygons)
const REGIONAL_BOUNDS: Record<string, number[][][]> = {
  "Auvergne-Rhône-Alpes": [[[3.2, 44.1], [7.2, 44.1], [7.2, 46.5], [3.2, 46.5], [3.2, 44.1]]],
  "Bourgogne-Franche-Comté": [[[2.8, 46.2], [7.0, 46.2], [7.0, 48.4], [2.8, 48.4], [2.8, 46.2]]],
  "Bretagne": [[[-5.1, 47.3], [-1.0, 47.3], [-1.0, 48.9], [-5.1, 48.9], [-5.1, 47.3]]],
  "Centre-Val de Loire": [[[0.1, 46.3], [3.1, 46.3], [3.1, 48.8], [0.1, 48.8], [0.1, 46.3]]],
  "Corse": [[[8.5, 41.3], [9.6, 41.3], [9.6, 43.0], [8.5, 43.0], [8.5, 41.3]]],
  "Grand Est": [[[4.8, 47.4], [8.2, 47.4], [8.2, 49.7], [4.8, 49.7], [4.8, 47.4]]],
  "Hauts-de-France": [[[1.5, 49.4], [4.3, 49.4], [4.3, 51.1], [1.5, 51.1], [1.5, 49.4]]],
  "Île-de-France": [[[1.4, 48.1], [3.6, 48.1], [3.6, 49.3], [1.4, 49.3], [1.4, 48.1]]],
  "Normandie": [[[-1.8, 48.3], [1.8, 48.3], [1.8, 50.1], [-1.8, 50.1], [-1.8, 48.3]]],
  "Nouvelle-Aquitaine": [[[-2.3, 42.7], [2.8, 42.7], [2.8, 46.8], [-2.3, 46.8], [-2.3, 42.7]]],
  "Occitanie": [[[-0.3, 42.3], [4.9, 42.3], [4.9, 45.0], [-0.3, 45.0], [-0.3, 42.3]]],
  "Pays de la Loire": [[[-2.3, 46.2], [0.9, 46.2], [0.9, 48.6], [-2.3, 48.6], [-2.3, 46.2]]],
  "Provence-Alpes-Côte d'Azur": [[[4.2, 43.0], [7.8, 43.0], [7.8, 45.0], [4.2, 45.0], [4.2, 43.0]]],
  "Guadeloupe": [[[-61.8, 15.8], [-61.0, 15.8], [-61.0, 16.5], [-61.8, 16.5], [-61.8, 15.8]]],
  "Martinique": [[[-61.2, 14.4], [-60.8, 14.4], [-60.8, 14.9], [-61.2, 14.9], [-61.2, 14.4]]],
  "Guyane": [[[-54.6, 2.1], [-51.6, 2.1], [-51.6, 5.8], [-54.6, 5.8], [-54.6, 2.1]]],
  "La Réunion": [[[55.2, -21.4], [55.8, -21.4], [55.8, -20.9], [55.2, -20.9], [55.2, -21.4]]],
  "Mayotte": [[[45.0, -13.0], [45.3, -13.0], [45.3, -12.6], [45.0, -12.6], [45.0, -13.0]]]
}

// Medical field display names (French)
export const MEDICAL_FIELD_NAMES: Record<string, string> = {
  "Médecin généraliste": "Médecin généraliste",
  "Cardiologue": "Cardiologue", 
  "Dermatologue": "Dermatologue",
  "Gynécologue": "Gynécologue",
  "Neurologue": "Neurologue",
  "Ophtalmologue": "Ophtalmologue",
  "Orthopédiste": "Orthopédiste",
  "Pédiatre": "Pédiatre",
  "Psychiatre": "Psychiatre",
  "Radiologue": "Radiologue",
  "Chirurgien": "Chirurgien",
  "Anesthésiste": "Anesthésiste",
  "Endocrinologue": "Endocrinologue",
  "Gastro-entérologue": "Gastro-entérologue",
  "Pneumologue": "Pneumologue",
  "Rhumatologue": "Rhumatologue",
  "Urologue": "Urologue",
  "ORL": "ORL",
  "Dentiste": "Dentiste",
  "Pharmacien": "Pharmacien",
  "Kinésithérapeute": "Kinésithérapeute",
  "Infirmier(ère)": "Infirmier(ère)",
  "Sage-femme": "Sage-femme",
  "Ostéopathe": "Ostéopathe",
  "Podologue": "Podologue",
  "Orthophoniste": "Orthophoniste",
  "Psychologue": "Psychologue",
  "Diététicien(ne)": "Diététicien(ne)"
}

// Get all available medical fields from the data
export function getAvailableMedicalFields(): string[] {
  const fields = new Set<string>()
  
  Object.values(medicalDensityData).forEach(regionData => {
    Object.keys(regionData).forEach(field => {
      if (MEDICAL_FIELD_NAMES[field]) {
        fields.add(field)
      }
    })
  })
  
  return Array.from(fields).sort()
}

// Calculate density score (professionals per 10,000 inhabitants)
function calculateDensityScore(professionalCount: number, populationCount: number): number {
  if (populationCount === 0) return 0
  return (professionalCount / populationCount) * 10000
}

// Convert density score to a 0-100 scale for visualization
function normalizeDensityScore(density: number, field: string): number {
  // Define typical ranges for different medical fields (professionals per 10,000 inhabitants)
  const fieldRanges: Record<string, { min: number, max: number }> = {
    "Médecin généraliste": { min: 5, max: 15 },
    "Infirmier(ère)": { min: 80, max: 120 },
    "Kinésithérapeute": { min: 8, max: 15 },
    "Pharmacien": { min: 8, max: 12 },
    "Psychologue": { min: 8, max: 12 },
    "Dentiste": { min: 4, max: 7 },
    "Ostéopathe": { min: 3, max: 6 },
    "Orthophoniste": { min: 3, max: 5 },
    "Diététicien(ne)": { min: 1.5, max: 3 },
    "Sage-femme": { min: 2, max: 4 },
    "Psychiatre": { min: 1.5, max: 3 },
    "Podologue": { min: 1.5, max: 3 },
    "Cardiologue": { min: 0.5, max: 2 },
    "Radiologue": { min: 0.5, max: 1.5 },
    "Anesthésiste": { min: 0.5, max: 2 },
    "Chirurgien": { min: 0.4, max: 1.2 },
    "Ophtalmologue": { min: 0.3, max: 1 },
    "Orthopédiste": { min: 0.3, max: 1 },
    "Gastro-entérologue": { min: 0.3, max: 1 },
    "Pneumologue": { min: 0.3, max: 1 },
    "Gynécologue": { min: 0.3, max: 1 },
    "ORL": { min: 0.3, max: 1 },
    "Pédiatre": { min: 0.3, max: 1 },
    "Neurologue": { min: 0.2, max: 0.8 },
    "Dermatologue": { min: 0.2, max: 0.8 },
    "Rhumatologue": { min: 0.2, max: 0.6 },
    "Endocrinologue": { min: 0.15, max: 0.5 },
    "Urologue": { min: 0.15, max: 0.5 }
  }

  const range = fieldRanges[field] || { min: 0.1, max: 2 }
  
  // Normalize to 0-100 scale
  const normalized = ((density - range.min) / (range.max - range.min)) * 100
  return Math.max(0, Math.min(100, normalized))
}

// Transform medical density data for a specific field
export function getMedicalDensityForField(field: string): RegionDensity[] {
  const regions: RegionDensity[] = []

  Object.entries(medicalDensityData).forEach(([regionName, regionData]) => {
    const fieldData = regionData[field as keyof typeof regionData]
    
    if (fieldData && REGIONAL_BOUNDS[regionName] && fieldData.professionalCount !== undefined) {
      const density = calculateDensityScore(fieldData.professionalCount, fieldData.populationCount)
      const normalizedScore = normalizeDensityScore(density, field)
      
      regions.push({
        region: regionName,
        code: regionName.toLowerCase().replace(/[^a-z]/g, ''),
        densityScore: normalizedScore,
        professionalCount: fieldData.professionalCount,
        populationCount: fieldData.populationCount,
        bounds: REGIONAL_BOUNDS[regionName]
      })
    }
  })

  return regions
}

// Get the default medical field (most common one)
export function getDefaultMedicalField(): string {
  return "Médecin généraliste"
}

// Get medical field statistics for display
export function getMedicalFieldStats(field: string): {
  totalProfessionals: number
  totalPopulation: number
  averageDensity: number
  regionCount: number
} {
  let totalProfessionals = 0
  let totalPopulation = 0
  let regionCount = 0

  Object.values(medicalDensityData).forEach(regionData => {
    const fieldData = regionData[field as keyof typeof regionData]
    if (fieldData && fieldData.professionalCount !== undefined) {
      totalProfessionals += fieldData.professionalCount
      totalPopulation += fieldData.populationCount
      regionCount++
    }
  })

  const averageDensity = totalPopulation > 0 ? (totalProfessionals / totalPopulation) * 10000 : 0

  return {
    totalProfessionals,
    totalPopulation,
    averageDensity,
    regionCount
  }
}