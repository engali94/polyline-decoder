import React, { useRef, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { Split } from 'lucide-react';
import { StyleOption } from './StyleSelector';
import MapEffects from './MapEffects';  // Using default import

interface MapRenderersProps {
  coordinates: [number, number][];
  secondaryCoordinates: [number, number][];
  isLoading: boolean;
  comparisonMode: boolean;
  comparisonType: 'overlay' | 'sideBySide' | 'diff';
  overlayOpacity: number;
  showDivergence: boolean;
  showIntersections: boolean;
  splitViewActive: boolean;
  styleOptions: StyleOption[];
  currentStyleId: string;
  map: React.MutableRefObject<maplibregl.Map | null>;
  secondMap: React.MutableRefObject<maplibregl.Map | null>;
  primaryColor: string;
  secondaryColor: string;
  primaryLineWidth: number;
  secondaryLineWidth: number;
  primaryLineDash: number[];
  secondaryLineDash: number[];
}

const MapRenderers: React.FC<MapRenderersProps> = ({
  coordinates,
  secondaryCoordinates,
  isLoading,
  comparisonMode,
  comparisonType,
  overlayOpacity,
  showDivergence,
  showIntersections,
  splitViewActive,
  styleOptions,
  currentStyleId,
  map,
  secondMap,
  primaryColor,
  secondaryColor,
  primaryLineWidth,
  secondaryLineWidth,
  primaryLineDash,
  secondaryLineDash
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const secondMapContainer = useRef<HTMLDivElement>(null);

  // Initialize primary map
  useEffect(() => {
    if (!mapContainer.current) return;

    const currentStyle = styleOptions.find(style => style.id === currentStyleId);
    if (!currentStyle) return;

    console.log("Initializing primary map");
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: currentStyle.url,
      center: [-74.5, 40],
      zoom: 2,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [styleOptions.length, map, currentStyleId]);

  // Initialize secondary map for side-by-side view
  useEffect(() => {
    console.log("Split view active changed:", splitViewActive, "Comparison mode:", comparisonMode);
    
    if (!splitViewActive || !secondMapContainer.current) {
      // Clean up second map if split view is deactivated
      if (secondMap.current) {
        console.log("Removing second map as split view is deactivated");
        secondMap.current.remove();
        secondMap.current = null;
      }
      return;
    }

    const currentStyle = styleOptions.find(style => style.id === currentStyleId);
    if (!currentStyle) return;

    console.log("Creating second map for side-by-side view");
    
    secondMap.current = new maplibregl.Map({
      container: secondMapContainer.current,
      style: currentStyle.url,
      center: [-74.5, 40],
      zoom: 2,
      attributionControl: false
    });

    secondMap.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    const syncMaps = (sourceMap: maplibregl.Map, targetMap: maplibregl.Map) => {
      sourceMap.on('move', () => {
        if (targetMap.getCenter().toString() === sourceMap.getCenter().toString()) {
          return;
        }
        targetMap.setCenter(sourceMap.getCenter());
        targetMap.setZoom(sourceMap.getZoom());
        targetMap.setBearing(sourceMap.getBearing());
        targetMap.setPitch(sourceMap.getPitch());
      });
    };

    if (map.current) {
      syncMaps(map.current, secondMap.current);
      syncMaps(secondMap.current, map.current);
    }

    // Force initial second map render
    setTimeout(() => {
      if (secondMap.current) {
        secondMap.current.resize();
      }
    }, 100);

    return () => {
      if (secondMap.current) {
        secondMap.current.remove();
        secondMap.current = null;
      }
    };
  }, [splitViewActive, styleOptions.length, map, secondMap, currentStyleId]);

  return (
    <>
      <MapEffects
        map={map}
        secondMap={secondMap}
        coordinates={coordinates}
        secondaryCoordinates={secondaryCoordinates}
        isLoading={isLoading}
        comparisonMode={comparisonMode}
        comparisonType={comparisonType}
        overlayOpacity={overlayOpacity}
        showDivergence={showDivergence}
        showIntersections={showIntersections}
        splitViewActive={splitViewActive}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        primaryLineWidth={primaryLineWidth}
        secondaryLineWidth={secondaryLineWidth}
        primaryLineDash={primaryLineDash}
        secondaryLineDash={secondaryLineDash}
      />
      
      <div className={`h-full w-full ${splitViewActive ? 'hidden md:block md:w-1/2 md:pr-1' : ''}`}>
        <div ref={mapContainer} className="map-container h-full w-full" />
      </div>
      
      {splitViewActive && (
        <div className="h-full md:absolute md:right-0 md:top-0 md:w-1/2 md:pl-1">
          <div ref={secondMapContainer} className="map-container h-full w-full" />
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Split className="h-6 w-6 text-primary-foreground opacity-70" />
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="animate-pulse text-primary">Loading map data...</div>
        </div>
      )}
    </>
  );
};

export default MapRenderers;
