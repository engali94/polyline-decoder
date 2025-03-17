import React, { useRef, useState, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import MapControls from './MapControls';
import StyleSelector from './StyleSelector';
import MapRenderers from './MapRenderers';
import { useMapStyles } from './MapStyleHooks';

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
  secondaryLineDash = []
}) => {
  const map = useRef<maplibregl.Map | null>(null);
  const secondMap = useRef<maplibregl.Map | null>(null);
  const [splitViewActive, setSplitViewActive] = useState(false);
  const [localComparisonType, setLocalComparisonType] = useState<'overlay' | 'sideBySide' | 'diff'>(comparisonType);
  const { styleOptions, setStyleOptions, currentStyleId, setCurrentStyleId } = useMapStyles();

  // Update local comparison type when prop changes
  useEffect(() => {
    setLocalComparisonType(comparisonType);
  }, [comparisonType]);

  // Toggle split view based on comparison type
  useEffect(() => {
    if (comparisonMode && localComparisonType === 'sideBySide') {
      console.log("Activating split view for side-by-side comparison");
      setSplitViewActive(true);
    } else {
      console.log("Deactivating split view");
      setSplitViewActive(false);
    }
  }, [comparisonMode, localComparisonType]);

  // Log props for debugging
  useEffect(() => {
    console.log("MapContainer props:", {
      coordinatesLength: coordinates.length,
      secondaryCoordinatesLength: secondaryCoordinates.length,
      comparisonMode,
      comparisonType: localComparisonType,
      splitViewActive,
      overlayOpacity,
      primaryColor,
      secondaryColor,
      primaryLineWidth,
      secondaryLineWidth,
      primaryLineDash,
      secondaryLineDash
    });
  }, [
    coordinates, 
    secondaryCoordinates, 
    comparisonMode, 
    localComparisonType, 
    splitViewActive, 
    overlayOpacity,
    primaryColor,
    secondaryColor,
    primaryLineWidth,
    secondaryLineWidth,
    primaryLineDash,
    secondaryLineDash
  ]);

  // Style handling for both maps
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

  // Force redraw on comparison changes
  useEffect(() => {
    const redrawTimeout = setTimeout(() => {
      // Force redraw by triggering a resize event
      if (map.current) {
        console.log("Forcing map redraw");
        map.current.resize();
      }
      if (secondMap.current) {
        console.log("Forcing second map redraw");
        secondMap.current.resize();
      }
    }, 200); // Slightly longer timeout for better rendering
    
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
    secondaryLineDash
  ]);

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
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        primaryLineWidth={primaryLineWidth}
        secondaryLineWidth={secondaryLineWidth}
        primaryLineDash={primaryLineDash}
        secondaryLineDash={secondaryLineDash}
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

export default MapContainer;
