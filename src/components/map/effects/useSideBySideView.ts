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
}

export const useSideBySideView = ({
  secondMap,
  secondaryCoordinates,
  splitViewActive,
  comparisonMode,
  validSecondaryCoords,
  color = '#10b981',
  lineWidth = 8,
  lineDash = [],
}: UseSideBySideViewProps) => {
  useEffect(() => {
    console.log('🔄 Side-by-side effect triggered:', {
      hasSecondMap: !!secondMap.current,
      splitViewActive,
      comparisonMode,
      secondaryCoordinatesLength: secondaryCoordinates?.length || 0,
      hasCoords: secondaryCoordinates && secondaryCoordinates.length > 0,
      sampleCoords: JSON.stringify(secondaryCoordinates?.slice(0, 2) || []),
      color,
      lineWidth,
      lineDash,
    });

    if (!secondMap.current) {
      console.log('❌ No second map available');
      return;
    }

    if (!splitViewActive || !comparisonMode) {
      console.log('❌ Split view or comparison mode not active');
      return;
    }

    if (!secondaryCoordinates || secondaryCoordinates.length < 2) {
      console.log('❌ Secondary coordinates missing or insufficient');
      return;
    }

    const addPolylinesToSecondMap = () => {
      console.log(
        '🗺️ Adding secondary polyline to second map:',
        secondaryCoordinates.length,
        'points',
        JSON.stringify(secondaryCoordinates.slice(0, 2))
      );

      if (!secondMap.current) return;

      // Clean up any existing layers on second map
      try {
        if (secondMap.current.getLayer('second-polyline-layer')) {
          secondMap.current.removeLayer('second-polyline-layer');
        }
        if (secondMap.current.getSource('second-polyline-source')) {
          secondMap.current.removeSource('second-polyline-source');
        }
      } catch (error) {
        console.error('Error cleaning up second map:', error);
      }

      try {
        // Add the GeoJSON source for the secondary polyline
        secondMap.current.addSource('second-polyline-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: secondaryCoordinates,
            },
          },
        });
        console.log('✅ Added polyline source to second map');

        // Add the line layer for the secondary polyline
        secondMap.current.addLayer({
          id: 'second-polyline-layer',
          type: 'line',
          source: 'second-polyline-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': color,
            'line-width': lineWidth,
            'line-opacity': 1,
            ...(lineDash.length > 0 ? { 'line-dasharray': lineDash } : {}),
          },
        });
        console.log('✅ Added polyline layer to second map');

        if (secondaryCoordinates.length > 0) {
          new maplibregl.Marker({ color }) // Green start marker
            .setLngLat(secondaryCoordinates[0])
            .addTo(secondMap.current);

          new maplibregl.Marker({ color: '#ef4444' })
            .setLngLat(secondaryCoordinates[secondaryCoordinates.length - 1])
            .addTo(secondMap.current);

          console.log(
            '✅ Added markers at:',
            secondaryCoordinates[0],
            'and',
            secondaryCoordinates[secondaryCoordinates.length - 1]
          );
        }

        try {
          const bounds = new maplibregl.LngLatBounds();
          secondaryCoordinates.forEach(coord => bounds.extend(coord as [number, number]));
          secondMap.current.fitBounds(bounds, { padding: 50, duration: 1000 });
          console.log('✅ Fit map to polyline bounds');
        } catch (e) {
          console.error('Error fitting map to bounds:', e);
        }

        console.log('✅ Successfully added secondary polyline to second map');
      } catch (error) {
        console.error('Error adding secondary polyline to second map:', error);
      }
    };

    const ensureMapLoaded = () => {
      if (!secondMap.current) return;

      if (secondMap.current.loaded()) {
        console.log('✅ Second map already loaded, adding polyline now');
        addPolylinesToSecondMap();
      } else {
        console.log('⏳ Second map loading, waiting for load event');

        secondMap.current.once('load', () => {
          console.log("Map 'load' event fired");
          addPolylinesToSecondMap();
        });

        secondMap.current.once('idle', () => {
          console.log("Map 'idle' event fired");
          if (!secondMap.current?.getSource('second-polyline-source')) {
            addPolylinesToSecondMap();
          }
        });

        setTimeout(() => {
          if (secondMap.current && !secondMap.current.getSource('second-polyline-source')) {
            console.log('⚠️ Using fallback timeout to add polyline');
            addPolylinesToSecondMap();
          }
        }, 1000);
      }
    };

    const handleSecondMapReady = () => {
      console.log('🎯 Received second-map-ready event');
      if (secondMap.current && !secondMap.current.getSource('second-polyline-source')) {
        addPolylinesToSecondMap();
      }
    };
    window.addEventListener('second-map-ready', handleSecondMapReady);

    setTimeout(ensureMapLoaded, 300);

    setTimeout(() => {
      if (secondMap.current && !secondMap.current.getSource('second-polyline-source')) {
        console.log('🔄 Final attempt to add secondary polyline');
        addPolylinesToSecondMap();
      }
    }, 2000);

    return () => {
      if (secondMap.current) {
        try {
          window.removeEventListener('second-map-ready', handleSecondMapReady);

          const markers = document.querySelectorAll('.maplibregl-marker');
          markers.forEach(marker => {
            if (marker.parentNode) {
              marker.parentNode.removeChild(marker);
            }
          });

          if (secondMap.current.getLayer('second-polyline-layer')) {
            secondMap.current.removeLayer('second-polyline-layer');
          }
          if (secondMap.current.getSource('second-polyline-source')) {
            secondMap.current.removeSource('second-polyline-source');
          }
        } catch (error) {
          console.error('Error in cleanup of second map effect:', error);
        }
      }
    };
  }, [
    secondaryCoordinates,
    splitViewActive,
    secondMap,
    comparisonMode,
    validSecondaryCoords,
    color,
    lineWidth,
    lineDash,
  ]);
};
