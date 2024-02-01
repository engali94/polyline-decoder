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
      secondaryCoordinatesLength: secondaryCoordinates.length,
      sampleCoords: secondaryCoordinates.slice(0, 2)
    });

    if (!secondMap.current) {
      console.log("No second map available");
      return;
    }
    
    if (!splitViewActive || !comparisonMode) {
      console.log("Split view or comparison mode not active");
      return;
    }
    
    if (!validSecondaryCoords) {
      console.log("Secondary coordinates are invalid");
      return;
    }

    const addPolylinesToSecondMap = () => {
      console.log("Adding secondary polyline to second map:", 
        secondaryCoordinates.length, "points",
        JSON.stringify(secondaryCoordinates.slice(0, 2)));
      
      if (!secondMap.current) return;
      
      // Clean up any existing layers on second map
      try {
        if (secondMap.current.getLayer('second-polyline-layer')) {
          secondMap.current.removeLayer('second-polyline-layer');
        }
        if (secondMap.current.getSource('second-polyline-source')) {
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
            'line-color': '#10b981', // Emerald green
            'line-width': 6,         // Wider line for better visibility
            'line-opacity': 1        // Full opacity
          }
        });

        // Add start and end markers
        if (secondaryCoordinates.length > 0) {
          new maplibregl.Marker({ color: '#10b981' }) // Green start marker
            .setLngLat(secondaryCoordinates[0])
            .addTo(secondMap.current);
            
          new maplibregl.Marker({ color: '#ef4444' }) // Red end marker
            .setLngLat(secondaryCoordinates[secondaryCoordinates.length - 1])
            .addTo(secondMap.current);
            
          console.log("Added markers at:", secondaryCoordinates[0], 
            "and", secondaryCoordinates[secondaryCoordinates.length - 1]);
        }
        
        console.log("✅ Successfully added secondary polyline to second map");
      } catch (error) {
        console.error("Error adding secondary polyline to second map:", error);
      }
    };

    // Attempt to add polyline immediately if map is loaded
    if (secondMap.current.loaded()) {
      addPolylinesToSecondMap();
    } else {
      // Otherwise wait for map to load
      console.log("Second map not loaded, waiting for load event");
      secondMap.current.once('load', addPolylinesToSecondMap);
    }

    // Cleanup function
    return () => {
      if (secondMap.current) {
        try {
          // Remove markers
          const markers = document.querySelectorAll('.maplibregl-marker');
          markers.forEach(marker => {
            if (marker.parentNode) {
              marker.parentNode.removeChild(marker);
            }
          });
          
          // Remove layer and source in correct order
          if (secondMap.current.getLayer('second-polyline-layer')) {
            secondMap.current.removeLayer('second-polyline-layer');
          }
          if (secondMap.current.getSource('second-polyline-source')) {
            secondMap.current.removeSource('second-polyline-source');
          }
        } catch (error) {
          console.error("Error in cleanup of second map effect:", error);
        }
      }
    };
  }, [secondaryCoordinates, splitViewActive, secondMap, comparisonMode, validSecondaryCoords]);
};
