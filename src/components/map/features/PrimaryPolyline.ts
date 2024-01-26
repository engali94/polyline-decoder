
import * as maplibregl from 'maplibre-gl';

export const addPrimaryPolyline = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  isLoading: boolean
): void => {
  if (isLoading || !coordinates.length) return;

  console.log("Adding primary polyline with", coordinates.length, "points");
  console.log("Sample coordinates:", coordinates.slice(0, 3));

  // Check if map is loaded and has a style
  if (!map.isStyleLoaded()) {
    console.log("Map style not loaded yet, waiting...");
    map.once('style.load', () => {
      addPrimaryPolyline(map, coordinates, isLoading);
    });
    return;
  }

  const sourceId = 'polyline-source';
  const layerId = 'polyline-layer';

  // Remove existing source and layer if they exist
  try {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  } catch (error) {
    console.error("Error removing existing layers:", error);
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
      // Create a bounding box from the coordinates
      const bounds = new maplibregl.LngLatBounds();
      
      // Add each coordinate to the bounds
      coordinates.forEach(coord => {
        // Make sure coordinates are valid before adding to bounds
        if (Array.isArray(coord) && coord.length === 2) {
          bounds.extend(coord as [number, number]);
        }
      });
      
      // Only fit bounds if we have a valid bounds object
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
          duration: 1000
        });
      } else {
        console.error("Unable to create valid bounds from coordinates");
      }
    }
  } catch (error) {
    console.error("Error adding polyline to map:", error);
  }
};
