import polyline from '@mapbox/polyline';

export function decodePolyline(encoded: string, precision: number = 5): [number, number][] {
  if (!encoded || encoded.length === 0) {
    return [];
  }
  
  const sanitizedEncoded = encoded.replace(/\\/g, '\\');
  
  try {
    let result: [number, number][] = [];
    
    try {
      result = polyline.decode(sanitizedEncoded, precision).map(([lat, lng]) => [lng, lat]);
    } catch (firstError) {
      if (precision !== 5) {
        result = polyline.decode(sanitizedEncoded, 5).map(([lat, lng]) => [lng, lat]);
      }
    }
    
    if (result.length === 0 && precision !== 6) {
      try {
        result = polyline.decode(sanitizedEncoded, 6).map(([lat, lng]) => [lng, lat]);
      } catch {}
    }
    
    return result.filter(([lng, lat]) => Math.abs(lat) <= 90 && Math.abs(lng) <= 180);
  } catch (error) {
    return [];
  }
}

export function encodePolyline(coordinates: [number, number][], precision: number = 5): string {
  if (!coordinates || coordinates.length === 0) {
    return '';
  }
  
  try {
    // Need to explicitly type as [number, number][] to satisfy TypeScript
    const flippedCoords: [number, number][] = coordinates.map(([lng, lat]): [number, number] => [lat, lng]);
    return polyline.encode(flippedCoords, precision);
  } catch (error) {
    return '';
  }
}


export function calculateDistance(coordinates: [number, number][]): number {
  if (coordinates.length < 2) return 0;

  const R = 6371000;

  let totalDistance = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    totalDistance += distance;
  }

  return totalDistance;
}

export function getBounds(coordinates: [number, number][]) {
  if (coordinates.length === 0) return null;

  let minLng = coordinates[0][0];
  let maxLng = coordinates[0][0];
  let minLat = coordinates[0][1];
  let maxLat = coordinates[0][1];

  for (const [lng, lat] of coordinates) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  return {
    southwest: [minLng, minLat],
    northeast: [maxLng, maxLat],
  };
}

export function coordinatesToGeoJSON(coordinates: [number, number][]) {
  if (!coordinates || coordinates.length === 0) return null;
  
  return polyline.toGeoJSON(encodePolyline(coordinates));
}

export function coordinatesToCSV(coordinates: [number, number][]) {
  const header = 'longitude,latitude\n';
  const rows = coordinates.map(([lng, lat]) => `${lng},${lat}`).join('\n');
  return header + rows;
}
