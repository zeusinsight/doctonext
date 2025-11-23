"use client";

import { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import {
  fetchDepartments,
  convertDepartmentCoordinatesToLeaflet,
  type DepartmentData,
} from "@/lib/services/department-service";

interface DepartmentOverlayProps {
  onDepartmentClick?: (department: DepartmentData) => void;
  onDepartmentHover?: (department: DepartmentData | null) => void;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (error: string | null) => void;
  visible?: boolean;
  opacity?: number;
  highlightedDepartment?: string | null;
}

export function DepartmentOverlay({
  onDepartmentClick,
  onDepartmentHover,
  onLoadingChange,
  onError,
  visible = true,
  opacity = 0.3,
  highlightedDepartment = null,
}: DepartmentOverlayProps) {
  const map = useMap();
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Load departments data
  useEffect(() => {
    let isCancelled = false;

    const loadDepartments = async () => {
      console.log("DepartmentOverlay: Starting to load departments...");
      setLoading(true);
      setError(null);
      onLoadingChange?.(true);
      onError?.(null);

      try {
        const departmentData = await fetchDepartments();

        if (!isCancelled) {
          setDepartments(departmentData);
          console.log(
            `DepartmentOverlay: Successfully loaded ${departmentData.length} departments`,
          );
        }
      } catch (error) {
        console.error("DepartmentOverlay: Error loading departments:", error);
        if (!isCancelled) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to load departments";
          setError(errorMessage);
          onError?.(errorMessage);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
          onLoadingChange?.(false);
        }
      }
    };

    loadDepartments();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Create and update department polygons
  useEffect(() => {
    if (!map || departments.length === 0) {
      console.log(
        "DepartmentOverlay: Skipping polygon creation - map:",
        !!map,
        "departments:",
        departments.length,
      );
      return;
    }

    console.log(
      `DepartmentOverlay: Creating polygons for ${departments.length} departments, visible:`,
      visible,
    );

    // Clear existing layers
    if (layerGroupRef.current) {
      map.removeLayer(layerGroupRef.current);
    }

    // Create new layer group
    const layerGroup = L.layerGroup();
    layerGroupRef.current = layerGroup;

    let successCount = 0;
    departments.forEach((department) => {
      try {
        const coordinates = convertDepartmentCoordinatesToLeaflet(
          department.geometry.coordinates,
          department.geometry.type,
        );

        let polygon: L.Polygon;

        if (department.geometry.type === "Polygon") {
          polygon = L.polygon(coordinates as L.LatLngExpression[][], {
            color: "#2563eb",
            weight: 2,
            opacity: 0.8,
            fillColor:
              highlightedDepartment === department.code ? "#4a8dd9" : "#60a5fa",
            fillOpacity:
              highlightedDepartment === department.code ? 0.6 : opacity,
            className: `department-${department.code}`,
          });
        } else {
          // MultiPolygon (already flattened by convertDepartmentCoordinatesToLeaflet)
          polygon = L.polygon(coordinates as L.LatLngExpression[][], {
            color: "#2563eb",
            weight: 2,
            opacity: 0.8,
            fillColor:
              highlightedDepartment === department.code ? "#4a8dd9" : "#60a5fa",
            fillOpacity:
              highlightedDepartment === department.code ? 0.6 : opacity,
            className: `department-${department.code}`,
          });
        }

        // Add hover effects
        polygon.on("mouseover", (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            fillOpacity: 0.6,
            fillColor: "#4a8dd9",
          });

          // Bring to front
          layer.bringToFront();

          onDepartmentHover?.(department);
        });

        polygon.on("mouseout", (e) => {
          const layer = e.target;
          const isHighlighted = highlightedDepartment === department.code;

          layer.setStyle({
            weight: 2,
            fillOpacity: isHighlighted ? 0.6 : opacity,
            fillColor: isHighlighted ? "#4a8dd9" : "#60a5fa",
          });

          onDepartmentHover?.(null);
        });

        // Add click handler
        polygon.on("click", (e) => {
          console.log("DepartmentOverlay: Polygon clicked!", department.name, department.code);
          e.originalEvent?.stopPropagation();
          onDepartmentClick?.(department);
        });

        // Add to layer group
        layerGroup.addLayer(polygon);
        successCount++;
      } catch (error) {
        console.error(
          `Error creating polygon for department ${department.code}:`,
          error,
        );
      }
    });

    console.log(
      `DepartmentOverlay: Successfully created ${successCount} department polygons`,
    );

    // Add to map if visible
    if (visible) {
      map.addLayer(layerGroup);
      console.log(
        `DepartmentOverlay: Added ${successCount} departments to map`,
      );
    } else {
      console.log("DepartmentOverlay: Not adding to map - visible=false");
    }

    // Cleanup on unmount
    return () => {
      if (layerGroupRef.current && map.hasLayer(layerGroupRef.current)) {
        map.removeLayer(layerGroupRef.current);
      }
    };
  }, [
    map,
    departments,
    visible,
    opacity,
    highlightedDepartment,
    onDepartmentClick,
    onDepartmentHover,
  ]);

  // Handle visibility changes
  useEffect(() => {
    if (!map || !layerGroupRef.current) return;

    if (visible) {
      if (!map.hasLayer(layerGroupRef.current)) {
        map.addLayer(layerGroupRef.current);
      }
    } else {
      if (map.hasLayer(layerGroupRef.current)) {
        map.removeLayer(layerGroupRef.current);
      }
    }
  }, [map, visible]);

  // Update highlighting when highlightedDepartment changes
  useEffect(() => {
    if (!layerGroupRef.current) return;

    layerGroupRef.current.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        const className = (layer.getElement() as HTMLElement)?.className || "";
        const departmentCode = className.match(/department-(\d+[AB]?)/)?.[1];

        if (departmentCode) {
          const isHighlighted = highlightedDepartment === departmentCode;

          layer.setStyle({
            fillColor: isHighlighted ? "#4a8dd9" : "#60a5fa",
            fillOpacity: isHighlighted ? 0.6 : opacity,
          });
        }
      }
    });
  }, [highlightedDepartment, opacity]);

  if (loading) {
    console.log("Loading departments...");
  }

  if (error) {
    console.error("Department overlay error:", error);
  }

  return null;
}
