// Major French cities with priority levels for map labeling and coordinates

export interface CityInfo {
    name: string
    priority: 1 | 2 | 3 | 4
    minZoom: number
    lat: number
    lng: number
    zoom?: number // Default zoom when navigating to this city
}

// Major French cities by INSEE code with display priorities and coordinates
export const MAJOR_CITIES: Record<string, CityInfo> = {
    // Priority 1: Always show major cities (zoom 5+)
    "75056": {
        name: "Paris",
        priority: 1,
        minZoom: 6,
        lat: 48.8566,
        lng: 2.3522,
        zoom: 10
    },
    "69123": {
        name: "Lyon",
        priority: 1,
        minZoom: 6,
        lat: 45.764,
        lng: 4.8357,
        zoom: 11
    },
    "13055": {
        name: "Marseille",
        priority: 1,
        minZoom: 6,
        lat: 43.2965,
        lng: 5.3698,
        zoom: 11
    },
    "31555": {
        name: "Toulouse",
        priority: 1,
        minZoom: 6,
        lat: 43.6047,
        lng: 1.4442,
        zoom: 11
    },
    "06088": {
        name: "Nice",
        priority: 1,
        minZoom: 6,
        lat: 43.7102,
        lng: 7.262,
        zoom: 11
    },
    "44109": {
        name: "Nantes",
        priority: 1,
        minZoom: 6,
        lat: 47.2184,
        lng: -1.5536,
        zoom: 11
    },
    "67482": {
        name: "Strasbourg",
        priority: 1,
        minZoom: 6,
        lat: 48.5734,
        lng: 7.7521,
        zoom: 11
    },
    "34172": {
        name: "Montpellier",
        priority: 1,
        minZoom: 6,
        lat: 43.611,
        lng: 3.8767,
        zoom: 11
    },
    "33063": {
        name: "Bordeaux",
        priority: 1,
        minZoom: 6,
        lat: 44.8378,
        lng: -0.5792,
        zoom: 11
    },
    "59350": {
        name: "Lille",
        priority: 1,
        minZoom: 6,
        lat: 50.6292,
        lng: 3.0573,
        zoom: 11
    },

    // Priority 2: Medium zoom cities (zoom 7+)
    "35238": {
        name: "Rennes",
        priority: 2,
        minZoom: 7,
        lat: 48.1173,
        lng: -1.6778,
        zoom: 12
    },
    "51454": {
        name: "Reims",
        priority: 2,
        minZoom: 7,
        lat: 49.2583,
        lng: 4.0317,
        zoom: 12
    },
    "76351": {
        name: "Le Havre",
        priority: 2,
        minZoom: 7,
        lat: 49.4944,
        lng: 0.1079,
        zoom: 12
    },
    "42218": {
        name: "Saint-Étienne",
        priority: 2,
        minZoom: 7,
        lat: 45.4397,
        lng: 4.3872,
        zoom: 12
    },
    "83137": {
        name: "Toulon",
        priority: 2,
        minZoom: 7,
        lat: 43.1242,
        lng: 5.928,
        zoom: 12
    },
    "38185": {
        name: "Grenoble",
        priority: 2,
        minZoom: 7,
        lat: 45.1885,
        lng: 5.7245,
        zoom: 12
    },
    "21231": {
        name: "Dijon",
        priority: 2,
        minZoom: 7,
        lat: 47.322,
        lng: 5.0415,
        zoom: 12
    },
    "49007": {
        name: "Angers",
        priority: 2,
        minZoom: 7,
        lat: 47.4784,
        lng: -0.5632,
        zoom: 12
    },
    "30189": {
        name: "Nîmes",
        priority: 2,
        minZoom: 7,
        lat: 43.8367,
        lng: 4.3601,
        zoom: 12
    },
    "13001": {
        name: "Aix-en-Provence",
        priority: 2,
        minZoom: 7,
        lat: 43.5297,
        lng: 5.4474,
        zoom: 12
    },
    "54395": {
        name: "Nancy",
        priority: 2,
        minZoom: 7,
        lat: 48.6921,
        lng: 6.1844,
        zoom: 12
    },
    "86194": {
        name: "Poitiers",
        priority: 2,
        minZoom: 7,
        lat: 46.5802,
        lng: 0.3404,
        zoom: 12
    },
    "62041": {
        name: "Boulogne-sur-Mer",
        priority: 2,
        minZoom: 7,
        lat: 50.726,
        lng: 1.614,
        zoom: 12
    },
    "17300": {
        name: "La Rochelle",
        priority: 2,
        minZoom: 7,
        lat: 46.1603,
        lng: -1.1511,
        zoom: 12
    },
    "56260": {
        name: "Vannes",
        priority: 2,
        minZoom: 7,
        lat: 47.6587,
        lng: -2.7603,
        zoom: 12
    },

    // Priority 3: Regional cities (zoom 8+)
    "87085": {
        name: "Limoges",
        priority: 3,
        minZoom: 8,
        lat: 45.8336,
        lng: 1.2611,
        zoom: 13
    },
    "25056": {
        name: "Besançon",
        priority: 3,
        minZoom: 8,
        lat: 47.2378,
        lng: 6.0241,
        zoom: 13
    },
    "57463": {
        name: "Metz",
        priority: 3,
        minZoom: 8,
        lat: 49.1193,
        lng: 6.1757,
        zoom: 13
    },
    "68224": {
        name: "Mulhouse",
        priority: 3,
        minZoom: 8,
        lat: 47.7508,
        lng: 7.3359,
        zoom: 13
    },
    "80021": {
        name: "Amiens",
        priority: 3,
        minZoom: 8,
        lat: 49.8941,
        lng: 2.2958,
        zoom: 13
    },
    "14118": {
        name: "Caen",
        priority: 3,
        minZoom: 8,
        lat: 49.1829,
        lng: -0.3707,
        zoom: 13
    },
    "29232": {
        name: "Brest",
        priority: 3,
        minZoom: 8,
        lat: 48.3905,
        lng: -4.4861,
        zoom: 13
    },
    "37261": {
        name: "Tours",
        priority: 3,
        minZoom: 8,
        lat: 47.3941,
        lng: 0.6848,
        zoom: 13
    },
    "45234": {
        name: "Orléans",
        priority: 3,
        minZoom: 8,
        lat: 47.9029,
        lng: 1.9093,
        zoom: 13
    },
    "63113": {
        name: "Clermont-Ferrand",
        priority: 3,
        minZoom: 8,
        lat: 45.7797,
        lng: 3.0863,
        zoom: 13
    },
    "66136": {
        name: "Perpignan",
        priority: 3,
        minZoom: 8,
        lat: 42.6886,
        lng: 2.8948,
        zoom: 13
    },
    "72181": {
        name: "Le Mans",
        priority: 3,
        minZoom: 8,
        lat: 48.0077,
        lng: 0.1996,
        zoom: 13
    },
    "18033": {
        name: "Bourges",
        priority: 3,
        minZoom: 8,
        lat: 47.081,
        lng: 2.3987,
        zoom: 13
    },
    "03190": {
        name: "Montluçon",
        priority: 3,
        minZoom: 8,
        lat: 46.3402,
        lng: 2.6038,
        zoom: 13
    },
    "82121": {
        name: "Montauban",
        priority: 3,
        minZoom: 8,
        lat: 44.0172,
        lng: 1.3518,
        zoom: 13
    },
    "65440": {
        name: "Tarbes",
        priority: 3,
        minZoom: 8,
        lat: 43.2332,
        lng: 0.0806,
        zoom: 13
    },
    "64445": {
        name: "Pau",
        priority: 3,
        minZoom: 8,
        lat: 43.2951,
        lng: -0.3707,
        zoom: 13
    },
    "32013": {
        name: "Auch",
        priority: 3,
        minZoom: 8,
        lat: 43.6461,
        lng: 0.5885,
        zoom: 13
    },
    "46042": {
        name: "Cahors",
        priority: 3,
        minZoom: 8,
        lat: 44.4479,
        lng: 1.4397,
        zoom: 13
    },
    "12202": {
        name: "Rodez",
        priority: 3,
        minZoom: 8,
        lat: 44.3498,
        lng: 2.5757,
        zoom: 13
    },
    "48095": {
        name: "Mende",
        priority: 3,
        minZoom: 8,
        lat: 44.5186,
        lng: 3.4976,
        zoom: 13
    },
    "15014": {
        name: "Aurillac",
        priority: 3,
        minZoom: 8,
        lat: 44.9317,
        lng: 2.4441,
        zoom: 13
    },
    "43157": {
        name: "Le Puy-en-Velay",
        priority: 3,
        minZoom: 8,
        lat: 45.0434,
        lng: 3.8859,
        zoom: 13
    },
    "07186": {
        name: "Privas",
        priority: 3,
        minZoom: 8,
        lat: 44.7358,
        lng: 4.5996,
        zoom: 13
    },
    "26362": {
        name: "Valence",
        priority: 3,
        minZoom: 8,
        lat: 44.9334,
        lng: 4.8924,
        zoom: 13
    },
    "05061": {
        name: "Gap",
        priority: 3,
        minZoom: 8,
        lat: 44.5598,
        lng: 6.0756,
        zoom: 13
    },
    "04070": {
        name: "Digne-les-Bains",
        priority: 3,
        minZoom: 8,
        lat: 44.0942,
        lng: 6.2361,
        zoom: 13
    },
    "84007": {
        name: "Avignon",
        priority: 3,
        minZoom: 8,
        lat: 44.9334,
        lng: 4.806,
        zoom: 13
    },
    "11069": {
        name: "Carcassonne",
        priority: 3,
        minZoom: 8,
        lat: 43.213,
        lng: 2.3491,
        zoom: 13
    },
    "09122": {
        name: "Foix",
        priority: 3,
        minZoom: 8,
        lat: 42.9649,
        lng: 1.6053,
        zoom: 13
    },
    "81004": {
        name: "Albi",
        priority: 3,
        minZoom: 8,
        lat: 43.9297,
        lng: 2.1479,
        zoom: 13
    },
    "64102": {
        name: "Bayonne",
        priority: 3,
        minZoom: 8,
        lat: 43.4929,
        lng: -1.4748,
        zoom: 13
    },
    "40192": {
        name: "Mont-de-Marsan",
        priority: 3,
        minZoom: 8,
        lat: 43.8907,
        lng: -0.4952,
        zoom: 13
    },
    "24322": {
        name: "Périgueux",
        priority: 3,
        minZoom: 8,
        lat: 45.1845,
        lng: 0.7213,
        zoom: 13
    },
    "19272": {
        name: "Tulle",
        priority: 3,
        minZoom: 8,
        lat: 45.2661,
        lng: 1.7712,
        zoom: 13
    },
    "23096": {
        name: "Guéret",
        priority: 3,
        minZoom: 8,
        lat: 46.1701,
        lng: 1.8716,
        zoom: 13
    },
    "36044": {
        name: "Châteauroux",
        priority: 3,
        minZoom: 8,
        lat: 46.8111,
        lng: 1.6914,
        zoom: 13
    },
    "41018": {
        name: "Blois",
        priority: 3,
        minZoom: 8,
        lat: 47.5868,
        lng: 1.3349,
        zoom: 13
    },
    "28085": {
        name: "Chartres",
        priority: 3,
        minZoom: 8,
        lat: 48.4431,
        lng: 1.4879,
        zoom: 13
    },
    "27229": {
        name: "Évreux",
        priority: 3,
        minZoom: 8,
        lat: 49.0246,
        lng: 1.151,
        zoom: 13
    },
    "76540": {
        name: "Rouen",
        priority: 3,
        minZoom: 8,
        lat: 49.4431,
        lng: 1.0993,
        zoom: 13
    },
    "80620": {
        name: "Péronne",
        priority: 3,
        minZoom: 8,
        lat: 49.9307,
        lng: 2.934,
        zoom: 13
    },
    "02691": {
        name: "Saint-Quentin",
        priority: 3,
        minZoom: 8,
        lat: 49.8467,
        lng: 3.2876,
        zoom: 13
    },
    "60057": {
        name: "Beauvais",
        priority: 3,
        minZoom: 8,
        lat: 49.4295,
        lng: 2.0807,
        zoom: 13
    },
    "77288": {
        name: "Meaux",
        priority: 3,
        minZoom: 8,
        lat: 48.9606,
        lng: 2.8789,
        zoom: 13
    },
    "91228": {
        name: "Évry-Courcouronnes",
        priority: 3,
        minZoom: 8,
        lat: 48.6289,
        lng: 2.4456,
        zoom: 13
    },
    "78646": {
        name: "Versailles",
        priority: 3,
        minZoom: 8,
        lat: 48.8049,
        lng: 2.1204,
        zoom: 13
    },
    "95500": {
        name: "Pontoise",
        priority: 3,
        minZoom: 8,
        lat: 49.0504,
        lng: 2.0942,
        zoom: 13
    },
    "93066": {
        name: "Saint-Denis",
        priority: 3,
        minZoom: 8,
        lat: 48.9362,
        lng: 2.3574,
        zoom: 13
    },
    "94028": {
        name: "Créteil",
        priority: 3,
        minZoom: 8,
        lat: 48.79,
        lng: 2.4555,
        zoom: 13
    },
    "92050": {
        name: "Nanterre",
        priority: 3,
        minZoom: 8,
        lat: 48.8925,
        lng: 2.2069,
        zoom: 13
    },

    // Overseas territories
    "97801": {
        name: "Saint-Denis (Réunion)",
        priority: 3,
        minZoom: 8,
        lat: -20.8823,
        lng: 55.4504,
        zoom: 11
    },
    "97105": {
        name: "Basse-Terre",
        priority: 3,
        minZoom: 8,
        lat: 15.9958,
        lng: -61.7322,
        zoom: 11
    },
    "97209": {
        name: "Fort-de-France",
        priority: 3,
        minZoom: 8,
        lat: 14.6037,
        lng: -61.0731,
        zoom: 11
    },
    "97302": {
        name: "Cayenne",
        priority: 3,
        minZoom: 8,
        lat: 4.9349,
        lng: -52.3263,
        zoom: 11
    },
    "98735": {
        name: "Nouméa",
        priority: 3,
        minZoom: 8,
        lat: -22.2763,
        lng: 166.4572,
        zoom: 11
    }
}

// Get all cities as an array for search functionality
export function getAllCities(): Array<CityInfo & { code: string }> {
    return Object.entries(MAJOR_CITIES).map(([code, info]) => ({
        ...info,
        code
    }))
}

// Search cities by name (case insensitive, supports partial matches)
export function searchCities(
    query: string
): Array<CityInfo & { code: string }> {
    if (!query.trim()) return []

    const normalizedQuery = query
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics

    const allCities = getAllCities()

    return allCities
        .filter((city) => {
            const normalizedName = city.name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            return normalizedName.includes(normalizedQuery)
        })
        .sort((a, b) => {
            // Priority sort (lower priority number = higher priority)
            if (a.priority !== b.priority) {
                return a.priority - b.priority
            }
            // Then alphabetical
            return a.name.localeCompare(b.name)
        })
        .slice(0, 10) // Limit to 10 results
}

// Check if a city should be shown at current zoom level
export function shouldShowCityLabel(cityCode: string, zoom: number): boolean {
    const cityInfo = MAJOR_CITIES[cityCode]
    if (!cityInfo) return false
    return zoom >= cityInfo.minZoom
}

// Get label style based on priority
export function getCityLabelStyle(
    priority: number,
    zoom: number
): {
    fontSize: number
    fontWeight: string
    background: string
    padding: string
    border: string
    boxShadow: string
} {
    switch (priority) {
        case 1: // Major cities
            return {
                fontSize: Math.min(16, 10 + zoom * 0.8),
                fontWeight: "bold",
                background: "rgba(255, 255, 255, 0.95)",
                padding: "6px 10px",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
            }
        case 2: // Regional cities
            return {
                fontSize: Math.min(14, 8 + zoom * 0.6),
                fontWeight: "600",
                background: "rgba(255, 255, 255, 0.92)",
                padding: "4px 8px",
                border: "1px solid rgba(0, 0, 0, 0.18)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)"
            }
        case 3: // Smaller cities
            return {
                fontSize: Math.min(12, 6 + zoom * 0.5),
                fontWeight: "500",
                background: "rgba(255, 255, 255, 0.88)",
                padding: "3px 6px",
                border: "1px solid rgba(0, 0, 0, 0.15)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
            }
        default: // All other communes
            return {
                fontSize: Math.min(11, 5 + zoom * 0.4),
                fontWeight: "normal",
                background: "rgba(255, 255, 255, 0.85)",
                padding: "2px 5px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)"
            }
    }
}
