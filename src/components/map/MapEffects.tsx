import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import {
  useAutoAlign,
  usePrimaryPolyline,
  useSecondaryPolyline,
  useSideBySideView,
  useCoordinateValidation,
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
  primaryColor: string;
  secondaryColor: string;
  primaryLineWidth: number;
  secondaryLineWidth: number;
  primaryLineDash: number[];
  secondaryLineDash: number[];
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
    splitViewActive,
    primaryColor,
    secondaryColor,
    primaryLineWidth,
    secondaryLineWidth,
    primaryLineDash,
    secondaryLineDash,
  } = props;

  // Validate coordinates - simplify validation to boolean
  const { validCoordinates, validSecondaryCoords } = useCoordinateValidation(
    coordinates,
    secondaryCoordinates
  );

  const handleAutoAlign = useAutoAlign({
    map,
    secondMap,
    coordinates,
    secondaryCoordinates,
    comparisonType,
    splitViewActive,
    validCoordinates,
    validSecondaryCoords,
  });

  useEffect(() => {
    window.addEventListener('auto-align-maps', handleAutoAlign as EventListener);
    return () => {
      window.removeEventListener('auto-align-maps', handleAutoAlign as EventListener);
    };
  }, [handleAutoAlign]);

  usePrimaryPolyline({
    map,
    coordinates,
    isLoading,
    validCoordinates,
    color: primaryColor,
    lineWidth: primaryLineWidth,
    lineDash: primaryLineDash,
  });

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
    validSecondaryCoords,
    color: secondaryColor,
    lineWidth: secondaryLineWidth,
    lineDash: secondaryLineDash,
  });

  // Second map effect for side-by-side view
  useSideBySideView({
    secondMap,
    secondaryCoordinates,
    splitViewActive,
    comparisonMode,
    validSecondaryCoords,
    color: secondaryColor,
    lineWidth: secondaryLineWidth,
    lineDash: secondaryLineDash,
  });

  return null;
};

export { MapEffects };
export default MapEffects;
