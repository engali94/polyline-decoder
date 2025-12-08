import React from 'react';
import { Trash2, Copy, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { decodePolyline } from '../utils/polylineDecoder';

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
  onPrecisionChange,
}) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const primaryCoordinates = value ? decodePolyline(value, precision) : [];

  return (
    <div className="panel">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Polyline
        </span>
        <span className="text-xs text-muted-foreground">
          Paste encoded polyline or draw on map
        </span>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <div />
        <div className="flex items-center space-x-1">
          {onPrecisionChange && (
            <Select
              value={precision.toString()}
              onValueChange={val => onPrecisionChange(Number(val))}
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
            className="rounded-md bg-secondary p-1.5 text-xs transition-colors hover:bg-secondary/80"
          >
            Paste
          </button>
          <button
            onClick={onClear}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
            disabled={!value}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste your encoded polyline here or use edit mode to draw on the map..."
        className="h-24 w-full resize-none border-0 bg-transparent p-0 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
      />

      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {value
            ? `${value.length} characters, ${primaryCoordinates.length} points`
            : 'No polyline data'}
        </div>
        <div className="flex space-x-1">
          {value && (
            <button
              onClick={() => navigator.clipboard.writeText(value)}
              className="flex items-center space-x-1 rounded-md bg-secondary p-1.5 text-xs transition-colors hover:bg-secondary/80"
            >
              <Copy className="mr-1 h-3 w-3" />
              <span>Copy</span>
            </button>
          )}
          <button
            onClick={() => {
              onChange(
                '}~kvHmzrr@ba\\hnc@jiu@r{Zqx~@hjp@pwEhnc@zhu@zflAbxn@fhjBvqHroaAgcnAp}gAeahAtqGkngAinc@_h|@r{Zad\\y|_D}_y@swg@ysg@}llBpoZqa{@xrw@~eBaaX}{uAero@uqGadY}nr@`dYs_NquNgbjAf{l@|yh@bfc@}nr@z}q@i|i@zgz@r{ZhjFr}gApob@ff}@laIsen@dgYhdPvbIren@'
              );
            }}
            className="flex items-center space-x-1 rounded-md bg-primary/10 p-1.5 text-xs text-primary transition-colors hover:bg-primary/20"
          >
            <Sparkles className={`h-3 w-3 ${!value ? 'mr-1' : ''}`} />
            {!value && <span>Sample</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolylineInput;
