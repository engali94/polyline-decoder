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
  setAlignmentThreshold,
}) => {
  // Function to trigger alignment
  const handleAutoAlign = () => {
    // Create and dispatch custom event for auto-alignment
    const event = new CustomEvent('auto-align-maps', {
      detail: { threshold: alignmentThreshold },
    });
    window.dispatchEvent(event);
    toast.success(`Auto-aligned segments with threshold: ${alignmentThreshold}m`);
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
          onValueChange={value => setAlignmentThreshold(value[0])}
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
