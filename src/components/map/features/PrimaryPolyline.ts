
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
    
    // Check for coordinates in unusual places (like the sea)
    const avgLng = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
    const avgLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
    console.log(`Average position: [${avgLng}, ${avgLat}]`);
    
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

    // Create and extend bounds
    const bounds = new maplibregl.LngLatBounds();
    let validCoords = false;
    
    coordinates.forEach(coord => {
      if (Array.isArray(coord) && coord.length === 2 && 
          !isNaN(coord[0]) && !isNaN(coord[1])) {
        bounds.extend(coord as [number, number]);
        validCoords = true;
      }
    });
    
    if (validCoords && !bounds.isEmpty()) {
      console.log("Fitting to bounds:", bounds.toString());
      
      // Use immediate bounds fitting with no animation for consistent behavior
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 0 // No animation for immediate display
      });
    } else if (coordinates.length === 1) {
      // If we have just one coordinate, center immediately
      console.log("Centering on single coordinate:", coordinates[0]);
      map.jumpTo({
        center: coordinates[0],
        zoom: 14
      });
    } else {
      console.warn("No valid coordinates found for bounds calculation");
    }
  } catch (error) {
    console.error("Error adding polyline to map:", error);
  }
};
