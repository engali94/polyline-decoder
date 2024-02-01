
import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';

interface UseSideBySideViewProps {
  secondMap: React.MutableRefObject<maplibregl.Map | null>;
  secondaryCoordinates: [number, number][];
  splitViewActive: boolean;
  comparisonMode: boolean;
  validSecondaryCoords: boolean;
}

export const useSideBySideView = ({
  secondMap,
  secondaryCoordinates,
  splitViewActive,
  comparisonMode,
  validSecondaryCoords
}: UseSideBySideViewProps) => {
  
  useEffect(() => {
    console.log("Side-by-side effect triggered:", {
      hasSecondMap: !!secondMap.current,
      splitViewActive,
      comparisonMode,
      secondaryCoordinatesLength: secondaryCoordinates.length
    });

    if (!secondMap.current) return;
    if (!splitViewActive || !comparisonMode) return;
    if (!validSecondaryCoords) return;

    const addPolylinesToSecondMap = () => {
      console.log("Adding secondary polyline to second map:", secondaryCoordinates.length, "points");
      
      if (!secondMap.current) return;
      
      // Clean up any existing layers on second map
      try {
        if (secondMap.current.getSource('second-polyline-source')) {
          secondMap.current.removeLayer('second-polyline-layer');
          secondMap.current.removeSource('second-polyline-source');
        }
      } catch (error) {
        console.error("Error cleaning up second map:", error);
      }

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
            'line-width': 3
          }
        });
      } catch (error) {
        console.error("Error adding secondary polyline to second map:", error);
      }
    };

    // Add polylines to second map when it's loaded
    if (secondMap.current.loaded()) {
      addPolylinesToSecondMap();
    } else {
      console.log("Second map not loaded, waiting for load event");
      secondMap.current.once('load', addPolylinesToSecondMap);
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
  }, [secondaryCoordinates, splitViewActive, secondMap, comparisonMode, validSecondaryCoords]);
};
