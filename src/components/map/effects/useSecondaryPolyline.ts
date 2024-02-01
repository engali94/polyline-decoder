
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
  validSecondaryCoords
}: UseSecondaryPolylineProps) => {
  
  useEffect(() => {
    console.log("Secondary polyline effect triggered:", {
      hasMap: !!map.current,
      comparisonMode,
      comparisonType,
      coords: secondaryCoordinates.length,
      validSecondaryCoords,
      splitViewActive
    });

    if (!map.current || isLoading) return;
    if (!comparisonMode) return;
    if (!validSecondaryCoords) {
      console.warn("Secondary coordinates are invalid:", secondaryCoordinates);
      return;
    }
    if (comparisonType === 'sideBySide' && splitViewActive) {
      console.log("Skipping secondary polyline rendering in side-by-side view");
      return;
    }

    const onMapLoad = () => {
      // Clean up previous layers before adding new ones
      cleanupMapLayers(map.current!, comparisonType);
      
      console.log("Adding secondary polyline to map:", {
        comparisonType,
        overlayOpacity,
        coordCount: secondaryCoordinates.length
      });
      
      if (comparisonType === 'overlay') {
        addSecondaryPolyline(map.current!, secondaryCoordinates, overlayOpacity);
      } else if (comparisonType === 'diff') {
        // In diff mode, show both the secondary polyline and the analysis
        addSecondaryPolyline(map.current!, secondaryCoordinates, overlayOpacity);
        
        addDifferentialAnalysis(
          map.current!,
          coordinates, 
          secondaryCoordinates, 
          showDivergence, 
          showIntersections
        );
      }
    };

    if (map.current.loaded()) {
      onMapLoad();
    } else {
      console.log("Map not loaded, waiting for load event");
      map.current.once('load', onMapLoad);
    }

    // Re-render when tab changes - essential fix for disappearing polylines
    return () => {
      if (map.current) {
        cleanupMapLayers(map.current, comparisonType);
        // Immediately re-add primary polyline to prevent it from disappearing
        if (coordinates.length > 0) {
          addPrimaryPolyline(map.current, coordinates, false);
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
    validSecondaryCoords
  ]);
};
