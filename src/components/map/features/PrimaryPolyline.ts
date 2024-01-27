
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

    // Center on Riyadh coordinates for Saudi Arabia if the polyline is likely in that region
    // Riyadh coordinates: approximately [46.6753, 24.7136]
    const riyadhCoordinates: [number, number] = [46.6753, 24.7136];
    
    // First try using the bounds from provided coordinates
    if (coordinates.length > 1) {
      try {
        const bounds = new maplibregl.LngLatBounds();
        
        coordinates.forEach(coord => {
          if (Array.isArray(coord) && coord.length === 2 && 
              !isNaN(coord[0]) && !isNaN(coord[1])) {
            bounds.extend(coord as [number, number]);
          }
        });
        
        if (!bounds.isEmpty()) {
          console.log("Fitting to bounds:", bounds.toString());
          
          // Check if bounds are potentially in Saudi Arabia region (rough check)
          const center = bounds.getCenter();
          const potentiallyInSaudiArabia = 
            center.lng > 34 && center.lng < 56 && 
            center.lat > 16 && center.lat < 33;
            
          if (potentiallyInSaudiArabia) {
            map.fitBounds(bounds, {
              padding: 50,
              maxZoom: 15,
              duration: 1000
            });
          } else {
            // If bounds don't look like they're in Saudi Arabia, force Riyadh
            console.log("Bounds not in Saudi Arabia, centering on Riyadh");
            map.flyTo({
              center: riyadhCoordinates,
              zoom: 12,
              duration: 1000
            });
          }
        } else {
          // Empty bounds fallback
          console.error("Empty bounds from coordinates, centering on Riyadh");
          map.flyTo({
            center: riyadhCoordinates,
            zoom: 12,
            duration: 1000
          });
        }
      } catch (error) {
        console.error("Error fitting bounds, centering on Riyadh:", error);
        map.flyTo({
          center: riyadhCoordinates,
          zoom: 12,
          duration: 1000
        });
      }
    } else if (coordinates.length === 1) {
      // If we have just one coordinate
      map.flyTo({
        center: coordinates[0],
        zoom: 14,
        duration: 1000
      });
    } else {
      // Final fallback to Riyadh
      map.flyTo({
        center: riyadhCoordinates,
        zoom: 12,
        duration: 1000
      });
    }
  } catch (error) {
    console.error("Error adding polyline to map:", error);
  }
};
