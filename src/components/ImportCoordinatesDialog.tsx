import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';

interface ImportCoordinatesDialogProps {
  onImport: (coordinates: [number, number][]) => void;
}

const ImportCoordinatesDialog: React.FC<ImportCoordinatesDialogProps> = ({ onImport }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const parseCoordinates = (input: string): [number, number][] => {
    const lines = input.trim().split(/\n/);
    const result: [number, number][] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parts = trimmed.split(/[,\s\t]+/).filter(Boolean);

      if (parts.length >= 2) {
        const first = parseFloat(parts[0]);
        const second = parseFloat(parts[1]);

        if (!isNaN(first) && !isNaN(second)) {
          if (Math.abs(first) <= 180 && Math.abs(second) <= 90) {
            result.push([first, second]);
          } else if (Math.abs(second) <= 180 && Math.abs(first) <= 90) {
            result.push([second, first]);
          }
        }
      }
    }

    return result;
  };

  const handleImport = () => {
    const parsed = parseCoordinates(text);
    if (parsed.length === 0) {
      setError('No valid coordinates found. Use format: longitude,latitude (one per line)');
      return;
    }
    onImport(parsed);
    setText('');
    setError('');
    setOpen(false);
  };

  const previewCount = text ? parseCoordinates(text).length : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Upload className="h-3.5 w-3.5" />
          Import Coordinates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Import Coordinates
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Paste coordinates in any of these formats:
          </p>
          <div className="rounded-md bg-muted/50 p-3 font-mono text-xs">
            <div className="text-muted-foreground">longitude, latitude</div>
            <div>-122.4194, 37.7749</div>
            <div>-122.4099, 37.7912</div>
          </div>

          <textarea
            value={text}
            onChange={e => {
              setText(e.target.value);
              setError('');
            }}
            placeholder="Paste your coordinates here..."
            className="h-40 w-full resize-none rounded-md border bg-background p-3 font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          {text && !error && (
            <p className="text-sm text-muted-foreground">
              {previewCount > 0
                ? `Found ${previewCount} valid coordinate${previewCount !== 1 ? 's' : ''}`
                : 'No valid coordinates detected'}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!text || previewCount === 0}>
            Import {previewCount > 0 && `(${previewCount})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCoordinatesDialog;
