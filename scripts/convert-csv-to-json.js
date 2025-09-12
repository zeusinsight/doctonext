#!/usr/bin/env node

/**
 * Script to convert CSV files to consolidated JSON format
 * This solves the Vercel deployment issue by pre-processing the data
 */

const fs = require('fs')
const path = require('path')

const PROFESSIONS = [
  'chirurgiens-dentistes',
  'infirmier', 
  'masseurs-kinésithérapeutes',
  'orthophonistes',
  'sages-femmes'
]

function parseMedicalDensityCSV(profession, filePath) {
  console.log(`Processing ${profession}...`)
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const lines = fileContent.split('\n')
    const data = []
    
    // Skip header lines (first 3 lines are metadata/headers)
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const parts = line.split(';')
      if (parts.length >= 3) {
        const code = parts[0].trim()
        const name = parts[1].trim()
        const zonage = parts[2].trim()
        
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
    
    console.log(`  ✓ Processed ${data.length} entries for ${profession}`)
    return data
  } catch (error) {
    console.error(`  ✗ Error processing ${profession}:`, error.message)
    return []
  }
}

function convertToConsolidatedFormat(allData) {
  const consolidated = {}
  
  for (const entry of allData) {
    if (!consolidated[entry.code]) {
      consolidated[entry.code] = {
        name: entry.name,
        zones: {}
      }
    }
    consolidated[entry.code].zones[entry.profession] = entry.zonage
  }
  
  return consolidated
}

function main() {
  console.log('🔄 Converting CSV files to JSON format...\n')
  
  const sourceDir = path.join(__dirname, '..', 'src', 'database', 'Zonage_Doctonext')
  const outputDir = path.join(__dirname, '..', 'src', 'lib', 'data')
  const outputFile = path.join(outputDir, 'town-density-data.json')
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  let allData = []
  let totalEntries = 0
  
  // Process each profession's CSV file
  for (const profession of PROFESSIONS) {
    const filePath = path.join(sourceDir, `${profession}.csv`)
    
    if (fs.existsSync(filePath)) {
      const professionData = parseMedicalDensityCSV(profession, filePath)
      allData = allData.concat(professionData)
      totalEntries += professionData.length
    } else {
      console.error(`  ✗ File not found: ${filePath}`)
    }
  }
  
  console.log(`\n📊 Processing complete:`)
  console.log(`  - Total entries processed: ${totalEntries}`)
  console.log(`  - Professions: ${PROFESSIONS.length}`)
  
  // Convert to consolidated format
  console.log('\n🔄 Creating consolidated data structure...')
  const consolidatedData = convertToConsolidatedFormat(allData)
  const townCount = Object.keys(consolidatedData).length
  
  console.log(`  ✓ Consolidated data for ${townCount} towns`)
  
  // Write to JSON file
  console.log('\n💾 Writing JSON file...')
  try {
    fs.writeFileSync(outputFile, JSON.stringify(consolidatedData, null, 2))
    const stats = fs.statSync(outputFile)
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2)
    
    console.log(`  ✓ Successfully wrote ${outputFile}`)
    console.log(`  ✓ File size: ${fileSizeMB} MB`)
    console.log(`  ✓ Towns: ${townCount}`)
    console.log(`  ✓ Professions per town: ${PROFESSIONS.length}`)
    
    // Sample data verification
    const sampleTowns = Object.keys(consolidatedData).slice(0, 3)
    console.log('\n📋 Sample data:')
    sampleTowns.forEach(code => {
      const town = consolidatedData[code]
      console.log(`  ${code}: ${town.name}`)
      Object.entries(town.zones).forEach(([prof, zonage]) => {
        console.log(`    ${prof}: ${zonage}`)
      })
    })
    
  } catch (error) {
    console.error('  ✗ Error writing JSON file:', error.message)
    process.exit(1)
  }
  
  console.log('\n🎉 Conversion complete!')
  console.log('The JSON data file is ready for production deployment.\n')
}

if (require.main === module) {
  main()
}

module.exports = { parseMedicalDensityCSV, convertToConsolidatedFormat }