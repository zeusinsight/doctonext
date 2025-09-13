import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Cache for the boundary data
let boundaryCache: Record<string, any> | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

/**
 * Load boundary data with caching from split files
 */
function loadBoundaryData() {
  if (!boundaryCache || Date.now() - cacheTimestamp > CACHE_DURATION) {
    try {
      const part1Path = path.join(process.cwd(), 'src', 'lib', 'data', 'commune-boundaries-part1.json')
      const part2Path = path.join(process.cwd(), 'src', 'lib', 'data', 'commune-boundaries-part2.json')

      // Load both parts
      const part1Raw = fs.readFileSync(part1Path, 'utf8')
      const part2Raw = fs.readFileSync(part2Path, 'utf8')

      const part1Data = JSON.parse(part1Raw)
      const part2Data = JSON.parse(part2Raw)

      // Merge both parts into a single object
      boundaryCache = { ...part1Data, ...part2Data }
      cacheTimestamp = Date.now()

      console.log(`Loaded ${Object.keys(boundaryCache || {}).length} commune boundaries from split files (Part 1: ${Object.keys(part1Data).length}, Part 2: ${Object.keys(part2Data).length})`)
    } catch (error) {
      console.error('Error loading boundary data:', error)
      boundaryCache = {}
    }
  }
  return boundaryCache || {}
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const codes = searchParams.get('codes')?.split(',') || []
    const limit = parseInt(searchParams.get('limit') || '500')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const allBoundaries = loadBoundaryData()
    
    // If specific codes requested, return only those
    if (codes.length > 0 && codes[0] !== '') {
      const requestedBoundaries: Record<string, any> = {}
      for (const code of codes) {
        if (allBoundaries[code]) {
          requestedBoundaries[code] = allBoundaries[code]
        }
      }
      
      return NextResponse.json({
        success: true,
        data: requestedBoundaries,
        meta: {
          requested: codes.length,
          found: Object.keys(requestedBoundaries).length
        }
      })
    }
    
    // Otherwise return paginated results
    const allCodes = Object.keys(allBoundaries)
    const paginatedCodes = allCodes.slice(offset, offset + limit)
    
    const paginatedBoundaries: Record<string, any> = {}
    for (const code of paginatedCodes) {
      paginatedBoundaries[code] = allBoundaries[code]
    }
    
    return NextResponse.json({
      success: true,
      data: paginatedBoundaries,
      meta: {
        total: allCodes.length,
        offset,
        limit,
        returned: paginatedCodes.length
      }
    })
    
  } catch (error) {
    console.error('Error in commune-boundaries API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load commune boundaries',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { codes, viewport } = body
    
    const allBoundaries = loadBoundaryData()
    
    if (!codes || !Array.isArray(codes)) {
      return NextResponse.json(
        { success: false, error: 'Invalid codes parameter' },
        { status: 400 }
      )
    }
    
    const requestedBoundaries: Record<string, any> = {}
    for (const code of codes) {
      if (allBoundaries[code]) {
        // TODO: Add viewport filtering here if needed
        requestedBoundaries[code] = allBoundaries[code]
      }
    }
    
    return NextResponse.json({
      success: true,
      data: requestedBoundaries,
      meta: {
        requested: codes.length,
        found: Object.keys(requestedBoundaries).length,
        viewport: viewport || null
      }
    })
    
  } catch (error) {
    console.error('Error in commune-boundaries POST API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process boundary request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}