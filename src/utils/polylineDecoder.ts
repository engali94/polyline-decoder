
// Google Polyline decoder implementation
export function decodePolyline(encoded: string, precision: number = 5): [number, number][] {
  if (!encoded || encoded.length === 0) {
    return [];
  }

  const factor = Math.pow(10, precision);
  const len = encoded.length;
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates: [number, number][] = [];

  while (index < len) {
    let result = 1;
    let shift = 0;
    let b: number;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result += (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    result = 1;
    shift = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result += (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    coordinates.push([lng / factor, lat / factor]);
  }

  return coordinates;
}

export function calculateDistance(coordinates: [number, number][]): number {
  if (coordinates.length < 2) return 0;

  // Earth radius in meters
  const R = 6371000;
  
  let totalDistance = 0;
  
  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
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
    northeast: [maxLng, maxLat]
  };
}

export function coordinatesToGeoJSON(coordinates: [number, number][]) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coordinates
        }
      }
    ]
  };
}

export function coordinatesToCSV(coordinates: [number, number][]) {
  const header = "longitude,latitude\n";
  const rows = coordinates.map(([lng, lat]) => `${lng},${lat}`).join("\n");
  return header + rows;
}
