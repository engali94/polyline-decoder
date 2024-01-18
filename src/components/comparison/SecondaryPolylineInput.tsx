
import React from 'react';

interface SecondaryPolylineInputProps {
  secondaryPolyline: string;
  setSecondaryPolyline: (value: string) => void;
  secondaryCoordinates: [number, number][];
}

const SecondaryPolylineInput: React.FC<SecondaryPolylineInputProps> = ({
  secondaryPolyline,
  setSecondaryPolyline,
  secondaryCoordinates
}) => {
  return (
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
  );
};

export default SecondaryPolylineInput;
