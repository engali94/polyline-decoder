
import React from 'react';
import { Button } from '../ui/button';
import { Clipboard, X } from 'lucide-react';

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
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSecondaryPolyline(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClear = () => {
    setSecondaryPolyline('');
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm text-muted-foreground">Secondary Polyline</label>
        <div className="flex items-center gap-1">
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            className="h-6 px-2 text-xs"
            onClick={handlePaste}
          >
            <Clipboard className="h-3 w-3 mr-1" />
            Paste
          </Button>
          {secondaryPolyline && (
            <Button 
              type="button" 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
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
