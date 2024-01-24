
import React from 'react';
import { Button } from '../ui/button';
import { Clipboard, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

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
    <div className="mb-4 border-2 border-primary/40 p-4 rounded-lg bg-background shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-base font-medium text-primary">Secondary Polyline Input</label>
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            size="sm" 
            variant="secondary" 
            className="h-9 px-4 text-sm"
            onClick={handlePaste}
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Paste from Clipboard
          </Button>
          {secondaryPolyline && (
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              className="h-9 px-3"
              onClick={handleClear}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
      <Textarea
        value={secondaryPolyline}
        onChange={(e) => setSecondaryPolyline(e.target.value)}
        placeholder="Type or paste your secondary polyline data here..."
        className="w-full h-24 resize-none bg-background text-sm font-mono border-2 focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
      />
      <div className="text-sm mt-2 text-foreground flex justify-between items-center">
        <span>
          {secondaryPolyline 
            ? `${secondaryPolyline.length} characters, ${secondaryCoordinates.length} points` 
            : 'Enter your comparison polyline data here'}
        </span>
        {!secondaryPolyline && (
          <span className="text-xs text-muted-foreground italic">Paste encoded polyline or type it directly into the field above</span>
        )}
      </div>
    </div>
  );
};

export default SecondaryPolylineInput;
