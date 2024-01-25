
import React, { useState } from 'react';
import { Copy, Trash2, Clipboard } from 'lucide-react';

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
  const [isFocused, setIsFocused] = useState(false);
  
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
    <div className={`panel transition-all duration-300 ${isFocused ? 'ring-1 ring-primary/20' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary">Secondary Input</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePaste}
            className="p-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
          >
            Paste
          </button>
          {secondaryPolyline && (
            <button
              onClick={handleClear}
              className="p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <textarea
        value={secondaryPolyline}
        onChange={(e) => setSecondaryPolyline(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Paste your secondary polyline here..."
        className="w-full h-24 resize-none bg-transparent border-0 p-0 placeholder:text-muted-foreground focus:ring-0 focus:outline-none text-sm font-mono"
      />
      
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {secondaryPolyline 
            ? `${secondaryPolyline.length} characters, ${secondaryCoordinates.length} points` 
            : 'No secondary polyline data'}
        </div>
        <div className="flex space-x-1">
          {secondaryPolyline && (
            <button
              onClick={() => navigator.clipboard.writeText(secondaryPolyline)}
              className="p-1.5 text-xs flex items-center space-x-1 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              <Copy className="h-3 w-3 mr-1" />
              <span>Copy</span>
            </button>
          )}
          <button 
            onClick={() => setSecondaryPolyline('_ulLnnqC_mqNvxq`@')} 
            className="p-1.5 text-xs flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
          >
            <span>Sample</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryPolylineInput;
