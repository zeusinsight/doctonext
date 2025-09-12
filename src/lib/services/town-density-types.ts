// Client-safe types and utility functions for town density

export type ZonageLevel = '1_Tres_sous_dotee' | '2_Sous_dotee' | '3_intermediaire' | '4_Tres_dotee' | '5_Sur_dotee' | '5b_Non_prioritaire' | 'N/A - résultat non disponible'

export type MedicalProfession = 'chirurgiens-dentistes' | 'infirmier' | 'masseurs-kinésithérapeutes' | 'orthophonistes' | 'sages-femmes'

export interface TownDensityData {
  code: string // INSEE code
  name: string // Town name
  zonage: ZonageLevel
  profession: MedicalProfession
}

export interface TownMedicalZones {
  [code: string]: {
    name: string
    zones: Partial<Record<MedicalProfession, ZonageLevel>>
  }
}

// Map zonage levels to density scores (0-100) for color coding
export const getZonageDensityScore = (zonage: ZonageLevel): number => {
  switch (zonage) {
    case '1_Tres_sous_dotee': return 15  // Very under-served (green)
    case '2_Sous_dotee': return 35       // Under-served (light green)
    case '3_intermediaire': return 55    // Balanced (orange)
    case '4_Tres_dotee': return 75       // Well-served (red)
    case '5_Sur_dotee': return 95        // Over-served (dark red)
    case '5b_Non_prioritaire': return 50 // Non-priority (neutral)
    default: return 0                    // Unknown/N/A (gray)
  }
}

// Map zonage levels to human-readable labels
export const getZonageLabel = (zonage: ZonageLevel): string => {
  switch (zonage) {
    case '1_Tres_sous_dotee': return 'Très sous-dotée'
    case '2_Sous_dotee': return 'Sous-dotée'
    case '3_intermediaire': return 'Intermédiaire'
    case '4_Tres_dotee': return 'Très dotée'
    case '5_Sur_dotee': return 'Sur-dotée'
    case '5b_Non_prioritaire': return 'Non prioritaire'
    default: return 'Non disponible'
  }
}

// Get color for zonage level
export const getZonageColor = (zonage: ZonageLevel): string => {
  const score = getZonageDensityScore(zonage)
  if (score <= 25) return '#10b981'     // Green - Very under-served
  if (score <= 45) return '#84cc16'     // Light green - Under-served
  if (score <= 65) return '#f59e0b'     // Orange - Balanced
  if (score <= 85) return '#ef4444'     // Red - Well-served
  return '#b91c1c'                      // Dark red - Over-served
}