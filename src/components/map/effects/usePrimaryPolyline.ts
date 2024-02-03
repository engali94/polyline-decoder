
import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { addPrimaryPolyline } from '../features';

interface UsePrimaryPolylineProps {
  map: React.MutableRefObject<maplibregl.Map | null>;
  coordinates: [number, number][];
  isLoading: boolean;
  validCoordinates: boolean;
}

export const usePrimaryPolyline = ({
  map,
  coordinates,
  isLoading,
  validCoordinates
}: UsePrimaryPolylineProps) => {
  
  useEffect(() => {
    if (!map.current || isLoading || !validCoordinates) return;

    const onMapLoad = () => {
      addPrimaryPolyline(map.current!, coordinates, isLoading);
    };

    if (map.current.loaded()) {
      onMapLoad();
    } else {
      map.current.once('load', onMapLoad);
    }
  }, [coordinates, isLoading, map, validCoordinates]);
};
