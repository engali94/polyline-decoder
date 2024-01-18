
import React from 'react';
import { Layers, Split, Diff } from 'lucide-react';

interface MapControlsProps {
  comparisonMode: boolean;
  comparisonType: 'overlay' | 'sideBySide' | 'diff';
  splitViewActive: boolean;
  setSplitViewActive: (active: boolean) => void;
  setComparisonType: (type: 'overlay' | 'sideBySide' | 'diff') => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  comparisonMode,
  comparisonType,
  splitViewActive,
  setSplitViewActive,
  setComparisonType
}) => {
  if (!comparisonMode) return null;
  
  return (
    <div className="absolute top-4 left-4 z-10 glass rounded-lg p-2 flex space-x-2">
      <button 
        onClick={() => {
          setSplitViewActive(false);
          setComparisonType('overlay');
        }}
        className={`p-1.5 rounded-md ${comparisonType === 'overlay' ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} hover:bg-opacity-90 transition-colors`}
        title="Overlay Mode"
      >
        <Layers className="h-4 w-4" />
      </button>
      <button 
        onClick={() => {
          setSplitViewActive(true);
          setComparisonType('sideBySide');
        }}
        className={`p-1.5 rounded-md ${comparisonType === 'sideBySide' ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} hover:bg-opacity-90 transition-colors`}
        title="Side-by-Side Mode"
      >
        <Split className="h-4 w-4" />
      </button>
      <button 
        onClick={() => {
          setSplitViewActive(false);
          setComparisonType('diff');
        }}
        className={`p-1.5 rounded-md ${comparisonType === 'diff' ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} hover:bg-opacity-90 transition-colors`}
        title="Difference Mode"
      >
        <Diff className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MapControls;
