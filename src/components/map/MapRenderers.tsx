
import React, { useRef, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { Split } from 'lucide-react';
import { StyleOption } from './StyleSelector';
import { MapEffects } from './MapEffects';
import { addPrimaryPolyline } from './features/PrimaryPolyline';
import { addSecondaryPolyline } from './features/SecondaryPolyline';
import { toast } from 'sonner';

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
  secondMap
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const secondMapContainer = useRef<HTMLDivElement>(null);

  // Initialize primary map
  useEffect(() => {
    if (!mapContainer.current) return;

    const currentStyle = styleOptions.find(style => style.id === currentStyleId);
    if (!currentStyle) return;

    console.log("Initializing primary map with style:", currentStyle.id);
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: currentStyle.url,
      center: [-74.5, 40],
      zoom: 2,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    // Add polylines once map is loaded
    map.current.on('load', () => {
      console.log("Primary map loaded - adding polylines");
      if (coordinates.length > 0) {
        addPrimaryPolyline(map.current, coordinates, isLoading);
      }
      
      if (comparisonMode && comparisonType === 'overlay' && secondaryCoordinates.length > 0) {
        addSecondaryPolyline(map.current, secondaryCoordinates, overlayOpacity);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [styleOptions.length, currentStyleId]);

  // Initialize secondary map for side-by-side view
  useEffect(() => {
    console.log("Split view active changed:", splitViewActive);
    
    if (!splitViewActive || !secondMapContainer.current) {
      // Clean up second map if split view is deactivated
      if (secondMap.current) {
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

    // Add polylines once second map is loaded
    secondMap.current.on('load', () => {
      console.log("Second map loaded - adding secondary polyline");
      if (secondaryCoordinates.length > 0) {
        try {
          // Use primary polyline rendering function but with secondary coordinates
          addPrimaryPolyline(secondMap.current, secondaryCoordinates, isLoading);
          toast.success("Secondary route loaded in side-by-side view");
        } catch (err) {
          console.error("Error adding polyline to second map:", err);
          toast.error("Failed to render secondary route");
        }
      } else {
        console.warn("No secondary coordinates available for second map");
      }
    });

    // Sync maps for navigation
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

    return () => {
      if (secondMap.current) {
        secondMap.current.remove();
        secondMap.current = null;
      }
    };
  }, [splitViewActive, styleOptions.length, currentStyleId, secondaryCoordinates]);

  // Log props for debugging
  useEffect(() => {
    console.log("MapRenderers props:", {
      primaryCoordinates: coordinates.length,
      secondaryCoordinates: secondaryCoordinates.length,
      comparisonMode,
      comparisonType,
      splitViewActive
    });
  }, [coordinates, secondaryCoordinates, comparisonMode, comparisonType, splitViewActive]);

  return (
    <>
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
