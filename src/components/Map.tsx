
import React, { useRef, useState, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapControls from './map/MapControls';
import StyleSelector, { StyleOption } from './map/StyleSelector';
import MapRenderers from './map/MapRenderers';
import { useMapStyles } from './map/MapStyleHooks';
import { 
  addPrimaryPolyline, 
  addSecondaryPolyline, 
  addDifferentialAnalysis,
  cleanupMapLayers
} from './map/MapFeatures';

interface MapProps {
  coordinates: [number, number][];
  secondaryCoordinates?: [number, number][];
  isLoading?: boolean;
  comparisonMode?: boolean;
  comparisonType?: 'overlay' | 'sideBySide' | 'diff';
  overlayOpacity?: number;
  showDivergence?: boolean;
  showIntersections?: boolean;
}

const Map: React.FC<MapProps> = ({ 
  coordinates, 
  secondaryCoordinates = [], 
  isLoading = false,
  comparisonMode = false,
  comparisonType = 'overlay',
  overlayOpacity = 50,
  showDivergence = true,
  showIntersections = true
}) => {
  const map = useRef<maplibregl.Map | null>(null);
  const secondMap = useRef<maplibregl.Map | null>(null);
  const [splitViewActive, setSplitViewActive] = useState(false);
  const [localComparisonType, setLocalComparisonType] = useState<'overlay' | 'sideBySide' | 'diff'>(comparisonType);
  const { styleOptions, setStyleOptions, currentStyleId, setCurrentStyleId } = useMapStyles();

  useEffect(() => {
    setLocalComparisonType(comparisonType);
  }, [comparisonType]);

  useEffect(() => {
    if (comparisonMode && localComparisonType === 'sideBySide') {
      setSplitViewActive(true);
    } else {
      setSplitViewActive(false);
    }
  }, [comparisonMode, localComparisonType]);

  useEffect(() => {
    if (map.current && styleOptions.length > 0) {
      const currentStyle = styleOptions.find(style => style.id === currentStyleId);
      if (currentStyle) {
        try {
          map.current.setStyle(currentStyle.url);
        } catch (error) {
          console.error('Error setting map style:', error);
        }
      }
    }

    if (secondMap.current && styleOptions.length > 0) {
      const currentStyle = styleOptions.find(style => style.id === currentStyleId);
      if (currentStyle) {
        try {
          secondMap.current.setStyle(currentStyle.url);
        } catch (error) {
          console.error('Error setting map style for second map:', error);
        }
      }
    }
  }, [currentStyleId, styleOptions]);

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
  }, [coordinates, isLoading]);

  useEffect(() => {
    if (!map.current || isLoading || !comparisonMode || !secondaryCoordinates.length) return;
    if (localComparisonType === 'sideBySide' && splitViewActive) return;

    const onMapLoad = () => {
      cleanupMapLayers(map.current, localComparisonType);
      
      if (localComparisonType === 'overlay') {
        addSecondaryPolyline(map.current!, secondaryCoordinates, overlayOpacity);
      } else if (localComparisonType === 'diff') {
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
        cleanupMapLayers(map.current, localComparisonType);
      }
    };
  }, [
    secondaryCoordinates, 
    comparisonMode, 
    localComparisonType, 
    overlayOpacity, 
    showDivergence, 
    showIntersections, 
    splitViewActive,
    coordinates
  ]);

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
  }, [secondaryCoordinates, splitViewActive]);

  return (
    <div className="relative h-full w-full animate-fade-in">
      <MapRenderers
        coordinates={coordinates}
        secondaryCoordinates={secondaryCoordinates}
        isLoading={isLoading}
        comparisonMode={comparisonMode}
        comparisonType={localComparisonType}
        overlayOpacity={overlayOpacity}
        showDivergence={showDivergence}
        showIntersections={showIntersections}
        splitViewActive={splitViewActive}
        styleOptions={styleOptions}
        currentStyleId={currentStyleId}
        map={map}
        secondMap={secondMap}
      />
      
      <MapControls
        comparisonMode={comparisonMode}
        comparisonType={localComparisonType}
        splitViewActive={splitViewActive}
        setSplitViewActive={setSplitViewActive}
        setComparisonType={setLocalComparisonType}
      />
      
      <StyleSelector
        styleOptions={styleOptions}
        currentStyleId={currentStyleId}
        setCurrentStyleId={setCurrentStyleId}
        setStyleOptions={setStyleOptions}
      />
    </div>
  );
};

export default Map;
