
import * as maplibregl from 'maplibre-gl';
import { cleanupDiffLayers } from './DifferentialAnalysis';

export const cleanupMapLayers = (
  map: maplibregl.Map | null,
  comparisonType: string
): void => {
  if (!map) return;
  
  try {
    const sourceId = 'secondary-polyline-source';
    const layerId = 'secondary-polyline-layer';

    if (map.getSource(sourceId)) {
      map.removeLayer(layerId);
      map.removeSource(sourceId);
    }

    cleanupDiffLayers(map);
  } catch (error) {
    console.error("Error cleaning up map layers:", error);
  }
};
