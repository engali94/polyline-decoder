
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
    if (!secondMap.current) return;
    if (!splitViewActive || !comparisonMode) return;
    if (secondaryCoordinates.length === 0) return;

    console.log("Initializing side-by-side view", {
      hasSecondMap: !!secondMap.current,
      splitViewActive,
      comparisonType,
      secondaryCoordinatesLength: secondaryCoordinates.length
    });

    const addPolylinesToSecondMap = () => {
      if (!secondMap.current || !secondMap.current.loaded()) {
        console.log("Second map not loaded yet, will retry");
        setTimeout(() => addPolylinesToSecondMap(), 100);
        return;
      }

      try {
        // Clean up any existing layers on second map
        if (secondMap.current.getSource('second-polyline-source')) {
          secondMap.current.removeLayer('second-polyline-layer');
          secondMap.current.removeSource('second-polyline-source');
        }
        
        // Remove any markers that might exist
        const markers = document.querySelectorAll('.maplibregl-marker');
        markers.forEach(marker => {
          if (marker.parentElement && marker.parentElement.classList.contains('map-container') && 
              !marker.parentElement.isEqualNode(map.current?.getContainer())) {
            marker.remove();
          }
        });
        
        console.log("Adding secondary polyline to second map:", secondaryCoordinates.length);
        
        // Add the secondary polyline to the second map
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
        
        // Add markers at start and end of route for better visibility
        if (secondaryCoordinates.length >= 2) {
          // Start marker (green)
          new maplibregl.Marker({color: '#10b981'})
            .setLngLat(secondaryCoordinates[0])
            .addTo(secondMap.current);
          
          // End marker (red)
          new maplibregl.Marker({color: '#ef4444'})
            .setLngLat(secondaryCoordinates[secondaryCoordinates.length - 1])
            .addTo(secondMap.current);
          
          console.log("Added start/end markers to second map");
        }
        
        // Create bounds for the second map
        if (secondaryCoordinates.length > 1) {
          const bounds = new maplibregl.LngLatBounds();
          let validCoords = false;
          
          for (const coord of secondaryCoordinates) {
            if (Array.isArray(coord) && coord.length === 2 && 
                !isNaN(coord[0]) && !isNaN(coord[1]) &&
                Math.abs(coord[0]) <= 180 && Math.abs(coord[1]) <= 90) {
              bounds.extend(coord as [number, number]);
              validCoords = true;
            }
          }
          
          if (validCoords) {
            console.log("Fitting second map to bounds:", bounds.toString());
            secondMap.current.fitBounds(bounds, {
              padding: 50,
              maxZoom: 15,
              duration: 500
            });
          }
        }
      } catch (error) {
        console.error("Error in side-by-side view:", error);
      }
    };

    // Use timeout to ensure the map is fully loaded
    setTimeout(addPolylinesToSecondMap, 300);

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
  }, [secondaryCoordinates, secondMap, splitViewActive, comparisonMode, comparisonType]);

  return null;
};

export default MapEffects;
