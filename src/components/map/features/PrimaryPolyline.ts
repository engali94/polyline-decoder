
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
    // Log all coordinates for debugging
    console.log("All coordinates:", JSON.stringify(coordinates));
    
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

    // Fit the map to the polyline bounds with better handling
    if (coordinates.length >= 1) {
      const bounds = new maplibregl.LngLatBounds();
      
      coordinates.forEach(coord => {
        if (Array.isArray(coord) && coord.length === 2 && 
            !isNaN(coord[0]) && !isNaN(coord[1])) {
          bounds.extend(coord as [number, number]);
        }
      });
      
      if (!bounds.isEmpty()) {
        console.log("Fitting to bounds:", bounds.toString());
        // Use immediate fitBounds to ensure it happens right away
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
          duration: 0 // No animation to ensure immediate display
        });
      } else if (coordinates.length === 1) {
        // If we have just one coordinate, center on it immediately
        console.log("Centering on single coordinate:", coordinates[0]);
        map.jumpTo({
          center: coordinates[0],
          zoom: 14
        });
      }
    }
  } catch (error) {
    console.error("Error adding polyline to map:", error);
  }
};
