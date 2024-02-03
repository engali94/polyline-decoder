import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import {
  useAutoAlign,
  usePrimaryPolyline,
  useSecondaryPolyline,
  useSideBySideView,
  useCoordinateValidation
} from './effects';

interface MapEffectsProps {
  map: React.MutableRefObject<maplibregl.Map | null>;
  secondMap: React.MutableRefObject<maplibregl.Map | null>;
  coordinates: [number, number][];
  secondaryCoordinates: [number, number][];
  isLoading: boolean;
  comparisonMode: boolean;
  comparisonType: 'overlay' | 'sideBySide' | 'diff';
  overlayOpacity: number;
  showDivergence: boolean;
  showIntersections: boolean;
  splitViewActive: boolean;
}

const MapEffects = (props: MapEffectsProps) => {
  const {
    map,
    secondMap,
    coordinates,
    secondaryCoordinates,
    isLoading,
    comparisonMode,
    comparisonType,
    overlayOpacity,
    showDivergence,
    showIntersections,
    splitViewActive
  } = props;

  // Validate coordinates - simplify validation to boolean
  const { validCoordinates, validSecondaryCoords } = useCoordinateValidation(
    coordinates,
    secondaryCoordinates
  );

  // Auto-alignment handler
  const handleAutoAlign = useAutoAlign({
    map,
    secondMap,
    coordinates,
    secondaryCoordinates,
    comparisonType,
    splitViewActive,
    validCoordinates,
    validSecondaryCoords
  });

  // Set up auto-align event listener
  useEffect(() => {
    window.addEventListener('auto-align-maps', handleAutoAlign as EventListener);
    return () => {
      window.removeEventListener('auto-align-maps', handleAutoAlign as EventListener);
    };
  }, [handleAutoAlign]);

  // Primary polyline effect
  usePrimaryPolyline({
    map,
    coordinates,
    isLoading,
    validCoordinates
  });

  // Secondary polyline and comparison mode effects
  useSecondaryPolyline({
    map,
    coordinates,
    secondaryCoordinates,
    isLoading,
    comparisonMode,
    comparisonType,
    overlayOpacity,
    showDivergence,
    showIntersections,
    splitViewActive,
    validSecondaryCoords
  });

  // Second map effect for side-by-side view
  useSideBySideView({
    secondMap,
    secondaryCoordinates,
    splitViewActive,
    comparisonMode,
    validSecondaryCoords
  });

  return null;
};

// Export as both named and default export to ensure compatibility
export { MapEffects };
export default MapEffects;
