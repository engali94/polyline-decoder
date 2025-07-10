import React from 'react';
import { Trash2, Copy, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
  onPrecisionChange,
}) => {
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
    <div className="mb-3 mt-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Secondary
          </span>
        </div>
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
            onClick={handleClear}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
            disabled={!secondaryPolyline}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <textarea
        value={secondaryPolyline}
        onChange={e => setSecondaryPolyline(e.target.value)}
        placeholder="Paste your secondary polyline here..."
        className="h-24 w-full resize-none border-0 bg-transparent p-0 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
      />

      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {secondaryPolyline
            ? `${secondaryPolyline.length} characters, ${secondaryCoordinates.length} points`
            : 'No secondary polyline data'}
        </div>
        <div className="flex space-x-1">
          {secondaryPolyline && (
            <button
              onClick={() => navigator.clipboard.writeText(secondaryPolyline)}
              className="flex items-center space-x-1 rounded-md bg-secondary p-1.5 text-xs transition-colors hover:bg-secondary/80"
            >
              <Copy className="mr-1 h-3 w-3" />
              <span>Copy</span>
            </button>
          )}
          <button
            onClick={() =>
              setSecondaryPolyline(
                '}~kvHmzrr@ba\\hnc@jiu@r{Zqx~@hjp@pwEhnc@zhu@zflAbxn@fhjBvqHroaAgcnAp}gAeahAtqGkngAinc@_h|@r{Zad\\y|_D}_y@swg@ysg@}llBpoZqa{@xrw@~eBaaX}{uAero@uqGadY}nr@`dYs_NquNgbjAf{l@|yh@bfc@}nr@z}q@i|i@zgz@r{ZhjFr}gApob@ff}@laIsen@dgYhdPvbIren@'
              )
            }
            className="flex items-center space-x-1 rounded-md bg-green-100 p-1.5 text-xs text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
          >
            <Sparkles className="mr-1 h-3 w-3" />
            <span>Sample</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryPolylineInput;
