
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
    if (!map.current || isLoading || !comparisonMode || !secondaryCoordinates.length) return;
    if (comparisonType === 'sideBySide' && splitViewActive) return;

    const onMapLoad = () => {
      cleanupMapLayers(map.current, comparisonType);
      
      if (comparisonType === 'overlay') {
        addSecondaryPolyline(map.current!, secondaryCoordinates, overlayOpacity);
      } else if (comparisonType === 'diff') {
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
    map
  ]);

  // Second map effect for side-by-side view
  useEffect(() => {
    if (!secondMap.current || isLoading || !splitViewActive) return;

    const onMapLoad = () => {
      if (secondaryCoordinates.length > 0) {
        const sourceId = 'second-primary-polyline-source';
        const layerId = 'second-primary-polyline-layer';

        if (secondMap.current?.getSource(sourceId)) {
          secondMap.current.removeLayer(layerId);
          secondMap.current.removeSource(sourceId);
        }

        secondMap.current?.addSource(sourceId, {
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
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#10b981',
            'line-width': 3
          }
        });
      }
    };

    if (secondMap.current.loaded()) {
      onMapLoad();
    } else {
      secondMap.current.once('load', onMapLoad);
    }

    return () => {
      if (secondMap.current?.getSource('second-primary-polyline-source')) {
        secondMap.current.removeLayer('second-primary-polyline-layer');
        secondMap.current.removeSource('second-primary-polyline-source');
      }
    };
  }, [secondaryCoordinates, splitViewActive, secondMap, isLoading]);

  return null;
};

export default MapEffects;
