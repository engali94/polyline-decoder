import * as maplibregl from 'maplibre-gl';

export const addDivergencePoints = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][]
): void => {
  if (coordinates.length === 0 || secondaryCoordinates.length === 0) {
    console.log("Cannot add divergence points: empty coordinates");
    return;
  }

  console.log("Adding divergence points");

  // Remove existing layer if it exists
  try {
    if (map.getLayer('divergence-layer')) {
      map.removeLayer('divergence-layer');
    }
    if (map.getSource('divergence-source')) {
      map.removeSource('divergence-source');
    }
  } catch (e) {
    console.error("Error removing existing divergence layers:", e);
  }

  const divergencePoints: GeoJSON.Feature[] = [];
  
  // Find points that diverge significantly between the two paths
  // Use dynamic threshold based on the average distance between coordinates
  const pointsToCheck = Math.min(coordinates.length, secondaryCoordinates.length);
  const samplingRate = Math.max(1, Math.floor(pointsToCheck / 30));

  console.log(`Analyzing divergence using ${pointsToCheck} points with sampling rate ${samplingRate}`);
  
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
  
  // Base threshold on average distance, with a minimum to catch small divergences
  const avgDistanceSquared = totalDistanceSquared / Math.max(1, comparisonPoints);
  const threshold = Math.max(0.00001, avgDistanceSquared * 0.25);
  
  console.log(`Divergence threshold: ${threshold} based on avg distance: ${avgDistanceSquared}`);
  
  // Now detect divergence using the threshold
  for (let i = 0; i < pointsToCheck; i += samplingRate) {
    const primary = coordinates[i];
    const secondary = secondaryCoordinates[i];
    
    const dx = primary[0] - secondary[0];
    const dy = primary[1] - secondary[1];
    const distSquared = dx * dx + dy * dy;
    
    // Add points where the divergence is significant
    if (distSquared > threshold) {
      // Calculate midpoint between the two paths for better visualization
      const midPoint: [number, number] = [
        (primary[0] + secondary[0]) / 2,
        (primary[1] + secondary[1]) / 2
      ];
      
      // Store both points and the distance for rendering
      divergencePoints.push({
        type: 'Feature',
        properties: {
          distance: Math.sqrt(distSquared),
          primaryIdx: i,
          secondaryIdx: i
        },
        geometry: {
          type: 'Point',
          coordinates: midPoint
        }
      });
    }
  }
  
  console.log(`Found ${divergencePoints.length} divergence points`);
  
  if (divergencePoints.length > 0) {
    try {
      // Add new source and layer for divergence points
      map.addSource('divergence-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: divergencePoints
        }
      });
      
      map.addLayer({
        id: 'divergence-layer',
        type: 'circle',
        source: 'divergence-source',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['get', 'distance'],
            0, 4,
            0.01, 8,
            0.05, 12
          ],
          'circle-color': '#ef4444',
          'circle-opacity': 0.7,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        }
      });
      
      console.log("✅ Successfully added divergence visualization");
    } catch (e) {
      console.error("Error adding divergence layer:", e);
    }
  }
};

export const addIntersectionPoints = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][]
): void => {
  if (coordinates.length === 0 || secondaryCoordinates.length === 0) {
    console.log("Cannot add intersection points: empty coordinates");
    return;
  }

  console.log("Adding intersection points");

  // Remove existing layer if it exists
  try {
    if (map.getLayer('intersection-layer')) {
      map.removeLayer('intersection-layer');
    }
    if (map.getSource('intersection-source')) {
      map.removeSource('intersection-source');
    }
  } catch (e) {
    console.error("Error removing existing intersection layers:", e);
  }

  // Find actual intersections between the paths by comparing segments
  const intersectionPoints: GeoJSON.Feature[] = [];
  
  // Helper function to check if line segments intersect
  const doSegmentsIntersect = (
    a1: [number, number], a2: [number, number], 
    b1: [number, number], b2: [number, number]
  ): [number, number] | null => {
    // Line segment intersection algorithm
    const dxa = a2[0] - a1[0];
    const dya = a2[1] - a1[1];
    const dxb = b2[0] - b1[0];
    const dyb = b2[1] - b1[1];
    
    const det = dxa * dyb - dya * dxb;
    if (Math.abs(det) < 0.0000001) return null; // Parallel or collinear
    
    const t = ((b1[0] - a1[0]) * dyb - (b1[1] - a1[1]) * dxb) / det;
    const u = ((b1[0] - a1[0]) * dya - (b1[1] - a1[1]) * dxa) / det;
    
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // Calculate intersection point
      return [
        a1[0] + t * dxa,
        a1[1] + t * dya
      ];
    }
    
    return null;
  };
  
  // Check path segments against each other for intersections
  // Limit the number of checks to avoid performance issues
  const maxChecks = 5000;
  const primarySteps = Math.max(1, Math.floor(coordinates.length / 50));
  const secondarySteps = Math.max(1, Math.floor(secondaryCoordinates.length / 50));
  
  console.log(`Checking for intersections with steps: primary=${primarySteps}, secondary=${secondarySteps}`);
  
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
            secondarySegment: j
          },
          geometry: {
            type: 'Point',
            coordinates: intersection
          }
        });
      }
    }
  }
  
  console.log(`Found ${intersectionPoints.length} intersection points after ${checkCount} checks`);
  
  if (intersectionPoints.length > 0) {
    try {
      // Add new source and layer for intersection points
      map.addSource('intersection-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: intersectionPoints
        }
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
          'circle-stroke-color': '#ffffff'
        }
      });
      
      console.log("✅ Successfully added intersection visualization");
    } catch (e) {
      console.error("Error adding intersection layer:", e);
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
  console.log("Adding differential analysis", { 
    coordinates: coordinates.length, 
    secondaryCoordinates: secondaryCoordinates.length,
    showDivergence,
    showIntersections
  });

  // Clean up existing layers first
  cleanupDiffLayers(map);

  // Add a connecting lines layer to better visualize the differences
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
            coordinates: [coordinates[i], secondaryCoordinates[i]]
          }
        });
      }
      
      if (connectingFeatures.length > 0) {
        // Add connecting lines source and layer
        map.addSource('connecting-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: connectingFeatures
          }
        });
        
        map.addLayer({
          id: 'connecting-layer',
          type: 'line',
          source: 'connecting-source',
          paint: {
            'line-color': '#9333ea',
            'line-width': 1.5,
            'line-opacity': 0.6,
            'line-dasharray': [2, 2]
          }
        });
      }
    }
  } catch (e) {
    console.error("Error adding connecting lines:", e);
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
    const layersToRemove = [
      'divergence-layer', 
      'intersection-layer',
      'connecting-layer'
    ];
    
    const sourcesToRemove = [
      'divergence-source', 
      'intersection-source',
      'connecting-source'
    ];
    
    // Remove layers first
    for (const layer of layersToRemove) {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
        console.log(`Removed diff layer: ${layer}`);
      }
    }
    
    // Then remove sources
    for (const source of sourcesToRemove) {
      if (map.getSource(source)) {
        map.removeSource(source);
        console.log(`Removed diff source: ${source}`);
      }
    }
  } catch (error) {
    console.error("Error cleaning up diff layers:", error);
  }
};

