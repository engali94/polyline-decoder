
import * as maplibregl from 'maplibre-gl';
import { cleanupDiffLayers } from './DifferentialAnalysis';

export const cleanupMapLayers = (
  map: maplibregl.Map | null,
  comparisonType: string
): void => {
  if (!map) return;
  
  try {
    console.log("🧹 Cleaning up map layers for comparison type:", comparisonType);
    
    // Clean up primary polyline
    if (map.getLayer('polyline-layer')) {
      map.removeLayer('polyline-layer');
    }
    if (map.getSource('polyline-source')) {
      map.removeSource('polyline-source');
    }
    
    // Clean up secondary polyline
    if (map.getLayer('secondary-polyline-layer')) {
      map.removeLayer('secondary-polyline-layer');
    }
    if (map.getSource('secondary-polyline-source')) {
      map.removeSource('secondary-polyline-source');
    }

    // Clean up markers
    const markers = document.querySelectorAll('.maplibregl-marker');
    markers.forEach(marker => {
      if (marker.parentElement && marker.parentElement.isEqualNode(map.getContainer())) {
        marker.remove();
      }
    });

    // Clean up diff layers
    cleanupDiffLayers(map);
    
    console.log("✅ Map layers cleaned up successfully");
  } catch (error) {
    console.error("❌ Error cleaning up map layers:", error);
  }
};
