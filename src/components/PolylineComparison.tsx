
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { 
  Split, 
  Layers, 
  Diff, 
  Route, 
  AlignHorizontalDistributeCenter, 
  Flame, 
  BarChart2, 
  Route as RouteIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { decodePolyline, calculateDistance } from '../utils/polylineDecoder';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from './ui/chart';
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface PolylineComparisonProps {
  primaryPolyline: string;
  setPrimaryPolyline: (value: string) => void;
  comparisonMode: boolean;
  setComparisonMode: (value: boolean) => void;
  secondaryPolyline?: string;
  setSecondaryPolyline?: (value: string) => void;
  comparisonType?: 'overlay' | 'sideBySide' | 'diff';
  setComparisonType?: (type: 'overlay' | 'sideBySide' | 'diff') => void;
  overlayOpacity?: number;
  setOverlayOpacity?: (value: number) => void;
  showDivergence?: boolean;
  setShowDivergence?: (value: boolean) => void;
  showIntersections?: boolean;
  setShowIntersections?: (value: boolean) => void;
}

const PolylineComparison: React.FC<PolylineComparisonProps> = ({
  primaryPolyline,
  setPrimaryPolyline,
  comparisonMode,
  setComparisonMode,
  secondaryPolyline = '',
  setSecondaryPolyline = () => {},
  comparisonType = 'overlay',
  setComparisonType = () => {},
  overlayOpacity = 50,
  setOverlayOpacity = () => {},
  showDivergence = true,
  setShowDivergence = () => {},
  showIntersections = true,
  setShowIntersections = () => {}
}) => {
  const [alignmentThreshold, setAlignmentThreshold] = useState(20);

  // Decoded coordinates for stats
  const primaryCoordinates = primaryPolyline ? decodePolyline(primaryPolyline) : [];
  const secondaryCoordinates = secondaryPolyline ? decodePolyline(secondaryPolyline) : [];

  // Calculate basic stats
  const primaryDistance = calculateDistance(primaryCoordinates);
  const secondaryDistance = calculateDistance(secondaryCoordinates);
  const distanceDiff = Math.abs(primaryDistance - secondaryDistance);
  const pointsDiff = Math.abs(primaryCoordinates.length - secondaryCoordinates.length);
  
  // Generate sample chart data (in a real app, this would be actual elevation or speed data)
  const generateChartData = () => {
    if (!primaryCoordinates.length && !secondaryCoordinates.length) return [];
    
    const longerArray = primaryCoordinates.length >= secondaryCoordinates.length 
      ? primaryCoordinates 
      : secondaryCoordinates;
    
    return longerArray.map((_, i) => {
      // Mock elevation data (would be real data in production)
      const primary = primaryCoordinates[i] 
        ? Math.sin(i * 0.2) * 50 + 100 + Math.random() * 10 
        : null;
      const secondary = secondaryCoordinates[i] 
        ? Math.sin(i * 0.2 + 0.5) * 40 + 110 + Math.random() * 10 
        : null;
      
      return {
        index: i,
        primary,
        secondary,
        diff: primary && secondary ? Math.abs(primary - secondary) : 0
      };
    });
  };

  const chartData = generateChartData();

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters.toFixed(0)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };
  
  const handleComparisonToggle = (value: boolean) => {
    setComparisonMode(value);
    if (!value) {
      setSecondaryPolyline('');
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'overlay') {
      setComparisonType('overlay');
    } else if (value === 'sideBySide') {
      setComparisonType('sideBySide');
    } else if (value === 'diff') {
      setComparisonType('diff');
    }
    // Don't change comparison type for 'stats' tab
  };

  return (
    <div className="panel animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary">Comparison</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">Enable</span>
          <Switch 
            checked={comparisonMode} 
            onCheckedChange={handleComparisonToggle}
          />
        </div>
      </div>

      {comparisonMode && (
        <>
          <div className="mb-4">
            <label className="block text-sm text-muted-foreground mb-1">Secondary Polyline</label>
            <textarea
              value={secondaryPolyline}
              onChange={(e) => setSecondaryPolyline(e.target.value)}
              placeholder="Paste the comparison polyline here..."
              className="w-full h-16 resize-none bg-background border border-input rounded-md p-2 text-xs font-mono focus:ring-1 focus:ring-primary/30 focus:outline-none"
            />
            <div className="text-xs mt-1 text-muted-foreground">
              {secondaryPolyline 
                ? `${secondaryPolyline.length} characters, ${secondaryCoordinates.length} points` 
                : 'No comparison data'}
            </div>
          </div>

          {secondaryPolyline && (
            <>
              <Tabs value={comparisonType === 'stats' ? 'stats' : comparisonType} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-4 mb-2 w-full bg-muted/70">
                  <TabsTrigger value="overlay" className="text-xs flex gap-1 items-center">
                    <Layers className="h-3 w-3" />
                    <span className="hidden sm:inline">Overlay</span>
                  </TabsTrigger>
                  <TabsTrigger value="sideBySide" className="text-xs flex gap-1 items-center">
                    <Split className="h-3 w-3" />
                    <span className="hidden sm:inline">Side-by-Side</span>
                  </TabsTrigger>
                  <TabsTrigger value="diff" className="text-xs flex gap-1 items-center">
                    <Diff className="h-3 w-3" />
                    <span className="hidden sm:inline">Diff</span>
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="text-xs flex gap-1 items-center">
                    <BarChart2 className="h-3 w-3" />
                    <span className="hidden sm:inline">Stats</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overlay" className="mt-0">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <label>Opacity</label>
                        <span>{overlayOpacity}%</span>
                      </div>
                      <Slider 
                        value={[overlayOpacity]} 
                        onValueChange={(value) => setOverlayOpacity(value[0])} 
                        min={10} 
                        max={100} 
                        step={5}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="diff" className="mt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <span>Show Divergence</span>
                      </label>
                      <Switch 
                        checked={showDivergence} 
                        onCheckedChange={setShowDivergence} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <span>Show Intersections</span>
                      </label>
                      <Switch 
                        checked={showIntersections} 
                        onCheckedChange={setShowIntersections} 
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sideBySide" className="mt-0">
                  <div className="flex flex-col gap-2">
                    <div className="text-xs">View primary and secondary polylines side by side</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <label>Alignment Threshold (m)</label>
                        <span>{alignmentThreshold}</span>
                      </div>
                      <Slider 
                        value={[alignmentThreshold]} 
                        onValueChange={(value) => setAlignmentThreshold(value[0])} 
                        min={5} 
                        max={50} 
                        step={5}
                      />
                    </div>
                    <Button size="sm" className="mt-1 bg-secondary/80 text-secondary-foreground hover:bg-secondary/90" variant="secondary">
                      <AlignHorizontalDistributeCenter className="mr-1 h-4 w-4" />
                      Auto-align Similar Segments
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="mt-0">
                  <div className="space-y-3">
                    <div className="flex flex-col mt-2 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-secondary/50 p-2">
                          <div className="text-xs text-muted-foreground">Distance Diff</div>
                          <div className="text-sm font-semibold">{formatDistance(distanceDiff)}</div>
                        </div>
                        <div className="rounded-lg bg-secondary/50 p-2">
                          <div className="text-xs text-muted-foreground">Points Diff</div>
                          <div className="text-sm font-semibold">{pointsDiff}</div>
                        </div>
                      </div>

                      <div className="h-[120px] w-full mt-2">
                        <ChartContainer 
                          config={{
                            primary: { color: '#3b82f6' },
                            secondary: { color: '#10b981' },
                            diff: { color: '#ef4444' }
                          }}
                        >
                          <AreaChart
                            data={chartData}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                            <XAxis 
                              dataKey="index" 
                              tick={false}
                              axisLine={false}
                            />
                            <YAxis hide />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area 
                              type="monotone" 
                              dataKey="primary" 
                              stroke="#3b82f6" 
                              fillOpacity={1}
                              fill="url(#primaryGradient)" 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="secondary" 
                              stroke="#10b981" 
                              fillOpacity={1}
                              fill="url(#secondaryGradient)" 
                            />
                          </AreaChart>
                        </ChartContainer>
                      </div>

                      <div className="text-xs text-muted-foreground text-center">
                        Sample elevation profile (blue: primary, green: secondary)
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PolylineComparison;
