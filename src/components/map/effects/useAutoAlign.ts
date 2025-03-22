import { useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import { toast } from 'sonner';

interface UseAutoAlignProps {
  map: React.MutableRefObject<maplibregl.Map | null>;
  secondMap: React.MutableRefObject<maplibregl.Map | null>;
  coordinates: [number, number][];
  secondaryCoordinates: [number, number][];
  comparisonType: 'overlay' | 'sideBySide' | 'diff';
  splitViewActive: boolean;
  validCoordinates: boolean;
  validSecondaryCoords: boolean;
}

export const useAutoAlign = ({
  map,
  secondMap,
  coordinates,
  secondaryCoordinates,
  comparisonType,
  splitViewActive,
  validCoordinates,
  validSecondaryCoords,
}: UseAutoAlignProps) => {
  return useCallback(
    (event: CustomEvent) => {
      if (!map.current || !secondMap.current) return;
      if (comparisonType !== 'sideBySide' || !splitViewActive) return;

      const threshold = event.detail?.threshold || 20;

      try {
        // Check if both maps have valid sources
        const primarySource = map.current.getSource('polyline-source');
        const secondarySource = secondMap.current.getSource('second-polyline-source');

        if (!primarySource || !secondarySource) {
          console.warn('Cannot auto-align: One or both sources are missing');
          return;
        }

        // Create bounds with all coordinates
        const bounds = new maplibregl.LngLatBounds();

        // Add primary coordinates to bounds
        if (validCoordinates) {
          coordinates.forEach(coord => bounds.extend(coord as maplibregl.LngLatLike));
        }

        // Add secondary coordinates to bounds
        if (validSecondaryCoords) {
          secondaryCoordinates.forEach(coord => bounds.extend(coord as maplibregl.LngLatLike));
        }

        // Only proceed if bounds are valid
        if (bounds.isEmpty()) {
          toast.error('Cannot align: No valid coordinates');
          return;
        }

        // Fit both maps to the same bounds
        const options = {
          padding: 50,
          maxZoom: 16,
          duration: 800,
        };

        map.current.fitBounds(bounds, options);
        secondMap.current.fitBounds(bounds, options);

        toast.success('Maps aligned successfully');
      } catch (error) {
        console.error('Auto-alignment error:', error);
        toast.error('Error aligning maps');
      }
    },
    [
      map,
      secondMap,
      coordinates,
      secondaryCoordinates,
      comparisonType,
      splitViewActive,
      validCoordinates,
      validSecondaryCoords,
    ]
  );
};
