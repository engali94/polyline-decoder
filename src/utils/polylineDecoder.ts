
// Google Polyline decoder implementation
export function decodePolyline(encoded: string, precision: number = 5): [number, number][] {
  if (!encoded || encoded.length === 0) {
    return [];
  }

  // Handle escaped backslashes by replacing them with their unescaped version
  const sanitizedEncoded = encoded.replace(/\\\\/g, '\\');
  
  const factor = Math.pow(10, precision);
  const len = sanitizedEncoded.length;
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates: [number, number][] = [];

  try {
    while (index < len) {
      let result = 1;
      let shift = 0;
      let b: number;
      
      do {
        b = sanitizedEncoded.charCodeAt(index++) - 63;
        result += (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      result = 1;
      shift = 0;
      
      do {
        b = sanitizedEncoded.charCodeAt(index++) - 63;
        result += (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      // IMPORTANT: Google's polyline format has lat,lng but we need lng,lat for GeoJSON
      const latitude = lat / factor;
      const longitude = lng / factor;
      
      console.log(`Raw decoded point: lat=${latitude}, lng=${longitude}`);
      
      // Check for sign flipped coordinates - sometimes latitude and longitude get swapped
      let finalLng = longitude;
      let finalLat = latitude;
      
      // If coordinates are likely in Saudi Arabia (around Riyadh), we don't need to flip
      // Riyadh is roughly at 24.7N, 46.7E
      const isNearRiyadh = 
        (Math.abs(latitude - 24.7) < 5 && Math.abs(longitude - 46.7) < 5) || 
        (Math.abs(longitude - 24.7) < 5 && Math.abs(latitude - 46.7) < 5);
      
      // If we detect possible flipped coordinates
      if (isNearRiyadh && Math.abs(longitude) < 90 && Math.abs(latitude) > 90) {
        // Coordinates might be flipped
        console.log("Detected possible flipped coordinates, correcting");
        finalLng = latitude;
        finalLat = longitude;
      }
      
      // Ensure coordinates are within valid range
      if (finalLat >= -90 && finalLat <= 90 && finalLng >= -180 && finalLng <= 180) {
        // For GeoJSON and maplibre, order must be [longitude, latitude]
        console.log(`Final coordinate: [${finalLng}, ${finalLat}]`);
        coordinates.push([finalLng, finalLat]);
      } else {
        console.warn(`Skipping invalid coordinate: [${finalLng}, ${finalLat}]`);
      }
    }
  } catch (error) {
    console.error("Error decoding polyline:", error);
  }

  if (coordinates.length > 0) {
    console.log("Decoded first coordinate:", coordinates[0]);
    console.log("Decoded last coordinate:", coordinates[coordinates.length - 1]);
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
