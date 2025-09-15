#!/usr/bin/env node

/**
 * Script to split commune-boundaries.json into two parts to stay under GitHub's file size limit
 * Splits by department number: 01-50 in part1, 51-95 in part2
 */

const fs = require("fs")
const path = require("path")

const inputFile = path.join(
    __dirname,
    "..",
    "src",
    "lib",
    "data",
    "commune-boundaries.json"
)
const outputDir = path.join(__dirname, "..", "src", "lib", "data")

console.log("Loading commune boundaries data...")

try {
    // Read the original file
    const data = JSON.parse(fs.readFileSync(inputFile, "utf8"))
    const entries = Object.entries(data)

    console.log(`Found ${entries.length} communes in total`)

    // Split by department code (first 2 digits of INSEE code)
    const part1 = {}
    const part2 = {}

    let part1Count = 0
    let part2Count = 0

    for (const [code, boundary] of entries) {
        const deptCode = parseInt(code.substring(0, 2))

        if (deptCode >= 1 && deptCode <= 50) {
            // Part 1: Departments 01-50 (includes overseas territories starting with 97x)
            part1[code] = boundary
            part1Count++
        } else {
            // Part 2: Departments 51-95
            part2[code] = boundary
            part2Count++
        }
    }

    console.log(`Part 1: ${part1Count} communes (departments 01-50)`)
    console.log(`Part 2: ${part2Count} communes (departments 51-95)`)

    // Write part 1
    const part1File = path.join(outputDir, "commune-boundaries-part1.json")
    console.log(`Writing part 1 to ${part1File}...`)
    fs.writeFileSync(part1File, JSON.stringify(part1, null, 0))

    // Write part 2
    const part2File = path.join(outputDir, "commune-boundaries-part2.json")
    console.log(`Writing part 2 to ${part2File}...`)
    fs.writeFileSync(part2File, JSON.stringify(part2, null, 0))

    // Check file sizes
    const part1Size = fs.statSync(part1File).size
    const part2Size = fs.statSync(part2File).size
    const originalSize = fs.statSync(inputFile).size

    console.log("\nFile sizes:")
    console.log(`Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Part 1: ${(part1Size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Part 2: ${(part2Size / 1024 / 1024).toFixed(2)} MB`)
    console.log(
        `Total split: ${((part1Size + part2Size) / 1024 / 1024).toFixed(2)} MB`
    )

    console.log("\n✅ Successfully split commune boundaries!")
    console.log(
        "You can now remove the original commune-boundaries.json file if desired."
    )
} catch (error) {
    console.error("Error splitting commune boundaries:", error)
    process.exit(1)
}
