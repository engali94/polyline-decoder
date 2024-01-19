
import * as maplibregl from 'maplibre-gl';

export const addPrimaryPolyline = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  isLoading: boolean
): void => {
  if (isLoading || !coordinates.length) return;

  const sourceId = 'polyline-source';
  const layerId = 'polyline-layer';

  // Remove existing source and layer if they exist
  if (map.getSource(sourceId)) {
    map.removeLayer(layerId);
    map.removeSource(sourceId);
  }

  // Add the new source and layer
  map.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates
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
      'line-color': '#3b82f6',
      'line-width': 3
    }
  });

  // Fit the map to the bounds of the polyline
  if (coordinates.length > 1) {
    const bounds = coordinates.reduce(
      (bounds, coord) => bounds.extend(coord as [number, number]), 
      new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
    );
    
    map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
      duration: 1000
    });
  }
};
