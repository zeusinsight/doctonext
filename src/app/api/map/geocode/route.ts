import { NextRequest, NextResponse } from "next/server"
import { geocodeAddress, geocodeByPostalCode } from "@/lib/services/geocoding"
import { z } from "zod"

const geocodeSchema = z.object({
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  fallbackToPostalCode: z.boolean().default(true)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, city, postalCode, fallbackToPostalCode } = geocodeSchema.parse(body)

    // Try full address geocoding first
    let result = await geocodeAddress(address || "", city, postalCode)

    // If full address fails and fallback is enabled, try postal code only
    if ("error" in result && fallbackToPostalCode && result.code === "NOT_FOUND") {
      result = await geocodeByPostalCode(postalCode, city)
    }

    if ("error" in result) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          code: result.code
        },
        { 
          status: result.code === "RATE_LIMITED" ? 429 : 
                 result.code === "NOT_FOUND" ? 404 : 400 
        }
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error("Geocoding API error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid input data",
          details: error.issues
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Erreur lors du géocodage de l'adresse" 
      },
      { status: 500 }
    )
  }
}