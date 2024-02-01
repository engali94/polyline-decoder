
export const useCoordinateValidation = (
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][]
) => {
  // Validate coordinates to prevent map errors
  const validCoordinates = coordinates && coordinates.length > 0 && 
    coordinates.every(coord => Array.isArray(coord) && coord.length === 2);
  
  const validSecondaryCoords = secondaryCoordinates && secondaryCoordinates.length > 0 && 
    secondaryCoordinates.every(coord => Array.isArray(coord) && coord.length === 2);

  return { validCoordinates, validSecondaryCoords };
};
