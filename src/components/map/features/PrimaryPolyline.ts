import * as maplibregl from 'maplibre-gl';

export const addPrimaryPolyline = (
  map: maplibregl.Map,
  coordinates: [number, number][],
  isLoading: boolean,
  color: string = '#3b82f6',
  lineWidth: number = 4,
  lineDash: number[] = []
): void => {
  if (isLoading || !coordinates.length) return;

  console.log("📍 Adding primary polyline with", coordinates.length, "points");
  console.log("📍 First few coordinates:", coordinates.slice(0, 3));
  console.log("📍 Last few coordinates:", coordinates.slice(-3));
  console.log("🎨 Using color:", color, "width:", lineWidth, "dash:", lineDash);

  if (!map.isStyleLoaded()) {
    console.log("🔄 Map style not loaded yet, waiting...");
    map.once('style.load', () => {
      addPrimaryPolyline(map, coordinates, isLoading, color, lineWidth, lineDash);
    });
    return;
  }

  const sourceId = 'polyline-source';
  const layerId = 'polyline-layer';

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
        'line-color': color,
        'line-width': lineWidth,
        ...(lineDash.length > 0 ? { 'line-dasharray': lineDash } : {})
      }
    });

    if (coordinates.length > 0) {
      const isSaudiArabia = coordinates.some(([lng, lat]) => 
        lat >= 20 && lat <= 30 && lng >= 40 && lng <= 50
      );
      
      if (isSaudiArabia) {
        console.log("🇸🇦 Saudi Arabia coordinates detected - using optimized view");
        
        map.jumpTo({
          center: coordinates[0],
          zoom: 14  // Start with a closer zoom
        });
        
        const bounds = new maplibregl.LngLatBounds();
        for (const coord of coordinates) {
          bounds.extend(coord as [number, number]);
        }
        
        map.fitBounds(bounds, {
          padding: 80,
          maxZoom: 15,
          duration: 500
        });
      } else {
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
          
          const center = [
            (bounds.getEast() + bounds.getWest()) / 2,
            (bounds.getNorth() + bounds.getSouth()) / 2
          ];
          map.jumpTo({
            center: center as [number, number],
            zoom: 7
          });
          
          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15,
            duration: 500
          });
        } else if (coordinates.length === 1) {
          console.log("📍 Centering on single coordinate:", coordinates[0]);
          map.jumpTo({
            center: coordinates[0],
            zoom: 14
          });
        }
      }
    }
    
    if (coordinates.length >= 2) {
      new maplibregl.Marker({color: '#10b981'})
        .setLngLat(coordinates[0])
        .addTo(map);
      
      new maplibregl.Marker({color: '#ef4444'})
        .setLngLat(coordinates[coordinates.length - 1])
        .addTo(map);
      
      console.log("🚩 Added start/end markers to map");
    }
  } catch (error) {
    console.error("❌ Error adding polyline to map:", error);
  }
};
