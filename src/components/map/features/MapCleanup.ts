
import * as maplibregl from 'maplibre-gl';
import { cleanupDiffLayers } from './DifferentialAnalysis';

export const cleanupMapLayers = (
  map: maplibregl.Map | null,
  comparisonType: string
): void => {
  if (!map) return;
  
  console.log("Cleaning up map layers for comparison type:", comparisonType);
  
  try {
    const sourceId = 'secondary-polyline-source';
    const layerId = 'secondary-polyline-layer';

    // Remove all markers
    const markers = document.querySelectorAll('.maplibregl-marker');
    markers.forEach(marker => {
      if (marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });

    // Remove layer and source in correct order
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
      console.log("Removed secondary polyline layer");
    }
    
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
      console.log("Removed secondary polyline source");
    }

    // Clean up diff analysis layers
    cleanupDiffLayers(map);
  } catch (error) {
    console.error("Error cleaning up map layers:", error);
  }
};
