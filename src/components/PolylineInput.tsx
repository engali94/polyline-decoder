
import React, { useState } from 'react';
import { Trash2, Copy, Sparkles, Scaling } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from './ui/select';

interface PolylineInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  precision?: number;
  onPrecisionChange?: (precision: number) => void;
}

const PolylineInput: React.FC<PolylineInputProps> = ({ 
  value, 
  onChange, 
  onClear,
  precision = 5, 
  onPrecisionChange 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className={`panel transition-all duration-300 ${isFocused ? 'ring-1 ring-primary/20' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary">Input</span>
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
            onClick={onClear}
            className="p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-colors"
            disabled={!value}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Paste your encoded polyline here..."
        className="w-full h-24 resize-none bg-transparent border-0 p-0 placeholder:text-muted-foreground focus:ring-0 focus:outline-none text-sm font-mono"
      />
      
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {value ? `${value.length} characters` : 'No polyline data'}
        </div>
        <div className="flex space-x-1">
          {value && (
            <button
              onClick={() => navigator.clipboard.writeText(value)}
              className="p-1.5 text-xs flex items-center space-x-1 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              <Copy className="h-3 w-3 mr-1" />
              <span>Copy</span>
            </button>
          )}
          <button 
            onClick={() => onChange('_p~iF~ps|U_ulLnnqC_mqNvxq`@')} 
            className="p-1.5 text-xs flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            <span>Sample</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolylineInput;
