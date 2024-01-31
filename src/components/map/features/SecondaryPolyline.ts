
import * as maplibregl from 'maplibre-gl';

export const addSecondaryPolyline = (
  map: maplibregl.Map,
  secondaryCoordinates: [number, number][],
  overlayOpacity: number
): void => {
  if (!secondaryCoordinates.length) {
    console.warn('No secondary coordinates provided');
    return;
  }

  console.log('Adding secondary polyline with', secondaryCoordinates.length, 'points and opacity', overlayOpacity);
  
  const sourceId = 'secondary-polyline-source';
  const layerId = 'secondary-polyline-layer';

  // Remove existing source and layer if they exist
  if (map.getSource(sourceId)) {
    try {
      map.removeLayer(layerId);
      map.removeSource(sourceId);
    } catch (error) {
      console.error('Error removing existing secondary polyline:', error);
    }
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
        'line-color': '#10b981',
        'line-width': 4,
        'line-opacity': overlayOpacity / 100
      }
    });
    
    console.log('Secondary polyline added successfully');
  } catch (error) {
    console.error('Error adding secondary polyline:', error);
  }
};
