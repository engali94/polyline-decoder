import React from 'react';
import { Slider } from '../ui/slider';

interface OverlayTabProps {
  overlayOpacity: number;
  setOverlayOpacity: (value: number) => void;
}

const OverlayTab: React.FC<OverlayTabProps> = ({ overlayOpacity, setOverlayOpacity }) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <label>Opacity</label>
          <span>{overlayOpacity}%</span>
        </div>
        <Slider
          value={[overlayOpacity]}
          onValueChange={value => setOverlayOpacity(value[0])}
          min={10}
          max={100}
          step={5}
        />
      </div>
    </div>
  );
};

export default OverlayTab;
