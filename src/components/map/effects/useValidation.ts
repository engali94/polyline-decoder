
export const useCoordinateValidation = (
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][]
) => {
  // Ultra-strict validation of coordinates to prevent map errors
  const validCoordinates = coordinates && 
    Array.isArray(coordinates) && 
    coordinates.length > 0 && 
    coordinates.every(coord => 
      Array.isArray(coord) && 
      coord.length === 2 && 
      typeof coord[0] === 'number' && 
      typeof coord[1] === 'number' &&
      !isNaN(coord[0]) && 
      !isNaN(coord[1]) &&
      Number.isFinite(coord[0]) &&
      Number.isFinite(coord[1]) &&
      Math.abs(coord[0]) <= 180 &&
      Math.abs(coord[1]) <= 90
    );
  
  // Modified validation for secondary coordinates to be more lenient
  // when the exact same polyline is used for both primary and secondary
  const validSecondaryCoords = secondaryCoordinates && 
    Array.isArray(secondaryCoordinates) && 
    secondaryCoordinates.length > 0;
  
  // Check if the secondary coordinates are valid when not strictly checked
  // But they fail the stricter validation - this means we need to sanitize them
  const needsSanitization = validSecondaryCoords && secondaryCoordinates.some(coord => 
    !Array.isArray(coord) || 
    coord.length !== 2 || 
    typeof coord[0] !== 'number' || 
    typeof coord[1] !== 'number' ||
    isNaN(coord[0]) || 
    isNaN(coord[1]) ||
    !Number.isFinite(coord[0]) ||
    !Number.isFinite(coord[1]) ||
    Math.abs(coord[0]) > 180 ||
    Math.abs(coord[1]) > 90
  );

  // Detailed validation results for debugging
  console.log("Coordinate validation:", { 
    validPrimary: validCoordinates, 
    validSecondary: validSecondaryCoords,
    needsSanitization,
    primaryCount: coordinates?.length || 0,
    secondaryCount: secondaryCoordinates?.length || 0,
    primarySample: coordinates?.slice(0, 2) || [],
    secondarySample: secondaryCoordinates?.slice(0, 2) || []
  });

  return { 
    validCoordinates, 
    validSecondaryCoords,
    needsSanitization
  };
};
