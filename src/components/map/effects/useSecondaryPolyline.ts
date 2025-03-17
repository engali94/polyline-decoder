import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { 
  addPrimaryPolyline, 
  addSecondaryPolyline, 
  addDifferentialAnalysis,
  cleanupMapLayers
} from '../features';

interface UseSecondaryPolylineProps {
  map: React.MutableRefObject<maplibregl.Map | null>;
  coordinates: [number, number][];
  secondaryCoordinates: [number, number][];
  isLoading: boolean;
  comparisonMode: boolean;
  comparisonType: 'overlay' | 'sideBySide' | 'diff';
  overlayOpacity: number;
  showDivergence: boolean;
  showIntersections: boolean;
  splitViewActive: boolean;
  validSecondaryCoords: boolean;
  color?: string;
  lineWidth?: number;
  lineDash?: number[];
}

export const useSecondaryPolyline = ({
  map,
  coordinates,
  secondaryCoordinates,
  isLoading,
  comparisonMode,
  comparisonType,
  overlayOpacity,
  showDivergence,
  showIntersections,
  splitViewActive,
  validSecondaryCoords,
  color = '#10b981',
  lineWidth = 8,
  lineDash = []
}: UseSecondaryPolylineProps) => {
  
  useEffect(() => {
    console.log("🔍 Secondary polyline effect triggered:", {
      hasMap: !!map.current,
      comparisonMode,
      comparisonType,
      coords: secondaryCoordinates?.length || 0,
      validSecondaryCoords,
      splitViewActive,
      coordinates: JSON.stringify(secondaryCoordinates?.slice(0, 2) || [])
    });

    if (!map.current || isLoading) {
      console.log("❌ Map not ready or still loading");
      return;
    }
    
    if (!comparisonMode) {
      console.log("❌ Comparison mode not active");
      return;
    }
    
    if (!secondaryCoordinates || secondaryCoordinates.length < 2) {
      console.warn("❌ Secondary coordinates missing or insufficient:", secondaryCoordinates);
      return;
    }
    
    // Skip rendering secondary line on main map if we're in side-by-side mode
    if (comparisonType === 'sideBySide' && splitViewActive) {
      console.log("ℹ️ Skipping secondary polyline rendering in side-by-side view");
      return;
    }

    const onMapLoad = () => {
      console.log("🗺️ Map loaded, adding secondary polyline");
      
      // Clean up previous layers before adding new ones
      cleanupMapLayers(map.current!, comparisonType);
      
      console.log("➕ Adding secondary polyline to map:", {
        comparisonType,
        overlayOpacity,
        coordCount: secondaryCoordinates.length,
        sampleCoords: JSON.stringify(secondaryCoordinates.slice(0, 2)),
        color,
        lineWidth,
        lineDash
      });
      
      // For overlay and diff mode, always show the secondary polyline
      if (comparisonType === 'overlay' || comparisonType === 'diff') {
        addSecondaryPolyline(map.current!, secondaryCoordinates, overlayOpacity, color, lineWidth, lineDash);
        
        // In diff mode, also show the analysis
        if (comparisonType === 'diff') {
          addDifferentialAnalysis(
            map.current!,
            coordinates, 
            secondaryCoordinates, 
            showDivergence, 
            showIntersections
          );
        }
      }
    };

    // Wait until map is loaded to add layers
    if (map.current.loaded()) {
      console.log("Map already loaded, adding secondary polyline now");
      onMapLoad();
    } else {
      console.log("Map not loaded, waiting for load event");
      map.current.once('load', onMapLoad);
    }

    // Re-render when tab changes - essential fix for disappearing polylines
    return () => {
      if (map.current) {
        console.log("Cleaning up secondary polyline effect");
        cleanupMapLayers(map.current, comparisonType);
        
        // Immediately re-add primary polyline to prevent it from disappearing
        if (coordinates.length > 0) {
          console.log("Re-adding primary polyline after cleanup");
          // Pass primary line styling from Index.tsx via MapContainer props
          addPrimaryPolyline(
            map.current, 
            coordinates, 
            false, 
            '#3b82f6',  // Default primary color 
            3,          // Default primary line width
            []          // Default solid line (empty array for no dash)
          );
        }
      }
    };
  }, [
    secondaryCoordinates, 
    comparisonMode, 
    comparisonType, 
    overlayOpacity, 
    showDivergence, 
    showIntersections, 
    splitViewActive,
    coordinates,
    map,
    isLoading,
    validSecondaryCoords,
    color,
    lineWidth,
    lineDash
  ]);
};
