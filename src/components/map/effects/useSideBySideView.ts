import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';

interface UseSideBySideViewProps {
  secondMap: React.MutableRefObject<maplibregl.Map | null>;
  secondaryCoordinates: [number, number][];
  splitViewActive: boolean;
  comparisonMode: boolean;
  validSecondaryCoords: boolean;
  color?: string;
  lineWidth?: number;
  lineDash?: number[];
  secondMapReady: boolean;
}

export const useSideBySideView = ({
  secondMap,
  secondaryCoordinates,
  splitViewActive,
  comparisonMode,
  validSecondaryCoords,
  secondMapReady,
  color = '#10b981',
  lineWidth = 8,
  lineDash = [],
}: UseSideBySideViewProps) => {
  useEffect(() => {
    console.log('🔄 Side-by-side effect triggered:', {
      hasSecondMap: !!secondMap.current,
      secondMapReady,
      splitViewActive,
      comparisonMode,
      secondaryCoordinatesLength: secondaryCoordinates?.length || 0,
      validSecondaryCoordsFromProp: validSecondaryCoords,
      sampleCoords: JSON.stringify(secondaryCoordinates?.slice(0, 2) || []),
      color,
      lineWidth,
      lineDash,
    });

    if (!secondMapReady || !secondMap.current) {
      console.log('❌ No second map instance available or not ready for side-by-side view.', { secondMapReady, hasMapRef: !!secondMap.current });
      // If the map was previously ready and now isn't (e.g. secondMapReady became false),
      // updateSecondMapFeatures will handle cleanup if called, but it might not be if we return here.
      // However, MapRenderers should set secondMapReady to false when the map is removed,
      // and if splitViewActive is also false, updateSecondMapFeatures called below will clean up.
      // If splitViewActive is true but secondMapReady is false, we should prevent drawing.
      return;
    }
    const mapInstance = secondMap.current;

    const updateSecondMapFeatures = () => {
      console.log('🛠️ updateSecondMapFeatures called. Map instance available. SplitViewActive:', splitViewActive, 'ValidSecondaryCoords:', validSecondaryCoords);

      const layerId = 'second-polyline-layer';
      const sourceId = 'second-polyline-source';

      const removeMapFeatures = () => {
        try {
          if (mapInstance.getLayer(layerId)) {
            mapInstance.removeLayer(layerId);
            console.log(`➖ Removed layer "${layerId}" from second map.`);
          }
          if (mapInstance.getSource(sourceId)) {
            mapInstance.removeSource(sourceId);
            console.log(`➖ Removed source "${sourceId}" from second map.`);
          }
        } catch (error) {
          console.error('Error removing features from second map:', error);
        }
      };

      if (!splitViewActive) {
        console.log('ℹ️ Split view not active. Ensuring second map features are removed.');
        removeMapFeatures();
        return;
      }

      if (!validSecondaryCoords || !secondaryCoordinates || secondaryCoordinates.length === 0) {
        console.log('❌ Secondary coordinates not valid or empty. Ensuring second map features are removed.');
        removeMapFeatures();
        return;
      }
      
      console.log(
        '🗺️ Adding/updating secondary polyline on second map:',
        secondaryCoordinates.length, 'points'
      );
      removeMapFeatures(); // Clean up before adding new ones

      try {
        mapInstance.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: secondaryCoordinates },
          },
        });
        console.log(`✅ Added source "${sourceId}" to second map.`);

        mapInstance.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 
            'line-color': color, 
            'line-width': lineWidth, 
            ...(lineDash && lineDash.length > 0 && { 'line-dasharray': lineDash }) 
          },
        });
        console.log(`✅ Added layer "${layerId}" to second map.`);

        const bounds = secondaryCoordinates.reduce(
          (b, coord) => b.extend(coord as maplibregl.LngLatLike),
          new maplibregl.LngLatBounds(
            secondaryCoordinates[0] as maplibregl.LngLatLike,
            secondaryCoordinates[0] as maplibregl.LngLatLike
          )
        );
        if (!bounds.isEmpty()) {
          console.log('✈️ Fitting bounds on second map:', bounds.toArray());
          mapInstance.fitBounds(bounds, { padding: 80, duration: 1000, maxZoom: 18 });
        }
      } catch (error) {
        console.error('Error adding source/layer or fitting bounds on second map:', error);
      }
    };

    // Since this effect runs when secondMapReady becomes true (or other relevant props change),
    // and secondMapReady is set after the map's 'load' event in MapRenderers,
    // we can assume the map is ready for source/layer manipulation if secondMapReady is true.
    console.log('✅ Second map is considered ready due to secondMapReady=true. Calling updateSecondMapFeatures.');
    updateSecondMapFeatures();

    const resizeObserver = new ResizeObserver(() => {
      if (secondMap.current) { // Check ref directly in observer callback
        console.log('📏 Resizing second map due to observer.');
        secondMap.current.resize();
      }
    });

    // Ensure mapInstance.getCanvas() is available before trying to get parentNode
    const canvas = mapInstance.getCanvas();
    if (canvas) {
      const parentNode = canvas.parentNode;
      if (parentNode) {
        resizeObserver.observe(parentNode as HTMLElement);
      }
    } else {
      console.warn('⚠️ Second map canvas not available for ResizeObserver.');
    }
    
    return () => {
      console.log('🧹 useEffect cleanup for useSideBySideView.');
      // No specific map 'load' listener to remove from this hook anymore
      resizeObserver.disconnect();
      console.log('🧹 Disconnected resize observer for second map.');
      // Consider if features should be removed here if the component unmounts
      // while splitViewActive is true. Current logic in updateSecondMapFeatures
      // relies on splitViewActive being false for cleanup, or invalid coords.
      // If the hook itself is unmounted (e.g. MapEffects unmounts),
      // MapRenderers' cleanup for the second map should handle its removal.
    };
  }, [secondMap, secondaryCoordinates, splitViewActive, comparisonMode, validSecondaryCoords, color, lineWidth, lineDash, secondMapReady]);
};
