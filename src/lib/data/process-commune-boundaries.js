const fs = require("fs")
const path = require("path")

// Process the large GeoJSON file and create optimized data structures
function processCommuneBoundaries() {
    console.log("Reading communes.geojson...")

    try {
        const geojsonPath = path.join(__dirname, "communes.geojson")
        const rawData = fs.readFileSync(geojsonPath, "utf8")
        const geojson = JSON.parse(rawData)

        console.log(`Found ${geojson.features.length} communes`)

        // Create index of commune codes to simplified boundaries
        const communeIndex = {}
        let processedCount = 0

        for (const feature of geojson.features) {
            const code = feature.properties.code
            const name = feature.properties.nom

            if (code && feature.geometry) {
                // Simplify coordinates by taking every 3rd point for performance
                let coordinates = feature.geometry.coordinates

                if (feature.geometry.type === "Polygon") {
                    coordinates = simplifyPolygonCoordinates(coordinates)
                } else if (feature.geometry.type === "MultiPolygon") {
                    coordinates = coordinates.map((polygon) =>
                        simplifyPolygonCoordinates(polygon)
                    )
                }

                communeIndex[code] = {
                    name,
                    type: feature.geometry.type,
                    coordinates
                }

                processedCount++
                if (processedCount % 1000 === 0) {
                    console.log(`Processed ${processedCount} communes...`)
                }
            }
        }

        console.log(`Successfully processed ${processedCount} communes`)

        // Write the processed data
        const outputPath = path.join(__dirname, "commune-boundaries.json")
        fs.writeFileSync(outputPath, JSON.stringify(communeIndex, null, 2))
        console.log(`Saved processed data to ${outputPath}`)

        // Create a TypeScript interface file
        const tsInterfacePath = path.join(__dirname, "commune-boundaries.d.ts")
        const tsInterface = `
export interface CommuneBoundary {
  name: string
  type: 'Polygon' | 'MultiPolygon'
  coordinates: number[][][] | number[][][][]
}

export interface CommuneBoundaries {
  [code: string]: CommuneBoundary
}
`
        fs.writeFileSync(tsInterfacePath, tsInterface)

        console.log("Processing complete!")
        return { total: processedCount, outputPath }
    } catch (error) {
        console.error("Error processing commune boundaries:", error)
        throw error
    }
}

// Simplify polygon coordinates by taking every nth point
function simplifyPolygonCoordinates(coordinates, factor = 3) {
    return coordinates.map((ring) => {
        if (ring.length <= 10) return ring // Keep small polygons as-is

        const simplified = []
        for (let i = 0; i < ring.length; i += factor) {
            simplified.push(ring[i])
        }

        // Always include the last point to close the polygon
        if (simplified[simplified.length - 1] !== ring[ring.length - 1]) {
            simplified.push(ring[ring.length - 1])
        }

        return simplified
    })
}

// Run the processing
if (require.main === module) {
    processCommuneBoundaries()
}

module.exports = { processCommuneBoundaries }
