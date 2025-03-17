import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { addPrimaryPolyline } from '../features';

interface UsePrimaryPolylineProps {
  map: React.MutableRefObject<maplibregl.Map | null>;
  coordinates: [number, number][];
  isLoading: boolean;
  validCoordinates: boolean;
  color?: string;
  lineWidth?: number;
  lineDash?: number[];
}

export const usePrimaryPolyline = ({
  map,
  coordinates,
  isLoading,
  validCoordinates,
  color = '#3b82f6',
  lineWidth = 3,
  lineDash = []
}: UsePrimaryPolylineProps) => {
  
  useEffect(() => {
    if (!map.current || isLoading || !validCoordinates) return;

    const onMapLoad = () => {
      addPrimaryPolyline(map.current!, coordinates, isLoading, color, lineWidth, lineDash);
    };

    if (map.current.loaded()) {
      onMapLoad();
    } else {
      map.current.once('load', onMapLoad);
    }
  }, [coordinates, isLoading, map, validCoordinates, color, lineWidth, lineDash]);
};
