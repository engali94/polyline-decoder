
import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { coordinatesToGeoJSON, coordinatesToCSV } from '../utils/polylineDecoder';

interface ExportOptionsProps {
  coordinates: [number, number][];
}

type ExportFormat = 'geojson' | 'csv';

const ExportOptions: React.FC<ExportOptionsProps> = ({ coordinates }) => {
  const [copied, setCopied] = useState<ExportFormat | null>(null);
  
  const noCoordinates = coordinates.length === 0;

  const exportData = (format: ExportFormat) => {
    let data: string;
    let mimeType: string;
    let filename: string;
    
    if (format === 'geojson') {
      data = JSON.stringify(coordinatesToGeoJSON(coordinates), null, 2);
      mimeType = 'application/json';
      filename = 'polyline.geojson';
    } else {
      data = coordinatesToCSV(coordinates);
      mimeType = 'text/csv';
      filename = 'polyline.csv';
    }
    
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (format: ExportFormat) => {
    let data: string;
    
    if (format === 'geojson') {
      data = JSON.stringify(coordinatesToGeoJSON(coordinates), null, 2);
    } else {
      data = coordinatesToCSV(coordinates);
    }
    
    await navigator.clipboard.writeText(data);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="panel animate-fade-in">
      <div className="flex items-center space-x-1 mb-2">
        <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary">Export</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="font-medium text-sm mb-2">GeoJSON</div>
          <div className="flex space-x-2">
            <button
              onClick={() => exportData('geojson')}
              disabled={noCoordinates}
              className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-3 text-xs bg-white/80 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-3 w-3 mr-1" />
              <span>Download</span>
            </button>
            <button
              onClick={() => copyToClipboard('geojson')}
              disabled={noCoordinates}
              className="flex items-center justify-center space-x-1 py-1.5 px-3 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied === 'geojson' ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
        
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="font-medium text-sm mb-2">CSV</div>
          <div className="flex space-x-2">
            <button
              onClick={() => exportData('csv')}
              disabled={noCoordinates}
              className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-3 text-xs bg-white/80 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-3 w-3 mr-1" />
              <span>Download</span>
            </button>
            <button
              onClick={() => copyToClipboard('csv')}
              disabled={noCoordinates}
              className="flex items-center justify-center space-x-1 py-1.5 px-3 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied === 'csv' ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
