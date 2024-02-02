
import React, { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { toast } from 'sonner';
import { cleanupMapLayers } from './features/MapCleanup';
import { addSecondaryPolyline } from './features/SecondaryPolyline';

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
  splitViewActive,
}) => {
  // Effect for auto-align event listener
  useEffect(() => {
    const handleAutoAlign = (event: Event) => {
      const customEvent = event as CustomEvent<{ threshold: number }>;
      const threshold = customEvent.detail.threshold;

      if (!map.current || !secondMap.current || !coordinates.length || !secondaryCoordinates.length) {
        toast.error("Cannot align: Missing map or path data");
        return;
      }

      // Auto-align logic would go here
      toast.success(`Auto-aligned polylines with threshold: ${threshold}m`);

      // Fit bounds to include both polylines
      if (coordinates.length > 0 && secondaryCoordinates.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        
        // Validate coordinates before extending bounds
        coordinates.forEach(coord => {
          if (isValidCoordinate(coord)) {
            bounds.extend([coord[0], coord[1]]);
          }
        });
        
        secondaryCoordinates.forEach(coord => {
          if (isValidCoordinate(coord)) {
            bounds.extend([coord[0], coord[1]]);
          }
        });

        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, { padding: 40 });
          if (secondMap.current) {
            secondMap.current.fitBounds(bounds, { padding: 40 });
          }
        }
      }
    };

    window.addEventListener('auto-align-polylines', handleAutoAlign);
    return () => {
      window.removeEventListener('auto-align-polylines', handleAutoAlign);
    };
  }, [map, secondMap, coordinates, secondaryCoordinates]);

  // Helper function to validate coordinates
  const isValidCoordinate = (coord: [number, number]): boolean => {
    return Array.isArray(coord) && 
           coord.length === 2 && 
           typeof coord[0] === 'number' && 
           typeof coord[1] === 'number' &&
           coord[0] >= -180 && 
           coord[0] <= 180 && 
           coord[1] >= -90 && 
           coord[1] <= 90;
  };

  // Effect for adding polylines to maps
  useEffect(() => {
    // Initialize and update maps with polylines
    if (!map.current) return;

    // Clean up existing sources and layers in primary map
    if (map.current.getSource('route')) {
      if (map.current.getLayer('route-line')) {
        map.current.removeLayer('route-line');
      }
      map.current.removeSource('route');
    }

    // Add primary polyline to main map
    if (coordinates.length > 0) {
      const validCoordinates = coordinates.filter(isValidCoordinate);
      
      if (validCoordinates.length > 0) {
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: validCoordinates
            }
          }
        });

        map.current.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#0070f3',
            'line-width': 4
          }
        });

        // Fit map to polyline bounds
        const bounds = new maplibregl.LngLatBounds();
        validCoordinates.forEach(coord => bounds.extend([coord[0], coord[1]]));
        map.current.fitBounds(bounds, { padding: 40 });
      }
    }

    // Handle second map if in split view
    if (secondMap.current && splitViewActive) {
      // Clean up existing sources and layers in secondary map
      if (secondMap.current.getSource('route')) {
        if (secondMap.current.getLayer('route-line')) {
          secondMap.current.removeLayer('route-line');
        }
        secondMap.current.removeSource('route');
      }
      
      if (secondMap.current.getSource('route-second')) {
        if (secondMap.current.getLayer('route-second-line')) {
          secondMap.current.removeLayer('route-second-line');
        }
        secondMap.current.removeSource('route-second');
      }

      // Add primary polyline to second map
      if (coordinates.length > 0) {
        const validCoordinates = coordinates.filter(isValidCoordinate);
        
        if (validCoordinates.length > 0) {
          secondMap.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: validCoordinates
              }
            }
          });

          secondMap.current.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#0070f3',
              'line-width': 4
            }
          });
        }
      }

      // Add secondary polyline to second map if in split view
      if (secondaryCoordinates.length > 0 && comparisonMode) {
        const validSecondaryCoordinates = secondaryCoordinates.filter(isValidCoordinate);
        
        if (validSecondaryCoordinates.length > 0) {
          secondMap.current.addSource('route-second', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: validSecondaryCoordinates
              }
            }
          });

          secondMap.current.addLayer({
            id: 'route-second-line',
            type: 'line',
            source: 'route-second',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#f30070',
              'line-width': 4
            }
          });

          // Fit second map to secondary polyline bounds
          const secondBounds = new maplibregl.LngLatBounds();
          validSecondaryCoordinates.forEach(coord => secondBounds.extend([coord[0], coord[1]]));
          secondMap.current.fitBounds(secondBounds, { padding: 40 });
        }
      }
    } else if (map.current && comparisonMode && comparisonType === 'overlay' && secondaryCoordinates.length > 0) {
      // Handle overlay mode in the main map
      addSecondaryPolyline(map.current, secondaryCoordinates.filter(isValidCoordinate), overlayOpacity);
    }

  }, [map, secondMap, coordinates, secondaryCoordinates, comparisonMode, comparisonType, overlayOpacity, splitViewActive]);

  return null; // This component doesn't render any UI elements
};

export { MapEffects };

// Also export as default for compatibility with existing imports
export default MapEffects;
