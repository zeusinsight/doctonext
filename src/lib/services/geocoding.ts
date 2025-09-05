import { db } from "@/database/db"
import { listingLocations } from "@/database/schema"
import { eq, isNull, or } from "drizzle-orm"

export interface GeocodeResult {
  latitude: number
  longitude: number
  formattedAddress?: string
}

// City-only fallback using Nominatim when address-level and postal mapping fail
export async function geocodeByCity(city: string): Promise<GeocodeResult | GeocodeError> {
  try {
    const query = [city, "France"].filter(Boolean).join(", ")
    if (!city || !city.trim()) {
      return { error: "Invalid city", code: "INVALID_INPUT" }
    }
    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.set("q", query)
    url.searchParams.set("format", "json")
    url.searchParams.set("limit", "1")
    url.searchParams.set("countrycodes", "fr")
    url.searchParams.set("addressdetails", "1")

    const response = await fetch(url.toString(), {
      headers: { "User-Agent": "Doctonext/1.0 (contact@doctonext.com)" }
    })
    if (response.status === 429) return { error: "Rate limit exceeded", code: "RATE_LIMITED" }
    if (!response.ok) return { error: "Geocoding service error", code: "NETWORK_ERROR" }

    const results = await response.json()
    if (!results || results.length === 0) return { error: "City not found", code: "NOT_FOUND" }

    const result = results[0]
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      formattedAddress: result.display_name
    }
  } catch (error) {
    console.error("City geocoding error:", error)
    return { error: "Geocoding failed", code: "NETWORK_ERROR" }
  }
}

export interface GeocodeError {
  error: string
  code: "NOT_FOUND" | "RATE_LIMITED" | "NETWORK_ERROR" | "INVALID_INPUT"
}

/**
 * Geocode an address using Nominatim (OpenStreetMap's geocoding service)
 * Free service with rate limits - consider upgrading to a paid service for production
 */
export async function geocodeAddress(address: string, city: string, postalCode: string): Promise<GeocodeResult | GeocodeError> {
  try {
    // Construct search query
    const searchQuery = [address, city, postalCode, "France"]
      .filter(Boolean)
      .join(", ")

    if (!searchQuery.trim()) {
      return { error: "Invalid address format", code: "INVALID_INPUT" }
    }

    // Use Nominatim API (free, but rate limited)
    const url = new URL("https://nominatim.openstreetmap.org/search")
    url.searchParams.set("q", searchQuery)
    url.searchParams.set("format", "json")
    url.searchParams.set("limit", "1")
    url.searchParams.set("countrycodes", "fr")
    url.searchParams.set("addressdetails", "1")

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Doctonext/1.0 (contact@doctonext.com)" // Required by Nominatim
      }
    })

    if (response.status === 429) {
      return { error: "Rate limit exceeded", code: "RATE_LIMITED" }
    }

    if (!response.ok) {
      return { error: "Geocoding service error", code: "NETWORK_ERROR" }
    }

    const results = await response.json()

    if (!results || results.length === 0) {
      return { error: "Address not found", code: "NOT_FOUND" }
    }

    const result = results[0]
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      formattedAddress: result.display_name
    }

  } catch (error) {
    console.error("Geocoding error:", error)
    return { error: "Geocoding failed", code: "NETWORK_ERROR" }
  }
}

/**
 * Fallback geocoding using French postal code approximations
 * This provides approximate coordinates for French postal codes
 */
export async function geocodeByPostalCode(postalCode: string, city: string): Promise<GeocodeResult | GeocodeError> {
  try {
    // Sanitize and derive department/overseas code
    const cleaned = (postalCode || "").replace(/\s+/g, "")
    if (cleaned.length < 2) {
      return { error: "Postal code not found", code: "NOT_FOUND" }
    }
    let postalCodePrefix = cleaned.substring(0, 2)

    // Approximate coordinates for French departments
    const departmentCoordinates: Record<string, [number, number]> = {
      "01": [46.2044, 5.2406], // Ain
      "02": [49.5667, 3.6239], // Aisne  
      "03": [46.3417, 3.4183], // Allier
      "04": [44.2619, 6.2367], // Alpes-de-Haute-Provence
      "05": [44.6608, 6.0661], // Hautes-Alpes
      "06": [43.7102, 7.2620], // Alpes-Maritimes
      "07": [44.7364, 4.3739], // Ardèche
      "08": [49.7611, 4.7097], // Ardennes
      "09": [42.9667, 1.4333], // Ariège
      "10": [48.2969, 4.0831], // Aube
      "11": [43.2130, 2.3491], // Aude
      "12": [44.3517, 2.5764], // Aveyron
      "13": [43.5283, 5.4497], // Bouches-du-Rhône
      "14": [49.1833, -0.3667], // Calvados
      "15": [45.0333, 2.4167], // Cantal
      "16": [45.6500, 0.1500], // Charente
      "17": [45.7500, -0.7500], // Charente-Maritime
      "18": [47.0833, 2.4000], // Cher
      "19": [45.2667, 1.7667], // Corrèze
      "21": [47.3167, 5.0167], // Côte-d'Or
      "22": [48.5167, -2.7833], // Côtes-d'Armor
      "23": [46.1667, 2.1333], // Creuse
      "24": [45.1833, 0.7167], // Dordogne
      "25": [47.2333, 6.0333], // Doubs
      "26": [44.7333, 5.0500], // Drôme
      "27": [49.0167, 1.1500], // Eure
      "28": [48.4667, 1.5000], // Eure-et-Loir
      "29": [48.1000, -4.1000], // Finistère
      "30": [43.8333, 4.3500], // Gard
      "31": [43.6044, 1.4442], // Haute-Garonne (Toulouse)
      "32": [43.6500, 0.5833], // Gers
      "33": [44.8378, -0.5792], // Gironde (Bordeaux)
      "34": [43.6119, 3.8772], // Hérault (Montpellier)
      "35": [48.1173, -1.6778], // Ille-et-Vilaine (Rennes)
      "36": [46.8103, 1.6908], // Indre
      "37": [47.3941, 0.6848], // Indre-et-Loire (Tours)
      "38": [45.1667, 5.7167], // Isère
      "39": [46.6833, 5.9000], // Jura
      "40": [43.8944, -0.5014], // Landes
      "41": [47.5906, 1.3356], // Loir-et-Cher
      "42": [45.4397, 4.3872], // Loire
      "43": [45.0428, 3.8844], // Haute-Loire
      "44": [47.2184, -1.5536], // Loire-Atlantique (Nantes)
      "45": [47.9028, 1.9094], // Loiret
      "46": [44.4478, 1.4419], // Lot
      "47": [44.2000, 0.6167], // Lot-et-Garonne
      "48": [44.5183, 3.5014], // Lozère
      "49": [47.4739, -0.5500], // Maine-et-Loire
      "50": [49.1167, -1.3000], // Manche
      "51": [49.0444, 4.3667], // Marne
      "52": [48.1167, 5.1333], // Haute-Marne
      "53": [48.0667, -0.7667], // Mayenne
      "54": [48.6833, 6.2000], // Meurthe-et-Moselle
      "55": [49.1667, 5.3833], // Meuse
      "56": [47.7500, -2.7500], // Morbihan
      "57": [49.1167, 6.1667], // Moselle
      "58": [47.2167, 3.1667], // Nièvre
      "59": [50.6292, 3.0573], // Nord
      "60": [49.4167, 2.8333], // Oise
      "61": [48.6167, 0.0833], // Orne
      "62": [50.4167, 2.8333], // Pas-de-Calais
      "63": [45.7797, 3.0863], // Puy-de-Dôme
      "64": [43.2951, -0.3708], // Pyrénées-Atlantiques
      "65": [43.2333, 0.0833], // Hautes-Pyrénées
      "66": [42.6833, 2.8833], // Pyrénées-Orientales
      "67": [48.5734, 7.7521], // Bas-Rhin (Strasbourg)
      "68": [47.7500, 7.3333], // Haut-Rhin
      "69": [45.7640, 4.8357], // Rhône (Lyon)
      "70": [47.6333, 6.1667], // Haute-Saône
      "71": [46.7833, 4.8333], // Saône-et-Loire
      "72": [48.0000, 0.2000], // Sarthe
      "73": [45.5667, 6.3167], // Savoie
      "74": [46.0667, 6.4167], // Haute-Savoie
      "75": [48.8566, 2.3522], // Paris
      "76": [49.4431, 1.0993], // Seine-Maritime
      "77": [48.8500, 2.9500], // Seine-et-Marne
      "78": [48.8000, 2.1300], // Yvelines
      "79": [46.3239, -0.4594], // Deux-Sèvres
      "80": [49.8944, 2.2958], // Somme
      "81": [43.9289, 2.1478], // Tarn
      "82": [44.0169, 1.3561], // Tarn-et-Garonne
      "83": [43.4667, 6.2333], // Var
      "84": [44.0333, 5.0500], // Vaucluse
      "85": [46.6703, -1.4267], // Vendée
      "86": [46.5836, 0.3339], // Vienne
      "87": [45.8333, 1.2617], // Haute-Vienne
      "88": [48.1667, 6.4500], // Vosges
      "89": [47.7986, 3.5628], // Yonne
      "90": [47.6333, 6.8667], // Territoire de Belfort
      "91": [48.6167, 2.3833], // Essonne
      "92": [48.8167, 2.2167], // Hauts-de-Seine
      "93": [48.9167, 2.4333], // Seine-Saint-Denis
      "94": [48.7667, 2.4167], // Val-de-Marne
      "95": [49.0500, 2.0833], // Val-d'Oise
      // Corsica (both 2A/2B -> 20)
      "20": [42.0396, 9.0129], // Corse
      // Overseas departments/collectivities (use first 3 digits)
      // We'll handle these below by switching key to the first 3
    }

    // Overseas departments use 97x or 98x prefixes (we use 3-digit granularity where applicable)
    if (cleaned.startsWith("97") || cleaned.startsWith("98")) {
      const overseasKey = cleaned.substring(0, 3)
      const overseasCoordinates: Record<string, [number, number]> = {
        "971": [16.2650, -61.5510], // Guadeloupe
        "972": [14.6415, -61.0242], // Martinique
        "973": [4.0000, -53.0000],  // Guyane
        "974": [-21.1151, 55.5364], // La Réunion
        "975": [46.9419, -56.2711], // Saint-Pierre-et-Miquelon
        "976": [-12.8275, 45.1662], // Mayotte
        // Other collectivities often use different country codes; omit by default
      }
      const overseas = overseasCoordinates[overseasKey]
      if (overseas) {
        return {
          latitude: overseas[0],
          longitude: overseas[1],
          formattedAddress: `${city}, ${cleaned}, France`
        }
      }
    }

    const coordinates = departmentCoordinates[postalCodePrefix]
    
    if (coordinates) {
      return {
        latitude: coordinates[0],
        longitude: coordinates[1],
        formattedAddress: `${city}, ${cleaned}, France`
      }
    }

    return { error: "Postal code not found", code: "NOT_FOUND" }
  } catch (error) {
    console.error("Postal code geocoding error:", error)
    return { error: "Geocoding failed", code: "NETWORK_ERROR" }
  }
}

/**
 * Update listing coordinates for listings that don't have them yet
 */
export async function updateListingCoordinates(listingId: string, coordinates: GeocodeResult) {
  try {
    await db
      .update(listingLocations)
      .set({
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString()
      })
      .where(eq(listingLocations.listingId, listingId))

    return { success: true }
  } catch (error) {
    console.error("Error updating listing coordinates:", error)
    return { success: false, error: "Database update failed" }
  }
}

/**
 * Batch geocode all listings without coordinates
 */
export async function geocodeAllListings(batchSize: number = 10) {
  try {
    // Get listings without coordinates
    const listingsToGeocode = await db
      .select({
        id: listingLocations.id,
        listingId: listingLocations.listingId,
        address: listingLocations.address,
        city: listingLocations.city,
        postalCode: listingLocations.postalCode
      })
      .from(listingLocations)
      .where(
        or(
          isNull(listingLocations.latitude),
          isNull(listingLocations.longitude)
        )
      )
      .limit(batchSize)

    console.log(`Found ${listingsToGeocode.length} listings to geocode`)

    const results = {
      success: 0,
      failed: 0,
      rateLimited: false
    }

    for (const location of listingsToGeocode) {
      // Add delay to respect rate limits (1 second between requests for Nominatim)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Try full address geocoding first
      let geocodeResult = await geocodeAddress(
        location.address || "",
        location.city,
        location.postalCode
      )

      // If full address fails, try postal code fallback
      if ("error" in geocodeResult && geocodeResult.code === "NOT_FOUND") {
        geocodeResult = await geocodeByPostalCode(location.postalCode, location.city)
      }

      // If postal code mapping not found, try city-only fallback
      if ("error" in geocodeResult && geocodeResult.code === "NOT_FOUND" && location.city) {
        geocodeResult = await geocodeByCity(location.city)
      }

      if ("error" in geocodeResult) {
        if (geocodeResult.code === "RATE_LIMITED") {
          results.rateLimited = true
          break // Stop processing if rate limited
        }
        results.failed++
        console.error(`Failed to geocode listing ${location.listingId}:`, geocodeResult.error)
      } else {
        const updateResult = await updateListingCoordinates(location.listingId, geocodeResult)
        if (updateResult.success) {
          results.success++
          console.log(`Successfully geocoded listing ${location.listingId}`)
        } else {
          results.failed++
        }
      }
    }

    return results
  } catch (error) {
    console.error("Batch geocoding error:", error)
    return { success: 0, failed: 0, rateLimited: false, error: String(error) }
  }
}