
import * as maplibregl from 'maplibre-gl';

export const addPrimaryPolyline = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  isLoading: boolean
): void => {
  if (isLoading || !coordinates.length) return;

  console.log("📍 Adding primary polyline with", coordinates.length, "points");
  console.log("📍 First few coordinates:", coordinates.slice(0, 3));
  console.log("📍 Last few coordinates:", coordinates.slice(-3));

  // Check if map is loaded and has a style
  if (!map.isStyleLoaded()) {
    console.log("🔄 Map style not loaded yet, waiting...");
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
    console.error("❌ Error removing existing layers:", error);
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

    // Create bounds for visible map area
    if (coordinates.length > 0) {
      // For Saudi Arabia, set a fixed default view if coordinates are in that region
      const isSaudiArabia = coordinates.some(([lng, lat]) => 
        lat >= 20 && lat <= 30 && lng >= 40 && lng <= 50
      );
      
      if (isSaudiArabia) {
        console.log("🇸🇦 Saudi Arabia coordinates detected - using optimized view");
        // Center on Riyadh area
        map.jumpTo({
          center: [46.7, 24.7],
          zoom: 8
        });
        
        // Then fit bounds with more padding
        const bounds = new maplibregl.LngLatBounds();
        for (const coord of coordinates) {
          bounds.extend(coord as [number, number]);
        }
        
        // Use a longer duration for the smooth transition after initial center
        map.fitBounds(bounds, {
          padding: 100,
          maxZoom: 14,
          duration: 500
        });
      } else {
        // Regular worldwide coordinates
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
          console.log("🗺️ Fitting to bounds:", bounds.toString());
          
          // Immediately jump to the approximate center first
          const center = [
            (bounds.getEast() + bounds.getWest()) / 2,
            (bounds.getNorth() + bounds.getSouth()) / 2
          ];
          map.jumpTo({
            center: center as [number, number],
            zoom: 7
          });
          
          // Then fit bounds with a short animation
          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15,
            duration: 500
          });
        } else if (coordinates.length === 1) {
          // If we have just one coordinate, center immediately
          console.log("📍 Centering on single coordinate:", coordinates[0]);
          map.jumpTo({
            center: coordinates[0],
            zoom: 14
          });
        }
      }
    }
    
    // Add markers at start and end of route for better visibility
    if (coordinates.length >= 2) {
      // Start marker (green)
      new maplibregl.Marker({color: '#10b981'})
        .setLngLat(coordinates[0])
        .addTo(map);
      
      // End marker (red)
      new maplibregl.Marker({color: '#ef4444'})
        .setLngLat(coordinates[coordinates.length - 1])
        .addTo(map);
      
      console.log("🚩 Added start/end markers to map");
    }
  } catch (error) {
    console.error("❌ Error adding polyline to map:", error);
  }
};
