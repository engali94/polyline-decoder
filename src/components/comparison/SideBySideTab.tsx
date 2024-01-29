
import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { AlignHorizontalDistributeCenter } from 'lucide-react';
import { toast } from 'sonner';

interface SideBySideTabProps {
  alignmentThreshold: number;
  setAlignmentThreshold: (value: number) => void;
}

const SideBySideTab: React.FC<SideBySideTabProps> = ({ 
  alignmentThreshold, 
  setAlignmentThreshold 
}) => {
  const handleAutoAlign = () => {
    // Dispatch the custom event with the threshold value
    window.dispatchEvent(new CustomEvent('auto-align-polylines', { 
      detail: { threshold: alignmentThreshold }
    }));
    
    // The actual processing happens in MapEffects.tsx
    // Don't show toast here as it will be shown by the event handler
  };

  return (
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
      <Button 
        size="sm" 
        className="mt-1 bg-secondary/80 text-secondary-foreground hover:bg-secondary/90" 
        variant="secondary"
        onClick={handleAutoAlign}
      >
        <AlignHorizontalDistributeCenter className="mr-1 h-4 w-4" />
        Auto-align Similar Segments
      </Button>
    </div>
  );
};

export default SideBySideTab;
