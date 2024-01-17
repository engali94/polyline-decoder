import React, { useRef, useEffect, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapStyle, mapStyles, loadCustomStyles, CustomMapStyle, saveCustomStyle } from '../utils/mapStyles';
import { Settings, Plus, X, Split, Layers, Diff } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from './ui/dialog';
import { toast } from './ui/use-toast';

interface MapProps {
  coordinates: [number, number][];
  secondaryCoordinates?: [number, number][];
  isLoading?: boolean;
  comparisonMode?: boolean;
  comparisonType?: 'overlay' | 'sideBySide' | 'diff';
  overlayOpacity?: number;
  showDivergence?: boolean;
  showIntersections?: boolean;
}

type StyleOption = {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
};

const Map: React.FC<MapProps> = ({ 
  coordinates, 
  secondaryCoordinates = [], 
  isLoading = false,
  comparisonMode = false,
  comparisonType = 'overlay',
  overlayOpacity = 50,
  showDivergence = true,
  showIntersections = true
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [styleOptions, setStyleOptions] = useState<StyleOption[]>([]);
  const [currentStyleId, setCurrentStyleId] = useState<string>('osm');
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [showCustomStyleDialog, setShowCustomStyleDialog] = useState(false);
  const [newStyleName, setNewStyleName] = useState('');
  const [newStyleUrl, setNewStyleUrl] = useState('');
  const [splitViewActive, setSplitViewActive] = useState(false);
  const secondMapContainer = useRef<HTMLDivElement>(null);
  const secondMap = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    const builtInStyles = Object.entries(mapStyles).map(([id, style]) => ({
      id,
      name: style.name,
      url: style.url
    }));
    
    const customStyles = Object.entries(loadCustomStyles()).map(([id, style]) => ({
      id,
      name: style.name,
      url: style.url,
      isCustom: true
    }));
    
    setStyleOptions([...builtInStyles, ...customStyles]);
  }, []);

  useEffect(() => {
    if (comparisonMode && comparisonType === 'sideBySide') {
      setSplitViewActive(true);
    } else {
      setSplitViewActive(false);
    }
  }, [comparisonMode, comparisonType]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const currentStyle = styleOptions.find(style => style.id === currentStyleId);
    if (!currentStyle) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: currentStyle.url,
      center: [-74.5, 40],
      zoom: 2,
      attributionControl: false
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [styleOptions.length]);

  useEffect(() => {
    if (!splitViewActive || !secondMapContainer.current) return;

    const currentStyle = styleOptions.find(style => style.id === currentStyleId);
    if (!currentStyle) return;

    secondMap.current = new maplibregl.Map({
      container: secondMapContainer.current,
      style: currentStyle.url,
      center: [-74.5, 40],
      zoom: 2,
      attributionControl: false
    });

    secondMap.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    const syncMaps = (sourceMap: maplibregl.Map, targetMap: maplibregl.Map) => {
      sourceMap.on('move', () => {
        if (targetMap.getCenter().toString() === sourceMap.getCenter().toString()) {
          return;
        }
        targetMap.setCenter(sourceMap.getCenter());
        targetMap.setZoom(sourceMap.getZoom());
        targetMap.setBearing(sourceMap.getBearing());
        targetMap.setPitch(sourceMap.getPitch());
      });
    };

    if (map.current) {
      syncMaps(map.current, secondMap.current);
      syncMaps(secondMap.current, map.current);
    }

    return () => {
      if (secondMap.current) {
        secondMap.current.remove();
      }
    };
  }, [splitViewActive, styleOptions.length]);

  useEffect(() => {
    if (map.current && styleOptions.length > 0) {
      const currentStyle = styleOptions.find(style => style.id === currentStyleId);
      if (currentStyle) {
        try {
          map.current.setStyle(currentStyle.url);
        } catch (error) {
          console.error('Error setting map style:', error);
          toast({
            title: 'Error Loading Map Style',
            description: 'Failed to load the selected map style. The URL might be invalid or requires authentication.',
            variant: 'destructive'
          });
        }
      }
    }

    if (secondMap.current && styleOptions.length > 0) {
      const currentStyle = styleOptions.find(style => style.id === currentStyleId);
      if (currentStyle) {
        try {
          secondMap.current.setStyle(currentStyle.url);
        } catch (error) {
          console.error('Error setting map style for second map:', error);
        }
      }
    }
  }, [currentStyleId, styleOptions]);

  useEffect(() => {
    if (!map.current || isLoading) return;

    const sourceId = 'polyline-source';
    const layerId = 'polyline-layer';

    const onMapLoad = () => {
      if (map.current?.getSource(sourceId)) {
        map.current.removeLayer(layerId);
        map.current.removeSource(sourceId);
      }

      if (coordinates.length > 0) {
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

        if (coordinates.length > 1) {
          const bounds = coordinates.reduce(
            (bounds, coord) => bounds.extend(coord as [number, number]), 
            new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
          );
          
          map.current?.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15,
            duration: 1000
          });
        }
      }
    };

    if (map.current.loaded()) {
      onMapLoad();
    } else {
      map.current.once('load', onMapLoad);
    }
  }, [coordinates, isLoading]);

  useEffect(() => {
    if (!map.current || isLoading || !comparisonMode || !secondaryCoordinates.length) return;
    if (comparisonType === 'sideBySide' && splitViewActive) return;

    const sourceId = 'secondary-polyline-source';
    const layerId = 'secondary-polyline-layer';

    const onMapLoad = () => {
      if (map.current?.getSource(sourceId)) {
        map.current.removeLayer(layerId);
        map.current.removeSource(sourceId);
      }

      map.current?.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: secondaryCoordinates
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
          'line-color': '#10b981',
          'line-width': 3,
          'line-opacity': overlayOpacity / 100
        }
      });

      if (comparisonType === 'diff') {
        if (showDivergence) {
          addDivergencePoints();
        }

        if (showIntersections) {
          addIntersectionPoints();
        }
      }
    };

    const addDivergencePoints = () => {
      const divergencePoints: [number, number][] = [];
      
      for (let i = 0; i < Math.min(coordinates.length, secondaryCoordinates.length); i += 10) {
        const primary = coordinates[i];
        const secondary = secondaryCoordinates[i];
        
        const dx = primary[0] - secondary[0];
        const dy = primary[1] - secondary[1];
        const distSquared = dx * dx + dy * dy;
        
        if (distSquared > 0.0001) {
          divergencePoints.push(primary);
        }
      }
      
      if (divergencePoints.length > 0) {
        map.current?.addSource('divergence-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: divergencePoints.map(point => ({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: point
              }
            }))
          }
        });
        
        map.current?.addLayer({
          id: 'divergence-layer',
          type: 'circle',
          source: 'divergence-source',
          paint: {
            'circle-radius': 5,
            'circle-color': '#ef4444',
            'circle-opacity': 0.8
          }
        });
      }
    };
    
    const addIntersectionPoints = () => {
      const intersectionPoints: [number, number][] = [];
      
      for (let i = 5; i < Math.min(coordinates.length, secondaryCoordinates.length); i += 15) {
        const primary = coordinates[i];
        intersectionPoints.push(primary);
      }
      
      if (intersectionPoints.length > 0) {
        map.current?.addSource('intersection-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: intersectionPoints.map(point => ({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: point
              }
            }))
          }
        });
        
        map.current?.addLayer({
          id: 'intersection-layer',
          type: 'circle',
          source: 'intersection-source',
          paint: {
            'circle-radius': 5,
            'circle-color': '#f59e0b',
            'circle-opacity': 0.8
          }
        });
      }
    };

    if (map.current.loaded()) {
      onMapLoad();
    } else {
      map.current.once('load', onMapLoad);
    }

    return () => {
      if (map.current?.getSource(sourceId)) {
        map.current.removeLayer(layerId);
        map.current.removeSource(sourceId);
      }

      if (comparisonType === 'diff') {
        if (map.current?.getSource('divergence-source')) {
          map.current.removeLayer('divergence-layer');
          map.current.removeSource('divergence-source');
        }
        
        if (map.current?.getSource('intersection-source')) {
          map.current.removeLayer('intersection-layer');
          map.current.removeSource('intersection-source');
        }
      }
    };
  }, [
    secondaryCoordinates, 
    comparisonMode, 
    comparisonType, 
    overlayOpacity, 
    showDivergence, 
    showIntersections, 
    splitViewActive
  ]);

  useEffect(() => {
    if (!secondMap.current || isLoading || !splitViewActive) return;

    const sourceId = 'second-primary-polyline-source';
    const layerId = 'second-primary-polyline-layer';

    const onMapLoad = () => {
      if (secondMap.current?.getSource(sourceId)) {
        secondMap.current.removeLayer(layerId);
        secondMap.current.removeSource(sourceId);
      }

      if (secondaryCoordinates.length > 0) {
        secondMap.current?.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: secondaryCoordinates
            }
          }
        });

        secondMap.current?.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#10b981',
            'line-width': 3
          }
        });
      }
    };

    if (secondMap.current.loaded()) {
      onMapLoad();
    } else {
      secondMap.current.once('load', onMapLoad);
    }

    return () => {
      if (secondMap.current?.getSource(sourceId)) {
        secondMap.current.removeLayer(layerId);
        secondMap.current.removeSource(sourceId);
      }
    };
  }, [secondaryCoordinates, splitViewActive]);

  const handleAddCustomStyle = () => {
    if (!newStyleName.trim() || !newStyleUrl.trim()) {
      toast({
        title: 'Invalid Input',
        description: 'Please provide both a name and URL for the custom style.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const id = `custom-${Date.now()}`;
      const newStyle: CustomMapStyle = {
        name: newStyleName.trim(),
        url: newStyleUrl.trim()
      };

      saveCustomStyle(id, newStyle);

      setStyleOptions(prev => [
        ...prev,
        { id, name: newStyle.name, url: newStyle.url, isCustom: true }
      ]);

      setNewStyleName('');
      setNewStyleUrl('');
      setShowCustomStyleDialog(false);

      toast({
        title: 'Style Added',
        description: `The custom style "${newStyle.name}" has been added.`
      });
    } catch (error) {
      console.error('Error adding custom style:', error);
      toast({
        title: 'Error',
        description: 'Failed to add custom style. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="relative h-full w-full animate-fade-in">
      <div className={`h-full w-full ${splitViewActive ? 'hidden md:block md:w-1/2 md:pr-1' : ''}`}>
        <div ref={mapContainer} className="map-container h-full w-full" />
      </div>
      
      {splitViewActive && (
        <div className="h-full md:absolute md:right-0 md:top-0 md:w-1/2 md:pl-1">
          <div ref={secondMapContainer} className="map-container h-full w-full" />
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Split className="h-6 w-6 text-primary-foreground opacity-70" />
          </div>
        </div>
      )}
      
      {comparisonMode && (
        <div className="absolute top-4 left-4 z-10 glass rounded-lg p-2 flex space-x-2">
          <button 
            onClick={() => setSplitViewActive(false)}
            className={`p-1.5 rounded-md ${!splitViewActive ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} hover:bg-opacity-90 transition-colors`}
            title="Overlay Mode"
          >
            <Layers className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setSplitViewActive(true)}
            className={`p-1.5 rounded-md ${splitViewActive ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} hover:bg-opacity-90 transition-colors`}
            title="Side-by-Side Mode"
          >
            <Split className="h-4 w-4" />
          </button>
          <button 
            onClick={() => {}}
            className="p-1.5 rounded-md bg-secondary/70 text-secondary-foreground hover:bg-opacity-90 transition-colors"
            title="Difference Mode"
          >
            <Diff className="h-4 w-4" />
          </button>
        </div>
      )}
      
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
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {styleOptions.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setCurrentStyleId(style.id);
                      setShowStyleOptions(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
                      currentStyleId === style.id 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    {style.name} {style.isCustom && '(Custom)'}
                  </button>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-border">
                <button
                  onClick={() => setShowCustomStyleDialog(true)}
                  className="flex items-center justify-center w-full text-sm text-primary hover:text-primary/80 py-1.5 rounded-md hover:bg-primary/10 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Custom Style
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showCustomStyleDialog} onOpenChange={setShowCustomStyleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Map Style</DialogTitle>
            <DialogDescription>
              Enter details for your custom map style. The style URL should point to a valid MapLibre/Mapbox style JSON.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="style-name">Style Name</label>
              <Input 
                id="style-name"
                value={newStyleName} 
                onChange={(e) => setNewStyleName(e.target.value)}
                placeholder="e.g., My Custom Style"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="style-url">Style URL</label>
              <Input 
                id="style-url"
                value={newStyleUrl} 
                onChange={(e) => setNewStyleUrl(e.target.value)}
                placeholder="https://example.com/style.json"
              />
              <p className="text-xs text-muted-foreground">
                Enter the URL to a MapLibre/Mapbox GL style definition JSON file
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddCustomStyle}>Add Style</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Map;
