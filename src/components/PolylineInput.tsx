import React from 'react';
import { Trash2, Copy, Sparkles, ClipboardPaste } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { decodePolyline } from '../utils/polylineDecoder';
import ImportCoordinatesDialog from './ImportCoordinatesDialog';
import { toast } from 'sonner';

interface PolylineInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  precision?: number;
  onPrecisionChange?: (precision: number) => void;
  onCoordinatesImport?: (coordinates: [number, number][]) => void;
}

const PolylineInput: React.FC<PolylineInputProps> = ({
  value,
  onChange,
  onClear,
  precision = 5,
  onPrecisionChange,
  onCoordinatesImport,
}) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      toast.success('Polyline pasted');
    } catch (err) {
      toast.error('Failed to paste from clipboard');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Polyline copied');
  };

  const handleImportCoordinates = (coords: [number, number][]) => {
    if (onCoordinatesImport) {
      onCoordinatesImport(coords);
      toast.success(`Imported ${coords.length} coordinates`);
    }
  };

  const loadSample = () => {
    onChange(
      '}~kvHmzrr@ba\\hnc@jiu@r{Zqx~@hjp@pwEhnc@zhu@zflAbxn@fhjBvqHroaAgcnAp}gAeahAtqGkngAinc@_h|@r{Zad\\y|_D}_y@swg@ysg@}llBpoZqa{@xrw@~eBaaX}{uAero@uqGadY}nr@`dYs_NquNgbjAf{l@|yh@bfc@}nr@z}q@i|i@zgz@r{ZhjFr}gApob@ff}@laIsen@dgYhdPvbIren@'
    );
    toast.success('Sample polyline loaded');
  };

  let pointCount = 0;
  try {
    if (value) {
      pointCount = decodePolyline(value, precision).length;
    }
  } catch {
    pointCount = 0;
  }

  return (
    <div className="panel space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Polyline</h3>
          {value && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {pointCount} points
            </span>
          )}
        </div>
        {onPrecisionChange && (
          <Select
            value={precision.toString()}
            onValueChange={val => onPrecisionChange(Number(val))}
          >
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue placeholder="Precision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Precision 5</SelectItem>
              <SelectItem value="6">Precision 6</SelectItem>
              <SelectItem value="7">Precision 7</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste encoded polyline here..."
          className="h-28 w-full resize-none rounded-lg border bg-muted/30 p-3 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Button variant="outline" size="sm" onClick={handlePaste} className="gap-1.5">
            <ClipboardPaste className="h-3.5 w-3.5" />
            Paste
          </Button>
          {onCoordinatesImport && <ImportCoordinatesDialog onImport={handleImportCoordinates} />}
          {!value && (
            <Button variant="ghost" size="sm" onClick={loadSample} className="gap-1.5 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Sample
            </Button>
          )}
        </div>

        <div className="flex gap-1.5">
          {value && (
            <>
              <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-1.5">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolylineInput;
