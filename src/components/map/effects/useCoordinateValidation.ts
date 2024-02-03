import { useMemo } from 'react';

export const useCoordinateValidation = (
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][]
) => {
  return useMemo(() => {
    const validCoordinates = coordinates && coordinates.length >= 2;
    const validSecondaryCoords = secondaryCoordinates && secondaryCoordinates.length >= 2;
    
    return {
      validCoordinates,
      validSecondaryCoords
    };
  }, [coordinates, secondaryCoordinates]);
}; 