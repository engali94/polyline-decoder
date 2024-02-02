
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

const Map: React.FC<MapProps> = (props) => {
  return <MapContainer {...props} />;
};

export default Map;
