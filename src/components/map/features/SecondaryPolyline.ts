
import * as maplibregl from 'maplibre-gl';

export const addSecondaryPolyline = (
  map: maplibregl.Map,
  secondaryCoordinates: [number, number][],
  overlayOpacity: number
): void => {
  if (!secondaryCoordinates.length) return;

  console.log("🟢 Adding secondary polyline with", secondaryCoordinates.length, "points");
  console.log("🟢 First few coordinates:", secondaryCoordinates.slice(0, 3));
  console.log("🟢 Last few coordinates:", secondaryCoordinates.slice(-3));

  // Check if map is ready
  if (!map.isStyleLoaded()) {
    console.log("⏳ Map not ready, waiting for style to load");
    map.once('style.load', () => {
      addSecondaryPolyline(map, secondaryCoordinates, overlayOpacity);
    });
    return;
  }

  // Validate coordinates
  const validCoords = secondaryCoordinates.filter(coord => 
    Array.isArray(coord) && 
    coord.length === 2 && 
    !isNaN(coord[0]) && 
    !isNaN(coord[1]) &&
    Math.abs(coord[0]) <= 180 && 
    Math.abs(coord[1]) <= 90
  );

  if (validCoords.length === 0) {
    console.error("❌ No valid coordinates for secondary polyline");
    return;
  }

  const sourceId = 'secondary-polyline-source';
  const layerId = 'secondary-polyline-layer';

  // Remove existing source and layer if they exist
  try {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  } catch (error) {
    console.error("❌ Error removing existing secondary layers:", error);
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
        'line-color': '#10b981',
        'line-width': 4,
        'line-opacity': overlayOpacity / 100
      }
    });

    // Add markers for start and end of secondary route
    if (validCoords.length >= 2) {
      try {
        // Start marker (green with slightly different shade)
        new maplibregl.Marker({color: '#059669'})
          .setLngLat(validCoords[0])
          .addTo(map);
        
        // End marker (orange)
        new maplibregl.Marker({color: '#f59e0b'})
          .setLngLat(validCoords[validCoords.length - 1])
          .addTo(map);
        
        console.log("🚩 Added start/end markers for secondary polyline");
      } catch (err) {
        console.error("❌ Error adding markers for secondary polyline:", err);
      }
    }

    console.log("✅ Secondary polyline added successfully");
  } catch (error) {
    console.error("❌ Error adding secondary polyline to map:", error);
  }
};
