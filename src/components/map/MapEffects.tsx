
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

    return () => {
      if (map.current) {
        cleanupMapLayers(map.current, comparisonType);
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
    if (!secondMap.current || isLoading) return;
    if (!comparisonMode || !secondaryCoordinates.length) return;
    if (!splitViewActive) return;

    const onMapLoad = () => {
      // Clean up before adding new secondary polyline
      if (secondMap.current?.getSource('second-polyline-source')) {
        secondMap.current.removeLayer('second-polyline-layer');
        secondMap.current.removeSource('second-polyline-source');
      }
      
      // Add secondary polyline to the second map
      secondMap.current?.addSource('second-polyline-source', {
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

      secondMap.current?.addLayer({
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

    if (secondMap.current.loaded()) {
      onMapLoad();
    } else {
      secondMap.current.once('load', onMapLoad);
    }

    return () => {
      if (secondMap.current?.getSource('second-polyline-source')) {
        secondMap.current.removeLayer('second-polyline-layer');
        secondMap.current.removeSource('second-polyline-source');
      }
    };
  }, [secondaryCoordinates, splitViewActive, secondMap, isLoading, comparisonMode]);

  return null;
};

export default MapEffects;
