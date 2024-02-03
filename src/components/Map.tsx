
import React from 'react';
import MapContainer from './map/MapContainer';
import 'maplibre-gl/dist/maplibre-gl.css';

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
  // Ensure we have valid data before rendering
  const validCoordinates = coordinates?.length ? coordinates : [];
  const validSecondaryCoordinates = secondaryCoordinates?.length ? secondaryCoordinates : [];
  
  console.log(`Map rendering with ${validCoordinates.length} primary coordinates and ${validSecondaryCoordinates.length} secondary coordinates`);
  console.log(`Comparison mode: ${comparisonMode}, type: ${comparisonType}`);

  return (
    <MapContainer 
      coordinates={validCoordinates}
      secondaryCoordinates={validSecondaryCoordinates}
      isLoading={isLoading}
      comparisonMode={comparisonMode}
      comparisonType={comparisonType}
      overlayOpacity={overlayOpacity}
      showDivergence={showDivergence}
      showIntersections={showIntersections}
    />
  );
};

export default Map;
