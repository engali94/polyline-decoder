import React, { useState } from 'react';
import { Trash2, Copy, Sparkles, ArrowDownUp, Upload, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Switch } from './ui/switch';

interface PolylineInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  precision?: number;
  onPrecisionChange?: (precision: number) => void;
  mode?: 'decode' | 'encode';
  onModeChange?: () => void;
  isEncoding?: boolean;
  onCoordinatesInput?: (text: string) => void;
}

const PolylineInput: React.FC<PolylineInputProps> = ({
  value,
  onChange,
  onClear,
  precision = 5,
  onPrecisionChange,
  mode = 'decode',
  onModeChange,
  isEncoding = false,
  onCoordinatesInput,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [coordinatesText, setCoordinatesText] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (mode === 'decode') {
        onChange(text);
      } else {
        setCoordinatesText(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleCoordinatesSubmit = () => {
    if (onCoordinatesInput && coordinatesText) {
      onCoordinatesInput(coordinatesText);
    }
  };

  return (
    <div
      className={`panel transition-all duration-300 ${isFocused ? 'ring-1 ring-primary/20' : ''}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {mode === 'decode' ? 'Decode' : 'Encode'}
          </span>
          {onModeChange && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                {mode === 'decode' ? 'Polyline → Coordinates' : 'Coordinates → Polyline'}
              </span>
              <div className="flex items-center space-x-1">
                <Switch checked={mode === 'encode'} onCheckedChange={onModeChange} />
                <ArrowDownUp className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          )}
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
            onClick={onClear}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
            disabled={!value && !coordinatesText}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {mode === 'decode' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste your encoded polyline here..."
          className="h-24 w-full resize-none border-0 bg-transparent p-0 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        />
      ) : (
        <div>
          <textarea
            value={coordinatesText}
            onChange={e => setCoordinatesText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Paste your coordinates here (format: longitude,latitude or one coordinate per line)..."
            className="h-24 w-full resize-none border-0 bg-transparent p-0 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleCoordinatesSubmit}
              disabled={!coordinatesText || isEncoding}
              className="flex items-center space-x-1 rounded-md bg-primary p-1.5 text-xs text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Upload className="mr-1 h-3 w-3" />
              <span>{isEncoding ? 'Encoding...' : 'Encode'}</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {mode === 'decode'
            ? value
              ? `${value.length} characters`
              : 'No polyline data'
            : value
              ? `Encoded polyline (${value.length} chars)`
              : 'No encoded result yet'}
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
              if (mode === 'decode') {
                onChange(
                  '}~kvHmzrr@ba\\hnc@jiu@r{Zqx~@hjp@pwEhnc@zhu@zflAbxn@fhjBvqHroaAgcnAp}gAeahAtqGkngAinc@_h|@r{Zad\\y|_D}_y@swg@ysg@}llBpoZqa{@xrw@~eBaaX}{uAero@uqGadY}nr@`dYs_NquNgbjAf{l@|yh@bfc@}nr@z}q@i|i@zgz@r{ZhjFr}gApob@ff}@laIsen@dgYhdPvbIren@'
                );
              } else {
                setCoordinatesText('-122.4194,37.7749\n-122.4099,37.7912\n-122.4330,37.7866');
              }
            }}
            className="flex items-center space-x-1 rounded-md bg-primary/10 p-1.5 text-xs text-primary transition-colors hover:bg-primary/20"
          >
            <Sparkles className="mr-1 h-3 w-3" />
            <span>Sample</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolylineInput;
