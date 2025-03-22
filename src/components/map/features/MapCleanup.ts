
import * as maplibregl from 'maplibre-gl';
import { cleanupDiffLayers } from './DifferentialAnalysis';

export const cleanupMapLayers = (
  map: maplibregl.Map | null,
  comparisonType: string
): void => {
  if (!map) return;
  
  console.log("Cleaning up map layers for comparison type:", comparisonType);
  
  try {
    const markerCleanup = () => {
      const markers = document.querySelectorAll('.maplibregl-marker');
      console.log(`Found ${markers.length} markers to clean up`);
      
      markers.forEach(marker => {
        if (marker.parentNode) {
          marker.parentNode.removeChild(marker);
          console.log("Removed marker from DOM");
        }
      });
    };
    
    markerCleanup();
    setTimeout(markerCleanup, 100);

    const layerIds = ['secondary-polyline-layer', 'second-polyline-layer'];
    const sourceIds = ['secondary-polyline-source', 'second-polyline-source'];
    
    for (const layerId of layerIds) {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        console.log(`Removed layer: ${layerId}`);
      }
    }
    
    setTimeout(() => {
      for (const sourceId of sourceIds) {
        try {
          if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
            console.log(`Removed source: ${sourceId}`);
          }
        } catch (e) {
          console.log(`Error removing source ${sourceId}:`, e);
        }
      }
    }, 50);

    if (comparisonType === 'diff') {
      cleanupDiffLayers(map);
    }
  } catch (error) {
    console.error("Error cleaning up map layers:", error);
  }
};
