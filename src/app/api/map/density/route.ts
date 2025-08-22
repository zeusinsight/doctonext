import { NextRequest, NextResponse } from "next/server"
import { getCachedMedicalDensity, getMedicalDensityStats } from "@/lib/services/medical-density"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      specialty: searchParams.get("specialty") || undefined,
      profession: searchParams.get("profession") || undefined,
    }

    const includeStats = searchParams.get("include_stats") === "true"

    const [densityData, stats] = await Promise.all([
      getCachedMedicalDensity(filters),
      includeStats ? getMedicalDensityStats(filters) : null
    ])

    return NextResponse.json({
      success: true,
      data: {
        regions: densityData,
        stats: stats,
        filters: filters
      }
    })
  } catch (error) {
    console.error("Error fetching medical density data:", error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Erreur lors de la récupération des données de densité médicale" 
      },
      { status: 500 }
    )
  }
}