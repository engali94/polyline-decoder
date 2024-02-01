
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
  const effectiveOpacity = Math.max(overlayOpacity, 50) / 100;
  
  console.log('ADDING SECONDARY POLYLINE WITH', secondaryCoordinates.length, 'POINTS:', secondaryCoordinates);
  console.log('Using opacity:', effectiveOpacity);

  const sourceId = 'secondary-polyline-source';
  const layerId = 'secondary-polyline-layer';

  // Clean up existing layers and sources first
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
        'line-color': '#10b981', // Emerald green color
        'line-width': 6, // Increased width for better visibility
        'line-opacity': effectiveOpacity
      }
    });
    
    console.log('✅ Secondary polyline added successfully');
    
    // Add start marker for secondary polyline
    if (secondaryCoordinates.length > 0) {
      new maplibregl.Marker({ color: '#10b981' })
        .setLngLat(secondaryCoordinates[0])
        .addTo(map);
      
      // Add end marker for secondary polyline
      new maplibregl.Marker({ color: '#ef4444' })
        .setLngLat(secondaryCoordinates[secondaryCoordinates.length - 1])
        .addTo(map);
    }
  } catch (error) {
    console.error('Error adding secondary polyline:', error);
  }
};
