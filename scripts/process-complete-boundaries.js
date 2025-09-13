#!/usr/bin/env node

/**
 * Script to process the complete French commune boundaries including arrondissements
 */

const fs = require('fs')
const path = require('path')

function processGeoJSONToBoundaries(inputFile, outputFile) {
  console.log('📍 Processing complete French commune boundaries...')
  
  try {
    console.log(`📖 Reading GeoJSON file: ${inputFile}`)
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'))
    
    console.log(`📊 Found ${data.features.length} features`)
    
    const boundaries = {}
    let processedCount = 0
    let errorCount = 0
    
    data.features.forEach(feature => {
      try {
        const properties = feature.properties
        const geometry = feature.geometry
        
        // Get the INSEE code - try different property names
        const code = properties.code || properties.insee || properties.CODE_INSEE || properties.INSEE_COM
        const name = properties.nom || properties.name || properties.NOM_COM
        
        if (!code || !name) {
          console.log(`⚠️  Missing data for feature:`, properties)
          errorCount++
          return
        }
        
        boundaries[code] = {
          name: name,
          type: geometry.type,
          coordinates: geometry.coordinates
        }
        
        processedCount++
        
        // Log progress every 5000 features
        if (processedCount % 5000 === 0) {
          console.log(`  ✓ Processed ${processedCount} features...`)
        }
        
      } catch (error) {
        console.error(`❌ Error processing feature:`, error.message)
        errorCount++
      }
    })
    
    console.log(`\n📈 Processing summary:`)
    console.log(`  - Successfully processed: ${processedCount}`)
    console.log(`  - Errors: ${errorCount}`)
    console.log(`  - Total features in source: ${data.features.length}`)
    
    // Check for key arrondissements
    const parisArrondissements = Object.keys(boundaries).filter(code => code.startsWith('751')).length
    const lyonArrondissements = Object.keys(boundaries).filter(code => code.startsWith('693')).length  
    const marseilleArrondissements = Object.keys(boundaries).filter(code => code.startsWith('132')).length
    
    console.log(`\n🏛️  Arrondissements found:`)
    console.log(`  - Paris: ${parisArrondissements} arrondissements`)
    console.log(`  - Lyon: ${lyonArrondissements} arrondissements`) 
    console.log(`  - Marseille: ${marseilleArrondissements} arrondissements`)
    
    // Sample some key codes
    const sampleCodes = ['75105', '69381', '13201']
    console.log(`\n🔍 Sample verification:`)
    sampleCodes.forEach(code => {
      if (boundaries[code]) {
        console.log(`  ✓ ${code}: ${boundaries[code].name}`)
      } else {
        console.log(`  ❌ ${code}: Not found`)
      }
    })
    
    console.log(`\n💾 Writing boundaries to ${outputFile}...`)
    fs.writeFileSync(outputFile, JSON.stringify(boundaries, null, 2))
    
    const outputStats = fs.statSync(outputFile)
    const fileSizeMB = (outputStats.size / (1024 * 1024)).toFixed(2)
    
    console.log(`✅ Successfully created commune boundaries file:`)
    console.log(`  - File: ${outputFile}`)
    console.log(`  - Size: ${fileSizeMB} MB`)
    console.log(`  - Communes/arrondissements: ${Object.keys(boundaries).length}`)
    console.log(`  - All Paris arrondissements included: ${parisArrondissements === 20 ? '✅' : '❌'}`)
    
    return boundaries
    
  } catch (error) {
    console.error('❌ Error processing GeoJSON file:', error.message)
    throw error
  }
}

function main() {
  const inputFile = path.join(__dirname, '..', 'tmp-communes-2024.geojson')
  const outputFile = path.join(__dirname, '..', 'src', 'lib', 'data', 'commune-boundaries.json')
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`)
    process.exit(1)
  }
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  console.log(`🚀 Starting boundary processing...`)
  console.log(`📥 Input: ${inputFile}`)
  console.log(`📤 Output: ${outputFile}`)
  
  processGeoJSONToBoundaries(inputFile, outputFile)
  
  console.log(`\n🎉 Processing complete! All French communes and arrondissements are now available.`)
}

if (require.main === module) {
  main()
}

module.exports = { processGeoJSONToBoundaries }