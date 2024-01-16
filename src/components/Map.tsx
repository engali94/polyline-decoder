
import React, { useRef, useEffect, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapStyle, mapStyles, loadCustomStyles, CustomMapStyle, saveCustomStyle } from '../utils/mapStyles';
import { Settings, Plus, X } from 'lucide-react';
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
  isLoading?: boolean;
}

type StyleOption = {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
};

const Map: React.FC<MapProps> = ({ coordinates, isLoading = false }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [styleOptions, setStyleOptions] = useState<StyleOption[]>([]);
  const [currentStyleId, setCurrentStyleId] = useState<string>('osm');
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [showCustomStyleDialog, setShowCustomStyleDialog] = useState(false);
  const [newStyleName, setNewStyleName] = useState('');
  const [newStyleUrl, setNewStyleUrl] = useState('');

  // Initialize style options by combining built-in and custom styles
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

  // Initialize the map
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

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [styleOptions.length]);

  // Update map style when changed
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
  }, [currentStyleId, styleOptions]);

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

    // If the map is already loaded, update immediately
    if (map.current.loaded()) {
      onMapLoad();
    } else {
      // Otherwise wait for the load event
      map.current.once('load', onMapLoad);
    }
  }, [coordinates, isLoading]);

  // Handle adding a new custom style
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
      // Generate a unique ID for the custom style
      const id = `custom-${Date.now()}`;
      const newStyle: CustomMapStyle = {
        name: newStyleName.trim(),
        url: newStyleUrl.trim()
      };

      // Save to localStorage
      saveCustomStyle(id, newStyle);

      // Update local state
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
      <div ref={mapContainer} className="map-container h-full w-full" />
      
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

      {/* Dialog for adding custom styles */}
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
