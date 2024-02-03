
import * as maplibregl from 'maplibre-gl';

export const addPrimaryPolyline = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  isLoading: boolean
): void => {
  if (isLoading || !coordinates.length) return;

  console.log("📍 Adding polyline with", coordinates.length, "points");
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

  // Cleanup: Remove any existing markers before adding new ones
  const markers = document.querySelectorAll('.maplibregl-marker');
  markers.forEach(marker => {
    if (marker.parentElement && marker.parentElement.isEqualNode(map.getContainer())) {
      marker.remove();
    }
  });

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

  // Validate coordinates before adding
  const validCoords = coordinates.filter(coord => 
    Array.isArray(coord) && 
    coord.length === 2 && 
    !isNaN(coord[0]) && 
    !isNaN(coord[1]) &&
    Math.abs(coord[0]) <= 180 && 
    Math.abs(coord[1]) <= 90
  );

  if (validCoords.length === 0) {
    console.error("❌ No valid coordinates for polyline");
    return;
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
          coordinates: validCoords
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
        'line-width': 4
      }
    });

    // Create bounds for visible map area
    if (validCoords.length > 0) {
      // Detect if these are likely Saudi Arabia coordinates
      const isSaudiArabia = validCoords.some(([lng, lat]) => 
        lat >= 20 && lat <= 30 && lng >= 40 && lng <= 50
      );
      
      if (isSaudiArabia) {
        console.log("🇸🇦 Saudi Arabia coordinates detected - using optimized view");
        
        // Fit bounds with padding
        const bounds = new maplibregl.LngLatBounds();
        for (const coord of validCoords) {
          bounds.extend(coord);
        }
        
        // Fit bounds with a slight delay to ensure map is ready
        setTimeout(() => {
          map.fitBounds(bounds, {
            padding: 80,
            maxZoom: 15,
            duration: 1000
          });
        }, 100);
      } else {
        // Regular worldwide coordinates
        const bounds = new maplibregl.LngLatBounds();
        
        for (const coord of validCoords) {
          bounds.extend(coord);
        }
        
        console.log("🗺️ Fitting to bounds:", bounds.toString());
        
        // Fit bounds with a slight delay to ensure map is ready
        setTimeout(() => {
          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15,
            duration: 1000
          });
        }, 100);
      }
    }
    
    // Add markers at start and end of route for better visibility
    if (validCoords.length >= 2) {
      try {
        // Start marker (green)
        new maplibregl.Marker({color: '#10b981'})
          .setLngLat(validCoords[0])
          .addTo(map);
        
        // End marker (red)
        new maplibregl.Marker({color: '#ef4444'})
          .setLngLat(validCoords[validCoords.length - 1])
          .addTo(map);
        
        console.log("🚩 Added start/end markers to map");
      } catch (err) {
        console.error("❌ Error adding markers:", err);
      }
    }
  } catch (error) {
    console.error("❌ Error adding polyline to map:", error);
  }
};
