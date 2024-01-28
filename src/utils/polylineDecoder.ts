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

      // IMPORTANT: Google's polyline format is lat,lng but we need to return [lng,lat] for MapLibre
      let latitude = lat / factor;
      let longitude = lng / factor;
      
      console.log(`Raw decoded point: lat=${latitude}, lng=${longitude}`);
      
      // Handle special cases for Saudi Arabia regions where coordinates might use different scaling
      // Saudi Arabia is roughly at latitude 24-25 and longitude 46-47
      
      // Case 1: Properly scaled coordinates that still need to be returned as [lng, lat]
      if (latitude >= 20 && latitude <= 30 && longitude >= 40 && longitude <= 50) {
        console.log("✅ Valid Saudi Arabia coordinates detected");
        coordinates.push([longitude, latitude]);
      } 
      // Case 2: Coordinates are flipped (lng is in lat position and vice versa)
      else if (longitude >= 20 && longitude <= 30 && latitude >= 40 && latitude <= 50) {
        console.log("🔄 Flipped Saudi Arabia coordinates detected - correcting order");
        // Swap them to correct order [lng, lat]
        coordinates.push([latitude, longitude]);
      }
      // Case 3: Coordinates might be scaled up incorrectly
      else if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
        // Try to detect common scaling issues
        const scaleFactor1 = 10;  // Common scaling issue
        const scaleFactor2 = 100; // Less common but possible
        
        const testLat1 = latitude / scaleFactor1;
        const testLng1 = longitude / scaleFactor1;
        const testLat2 = latitude / scaleFactor2;
        const testLng2 = longitude / scaleFactor2;
        
        // Check if scaling down by 10 makes sense for Saudi Arabia
        if (testLat1 >= 20 && testLat1 <= 30 && testLng1 >= 40 && testLng1 <= 50) {
          console.log(`🔍 Scaled coordinates (÷${scaleFactor1}) detected for Saudi Arabia`);
          coordinates.push([testLng1, testLat1]);
        }
        // Check if scaling down by 100 makes sense for Saudi Arabia
        else if (testLat2 >= 20 && testLat2 <= 30 && testLng2 >= 40 && testLng2 <= 50) {
          console.log(`🔍 Scaled coordinates (÷${scaleFactor2}) detected for Saudi Arabia`);
          coordinates.push([testLng2, testLat2]);
        }
        // If scaled flipped coordinates
        else if (testLng1 >= 20 && testLng1 <= 30 && testLat1 >= 40 && testLat1 <= 50) {
          console.log(`🔄🔍 Flipped and scaled coordinates (÷${scaleFactor1}) detected`);
          coordinates.push([testLat1, testLng1]);
        }
        else if (testLng2 >= 20 && testLng2 <= 30 && testLat2 >= 40 && testLat2 <= 50) {
          console.log(`🔄🔍 Flipped and scaled coordinates (÷${scaleFactor2}) detected`);
          coordinates.push([testLat2, testLng2]);
        }
        else {
          console.warn(`⚠️ Invalid coordinate after scaling attempts: [${longitude}, ${latitude}]`);
        }
      }
      // Case 4: Standard valid coordinates anywhere else in the world
      else if (Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180) {
        console.log(`✅ Valid global coordinate: [${longitude}, ${latitude}]`);
        coordinates.push([longitude, latitude]);
      }
      else {
        console.warn(`⚠️ Invalid coordinate: [${longitude}, ${latitude}]`);
      }
    }
  } catch (error) {
    console.error("Error decoding polyline:", error);
  }

  // Final validation and debug output
  if (coordinates.length > 0) {
    console.log(`✅ Decoded ${coordinates.length} coordinates successfully`);
    console.log("First coordinate:", coordinates[0]);
    console.log("Last coordinate:", coordinates[coordinates.length - 1]);
    
    // Detect if coordinates make sense for Saudi Arabia
    let inSaudiArabia = 0;
    for (const [lng, lat] of coordinates) {
      if (lat >= 20 && lat <= 30 && lng >= 40 && lng <= 50) {
        inSaudiArabia++;
      }
    }
    
    if (inSaudiArabia > 0) {
      const percentage = (inSaudiArabia / coordinates.length) * 100;
      console.log(`🇸🇦 ${percentage.toFixed(1)}% of coordinates are in Saudi Arabia region`);
    }
  } else {
    console.warn("❌ No valid coordinates decoded from polyline");
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
