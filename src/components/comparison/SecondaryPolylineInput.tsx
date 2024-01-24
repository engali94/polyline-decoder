
import React from 'react';
import { Button } from '../ui/button';
import { Clipboard, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';

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
    <div className="mb-4 border border-primary/20 p-3 rounded-lg bg-background/50">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium">Secondary Polyline Input</label>
        <div className="flex items-center gap-1">
          <Button 
            type="button" 
            size="sm" 
            variant="secondary" 
            className="h-8 px-3 text-sm"
            onClick={handlePaste}
          >
            <Clipboard className="h-4 w-4 mr-1" />
            Paste
          </Button>
          {secondaryPolyline && (
            <Button 
              type="button" 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Textarea
        value={secondaryPolyline}
        onChange={(e) => setSecondaryPolyline(e.target.value)}
        placeholder="Type or paste the secondary polyline here..."
        className="w-full h-20 resize-none bg-background text-sm font-mono focus:ring-1 focus:ring-primary/30 focus:outline-none"
      />
      <div className="text-xs mt-1 text-muted-foreground">
        {secondaryPolyline 
          ? `${secondaryPolyline.length} characters, ${secondaryCoordinates.length} points` 
          : 'Enter your comparison polyline data here'}
      </div>
    </div>
  );
};

export default SecondaryPolylineInput;
