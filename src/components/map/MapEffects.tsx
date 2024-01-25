
import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { 
  addPrimaryPolyline, 
  addSecondaryPolyline, 
  addDifferentialAnalysis,
  cleanupMapLayers
} from './features';

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

const MapEffects: React.FC<MapEffectsProps> = ({
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
}) => {
  // Primary polyline effect
  useEffect(() => {
    if (!map.current || isLoading) return;

    const onMapLoad = () => {
      addPrimaryPolyline(map.current!, coordinates, isLoading);
    };

    if (map.current.loaded()) {
      onMapLoad();
    } else {
      map.current.once('load', onMapLoad);
    }
  }, [coordinates, isLoading, map]);

  // Secondary polyline and comparison mode effects
  useEffect(() => {
    if (!map.current || isLoading) return;
    if (!comparisonMode || !secondaryCoordinates.length) return;
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
    isLoading
  ]);

  // Second map effect for side-by-side view
  useEffect(() => {
    console.log("Side-by-side effect triggered:", {
      hasSecondMap: !!secondMap.current,
      splitViewActive,
      comparisonMode,
      coordinatesLength: coordinates.length,
      secondaryCoordinatesLength: secondaryCoordinates.length
    });

    if (!secondMap.current) return;
    if (!splitViewActive || !comparisonMode) return;
    if (secondaryCoordinates.length === 0) return;

    const addPolylinesToMaps = () => {
      console.log("Adding polylines to maps in side-by-side view");
      
      // Add primary polyline to first map
      if (map.current && map.current.loaded()) {
        addPrimaryPolyline(map.current, coordinates, false);
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
      
      if (!secondMap.current) return;
      
      console.log("Adding secondary polyline to second map:", secondaryCoordinates.length, "points");

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
          'line-width': 3
        }
      });
    };

    // Add polylines to both maps when they're loaded
    if (secondMap.current.loaded()) {
      addPolylinesToMaps();
    } else {
      console.log("Second map not loaded, waiting for load event");
      secondMap.current.once('load', addPolylinesToMaps);
    }

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
  }, [secondaryCoordinates, coordinates, splitViewActive, secondMap, map, comparisonMode]);

  return null;
};

export default MapEffects;
