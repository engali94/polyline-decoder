
import { useEffect, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import { 
  addPrimaryPolyline, 
  addSecondaryPolyline, 
  addDifferentialAnalysis,
  cleanupMapLayers
} from './features';
import { toast } from 'sonner';

interface MapEffectsProps {
  map: React.MutableRefObject<maplibregl.Map | null>;
  secondMap: React.MutableRefObject<maplibregl.Map | null>;
  coordinates: [number, number][];
  secondaryCoordinates: [number, number][];
  isLoading: boolean;
  comparisonMode: boolean;
  comparisonType: 'overlay' | 'sideBySide' | 'diff';
  overlayOpacity: number;
  showDivergence: boolean;
  showIntersections: boolean;
  splitViewActive: boolean;
}

const MapEffects = ({
  map,
  secondMap,
  coordinates,
  secondaryCoordinates,
  isLoading,
  comparisonMode,
  comparisonType,
  overlayOpacity,
  showDivergence,
  showIntersections,
  splitViewActive
}: MapEffectsProps) => {
  // Validate coordinates to prevent map errors
  const validCoordinates = coordinates && coordinates.length > 0 && 
    coordinates.every(coord => Array.isArray(coord) && coord.length === 2);
  
  const validSecondaryCoords = secondaryCoordinates && secondaryCoordinates.length > 0 && 
    secondaryCoordinates.every(coord => Array.isArray(coord) && coord.length === 2);

  // Auto-alignment handler
  const handleAutoAlign = useCallback((event: CustomEvent) => {
    if (!map.current || !secondMap.current) return;
    if (comparisonType !== 'sideBySide' || !splitViewActive) return;
    
    const threshold = event.detail?.threshold || 20;
    
    try {
      // Check if both maps have valid sources
      const primarySource = map.current.getSource('polyline-source');
      const secondarySource = secondMap.current.getSource('second-polyline-source');
      
      if (!primarySource || !secondarySource) {
        console.warn('Cannot auto-align: One or both sources are missing');
        return;
      }
      
      // Create bounds with all coordinates
      const bounds = new maplibregl.LngLatBounds();
      
      // Add primary coordinates to bounds
      if (validCoordinates) {
        coordinates.forEach(coord => bounds.extend(coord as maplibregl.LngLatLike));
      }
      
      // Add secondary coordinates to bounds
      if (validSecondaryCoords) {
        secondaryCoordinates.forEach(coord => bounds.extend(coord as maplibregl.LngLatLike));
      }
      
      // Only proceed if bounds are valid
      if (bounds.isEmpty()) {
        toast.error('Cannot align: No valid coordinates');
        return;
      }
      
      // Fit both maps to the same bounds
      const options = { 
        padding: 50, 
        maxZoom: 16,
        duration: 800
      };
      
      map.current.fitBounds(bounds, options);
      secondMap.current.fitBounds(bounds, options);
      
      toast.success('Maps aligned successfully');
    } catch (error) {
      console.error('Auto-alignment error:', error);
      toast.error('Error aligning maps');
    }
  }, [map, secondMap, coordinates, secondaryCoordinates, comparisonType, splitViewActive]);

  // Set up auto-align event listener
  useEffect(() => {
    window.addEventListener('auto-align-maps', handleAutoAlign as EventListener);
    return () => {
      window.removeEventListener('auto-align-maps', handleAutoAlign as EventListener);
    };
  }, [handleAutoAlign]);

  // Primary polyline effect
  useEffect(() => {
    if (!map.current || isLoading || !validCoordinates) return;

    const onMapLoad = () => {
      addPrimaryPolyline(map.current!, coordinates, isLoading);
    };

    if (map.current.loaded()) {
      onMapLoad();
    } else {
      map.current.once('load', onMapLoad);
    }
  }, [coordinates, isLoading, map, validCoordinates]);

  // Secondary polyline and comparison mode effects for main map
  useEffect(() => {
    console.log("Comparison effect triggered:", {
      hasMap: !!map.current,
      comparisonMode,
      comparisonType,
      secondaryCoords: secondaryCoordinates.length,
      validSecondaryCoords,
      splitViewActive
    });

    if (!map.current || isLoading) return;
    if (!comparisonMode || !validSecondaryCoords) return;
    if (comparisonType === 'sideBySide' && splitViewActive) return;

    const onMapLoad = () => {
      // Clean up previous layers before adding new ones
      cleanupMapLayers(map.current!, comparisonType);
      
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
      map.current.once('load', onMapLoad);
    }

    // Re-render when tab changes - essential fix for disappearing polylines
    return () => {
      if (map.current) {
        cleanupMapLayers(map.current, comparisonType);
        // Immediately re-add primary polyline to prevent it from disappearing
        if (validCoordinates) {
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
    validCoordinates,
    validSecondaryCoords
  ]);

  // Second map effect for side-by-side view
  useEffect(() => {
    console.log("Side-by-side effect triggered:", {
      hasSecondMap: !!secondMap.current,
      splitViewActive,
      comparisonMode,
      comparisonType,
      coordinatesLength: coordinates.length,
      secondaryCoordinatesLength: secondaryCoordinates.length,
      validSecondaryCoords
    });

    if (!secondMap.current) return;
    if (!splitViewActive || !comparisonMode || comparisonType !== 'sideBySide') return;
    if (!validSecondaryCoords) return;

    const addPolylinesToMaps = () => {
      console.log("Adding polylines to maps in side-by-side view");
      
      // Add primary polyline to first map
      if (map.current && validCoordinates) {
        if (map.current.loaded()) {
          addPrimaryPolyline(map.current, coordinates, false);
        } else {
          map.current.once('load', () => {
            addPrimaryPolyline(map.current!, coordinates, false);
          });
        }
      }
      
      // Clear any existing layers on second map
      try {
        if (secondMap.current && secondMap.current.getSource('second-polyline-source')) {
          secondMap.current.removeLayer('second-polyline-layer');
          secondMap.current.removeSource('second-polyline-source');
        }
      } catch (error) {
        console.error("Error cleaning up second map:", error);
      }
      
      if (!secondMap.current || !validSecondaryCoords) return;
      
      // Add second polyline to second map
      if (secondMap.current.loaded()) {
        addSecondPolyline();
      } else {
        secondMap.current.once('load', addSecondPolyline);
      }
    };
    
    const addSecondPolyline = () => {
      if (!secondMap.current) return;
      
      console.log("Adding secondary polyline to second map:", secondaryCoordinates.length, "points");
      
      try {
        // Add the GeoJSON source for the secondary polyline
        secondMap.current.addSource('second-polyline-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: secondaryCoordinates
            }
          }
        });

        // Add the line layer for the secondary polyline
        secondMap.current.addLayer({
          id: 'second-polyline-layer',
          type: 'line',
          source: 'second-polyline-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#10b981',
            'line-width': 4
          }
        });
        
        console.log("Secondary polyline added to second map successfully");
      } catch (error) {
        console.error("Error adding secondary polyline to second map:", error);
      }
    };

    // Add polylines to both maps
    addPolylinesToMaps();

    // Cleanup function
    return () => {
      if (secondMap.current) {
        try {
          if (secondMap.current.getSource('second-polyline-source')) {
            secondMap.current.removeLayer('second-polyline-layer');
            secondMap.current.removeSource('second-polyline-source');
          }
        } catch (error) {
          console.error("Error in cleanup of second map effect:", error);
        }
      }
    };
  }, [
    secondaryCoordinates, 
    coordinates, 
    splitViewActive, 
    secondMap, 
    map, 
    comparisonMode,
    comparisonType,
    validCoordinates,
    validSecondaryCoords
  ]);

  return null;
};

// Export as both named and default export to ensure compatibility
export { MapEffects };
export default MapEffects;
