import React, { useRef, useState, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import MapControls from './MapControls';
import StyleSelector from './StyleSelector';
import MapRenderers from './MapRenderers';
import { useMapStyles } from './MapStyleHooks';
import { Link, Unlink } from 'lucide-react';

interface MapProps {
  coordinates: [number, number][];
  secondaryCoordinates?: [number, number][];
  isLoading?: boolean;
  comparisonMode?: boolean;
  comparisonType?: 'overlay' | 'sideBySide' | 'diff';
  overlayOpacity?: number;
  showDivergence?: boolean;
  showIntersections?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLineWidth?: number;
  secondaryLineWidth?: number;
  primaryLineDash?: number[];
  secondaryLineDash?: number[];
}

const MapContainer: React.FC<MapProps> = ({
  coordinates,
  secondaryCoordinates = [],
  isLoading = false,
  comparisonMode = false,
  comparisonType = 'overlay',
  overlayOpacity = 50,
  showDivergence = true,
  showIntersections = true,
  primaryColor = '#3b82f6',
  secondaryColor = '#10b981',
  primaryLineWidth = 3,
  secondaryLineWidth = 3,
  primaryLineDash = [],
  secondaryLineDash = [],
}) => {
  const map = useRef<maplibregl.Map | null>(null);
  const secondMap = useRef<maplibregl.Map | null>(null);
  const [splitViewActive, setSplitViewActive] = useState(false);
  const [syncMaps, setSyncMaps] = useState(false);
  const [localComparisonType, setLocalComparisonType] = useState<'overlay' | 'sideBySide' | 'diff'>(
    comparisonType
  );
  const { styleOptions, setStyleOptions, currentStyleId, setCurrentStyleId } = useMapStyles();

  useEffect(() => {
    setLocalComparisonType(comparisonType);
  }, [comparisonType]);

  useEffect(() => {
    if (comparisonMode && localComparisonType === 'sideBySide') {
      console.log('Activating split view for side-by-side comparison');
      setSplitViewActive(true);
    } else {
      console.log('Deactivating split view');
      setSplitViewActive(false);
    }
  }, [comparisonMode, localComparisonType]);

  useEffect(() => {
    console.log('MapContainer props:', {
      coordinatesLength: coordinates.length,
      secondaryCoordinatesLength: secondaryCoordinates.length,
      comparisonMode,
      comparisonType: localComparisonType,
      splitViewActive,
      syncMaps,
      overlayOpacity,
      primaryColor,
      secondaryColor,
      primaryLineWidth,
      secondaryLineWidth,
      primaryLineDash,
      secondaryLineDash,
    });
  }, [
    coordinates,
    secondaryCoordinates,
    comparisonMode,
    localComparisonType,
    splitViewActive,
    syncMaps,
    overlayOpacity,
    primaryColor,
    secondaryColor,
    primaryLineWidth,
    secondaryLineWidth,
    primaryLineDash,
    secondaryLineDash,
  ]);

  const toggleMapSync = () => {
    setSyncMaps(prev => !prev);
    console.log('Toggled map synchronization:', !syncMaps);
  };

  useEffect(() => {
    if (!map.current || coordinates.length === 0) return;

    console.log('Forcing fit to bounds on coordinates');
    
    const onMapLoad = () => {
      const fitMapToBounds = () => {
        try {
          const bounds = new maplibregl.LngLatBounds();
          coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
          
          if (!bounds.isEmpty()) {
            console.log('Fitting to bounds on initial render');
            map.current!.fitBounds(bounds, {
              padding: 50,
              maxZoom: 15,
              duration: 0 // Fast rendering without animation
            });
          }
        } catch (error) {
          console.error('Error fitting to bounds:', error);
        }
      };
      
      fitMapToBounds();
      setTimeout(fitMapToBounds, 100);
    };
    
    if (map.current.loaded()) {
      onMapLoad();
    } else {
      map.current.once('load', onMapLoad);
    }
  }, [coordinates.length]);

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
    const redrawTimeout = setTimeout(() => {
      if (map.current) {
        console.log('Forcing map redraw');
        map.current.resize();
      }
      if (secondMap.current) {
        console.log('Forcing second map redraw');
        secondMap.current.resize();
      }
    }, 200);

    return () => clearTimeout(redrawTimeout);
  }, [
    comparisonMode,
    comparisonType,
    secondaryCoordinates,
    overlayOpacity,
    splitViewActive,
    primaryColor,
    secondaryColor,
    primaryLineWidth,
    secondaryLineWidth,
    primaryLineDash,
    secondaryLineDash,
  ]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <MapControls
        comparisonMode={comparisonMode}
        comparisonType={localComparisonType}
        splitViewActive={splitViewActive}
        setSplitViewActive={setSplitViewActive}
        setComparisonType={setLocalComparisonType}
      />

      {splitViewActive && (
        <div className="glass absolute right-20 top-4 z-10 rounded-lg p-2">
          <button
            onClick={toggleMapSync}
            className={`rounded-md p-1.5 ${
              syncMaps ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'
            } transition-colors hover:bg-opacity-90`}
            title={syncMaps ? "Unlink maps (independent control)" : "Link maps (synchronized control)"}
          >
            {syncMaps ? <Link className="h-4 w-4" /> : <Unlink className="h-4 w-4" />}
          </button>
        </div>
      )}

      <StyleSelector
        currentStyleId={currentStyleId}
        setCurrentStyleId={setCurrentStyleId}
        styleOptions={styleOptions}
        setStyleOptions={setStyleOptions}
      />

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
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        primaryLineWidth={primaryLineWidth}
        secondaryLineWidth={secondaryLineWidth}
        primaryLineDash={primaryLineDash}
        secondaryLineDash={secondaryLineDash}
        syncMaps={syncMaps}
      />
    </div>
  );
};

export default MapContainer;
