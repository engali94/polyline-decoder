
import React, { useRef, useState, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapStyles, loadCustomStyles } from '../utils/mapStyles';
import { Split } from 'lucide-react';
import MapControls from './map/MapControls';
import StyleSelector, { StyleOption } from './map/StyleSelector';
import MapRenderers from './map/MapRenderers';
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
  const [styleOptions, setStyleOptions] = useState<StyleOption[]>([]);
  const [currentStyleId, setCurrentStyleId] = useState<string>('osm');
  const [splitViewActive, setSplitViewActive] = useState(false);

  // Load map styles (built-in + custom)
  useEffect(() => {
    const builtInStyles = Object.entries(mapStyles).map(([id, style]) => ({
      id,
      name: style.name,
      url: style.url
    }));
    
    const customStyles = Object.entries(loadCustomStyles()).map(([id, style]) => ({
      id,
      name: style.name,
      url: style.url,
      isCustom: true
    }));
    
    setStyleOptions([...builtInStyles, ...customStyles]);
  }, []);

  // Handle comparison mode changes
  useEffect(() => {
    if (comparisonMode && comparisonType === 'sideBySide') {
      setSplitViewActive(true);
    } else {
      setSplitViewActive(false);
    }
  }, [comparisonMode, comparisonType]);

  // Update map styles when style selection changes
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

  // Add primary polyline to map
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

  // Add secondary polyline for comparison
  useEffect(() => {
    if (!map.current || isLoading || !comparisonMode || !secondaryCoordinates.length) return;
    if (comparisonType === 'sideBySide' && splitViewActive) return;

    const onMapLoad = () => {
      addSecondaryPolyline(map.current!, secondaryCoordinates, overlayOpacity);

      if (comparisonType === 'diff') {
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
      cleanupMapLayers(map.current, comparisonType);
    };
  }, [
    secondaryCoordinates, 
    comparisonMode, 
    comparisonType, 
    overlayOpacity, 
    showDivergence, 
    showIntersections, 
    splitViewActive,
    coordinates
  ]);

  // Add secondary polyline to second map in split view
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
        comparisonType={comparisonType}
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
        splitViewActive={splitViewActive}
        setSplitViewActive={setSplitViewActive}
        setComparisonType={(type) => {}}  // This is a placeholder as the prop is handled at a higher level
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
