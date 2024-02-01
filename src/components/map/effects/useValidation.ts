
export const useCoordinateValidation = (
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][]
) => {
  // More robust validation of coordinates to prevent map errors
  const validCoordinates = coordinates && 
    Array.isArray(coordinates) && 
    coordinates.length > 0 && 
    coordinates.every(coord => 
      Array.isArray(coord) && 
      coord.length === 2 && 
      typeof coord[0] === 'number' && 
      typeof coord[1] === 'number' &&
      !isNaN(coord[0]) && 
      !isNaN(coord[1])
    );
  
  const validSecondaryCoords = secondaryCoordinates && 
    Array.isArray(secondaryCoordinates) && 
    secondaryCoordinates.length > 0 && 
    secondaryCoordinates.every(coord => 
      Array.isArray(coord) && 
      coord.length === 2 && 
      typeof coord[0] === 'number' && 
      typeof coord[1] === 'number' &&
      !isNaN(coord[0]) && 
      !isNaN(coord[1])
    );

  return { validCoordinates, validSecondaryCoords };
};
