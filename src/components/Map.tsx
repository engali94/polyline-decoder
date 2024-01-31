
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
  // Log props for debugging
  console.log('Map component props:', {
    coordinatesCount: coordinates.length,
    secondaryCoordinatesCount: secondaryCoordinates.length,
    comparisonMode,
    comparisonType,
    overlayOpacity
  });

  return (
    <MapContainer
      coordinates={coordinates}
      secondaryCoordinates={secondaryCoordinates}
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
