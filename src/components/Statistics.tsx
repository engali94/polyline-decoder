import React from 'react';
import { LayoutGrid, Route, MapPin, Maximize, BarChart3 } from 'lucide-react';
import { getBounds, calculateDistance } from '../utils/polylineDecoder';

interface StatisticsProps {
  coordinates: [number, number][];
  secondaryCoordinates?: [number, number][];
  distance: number;
}

const Statistics: React.FC<StatisticsProps> = ({ 
  coordinates, 
  secondaryCoordinates = [], 
  distance 
}) => {
  const bounds = getBounds(coordinates);
  const secondaryBounds = secondaryCoordinates.length > 0 ? getBounds(secondaryCoordinates) : null;
  const secondaryDistance = calculateDistance(secondaryCoordinates);
  
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters.toFixed(0)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };
  
  const formatCoordinate = (coord: number) => {
    return coord.toFixed(6);
  };

  return (
    <div className="panel animate-fade-in">
      <div className="flex items-center space-x-1 mb-2">
        <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary flex items-center">
          <BarChart3 className="h-3 w-3 mr-1" /> Detailed Statistics
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-secondary/50 p-2 space-y-1">
            <div className="text-xs font-medium">Primary Path</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-xs text-muted-foreground">Points:</div>
              <div className="text-xs text-right">{coordinates.length}</div>
              
              <div className="text-xs text-muted-foreground">Distance:</div>
              <div className="text-xs text-right">
                {formatDistance(distance)}
              </div>
              
              {coordinates.length > 0 && (
                <>
                  <div className="text-xs text-muted-foreground">Start:</div>
                  <div className="text-xs text-right">
                    {coordinates[0][1].toFixed(4)}, {coordinates[0][0].toFixed(4)}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">End:</div>
                  <div className="text-xs text-right">
                    {coordinates[coordinates.length-1][1].toFixed(4)}, 
                    {coordinates[coordinates.length-1][0].toFixed(4)}
                  </div>
                </>
              )}
              
              {bounds && (
                <>
                  <div className="text-xs text-muted-foreground">Bounds NE:</div>
                  <div className="text-xs text-right">
                    {formatCoordinate(bounds.northeast[1])}, {formatCoordinate(bounds.northeast[0])}
                  </div>
                  <div className="text-xs text-muted-foreground">Bounds SW:</div>
                  <div className="text-xs text-right">
                    {formatCoordinate(bounds.southwest[1])}, {formatCoordinate(bounds.southwest[0])}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="rounded-lg bg-secondary/50 p-2 space-y-1">
            <div className="text-xs font-medium">Secondary Path</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-xs text-muted-foreground">Points:</div>
              <div className="text-xs text-right">{secondaryCoordinates.length}</div>
              
              <div className="text-xs text-muted-foreground">Distance:</div>
              <div className="text-xs text-right">
                {formatDistance(secondaryDistance)}
              </div>
              
              {secondaryCoordinates.length > 0 && (
                <>
                  <div className="text-xs text-muted-foreground">Start:</div>
                  <div className="text-xs text-right">
                    {secondaryCoordinates[0][1].toFixed(4)}, {secondaryCoordinates[0][0].toFixed(4)}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">End:</div>
                  <div className="text-xs text-right">
                    {secondaryCoordinates[secondaryCoordinates.length-1][1].toFixed(4)}, 
                    {secondaryCoordinates[secondaryCoordinates.length-1][0].toFixed(4)}
                  </div>
                </>
              )}
              
              {secondaryBounds && (
                <>
                  <div className="text-xs text-muted-foreground">Bounds NE:</div>
                  <div className="text-xs text-right">
                    {formatCoordinate(secondaryBounds.northeast[1])}, {formatCoordinate(secondaryBounds.northeast[0])}
                  </div>
                  <div className="text-xs text-muted-foreground">Bounds SW:</div>
                  <div className="text-xs text-right">
                    {formatCoordinate(secondaryBounds.southwest[1])}, {formatCoordinate(secondaryBounds.southwest[0])}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Points density and timing info */}
        <div className="rounded-lg bg-secondary/50 p-2 mt-2">
          <div className="text-xs font-medium mb-1">Advanced Analysis</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="text-xs text-muted-foreground">Primary Density:</div>
            <div className="text-xs text-right">
              {coordinates.length > 0
                ? `${(coordinates.length / distance * 1000).toFixed(1)} pts/km`
                : 'N/A'}
            </div>
            
            <div className="text-xs text-muted-foreground">Secondary Density:</div>
            <div className="text-xs text-right">
              {secondaryCoordinates.length > 0
                ? `${(secondaryCoordinates.length / secondaryDistance * 1000).toFixed(1)} pts/km`
                : 'N/A'}
            </div>
            
            {coordinates.length > 0 && secondaryCoordinates.length > 0 && (
              <>
                <div className="text-xs text-muted-foreground">Size Ratio:</div>
                <div className="text-xs text-right">
                  {(secondaryCoordinates.length / coordinates.length).toFixed(2)}x
                </div>
                
                <div className="text-xs text-muted-foreground">Length Ratio:</div>
                <div className="text-xs text-right">
                  {(secondaryDistance / distance).toFixed(2)}x
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
