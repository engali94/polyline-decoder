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
  setComparisonType,
}) => {
  if (!comparisonMode) return null;

  return (
    <div className="glass absolute left-4 top-4 z-10 flex space-x-2 rounded-lg p-2">
      <button
        onClick={() => {
          setSplitViewActive(false);
          setComparisonType('overlay');
        }}
        className={`rounded-md p-1.5 ${comparisonType === 'overlay' ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} transition-colors hover:bg-opacity-90`}
        title="Overlay Mode"
      >
        <Layers className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          setSplitViewActive(true);
          setComparisonType('sideBySide');
        }}
        className={`rounded-md p-1.5 ${comparisonType === 'sideBySide' ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} transition-colors hover:bg-opacity-90`}
        title="Side-by-Side Mode"
      >
        <Split className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          setSplitViewActive(false);
          setComparisonType('diff');
        }}
        className={`rounded-md p-1.5 ${comparisonType === 'diff' ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} transition-colors hover:bg-opacity-90`}
        title="Difference Mode"
      >
        <Diff className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MapControls;
