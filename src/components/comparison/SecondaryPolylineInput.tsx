import React, { useState } from 'react';
import { Trash2, Copy, Sparkles } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '../ui/select';

interface SecondaryPolylineInputProps {
  secondaryPolyline: string;
  setSecondaryPolyline: (value: string) => void;
  secondaryCoordinates: [number, number][];
  precision?: number;
  onPrecisionChange?: (precision: number) => void;
}

const SecondaryPolylineInput: React.FC<SecondaryPolylineInputProps> = ({ 
  secondaryPolyline, 
  setSecondaryPolyline, 
  secondaryCoordinates,
  precision = 5,
  onPrecisionChange
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClear = () => {
    setSecondaryPolyline('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSecondaryPolyline(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className={`mt-4 mb-3 transition-all duration-300 ${isFocused ? 'ring-1 ring-primary/20' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-medium">Secondary</span>
        </div>
        <div className="flex items-center space-x-1">
          {onPrecisionChange && (
            <Select 
              value={precision.toString()} 
              onValueChange={(val) => onPrecisionChange(Number(val))}
            >
              <SelectTrigger className="h-8 min-w-[80px] text-xs">
                <SelectValue placeholder="Precision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Precision 5</SelectItem>
                <SelectItem value="6">Precision 6</SelectItem>
                <SelectItem value="7">Precision 7</SelectItem>
              </SelectContent>
            </Select>
          )}
          <button
            onClick={handlePaste}
            className="p-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
          >
            Paste
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-colors"
            disabled={!secondaryPolyline}
          >
            <Trash2 className="h-4 w-4" />
          </button>
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
            onClick={() => setSecondaryPolyline('}~kvHmzrr@ba\\hnc@jiu@r{Zqx~@hjp@pwEhnc@zhu@zflAbxn@fhjBvqHroaAgcnAp}gAeahAtqGkngAinc@_h|@r{Zad\\y|_D}_y@swg@ysg@}llBpoZqa{@xrw@~eBaaX}{uAero@uqGadY}nr@`dYs_NquNgbjAf{l@|yh@bfc@}nr@z}q@i|i@zgz@r{ZhjFr}gApob@ff}@laIsen@dgYhdPvbIren@')}
            className="p-1.5 text-xs flex items-center space-x-1 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 rounded-md transition-colors"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            <span>Sample</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryPolylineInput;
