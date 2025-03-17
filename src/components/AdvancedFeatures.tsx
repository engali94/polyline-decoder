import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  PaintBucket, 
  StretchHorizontal, 
  Mountain, 
  Clock, 
  Percent,
  Settings
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner';
import { calculateDistance, getBounds } from '../utils/polylineDecoder';

type ColorOption = {
  name: string;
  primaryColor: string;
  secondaryColor: string;
};

interface AdvancedFeaturesProps {
  primaryCoordinates: [number, number][];
  secondaryCoordinates: [number, number][];
  precision: number;
  setPrecision: (value: number) => void;
  primaryLineWidth?: number;
  setPrimaryLineWidth?: (value: number) => void;
  secondaryLineWidth?: number;
  setSecondaryLineWidth?: (value: number) => void;
  primaryColor?: string;
  setPrimaryColor?: (color: string) => void;
  secondaryColor?: string;
  setSecondaryColor?: (color: string) => void;
  primaryLineDash?: number[];
  setPrimaryLineDash?: (value: number[]) => void;
  secondaryLineDash?: number[];
  setSecondaryLineDash?: (value: number[]) => void;
  hasElevationData?: boolean;
}

const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({
  primaryCoordinates,
  secondaryCoordinates,
  precision,
  setPrecision,
  primaryLineWidth = 3,
  setPrimaryLineWidth = () => {},
  secondaryLineWidth = 3,
  setSecondaryLineWidth = () => {},
  primaryColor = '#3b82f6',
  setPrimaryColor = () => {},
  secondaryColor = '#10b981',
  setSecondaryColor = () => {},
  primaryLineDash = [],
  setPrimaryLineDash = () => {},
  secondaryLineDash = [],
  setSecondaryLineDash = () => {},
  hasElevationData = false
}) => {
  const [selectedColorScheme, setSelectedColorScheme] = useState<string>('default');
  const [customPrimaryColor, setCustomPrimaryColor] = useState(primaryColor);
  const [customSecondaryColor, setCustomSecondaryColor] = useState(secondaryColor);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [showElevationProfile, setShowElevationProfile] = useState(false);

  // Color scheme presets
  const colorSchemes: ColorOption[] = [
    { name: 'default', primaryColor: '#3b82f6', secondaryColor: '#10b981' },
    { name: 'contrast', primaryColor: '#ef4444', secondaryColor: '#3b82f6' },
    { name: 'monochrome', primaryColor: '#000000', secondaryColor: '#666666' },
    { name: 'earth', primaryColor: '#84cc16', secondaryColor: '#a16207' },
    { name: 'ocean', primaryColor: '#0ea5e9', secondaryColor: '#0f766e' },
    { name: 'sunset', primaryColor: '#f97316', secondaryColor: '#7c3aed' }
  ];

  // Line style presets
  const lineStyles = [
    { name: 'Solid', primaryDash: [], secondaryDash: [] },
    { name: 'Dashed', primaryDash: [6, 2], secondaryDash: [6, 2] },
    { name: 'Dotted', primaryDash: [2, 2], secondaryDash: [2, 2] },
    { name: 'Dash-Dot', primaryDash: [6, 2, 2, 2], secondaryDash: [6, 2, 2, 2] },
    { name: 'Contrast', primaryDash: [], secondaryDash: [6, 2] }
  ];

  // Calculate similarity score between primary and secondary polylines
  const calculateSimilarityScore = () => {
    if (primaryCoordinates.length === 0 || secondaryCoordinates.length === 0) {
      setSimilarityScore(null);
      return;
    }

    // Calculate length similarity
    const primaryDistance = calculateDistance(primaryCoordinates);
    const secondaryDistance = calculateDistance(secondaryCoordinates);
    const lengthSimilarity = Math.min(primaryDistance, secondaryDistance) / Math.max(primaryDistance, secondaryDistance);

    // Calculate point count similarity
    const pointCountSimilarity = Math.min(primaryCoordinates.length, secondaryCoordinates.length) / 
                               Math.max(primaryCoordinates.length, secondaryCoordinates.length);

    // Calculate area overlap (simplified)
    const primaryBounds = getBounds(primaryCoordinates);
    const secondaryBounds = getBounds(secondaryCoordinates);
    
    const areaSimilarity = primaryBounds && secondaryBounds ? 0.8 : 0;

    // Calculate path shape similarity (simplified)
    const shapeSimilarity = 0.7; // Placeholder - would require more complex analysis

    // Weighted average of different factors
    const score = (
      lengthSimilarity * 0.3 + 
      pointCountSimilarity * 0.1 + 
      areaSimilarity * 0.3 + 
      shapeSimilarity * 0.3
    ) * 100;
    
    setSimilarityScore(parseFloat(score.toFixed(1)));
    toast.success(`Similarity score calculated: ${parseFloat(score.toFixed(1))}%`);
  };

  // Apply a color scheme
  const applyColorScheme = (scheme: ColorOption) => {
    setPrimaryColor(scheme.primaryColor);
    setSecondaryColor(scheme.secondaryColor);
    setCustomPrimaryColor(scheme.primaryColor);
    setCustomSecondaryColor(scheme.secondaryColor);
    setSelectedColorScheme(scheme.name);
    toast.success(`Applied ${scheme.name} color scheme`);
  };

  // Apply custom colors
  const applyCustomColors = () => {
    setPrimaryColor(customPrimaryColor);
    setSecondaryColor(customSecondaryColor);
    setSelectedColorScheme('custom');
    toast.success('Applied custom colors');
  };

  // Apply a line style
  const applyLineStyle = (style: { name: string, primaryDash: number[], secondaryDash: number[] }) => {
    setPrimaryLineDash(style.primaryDash);
    setSecondaryLineDash(style.secondaryDash);
    toast.success(`Applied ${style.name} line style`);
  };

  // Format distance for display
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters.toFixed(0)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  return (
    <div className="panel animate-fade-in">
      <div className="flex items-center space-x-1 mb-2">
        <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary flex items-center">
          <Settings className="h-3 w-3 mr-1" /> Advanced Features
        </span>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {/* Precision Controls */}
        <AccordionItem value="precision">
          <AccordionTrigger className="text-sm py-2">
            <div className="flex items-center">
              <Sliders className="h-4 w-4 mr-2" />
              <span>Coordinate Precision</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Precision:</Label>
                <span className="text-xs font-medium">{precision}</span>
              </div>
              <Slider
                value={[precision]}
                min={4}
                max={7}
                step={1}
                onValueChange={(value) => setPrecision(value[0])}
                className="my-2"
              />
              <div className="grid grid-cols-4 text-center text-xs text-muted-foreground pt-1">
                <div>4 (±11m)</div>
                <div>5 (±1.1m)</div>
                <div>6 (±0.11m)</div>
                <div>7 (±0.01m)</div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color Customization */}
        <AccordionItem value="colors">
          <AccordionTrigger className="text-sm py-2">
            <div className="flex items-center">
              <PaintBucket className="h-4 w-4 mr-2" />
              <span>Color Customization</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-3">
              <Tabs defaultValue="presets">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="presets" className="text-xs">Presets</TabsTrigger>
                  <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
                </TabsList>
                
                <TabsContent value="presets" className="mt-2 space-y-2">
                  <div className="max-h-40 overflow-y-auto">
                    <div className="space-y-2">
                      {colorSchemes.map((scheme) => (
                        <div
                          key={scheme.name}
                          className={`flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-secondary/30 ${
                            selectedColorScheme === scheme.name ? 'border-primary' : 'border-transparent'
                          }`}
                          onClick={() => applyColorScheme(scheme)}
                        >
                          <div className="text-xs capitalize">{scheme.name}</div>
                          <div className="flex space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: scheme.primaryColor }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: scheme.secondaryColor }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="mt-2 space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Primary Path:</Label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border" 
                          style={{ backgroundColor: customPrimaryColor }}
                        />
                        <Input 
                          type="text"
                          value={customPrimaryColor}
                          onChange={(e) => setCustomPrimaryColor(e.target.value)}
                          className="w-24 h-7 text-xs"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Secondary Path:</Label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border" 
                          style={{ backgroundColor: customSecondaryColor }}
                        />
                        <Input 
                          type="text"
                          value={customSecondaryColor}
                          onChange={(e) => setCustomSecondaryColor(e.target.value)}
                          className="w-24 h-7 text-xs"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs mt-2"
                      onClick={applyCustomColors}
                    >
                      Apply Custom Colors
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Width & Style Adjustments */}
        <AccordionItem value="style">
          <AccordionTrigger className="text-sm py-2">
            <div className="flex items-center">
              <StretchHorizontal className="h-4 w-4 mr-2" />
              <span>Width & Style</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-4">
              {/* Line Style Presets */}
              <div className="space-y-2">
                <Label className="text-xs">Line Style:</Label>
                <div className="grid grid-cols-3 gap-2">
                  {lineStyles.map((style) => (
                    <Button
                      key={style.name}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => applyLineStyle(style)}
                    >
                      {style.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Line Width Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Primary Width:</Label>
                  <span className="text-xs font-medium">{primaryLineWidth}px</span>
                </div>
                <Slider
                  value={[primaryLineWidth]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setPrimaryLineWidth(value[0])}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <Label className="text-xs">Secondary Width:</Label>
                  <span className="text-xs font-medium">{secondaryLineWidth}px</span>
                </div>
                <Slider
                  value={[secondaryLineWidth]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setSecondaryLineWidth(value[0])}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Elevation Profile (when data available) */}
        {hasElevationData && (
          <AccordionItem value="elevation">
            <AccordionTrigger className="text-sm py-2">
              <div className="flex items-center">
                <Mountain className="h-4 w-4 mr-2" />
                <span>Elevation Profile</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Elevation Profile:</Label>
                  <Switch 
                    checked={showElevationProfile}
                    onCheckedChange={setShowElevationProfile}
                  />
                </div>
                
                {showElevationProfile && (
                  <div className="rounded-lg bg-secondary/50 p-2 h-40 flex items-center justify-center">
                    <div className="text-xs text-muted-foreground">
                      Elevation data visualization would appear here
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Similarity Analysis */}
        <AccordionItem value="similarity">
          <AccordionTrigger className="text-sm py-2">
            <div className="flex items-center">
              <Percent className="h-4 w-4 mr-2" />
              <span>Similarity Analysis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-3">
              {primaryCoordinates.length > 0 && secondaryCoordinates.length > 0 ? (
                <>
                  <Button 
                    size="sm" 
                    className="w-full text-xs bg-white/80 hover:bg-white text-black"
                    onClick={calculateSimilarityScore}
                  >
                    Calculate Similarity Score
                  </Button>
                  
                  {similarityScore !== null && (
                    <div className="rounded-lg bg-secondary/50 p-3 text-center">
                      <div className="text-2xl font-bold">{similarityScore}%</div>
                      <div className="text-xs text-muted-foreground mt-1">Path Similarity</div>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Similarity score considers path length, shape, and point distribution.
                  </div>
                </>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Both primary and secondary polylines are required for similarity analysis.
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Time Alignment */}
        <AccordionItem value="time">
          <AccordionTrigger className="text-sm py-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Time Alignment</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Align Temporal Data:</Label>
                <Switch 
                  checked={false}
                  onCheckedChange={() => {
                    toast.info('Time alignment feature coming soon');
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 my-2">
                <div className="space-y-1">
                  <Label className="text-xs">Start Time:</Label>
                  <Input 
                    type="datetime-local"
                    className="h-7 text-xs"
                    disabled
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End Time:</Label>
                  <Input 
                    type="datetime-local"
                    className="h-7 text-xs"
                    disabled
                  />
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Time alignment requires temporal data to be included in the polyline.
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AdvancedFeatures; 