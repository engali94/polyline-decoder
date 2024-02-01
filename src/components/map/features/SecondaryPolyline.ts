
import * as maplibregl from 'maplibre-gl';

export const addSecondaryPolyline = (
  map: maplibregl.Map,
  secondaryCoordinates: [number, number][],
  overlayOpacity: number
): void => {
  if (!secondaryCoordinates || secondaryCoordinates.length < 2) {
    console.warn('Secondary polyline coordinates invalid or insufficient:', secondaryCoordinates);
    return;
  }

  // Force opacity to a reasonable minimum to ensure visibility
  const effectiveOpacity = Math.max(overlayOpacity, 30) / 100;
  
  console.log('Adding secondary polyline with', secondaryCoordinates.length, 'points and opacity', effectiveOpacity);

  const sourceId = 'secondary-polyline-source';
  const layerId = 'secondary-polyline-layer';

  // Remove existing source and layer if they exist
  try {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  } catch (error) {
    console.error('Error cleaning up secondary polyline layers:', error);
  }

  try {
    // Add the new source and layer
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: secondaryCoordinates
        }
      }
    });

    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#10b981', // Keep emerald green color
        'line-width': 5, // Increased width for better visibility
        'line-opacity': effectiveOpacity
      }
    });
    
    console.log('Secondary polyline added successfully');
  } catch (error) {
    console.error('Error adding secondary polyline:', error);
  }
};
