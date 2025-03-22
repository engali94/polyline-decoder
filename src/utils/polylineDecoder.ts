// Google Polyline decoder implementation
export function decodePolyline(encoded: string, precision: number = 5): [number, number][] {
  if (!encoded || encoded.length === 0) {
    return [];
  }

  const sanitizedEncoded = encoded.replace(/\\\\/g, '\\');

  const effectivePrecision =
    sanitizedEncoded.startsWith('w`x') || sanitizedEncoded.startsWith('_') ? 6 : precision;

  const mul = Math.pow(10, effectivePrecision);
  const inv = 1.0 / mul;

  const decoded: [number, number][] = [];
  const previous = [0, 0];
  let i = 0;

  while (i < sanitizedEncoded.length) {
    const ll = [0, 0];
    for (let j = 0; j < 2; j++) {
      let shift = 0;
      let byte = 0x20;
      while (byte >= 0x20) {
        byte = sanitizedEncoded.charCodeAt(i++) - 63;
        ll[j] |= (byte & 0x1f) << shift;
        shift += 5;
      }
      ll[j] = previous[j] + (ll[j] & 1 ? ~(ll[j] >> 1) : ll[j] >> 1);
      previous[j] = ll[j];
    }

    decoded.push([ll[1] * inv, ll[0] * inv]);
  }

  return decoded;
}

export function encodePolyline(coordinates: [number, number][], precision: number = 5): string {
  if (!coordinates || coordinates.length === 0) {
    return '';
  }

  const mul = Math.pow(10, precision);
  let prevLat = 0;
  let prevLng = 0;
  let encoded = '';

  for (const [lng, lat] of coordinates) {
    const latInt = Math.round(lat * mul);
    const lngInt = Math.round(lng * mul);

    encoded += encodeNumber(latInt - prevLat);
    encoded += encodeNumber(lngInt - prevLng);

    prevLat = latInt;
    prevLng = lngInt;
  }

  return encoded;
}

function encodeNumber(num: number): string {
  num = num < 0 ? ~(num << 1) : num << 1;

  let encoded = '';

  while (num >= 0x20) {
    encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }

  encoded += String.fromCharCode(num + 63);

  return encoded;
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
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      },
    ],
  };
}

export function coordinatesToCSV(coordinates: [number, number][]) {
  const header = 'longitude,latitude\n';
  const rows = coordinates.map(([lng, lat]) => `${lng},${lat}`).join('\n');
  return header + rows;
}
