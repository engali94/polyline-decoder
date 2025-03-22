import * as maplibregl from 'maplibre-gl';

export const addSecondaryPolyline = (
  map: maplibregl.Map,
  secondaryCoordinates: [number, number][],
  overlayOpacity: number,
  color: string = '#10b981',
  lineWidth: number = 8,
  lineDash: number[] = []
): void => {
  if (!secondaryCoordinates || !secondaryCoordinates.length) {
    console.log('No secondary coordinates provided');
    return;
  }

  const sourceId = 'secondary-polyline-source';
  const layerId = 'secondary-polyline-layer';
  const effectiveOpacity = overlayOpacity / 100;

  try {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  } catch (error) {
    console.error('Error cleaning up existing secondary polyline:', error);
  }

  try {
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: secondaryCoordinates,
        },
      },
    });
    console.log('Added secondary polyline source successfully');

    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': color,
        'line-width': lineWidth,
        'line-opacity': effectiveOpacity,
        ...(lineDash.length > 0 ? { 'line-dasharray': lineDash } : {}),
      },
    });
    console.log('Added secondary polyline layer successfully');

    if (secondaryCoordinates.length > 0) {
      try {
        new maplibregl.Marker({ color }).setLngLat(secondaryCoordinates[0]).addTo(map);

        new maplibregl.Marker({ color: '#ef4444' })
          .setLngLat(secondaryCoordinates[secondaryCoordinates.length - 1])
          .addTo(map);

        console.log('Added start/end markers for secondary polyline');
      } catch (markerError) {
        console.error('Error adding markers:', markerError);
      }
    }
  } catch (error) {
    console.error('Error adding secondary polyline:', error);
  }
};
