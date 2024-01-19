
import * as maplibregl from 'maplibre-gl';

export const addDivergencePoints = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  secondaryCoordinates: [number, number][]
): void => {
  if (coordinates.length === 0 || secondaryCoordinates.length === 0) return;

  const divergencePoints: [number, number][] = [];
  
  // Find points that diverge significantly between the two paths
  for (let i = 0; i < Math.min(coordinates.length, secondaryCoordinates.length); i += 10) {
    const primary = coordinates[i];
    const secondary = secondaryCoordinates[i];
    
    const dx = primary[0] - secondary[0];
    const dy = primary[1] - secondary[1];
    const distSquared = dx * dx + dy * dy;
    
    // Add points where the divergence is significant
    if (distSquared > 0.0001) {
      divergencePoints.push(primary);
    }
  }
  
  // Remove existing layer if it exists
  if (map.getSource('divergence-source')) {
    map.removeLayer('divergence-layer');
    map.removeSource('divergence-source');
  }
  
  if (divergencePoints.length > 0) {
    // Add new source and layer for divergence points
    map.addSource('divergence-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: divergencePoints.map(point => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: point
          }
        }))
      }
    });
    
    map.addLayer({
      id: 'divergence-layer',
      type: 'circle',
      source: 'divergence-source',
      paint: {
        'circle-radius': 5,
        'circle-color': '#ef4444',
        'circle-opacity': 0.8
      }
    });
  }
};

export const addIntersectionPoints = (
  map: maplibregl.Map,
  coordinates: [number, number][]
): void => {
  if (coordinates.length === 0) return;

  // Sample points along the path to highlight as intersections
  const intersectionPoints: [number, number][] = [];
  
  for (let i = 5; i < coordinates.length; i += 15) {
    intersectionPoints.push(coordinates[i]);
  }
  
  // Remove existing layer if it exists
  if (map.getSource('intersection-source')) {
    map.removeLayer('intersection-layer');
    map.removeSource('intersection-source');
  }
  
  if (intersectionPoints.length > 0) {
    // Add new source and layer for intersection points
    map.addSource('intersection-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: intersectionPoints.map(point => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: point
          }
        }))
      }
    });
    
    map.addLayer({
      id: 'intersection-layer',
      type: 'circle',
      source: 'intersection-source',
      paint: {
        'circle-radius': 5,
        'circle-color': '#f59e0b',
        'circle-opacity': 0.8
      }
    });
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

  if (showDivergence) {
    addDivergencePoints(map, coordinates, secondaryCoordinates);
  }

  if (showIntersections) {
    addIntersectionPoints(map, coordinates);
  }
};

export const cleanupDiffLayers = (map: maplibregl.Map): void => {
  if (map.getSource('divergence-source')) {
    map.removeLayer('divergence-layer');
    map.removeSource('divergence-source');
  }
  
  if (map.getSource('intersection-source')) {
    map.removeLayer('intersection-layer');
    map.removeSource('intersection-source');
  }
};
