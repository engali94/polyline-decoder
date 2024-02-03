
import React, { useRef, useState, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import MapControls from './MapControls';
import StyleSelector from './StyleSelector';
import MapRenderers from './MapRenderers';
import { useMapStyles } from './MapStyleHooks';
import { toast } from 'sonner';

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

const MapContainer: React.FC<MapProps> = ({ 
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
      if (splitViewActive) {
        console.log("Deactivating split view");
      }
      setSplitViewActive(false);
    }
  }, [comparisonMode, localComparisonType]);

  // Handle comparison type changes with better feedback
  const handleComparisonTypeChange = (type: 'overlay' | 'sideBySide' | 'diff') => {
    console.log("Comparison type changed to:", type);
    setLocalComparisonType(type);
    
    if (type === 'sideBySide') {
      if (secondaryCoordinates.length === 0) {
        toast.error("Side-by-side view requires secondary coordinates");
      } else {
        toast.success("Side-by-side comparison activated");
      }
    }
  };

  // Log props for debugging
  useEffect(() => {
    console.log("MapContainer props:", {
      coordinatesLength: coordinates.length,
      secondaryCoordinatesLength: secondaryCoordinates.length,
      comparisonMode,
      comparisonType: localComparisonType,
      splitViewActive
    });

    // Validate coordinates
    if (coordinates.length > 0) {
      const sampleCoord = coordinates[0];
      console.log("Primary coordinate sample:", sampleCoord);
    }
    
    if (secondaryCoordinates.length > 0) {
      const sampleCoord = secondaryCoordinates[0];
      console.log("Secondary coordinate sample:", sampleCoord);
    }
  }, [coordinates, secondaryCoordinates, comparisonMode, localComparisonType, splitViewActive]);

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
        setComparisonType={handleComparisonTypeChange}
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
