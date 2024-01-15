
import React from 'react';
import { LayoutGrid, Route, MapPin, Maximize } from 'lucide-react';
import { getBounds } from '../utils/polylineDecoder';

interface StatisticsProps {
  coordinates: [number, number][];
  distance: number;
}

const Statistics: React.FC<StatisticsProps> = ({ coordinates, distance }) => {
  const bounds = getBounds(coordinates);
  
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
        <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary">Statistics</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3 mr-1" /> Points
          </div>
          <div className="text-lg font-semibold">
            {coordinates.length}
          </div>
        </div>
        
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <Route className="h-3 w-3 mr-1" /> Distance
          </div>
          <div className="text-lg font-semibold">
            {formatDistance(distance)}
          </div>
        </div>
      </div>
      
      {bounds && (
        <div className="mt-2 rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <Maximize className="h-3 w-3 mr-1" /> Bounds
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
            <div className="text-xs">
              <span className="text-muted-foreground">NE:</span> {formatCoordinate(bounds.northeast[1])}, {formatCoordinate(bounds.northeast[0])}
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">SW:</span> {formatCoordinate(bounds.southwest[1])}, {formatCoordinate(bounds.southwest[0])}
            </div>
          </div>
        </div>
      )}
      
      {coordinates.length > 0 && (
        <div className="mt-2 rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <LayoutGrid className="h-3 w-3 mr-1" /> Start/End Points
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
            <div className="text-xs">
              <span className="text-muted-foreground">Start:</span> {formatCoordinate(coordinates[0][1])}, {formatCoordinate(coordinates[0][0])}
            </div>
            {coordinates.length > 1 && (
              <div className="text-xs">
                <span className="text-muted-foreground">End:</span> {formatCoordinate(coordinates[coordinates.length-1][1])}, {formatCoordinate(coordinates[coordinates.length-1][0])}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
