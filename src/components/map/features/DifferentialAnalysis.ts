import * as maplibregl from 'maplibre-gl';

export const addDivergencePoints = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][]
): void => {
  if (coordinates.length === 0 || secondaryCoordinates.length === 0) {
    console.log('Cannot add divergence points: empty coordinates');
    return;
  }

  console.log('Adding divergence points');

  // Remove existing layer if it exists
  try {
    if (map.getLayer('divergence-layer')) {
      map.removeLayer('divergence-layer');
    }
    if (map.getSource('divergence-source')) {
      map.removeSource('divergence-source');
    }
  } catch (e) {
    console.error('Error removing existing divergence layers:', e);
  }

  const divergencePoints: GeoJSON.Feature[] = [];

  const pointsToCheck = Math.min(coordinates.length, secondaryCoordinates.length);
  const samplingRate = Math.max(1, Math.floor(pointsToCheck / 30));

  console.log(
    `Analyzing divergence using ${pointsToCheck} points with sampling rate ${samplingRate}`
  );

  // Calculate a suitable divergence threshold based on the data
  let totalDistanceSquared = 0;
  let comparisonPoints = 0;

  for (let i = 0; i < pointsToCheck; i += samplingRate) {
    const primary = coordinates[i];
    const secondary = secondaryCoordinates[i];

    const dx = primary[0] - secondary[0];
    const dy = primary[1] - secondary[1];
    const distSquared = dx * dx + dy * dy;

    totalDistanceSquared += distSquared;
    comparisonPoints++;
  }

  const avgDistanceSquared = totalDistanceSquared / Math.max(1, comparisonPoints);
  const threshold = Math.max(0.00001, avgDistanceSquared * 0.25);

  console.log(`Divergence threshold: ${threshold} based on avg distance: ${avgDistanceSquared}`);

  for (let i = 0; i < pointsToCheck; i += samplingRate) {
    const primary = coordinates[i];
    const secondary = secondaryCoordinates[i];

    const dx = primary[0] - secondary[0];
    const dy = primary[1] - secondary[1];
    const distSquared = dx * dx + dy * dy;

    if (distSquared > threshold) {
      const midPoint: [number, number] = [
        (primary[0] + secondary[0]) / 2,
        (primary[1] + secondary[1]) / 2,
      ];

      divergencePoints.push({
        type: 'Feature',
        properties: {
          distance: Math.sqrt(distSquared),
          primaryIdx: i,
          secondaryIdx: i,
        },
        geometry: {
          type: 'Point',
          coordinates: midPoint,
        },
      });
    }
  }

  console.log(`Found ${divergencePoints.length} divergence points`);

  if (divergencePoints.length > 0) {
    try {
      map.addSource('divergence-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: divergencePoints,
        },
      });

      map.addLayer({
        id: 'divergence-layer',
        type: 'circle',
        source: 'divergence-source',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'distance'],
            0,
            4,
            0.01,
            8,
            0.05,
            12,
          ],
          'circle-color': '#ef4444',
          'circle-opacity': 0.7,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
      });

      console.log('✅ Successfully added divergence visualization');
    } catch (e) {
      console.error('Error adding divergence layer:', e);
    }
  }
};

export const addIntersectionPoints = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][]
): void => {
  if (coordinates.length === 0 || secondaryCoordinates.length === 0) {
    console.log('Cannot add intersection points: empty coordinates');
    return;
  }

  console.log('Adding intersection points');

  // Remove existing layer if it exists
  try {
    if (map.getLayer('intersection-layer')) {
      map.removeLayer('intersection-layer');
    }
    if (map.getSource('intersection-source')) {
      map.removeSource('intersection-source');
    }
  } catch (e) {
    console.error('Error removing existing intersection layers:', e);
  }

  const intersectionPoints: GeoJSON.Feature[] = [];

  const doSegmentsIntersect = (
    a1: [number, number],
    a2: [number, number],
    b1: [number, number],
    b2: [number, number]
  ): [number, number] | null => {
    const dxa = a2[0] - a1[0];
    const dya = a2[1] - a1[1];
    const dxb = b2[0] - b1[0];
    const dyb = b2[1] - b1[1];

    const det = dxa * dyb - dya * dxb;
    if (Math.abs(det) < 0.0000001) return null; // Parallel or collinear

    const t = ((b1[0] - a1[0]) * dyb - (b1[1] - a1[1]) * dxb) / det;
    const u = ((b1[0] - a1[0]) * dya - (b1[1] - a1[1]) * dxa) / det;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return [a1[0] + t * dxa, a1[1] + t * dya];
    }

    return null;
  };

  const maxChecks = 5000;
  const primarySteps = Math.max(1, Math.floor(coordinates.length / 50));
  const secondarySteps = Math.max(1, Math.floor(secondaryCoordinates.length / 50));

  console.log(
    `Checking for intersections with steps: primary=${primarySteps}, secondary=${secondarySteps}`
  );

  let checkCount = 0;
  for (let i = 0; i < coordinates.length - 1; i += primarySteps) {
    if (checkCount > maxChecks) break;

    const a1 = coordinates[i];
    const a2 = coordinates[i + 1];

    for (let j = 0; j < secondaryCoordinates.length - 1; j += secondarySteps) {
      checkCount++;
      if (checkCount > maxChecks) break;

      const b1 = secondaryCoordinates[j];
      const b2 = secondaryCoordinates[j + 1];

      const intersection = doSegmentsIntersect(a1, a2, b1, b2);
      if (intersection) {
        intersectionPoints.push({
          type: 'Feature',
          properties: {
            primarySegment: i,
            secondarySegment: j,
          },
          geometry: {
            type: 'Point',
            coordinates: intersection,
          },
        });
      }
    }
  }

  console.log(`Found ${intersectionPoints.length} intersection points after ${checkCount} checks`);

  if (intersectionPoints.length > 0) {
    try {
      map.addSource('intersection-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: intersectionPoints,
        },
      });

      map.addLayer({
        id: 'intersection-layer',
        type: 'circle',
        source: 'intersection-source',
        paint: {
          'circle-radius': 6,
          'circle-color': '#f59e0b',
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      console.log('✅ Successfully added intersection visualization');
    } catch (e) {
      console.error('Error adding intersection layer:', e);
    }
  }
};

export const addDifferentialAnalysis = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][],
  showDivergence: boolean,
  showIntersections: boolean
): void => {
  console.log('Adding differential analysis', {
    coordinates: coordinates.length,
    secondaryCoordinates: secondaryCoordinates.length,
    showDivergence,
    showIntersections,
  });

  cleanupDiffLayers(map);

  try {
    if (coordinates.length > 0 && secondaryCoordinates.length > 0) {
      const connectingFeatures: GeoJSON.Feature[] = [];
      const pointCount = Math.min(coordinates.length, secondaryCoordinates.length);
      const step = Math.max(1, Math.floor(pointCount / 15)); // Limit to ~15 connecting lines

      for (let i = 0; i < pointCount; i += step) {
        connectingFeatures.push({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [coordinates[i], secondaryCoordinates[i]],
          },
        });
      }

      if (connectingFeatures.length > 0) {
        map.addSource('connecting-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: connectingFeatures,
          },
        });

        map.addLayer({
          id: 'connecting-layer',
          type: 'line',
          source: 'connecting-source',
          paint: {
            'line-color': '#9333ea',
            'line-width': 1.5,
            'line-opacity': 0.6,
            'line-dasharray': [2, 2],
          },
        });
      }
    }
  } catch (e) {
    console.error('Error adding connecting lines:', e);
  }

  if (showDivergence) {
    addDivergencePoints(map, coordinates, secondaryCoordinates);
  }

  if (showIntersections) {
    addIntersectionPoints(map, coordinates, secondaryCoordinates);
  }
};

export const cleanupDiffLayers = (map: maplibregl.Map): void => {
  try {
    const layersToRemove = ['divergence-layer', 'intersection-layer', 'connecting-layer'];

    const sourcesToRemove = ['divergence-source', 'intersection-source', 'connecting-source'];

    for (const layer of layersToRemove) {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
        console.log(`Removed diff layer: ${layer}`);
      }
    }

    for (const source of sourcesToRemove) {
      if (map.getSource(source)) {
        map.removeSource(source);
        console.log(`Removed diff source: ${source}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up diff layers:', error);
  }
};
