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
  primaryColor?: string;
  secondaryColor?: string;
  primaryLineWidth?: number;
  secondaryLineWidth?: number;
  primaryLineDash?: number[];
  secondaryLineDash?: number[];
}

const Map: React.FC<MapProps> = ({
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
  console.log('Map component props:', {
    coordinatesCount: coordinates.length,
    secondaryCoordinatesCount: secondaryCoordinates.length,
    comparisonMode,
    comparisonType,
    overlayOpacity,
    primaryColor,
    secondaryColor,
    primaryLineWidth,
    secondaryLineWidth
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
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      primaryLineWidth={primaryLineWidth}
      secondaryLineWidth={secondaryLineWidth}
      primaryLineDash={primaryLineDash}
      secondaryLineDash={secondaryLineDash}
    />
  );
};

export default Map;
