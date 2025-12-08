"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection, Feature } from "geojson";
import type { PublicListing } from "@/types/listing";
import { SponsoredListingCard } from "@/components/listings/sponsored-listing-card";
import { cn } from "@/lib/utils";
import type {
  MedicalProfession,
  TownMedicalZones,
} from "@/lib/services/town-density-types";
import {
  getZonageColor,
  getZonageLabel,
} from "@/lib/services/town-density-types";
import townDensityData from "@/lib/data/town-density-data.json";
import { CitySearchBox } from "./city-search-box";
import type { CityInfo } from "@/lib/services/city-service";

// Fix for Leaflet default markers in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

interface FranceMapProps {
  height?: string;
  listings?: PublicListing[];
  className?: string;
}

interface DepartmentFeature extends Feature {
  properties: {
    code: string;
    nom: string;
  };
}

interface CommuneFeature extends Feature {
  properties: {
    code: string;
    nom: string;
    codeDepartement: string;
    // For Paris arrondissements
    c_arinsee?: number;
    l_ar?: string;
  };
}

// Data URLs
const DEPARTMENTS_URL =
  "https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson";

// Department code to folder name mapping
const DEPARTMENT_FOLDERS: { [key: string]: string } = {
  "01": "01-ain",
  "02": "02-aisne",
  "03": "03-allier",
  "04": "04-alpes-de-haute-provence",
  "05": "05-hautes-alpes",
  "06": "06-alpes-maritimes",
  "07": "07-ardeche",
  "08": "08-ardennes",
  "09": "09-ariege",
  "10": "10-aube",
  "11": "11-aude",
  "12": "12-aveyron",
  "13": "13-bouches-du-rhone",
  "14": "14-calvados",
  "15": "15-cantal",
  "16": "16-charente",
  "17": "17-charente-maritime",
  "18": "18-cher",
  "19": "19-correze",
  "2A": "2A-corse-du-sud",
  "2B": "2B-haute-corse",
  "21": "21-cote-d-or",
  "22": "22-cotes-d-armor",
  "23": "23-creuse",
  "24": "24-dordogne",
  "25": "25-doubs",
  "26": "26-drome",
  "27": "27-eure",
  "28": "28-eure-et-loir",
  "29": "29-finistere",
  "30": "30-gard",
  "31": "31-haute-garonne",
  "32": "32-gers",
  "33": "33-gironde",
  "34": "34-herault",
  "35": "35-ille-et-vilaine",
  "36": "36-indre",
  "37": "37-indre-et-loire",
  "38": "38-isere",
  "39": "39-jura",
  "40": "40-landes",
  "41": "41-loir-et-cher",
  "42": "42-loire",
  "43": "43-haute-loire",
  "44": "44-loire-atlantique",
  "45": "45-loiret",
  "46": "46-lot",
  "47": "47-lot-et-garonne",
  "48": "48-lozere",
  "49": "49-maine-et-loire",
  "50": "50-manche",
  "51": "51-marne",
  "52": "52-haute-marne",
  "53": "53-mayenne",
  "54": "54-meurthe-et-moselle",
  "55": "55-meuse",
  "56": "56-morbihan",
  "57": "57-moselle",
  "58": "58-nievre",
  "59": "59-nord",
  "60": "60-oise",
  "61": "61-orne",
  "62": "62-pas-de-calais",
  "63": "63-puy-de-dome",
  "64": "64-pyrenees-atlantiques",
  "65": "65-hautes-pyrenees",
  "66": "66-pyrenees-orientales",
  "67": "67-bas-rhin",
  "68": "68-haut-rhin",
  "69": "69-rhone",
  "70": "70-haute-saone",
  "71": "71-saone-et-loire",
  "72": "72-sarthe",
  "73": "73-savoie",
  "74": "74-haute-savoie",
  "75": "75-paris",
  "76": "76-seine-maritime",
  "77": "77-seine-et-marne",
  "78": "78-yvelines",
  "79": "79-deux-sevres",
  "80": "80-somme",
  "81": "81-tarn",
  "82": "82-tarn-et-garonne",
  "83": "83-var",
  "84": "84-vaucluse",
  "85": "85-vendee",
  "86": "86-vienne",
  "87": "87-haute-vienne",
  "88": "88-vosges",
  "89": "89-yonne",
  "90": "90-territoire-de-belfort",
  "91": "91-essonne",
  "92": "92-hauts-de-seine",
  "93": "93-seine-saint-denis",
  "94": "94-val-de-marne",
  "95": "95-val-d-oise",
  // Overseas departments
  "971": "971-guadeloupe",
  "972": "972-martinique",
  "973": "973-guyane",
  "974": "974-la-reunion",
  "976": "976-mayotte",
};

const getCommuneUrl = (departmentCode: string) => {
  const folderName = DEPARTMENT_FOLDERS[departmentCode];
  if (!folderName) {
    console.error(
      `No folder mapping found for department code: ${departmentCode}`,
    );
    return null;
  }

  return `https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements/${folderName}/communes-${folderName}.geojson`;
};

// Map configuration
const FRANCE_CENTER: [number, number] = [46.603354, 1.888334];
const DEFAULT_ZOOM = 6;
const DEPARTMENT_ZOOM = 10;

export function FranceMap({
  height = "600px",
  listings = [],
  className,
}: FranceMapProps) {
  const [departmentData, setDepartmentData] =
    useState<FeatureCollection<any> | null>(null);
  const [communeData, setCommuneData] = useState<FeatureCollection<any> | null>(
    null,
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [communeLoading, setCommuneLoading] = useState(false);
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(
    null,
  );
  const [loadingDepartmentCode, setLoadingDepartmentCode] = useState<
    string | null
  >(null);
  const [selectedProfession, setSelectedProfession] =
    useState<MedicalProfession>("chirurgiens-dentistes");
  const [parisArrondissements, setParisArrondissements] =
    useState<FeatureCollection<any> | null>(null);
  const [lyonArrondissements, setLyonArrondissements] =
    useState<FeatureCollection<any> | null>(null);
  const [marseilleArrondissements, setMarseilleArrondissements] =
    useState<FeatureCollection<any> | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Track current fetch request to cancel it if needed
  const [currentAbortController, setCurrentAbortController] =
    useState<AbortController | null>(null);

  // Map reference for programmatic control
  const [map, setMap] = useState<L.Map | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Type the town density data
  const densityData = townDensityData as TownMedicalZones;

  // Refs for accessing latest data in stale closures
  const parisArrondissementsRef = useRef<FeatureCollection<any> | null>(null);
  const lyonArrondissementsRef = useRef<FeatureCollection<any> | null>(null);
  const marseilleArrondissementsRef = useRef<FeatureCollection<any> | null>(null);

  // Update refs when state changes
  useEffect(() => {
    parisArrondissementsRef.current = parisArrondissements;
    lyonArrondissementsRef.current = lyonArrondissements;
    marseilleArrondissementsRef.current = marseilleArrondissements;
  }, [parisArrondissements, lyonArrondissements, marseilleArrondissements]);

  // Debug current state
  console.log(
    "FranceMap render - dataLoaded:",
    dataLoaded,
    "parisArrondissements:",
    !!parisArrondissements,
    "features:",
    parisArrondissements?.features?.length,
  );

  // Load departments and Paris arrondissements on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load departments data
        const departmentsResponse = await fetch(DEPARTMENTS_URL);
        const departmentsData = await departmentsResponse.json();
        setDepartmentData(departmentsData);
        console.log("Departments data loaded successfully");

        // Load Paris arrondissements data
        const parisResponse = await fetch(
          "/data/arrondissements_paris.geojson",
        );
        if (!parisResponse.ok) {
          throw new Error(
            `HTTP ${parisResponse.status}: ${parisResponse.statusText}`,
          );
        }
        const parisData = await parisResponse.json();
        setParisArrondissements(parisData);
        console.log(
          "Paris arrondissements data loaded successfully:",
          parisData?.features?.length,
          "features",
        );

        // Load Lyon arrondissements
        try {
          const lyonResponse = await fetch(
            "/data/arrondissements_lyon.geojson",
          );
          if (lyonResponse.ok) {
            const lyonData = await lyonResponse.json();
            console.log("Lyon arrondissements loaded:", lyonData.features?.length, "features");
            setLyonArrondissements(lyonData);
          }
        } catch (error) {
          console.error("Failed to load Lyon arrondissements:", error);
        }

        // Load Marseille arrondissements
        try {
          const marseilleResponse = await fetch(
            "/data/arrondissements_marseille.geojson",
          );
          if (marseilleResponse.ok) {
            const marseilleData = await marseilleResponse.json();
            console.log("Marseille arrondissements loaded:", marseilleData.features?.length, "features");
            setMarseilleArrondissements(marseilleData);
          }
        } catch (error) {
          console.error("Failed to load Marseille arrondissements:", error);
        }

        setDataLoaded(true);
      } catch (error) {
        console.error("Failed to load map data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Cleanup effect to cancel any ongoing requests when component unmounts
  useEffect(() => {
    return () => {
      if (currentAbortController) {
        currentAbortController.abort();
      }
    };
  }, [currentAbortController]);

  // Department style function
  const getDepartmentStyle = useCallback(
    (feature?: DepartmentFeature) => {
      if (!feature) return {};
      const isHovered = hoveredDepartment === feature.properties.code;
      const isLoading = loadingDepartmentCode === feature.properties.code;

      return {
        fillColor: isLoading ? "#60a5fa" : isHovered ? "#93c5fd" : "#e2e8f0",
        weight: isHovered || isLoading ? 2 : 1,
        opacity: 1,
        color: isLoading ? "#4a8dd9" : isHovered ? "#60a5fa" : "#94a3b8",
        fillOpacity: isLoading ? 0.4 : 0.7,
        className: isLoading ? "department-shimmer" : "",
      };
    },
    [hoveredDepartment, loadingDepartmentCode],
  );

  // Commune style function with zone-based colors
  const getCommuneStyle = useCallback(
    (feature: CommuneFeature) => {
      // For Paris arrondissements, use c_arinsee; for regular communes, use code
      const communeCode = feature.properties.c_arinsee
        ? feature.properties.c_arinsee.toString()
        : feature.properties.code;

      const townData = densityData[communeCode];

      if (townData && townData.zones[selectedProfession]) {
        const zone = townData.zones[selectedProfession];
        const zoneColor = getZonageColor(zone!);

        return {
          fillColor: zoneColor,
          weight: 1,
          opacity: 0.8,
          color: zoneColor,
          fillOpacity: 0.7,
        };
      }

      // Default style for communes without data
      return {
        fillColor: "#d1d5db",
        weight: 1,
        opacity: 0.8,
        color: "#9ca3af",
        fillOpacity: 0.4,
      };
    },
    [selectedProfession, densityData],
  );

  // Handle department click
  const onDepartmentClick = useCallback(
    async (feature: DepartmentFeature, layer: L.Layer) => {
      const departmentCode = feature.properties.code;

      // Cancel any existing request
      if (currentAbortController) {
        currentAbortController.abort();
      }

      // Clear previous commune data immediately
      setCommuneData(null);
      setSelectedDepartment(departmentCode);
      setLoadingDepartmentCode(departmentCode);

      // ZOOM FIRST - immediate visual feedback
      const currentMap = mapRef.current;
      console.log("Department clicked - attempting zoom:", {
        departmentCode,
        hasMap: !!currentMap,
        hasGetBounds: layer && "getBounds" in layer,
      });
      if (
        currentMap &&
        "getBounds" in layer &&
        typeof layer.getBounds === "function"
      ) {
        const bounds = (layer as any).getBounds();
        console.log("Zooming to bounds:", bounds);
        currentMap.fitBounds(bounds, { padding: [20, 20] });
      } else {
        console.warn("Cannot zoom - missing map or layer bounds");
      }

      // Special cases for Paris, Lyon, and Marseille - use local arrondissements data
      if (departmentCode === "75") {
        const parisData = parisArrondissementsRef.current;
        console.log(
          "Clicked on Paris, checking data:",
          !!parisData,
          parisData?.features?.length,
        );
        if (parisData) {
          setCommuneData(parisData);
          setLoadingDepartmentCode(null);
          console.log("Paris data set successfully");
        } else {
          console.error("Paris arrondissements data not loaded yet");
          setLoadingDepartmentCode(null);
        }
        return;
      }

      if (departmentCode === "69") {
        const lyonData = lyonArrondissementsRef.current;
        console.log(
          "Clicked on Rhône (69), loading communes + Lyon arrondissements"
        );
        
        // Load all communes in the department
        const abortController = new AbortController();
        setCurrentAbortController(abortController);

        const communeUrl = getCommuneUrl(departmentCode);
        if (communeUrl) {
          fetch(communeUrl, { signal: abortController.signal })
            .then(response => response.json())
            .then(communesData => {
              // Merge Lyon arrondissements with other communes
              if (lyonData && lyonData.features.length > 0) {
                // Filter out the main Lyon commune (code 69123) to avoid overlap
                const otherCommunes = communesData.features.filter((f: any) => 
                  f.properties.code !== "69123"
                );
                
                const mergedData = {
                  type: "FeatureCollection" as const,
                  features: [...lyonData.features, ...otherCommunes]
                };
                
                console.log(`Merged ${lyonData.features.length} Lyon arrondissements with ${otherCommunes.length} other communes`);
                setCommuneData(mergedData);
              } else {
                setCommuneData(communesData);
              }
              setLoadingDepartmentCode(null);
            })
            .catch(error => {
              if (error.name !== 'AbortError') {
                console.error("Failed to load Rhône communes:", error);
              }
              setLoadingDepartmentCode(null);
            });
        }
        return;
      }

      if (departmentCode === "13") {
        const marseilleData = marseilleArrondissementsRef.current;
        console.log(
          "Clicked on Bouches-du-Rhône (13), loading communes + Marseille arrondissements"
        );
        
        // Load all communes in the department
        const abortController = new AbortController();
        setCurrentAbortController(abortController);

        const communeUrl = getCommuneUrl(departmentCode);
        if (communeUrl) {
          fetch(communeUrl, { signal: abortController.signal })
            .then(response => response.json())
            .then(communesData => {
              // Merge Marseille arrondissements with other communes
              if (marseilleData && marseilleData.features.length > 0) {
                // Filter out the main Marseille commune (code 13055) to avoid overlap
                const otherCommunes = communesData.features.filter((f: any) => 
                  f.properties.code !== "13055"
                );
                
                const mergedData = {
                  type: "FeatureCollection" as const,
                  features: [...marseilleData.features, ...otherCommunes]
                };
                
                console.log(`Merged ${marseilleData.features.length} Marseille arrondissements with ${otherCommunes.length} other communes`);
                setCommuneData(mergedData);
              } else {
                setCommuneData(communesData);
              }
              setLoadingDepartmentCode(null);
            })
            .catch(error => {
              if (error.name !== 'AbortError') {
                console.error("Failed to load Bouches-du-Rhône communes:", error);
              }
              setLoadingDepartmentCode(null);
            });
        }
        return;
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      setCurrentAbortController(abortController);

      try {
        // Get commune URL for this department
        const communeUrl = getCommuneUrl(departmentCode);
        if (!communeUrl) {
          console.error(
            `No commune data available for department ${departmentCode}`,
          );
          setLoadingDepartmentCode(null);
          setCurrentAbortController(null);
          return;
        }

        // THEN fetch commune data in background while zooming
        const response = await fetch(communeUrl, {
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Only set data if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setCommuneData(data);
        }
      } catch (error) {
        // Don't log abort errors as they're expected
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(
            `Failed to load commune data for department ${departmentCode}:`,
            error,
          );
        }
      } finally {
        // Only update loading state if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setLoadingDepartmentCode(null);
          setCurrentAbortController(null);
        }
      }
    },
    [currentAbortController],
  );

  // Handle commune click
  const onCommuneClick = useCallback(
    (feature: CommuneFeature) => {
      // For Paris arrondissements, use c_arinsee; for regular communes, use code
      const communeCode = feature.properties.c_arinsee
        ? feature.properties.c_arinsee.toString()
        : feature.properties.code;

      const townData = densityData[communeCode];
      const zone = townData?.zones[selectedProfession];

      // Get display name - use l_ar for Paris arrondissements, nom for regular communes
      const displayName = feature.properties.l_ar || feature.properties.nom;

      console.log(
        "Clicked commune:",
        displayName,
        "Code:",
        communeCode,
        zone ? `Zone: ${getZonageLabel(zone)}` : "No data",
      );
      // You can add more functionality here, like showing listings for this commune
    },
    [selectedProfession, densityData],
  );

  // Department event handlers
  const onEachDepartment = useCallback(
    (feature: DepartmentFeature, layer: L.Layer) => {
      layer.on({
        mouseover: () => setHoveredDepartment(feature.properties.code),
        mouseout: () => setHoveredDepartment(null),
        click: () => onDepartmentClick(feature, layer),
      });

      // Bind tooltip
      layer.bindTooltip(feature.properties.nom, {
        permanent: false,
        direction: "center",
        className: "department-tooltip",
      });
    },
    [onDepartmentClick],
  );

  // Commune event handlers
  const onEachCommune = useCallback(
    (feature: CommuneFeature, layer: L.Layer) => {
      // For Paris arrondissements, use c_arinsee; for regular communes, use code
      const communeCode = feature.properties.c_arinsee
        ? feature.properties.c_arinsee.toString()
        : feature.properties.code;

      const townData = densityData[communeCode];
      const zone = townData?.zones[selectedProfession];

      layer.on({
        click: () => onCommuneClick(feature),
      });

      // Get display name - use l_ar for Paris arrondissements, nom for regular communes
      const displayName = feature.properties.l_ar || feature.properties.nom;

      // Build tooltip content with zone information
      const tooltipContent = zone
        ? `${displayName}<br/><strong>${getZonageLabel(zone)}</strong>`
        : displayName;

      // Bind tooltip
      layer.bindTooltip(tooltipContent, {
        permanent: false,
        direction: "center",
        className: "commune-tooltip",
      });
    },
    [onCommuneClick, selectedProfession, densityData],
  );

  // Reset to department view
  const resetToFrance = useCallback(() => {
    // Cancel any ongoing request
    if (currentAbortController) {
      currentAbortController.abort();
      setCurrentAbortController(null);
    }

    setSelectedDepartment(null);
    setCommuneData(null);
    setCommuneLoading(false);
    setLoadingDepartmentCode(null);
  }, [currentAbortController]);

  // Handle city search selection
  const handleCitySelect = useCallback(
    async (city: CityInfo) => {
      if (!map) return;

      // Extract department code from INSEE code (first 2-3 digits)
      let departmentCode = city.code.substring(0, 2);

      // Handle Corsica special cases based on INSEE code ranges
      if (departmentCode === "20") {
        const inseeNumber = parseInt(city.code);
        departmentCode = inseeNumber >= 20200 ? "2B" : "2A";
      }

      // Set states immediately
      setSelectedDepartment(departmentCode);
      setCommuneData(null);
      setLoadingDepartmentCode(departmentCode);

      // FLY TO CITY FIRST - immediate visual feedback
      map.flyTo([city.lat, city.lng], city.zoom || 12, {
        duration: 1.5,
      });

      // Special case for Paris - use local arrondissements data
      if (departmentCode === "75") {
        console.log(
          "Clicked on Paris, checking data:",
          !!parisArrondissements,
          parisArrondissements?.features?.length,
        );
        if (parisArrondissements) {
          setCommuneData(parisArrondissements);
          setLoadingDepartmentCode(null);
          console.log("Paris data set successfully");
        } else {
          console.error("Paris arrondissements data not loaded yet");
          setLoadingDepartmentCode(null);
        }
        return;
      }

      // THEN load commune data in background while flying
      try {
        const communeUrl = getCommuneUrl(departmentCode);
        if (communeUrl) {
          const response = await fetch(communeUrl);
          if (response.ok) {
            const data = await response.json();
            setCommuneData(data);
          }
        }
      } catch (error) {
        console.error(
          `Failed to load commune data for department ${departmentCode}:`,
          error,
        );
      } finally {
        setLoadingDepartmentCode(null);
      }
    },
    [map, parisArrondissements],
  );

  if (loading) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg bg-gray-100",
          className,
        )}
        style={{ height }}
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm">Chargement de la carte...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)} style={{ height }}>
      <MapContainer
        center={FRANCE_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{
          height: "100%",
          width: "100%",
          border: "none",
          outline: "none",
        }}
        className="rounded-lg"
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        ref={(mapInstance) => {
          if (mapInstance) {
            setMap(mapInstance);
            mapRef.current = mapInstance;
          }
        }}
      >
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={18}
        />

        {/* Department polygons */}
        {departmentData && (
          <GeoJSON
            data={departmentData}
            style={getDepartmentStyle}
            onEachFeature={onEachDepartment}
          />
        )}

        {/* Commune polygons (when a department is selected) */}
        {communeData && (
          <GeoJSON
            key={`communes-${selectedDepartment}-${selectedProfession}`}
            data={communeData}
            style={(feature) => getCommuneStyle(feature as CommuneFeature)}
            onEachFeature={onEachCommune}
          />
        )}

        {/* Listings Markers */}
        {listings.map((listing) => {
          if (listing.location?.latitude && listing.location?.longitude) {
            const lat = parseFloat(listing.location.latitude);
            const lng = parseFloat(listing.location.longitude);

            if (!isNaN(lat) && !isNaN(lng)) {
              return (
                <Marker key={listing.id} position={[lat, lng]}>
                  <Popup className="listing-popup" maxWidth={280} minWidth={250}>
                    <SponsoredListingCard
                      listing={listing}
                      orientation="popup"
                      className="border-0 shadow-none"
                    />
                  </Popup>
                </Marker>
              );
            }
          }
          return null;
        })}
      </MapContainer>

      {/* Controls overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        {selectedDepartment && (
          <button
            onClick={resetToFrance}
            className="rounded-lg border border-gray-200 bg-white/95 px-3 py-2 font-medium text-sm shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
          >
            ← Retour à la France
          </button>
        )}

        {/* Medical profession selector - always visible */}
        <div className="rounded-lg border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
          <label
            htmlFor="profession-select"
            className="mb-2 block font-medium text-gray-700 text-xs"
          >
            Profession médicale
          </label>
          <select
            id="profession-select"
            value={selectedProfession}
            onChange={(e) =>
              setSelectedProfession(e.target.value as MedicalProfession)
            }
            className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="chirurgiens-dentistes">Chirurgiens-dentistes</option>
            <option value="infirmier">Infirmiers</option>
            <option value="masseurs-kinésithérapeutes">
              Kinésithérapeutes
            </option>
            <option value="orthophonistes">Orthophonistes</option>
            <option value="sages-femmes">Sages-femmes</option>
          </select>
        </div>
      </div>

      {/* City search and zone legend */}
      <div className="absolute top-4 right-4 z-[1000] flex max-w-sm flex-col gap-2">
        {/* City search box */}
        <CitySearchBox
          onCitySelect={handleCitySelect}
          placeholder="Rechercher une ville..."
          className="w-80"
        />
      </div>

      {/* Zone legend - bottom right, always visible */}
      <div className="absolute right-4 bottom-4 z-[1000] rounded-lg border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
        <div className="mb-2 font-medium text-gray-700 text-xs">
          Zonage médical (ARS)
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: "#10b981" }}
            />
            <span>Très sous-dotée</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: "#84cc16" }}
            />
            <span>Sous-dotée</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: "#f59e0b" }}
            />
            <span>Intermédiaire</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: "#ef4444" }}
            />
            <span>Très dotée</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: "#b91c1c" }}
            />
            <span>Sur-dotée</span>
          </div>
        </div>
      </div>

      {/* Listings count */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-gray-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
        <div className="font-medium text-gray-700 text-xs">
          {listings.length} annonces disponibles
        </div>
      </div>

      {/* Styles for tooltips, map container and shimmer effect */}
      <style jsx global>{`
        .department-tooltip {
          background: rgba(59, 130, 246, 0.9) !important;
          color: white !important;
          border: none !important;
          border-radius: 6px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          padding: 4px 8px !important;
        }
        .commune-tooltip {
          background: rgba(245, 158, 11, 0.9) !important;
          color: white !important;
          border: none !important;
          border-radius: 6px !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          padding: 3px 6px !important;
        }
        .leaflet-container {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .leaflet-container:focus {
          outline: none !important;
          border: none !important;
        }

        @keyframes department-shimmer {
          0%,
          100% {
            fill-opacity: 0.4;
            stroke-opacity: 0.6;
          }
          50% {
            fill-opacity: 0.8;
            stroke-opacity: 1;
          }
        }

        .department-shimmer {
          animation: department-shimmer 1.5s ease-in-out infinite !important;
        }

        /* Listing popup styles */
        .listing-popup .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }
        .listing-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 100% !important;
        }
        .listing-popup .leaflet-popup-tip {
          background: white !important;
        }
        .listing-popup .leaflet-popup-close-button {
          top: 8px !important;
          right: 8px !important;
          width: 24px !important;
          height: 24px !important;
          font-size: 18px !important;
          color: #6b7280 !important;
          background: rgba(255, 255, 255, 0.9) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 10 !important;
        }
        .listing-popup .leaflet-popup-close-button:hover {
          color: #111827 !important;
          background: white !important;
        }
      `}</style>
    </div>
  );
}
