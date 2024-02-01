
import * as maplibregl from 'maplibre-gl';
import { cleanupDiffLayers } from './DifferentialAnalysis';

export const cleanupMapLayers = (
  map: maplibregl.Map | null,
  comparisonType: string
): void => {
  if (!map) return;
  
  console.log("Cleaning up map layers for comparison type:", comparisonType);
  
  try {
    // First remove all markers from the DOM
    const markers = document.querySelectorAll('.maplibregl-marker');
    markers.forEach(marker => {
      if (marker.parentNode) {
        marker.parentNode.removeChild(marker);
      }
    });

    // Then remove layers and sources in correct order
    const layerIds = ['secondary-polyline-layer', 'second-polyline-layer'];
    const sourceIds = ['secondary-polyline-source', 'second-polyline-source'];
    
    // Remove layers first
    for (const layerId of layerIds) {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        console.log(`Removed layer: ${layerId}`);
      }
    }
    
    // Then remove sources
    for (const sourceId of sourceIds) {
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
        console.log(`Removed source: ${sourceId}`);
      }
    }

    // Clean up diff analysis layers if needed
    if (comparisonType === 'diff') {
      cleanupDiffLayers(map);
    }
  } catch (error) {
    console.error("Error cleaning up map layers:", error);
  }
};
