import React, { useState } from 'react';
import { Copy, Download, Code, Table, Brackets } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';

interface CoordinatesViewerProps {
  primaryCoordinates: [number, number][];
  secondaryCoordinates?: [number, number][];
  primaryLabel?: string;
  secondaryLabel?: string;
}

const CoordinatesViewer: React.FC<CoordinatesViewerProps> = ({
  primaryCoordinates,
  secondaryCoordinates = [],
  primaryLabel = 'Primary Path',
  secondaryLabel = 'Secondary Path'
}) => {
  const [exportFormat, setExportFormat] = useState<'swift' | 'android' | 'js' | 'rust'>('swift');

  // Format coordinates according to programming language
  const formatCoordinates = (coords: [number, number][], format: 'swift' | 'android' | 'js' | 'rust') => {
    if (coords.length === 0) return 'No coordinates available';
    
    switch (format) {
      case 'swift':
        return `let coordinates: [CLLocationCoordinate2D] = [
  ${coords.map(([lng, lat]) => `CLLocationCoordinate2D(latitude: ${lat}, longitude: ${lng})`).join(',\n  ')}
]`;
      case 'android':
        return `List<LatLng> coordinates = new ArrayList<>();
${coords.map(([lng, lat]) => `coordinates.add(new LatLng(${lat}, ${lng}));`).join('\n')}`;
      case 'js':
        return `const coordinates = [
  ${coords.map(([lng, lat]) => `[${lng}, ${lat}]`).join(',\n  ')}
];`;
      case 'rust':
        return `let coordinates: Vec<(f64, f64)> = vec![
  ${coords.map(([lng, lat]) => `(${lng}, ${lat})`).join(',\n  ')}
];`;
      default:
        return 'Unknown format';
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${label} copied to clipboard`),
      () => toast.error(`Failed to copy ${label}`)
    );
  };

  // Download as file
  const downloadAsFile = (content: string, filename: string, extension: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded as ${filename}.${extension}`);
  };

  // Get file extension based on format
  const getFileExtension = () => {
    switch (exportFormat) {
      case 'swift': return 'swift';
      case 'android': return 'java';
      case 'js': return 'js';
      case 'rust': return 'rs';
      default: return 'txt';
    }
  };

  return (
    <div className="panel animate-fade-in">
      <div className="flex items-center space-x-1 mb-2">
        <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary flex items-center">
          <Brackets className="h-3 w-3 mr-1" /> Coordinates
        </span>
      </div>
      
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="code" className="text-xs">
            <Code className="h-3 w-3 mr-1" /> Code Export
          </TabsTrigger>
          <TabsTrigger value="table" className="text-xs">
            <Table className="h-3 w-3 mr-1" /> Table View
          </TabsTrigger>
        </TabsList>

        {/* Code Export Tab */}
        <TabsContent value="code">
          <Tabs defaultValue="primary" className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="primary" className="text-xs">{primaryLabel}</TabsTrigger>
              <TabsTrigger 
                value="secondary" 
                disabled={secondaryCoordinates.length === 0}
                className="text-xs"
              >
                {secondaryLabel}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="primary" className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {primaryCoordinates.length} points
                </div>
                
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(
                            formatCoordinates(primaryCoordinates, exportFormat),
                            primaryLabel
                          )}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy to clipboard</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => downloadAsFile(
                            formatCoordinates(primaryCoordinates, exportFormat),
                            'primary_coordinates',
                            getFileExtension()
                          )}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download as file</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="rounded-lg border bg-secondary/20 overflow-hidden">
                <Tabs defaultValue="swift" onValueChange={(v) => setExportFormat(v as any)}>
                  <TabsList className="w-full grid grid-cols-4 bg-secondary/30">
                    <TabsTrigger value="swift" className="text-xs">Swift</TabsTrigger>
                    <TabsTrigger value="android" className="text-xs">Android</TabsTrigger>
                    <TabsTrigger value="js" className="text-xs">JavaScript</TabsTrigger>
                    <TabsTrigger value="rust" className="text-xs">Rust</TabsTrigger>
                  </TabsList>
                  <ScrollArea className="h-48 p-2">
                    <pre className="text-xs font-mono p-2 rounded bg-muted/50">
                      {formatCoordinates(primaryCoordinates, exportFormat)}
                    </pre>
                  </ScrollArea>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="secondary" className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {secondaryCoordinates.length} points
                </div>
                
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(
                            formatCoordinates(secondaryCoordinates, exportFormat),
                            secondaryLabel
                          )}
                          disabled={secondaryCoordinates.length === 0}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy to clipboard</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => downloadAsFile(
                            formatCoordinates(secondaryCoordinates, exportFormat),
                            'secondary_coordinates',
                            getFileExtension()
                          )}
                          disabled={secondaryCoordinates.length === 0}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download as file</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="rounded-lg border bg-secondary/20 overflow-hidden">
                <Tabs defaultValue="swift" onValueChange={(v) => setExportFormat(v as any)}>
                  <TabsList className="w-full grid grid-cols-4 bg-secondary/30">
                    <TabsTrigger value="swift" className="text-xs">Swift</TabsTrigger>
                    <TabsTrigger value="android" className="text-xs">Android</TabsTrigger>
                    <TabsTrigger value="js" className="text-xs">JavaScript</TabsTrigger>
                    <TabsTrigger value="rust" className="text-xs">Rust</TabsTrigger>
                  </TabsList>
                  <ScrollArea className="h-48 p-2">
                    <pre className="text-xs font-mono p-2 rounded bg-muted/50">
                      {formatCoordinates(secondaryCoordinates, exportFormat)}
                    </pre>
                  </ScrollArea>
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Table View Tab */}
        <TabsContent value="table">
          <Tabs defaultValue="primary" className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="primary" className="text-xs">{primaryLabel}</TabsTrigger>
              <TabsTrigger 
                value="secondary" 
                disabled={secondaryCoordinates.length === 0}
                className="text-xs"
              >
                {secondaryLabel}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="primary">
              <div className="rounded-lg border bg-secondary/20 overflow-hidden">
                <div className="grid grid-cols-3 text-xs font-medium bg-secondary/30 p-2">
                  <div>Index</div>
                  <div>Latitude</div>
                  <div>Longitude</div>
                </div>
                <ScrollArea className="h-64">
                  <div className="p-1">
                    {primaryCoordinates.map(([lng, lat], index) => (
                      <div 
                        key={index} 
                        className="grid grid-cols-3 text-xs p-1 hover:bg-secondary/30 rounded"
                      >
                        <div>{index}</div>
                        <div>{lat.toFixed(6)}</div>
                        <div>{lng.toFixed(6)}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="secondary">
              <div className="rounded-lg border bg-secondary/20 overflow-hidden">
                <div className="grid grid-cols-3 text-xs font-medium bg-secondary/30 p-2">
                  <div>Index</div>
                  <div>Latitude</div>
                  <div>Longitude</div>
                </div>
                <ScrollArea className="h-64">
                  <div className="p-1">
                    {secondaryCoordinates.map(([lng, lat], index) => (
                      <div 
                        key={index} 
                        className="grid grid-cols-3 text-xs p-1 hover:bg-secondary/30 rounded"
                      >
                        <div>{index}</div>
                        <div>{lat.toFixed(6)}</div>
                        <div>{lng.toFixed(6)}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoordinatesViewer; 