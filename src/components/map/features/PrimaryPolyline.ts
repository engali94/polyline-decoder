
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
    console.log("First few coordinates:", JSON.stringify(coordinates.slice(0, 5)));
    console.log("Last few coordinates:", JSON.stringify(coordinates.slice(-5)));
    
    // Calculate center point to help with debugging
    const avgLng = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
    const avgLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
    console.log(`Average position: [${avgLng.toFixed(4)}, ${avgLat.toFixed(4)}]`);
    
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

    // Create bounds for visible map area
    if (coordinates.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      let validCoords = false;
      
      for (const coord of coordinates) {
        if (Array.isArray(coord) && coord.length === 2 && 
            !isNaN(coord[0]) && !isNaN(coord[1]) &&
            Math.abs(coord[0]) <= 180 && Math.abs(coord[1]) <= 90) {
          bounds.extend(coord as [number, number]);
          validCoords = true;
        }
      }
      
      if (validCoords) {
        console.log("Fitting to bounds:", bounds.toString());
        console.log("NE:", bounds.getNorthEast().toString());
        console.log("SW:", bounds.getSouthWest().toString());
        
        // Use immediate bounds fitting with padding and no animation
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
        
        // Last resort: just try to center on the first coordinate
        if (coordinates[0] && coordinates[0].length === 2) {
          console.log("Emergency centering on first coordinate:", coordinates[0]);
          map.jumpTo({
            center: coordinates[0],
            zoom: 10
          });
        }
      }
    }
  } catch (error) {
    console.error("Error adding polyline to map:", error);
  }
};
