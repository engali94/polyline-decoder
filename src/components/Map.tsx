import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapStyle, mapStyles } from '../utils/mapStyles';
import { Settings } from 'lucide-react';

// Temporary public token for development - in production this should be managed securely
mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xnd3p4ZWxzMDM3aDNkcDkwdmRnbGZ2ZSJ9.Q9qSNxrXDTIHoUEd0P3FMA';

interface MapProps {
  coordinates: [number, number][];
  isLoading?: boolean;
}

const Map: React.FC<MapProps> = ({ coordinates, isLoading = false }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentStyle, setCurrentStyle] = useState<MapStyle>('light');
  const [showStyleOptions, setShowStyleOptions] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles[currentStyle].url,
      center: [-74.5, 40],
      zoom: 2,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update map style when changed
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyles[currentStyle].url);
    }
  }, [currentStyle]);

  // Update the polyline on the map when coordinates change
  useEffect(() => {
    if (!map.current || isLoading) return;

    const sourceId = 'polyline-source';
    const layerId = 'polyline-layer';

    const onMapLoad = () => {
      // Remove existing source and layer if they exist
      if (map.current?.getSource(sourceId)) {
        map.current.removeLayer(layerId);
        map.current.removeSource(sourceId);
      }

      if (coordinates.length > 0) {
        // Add source and layer
        map.current?.addSource(sourceId, {
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

        map.current?.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 3
          }
        });

        // Fit bounds to show the entire polyline
        if (coordinates.length > 1) {
          const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord as [number, number]), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
          
          map.current?.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15,
            duration: 1000
          });
        }
      }
    };

    // If the map is already loaded, update immediately
    if (map.current.loaded()) {
      onMapLoad();
    } else {
      // Otherwise wait for the load event
      map.current.once('load', onMapLoad);
    }
  }, [coordinates, isLoading]);

  return (
    <div className="relative h-full w-full animate-fade-in">
      <div ref={mapContainer} className="map-container" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="animate-pulse text-primary">Loading map data...</div>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 z-10">
        <div className="relative">
          <button 
            onClick={() => setShowStyleOptions(!showStyleOptions)}
            className="glass p-2 rounded-lg hover:bg-white/90 transition-all duration-200"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          
          {showStyleOptions && (
            <div className="absolute bottom-full right-0 mb-2 glass rounded-lg p-2 min-w-40 animate-scale-in">
              <div className="text-xs font-medium mb-2 text-muted-foreground">Map Style</div>
              <div className="space-y-1">
                {(Object.keys(mapStyles) as MapStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      setCurrentStyle(style);
                      setShowStyleOptions(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                      currentStyle === style 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    {mapStyles[style].name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
