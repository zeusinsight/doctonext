import { NextRequest, NextResponse } from 'next/server'
import { getTownMedicalDensityWithBoundaries, getTownDensityStatistics, getTownsByZonageLevel } from '@/lib/services/town-medical-density'
import { type MedicalProfession, type ZonageLevel } from '@/lib/services/town-density'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession') as MedicalProfession
    const zonageLevel = searchParams.get('zonage') as ZonageLevel
    const maxResults = parseInt(searchParams.get('limit') || '200')
    
    // Allow large limits for viewport optimization
    const actualLimit = Math.min(maxResults, 50000)
    const statsOnly = searchParams.get('stats') === 'true'
    
    if (!profession) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing profession parameter',
          validProfessions: [
            'chirurgiens-dentistes',
            'infirmier',
            'masseurs-kinésithérapeutes',
            'orthophonistes', 
            'sages-femmes'
          ]
        },
        { status: 400 }
      )
    }
    
    // Return statistics only
    if (statsOnly) {
      const stats = await getTownDensityStatistics(profession)
      return NextResponse.json({
        success: true,
        data: stats
      })
    }
    
    // Return towns filtered by zonage level
    if (zonageLevel) {
      const towns = await getTownsByZonageLevel(profession, zonageLevel, maxResults)
      return NextResponse.json({
        success: true,
        data: {
          profession,
          zonageLevel,
          towns,
          count: towns.length
        }
      })
    }
    
    // Return all towns for profession (limited)
    const towns = await getTownMedicalDensityWithBoundaries(profession, {
      maxResults: actualLimit
    })
    
    return NextResponse.json({
      success: true,
      data: {
        profession,
        towns,
        count: towns.length,
        meta: {
          requestedLimit: maxResults,
          actualLimit,
          note: maxResults > actualLimit ? `Results limited to ${actualLimit} for performance` : undefined
        }
      }
    })
    
  } catch (error) {
    console.error('Error in town-density API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load town density data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profession, zonageLevels, viewport, maxResults = 500 } = body
    
    if (!profession) {
      return NextResponse.json(
        { success: false, error: 'Missing profession parameter' },
        { status: 400 }
      )
    }
    
    const towns = await getTownMedicalDensityWithBoundaries(profession, {
      zonageLevels,
      viewport,
      maxResults
    })
    
    return NextResponse.json({
      success: true,
      data: {
        profession,
        filters: {
          zonageLevels,
          viewport,
          maxResults
        },
        towns,
        count: towns.length
      }
    })
    
  } catch (error) {
    console.error('Error in town-density POST API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process town density request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}