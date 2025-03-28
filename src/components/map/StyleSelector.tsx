import React, { useState } from 'react';
import { Settings, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { saveCustomStyle } from '../../utils/mapStyles';

export type StyleOption = {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
};

interface StyleSelectorProps {
  styleOptions: StyleOption[];
  currentStyleId: string;
  setCurrentStyleId: (id: string) => void;
  setStyleOptions: React.Dispatch<React.SetStateAction<StyleOption[]>>;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  styleOptions,
  currentStyleId,
  setCurrentStyleId,
  setStyleOptions,
}) => {
  const [showStyleOptions, setShowStyleOptions] = useState(false);
  const [showCustomStyleDialog, setShowCustomStyleDialog] = useState(false);
  const [newStyleName, setNewStyleName] = useState('');
  const [newStyleUrl, setNewStyleUrl] = useState('');

  const handleAddCustomStyle = () => {
    if (!newStyleName.trim() || !newStyleUrl.trim()) {
      toast({
        title: 'Invalid Input',
        description: 'Please provide both a name and URL for the custom style.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const id = `custom-${Date.now()}`;
      const newStyle = {
        name: newStyleName.trim(),
        url: newStyleUrl.trim(),
      };

      saveCustomStyle(id, newStyle);

      setStyleOptions(prev => [
        ...prev,
        { id, name: newStyle.name, url: newStyle.url, isCustom: true },
      ]);

      setNewStyleName('');
      setNewStyleUrl('');
      setShowCustomStyleDialog(false);

      toast({
        title: 'Style Added',
        description: `The custom style "${newStyle.name}" has been added.`,
      });
    } catch (error) {
      console.error('Error adding custom style:', error);
      toast({
        title: 'Error',
        description: 'Failed to add custom style. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <div className="relative">
        <button
          onClick={() => setShowStyleOptions(!showStyleOptions)}
          className="glass rounded-lg p-2 transition-all duration-200 hover:bg-white/90"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </button>

        {showStyleOptions && (
          <div className="glass absolute bottom-full right-0 mb-2 min-w-40 animate-scale-in rounded-lg p-2">
            <div className="mb-2 text-xs font-medium text-muted-foreground">Map Style</div>
            <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
              {styleOptions.map(style => (
                <button
                  key={style.id}
                  onClick={() => {
                    setCurrentStyleId(style.id);
                    setShowStyleOptions(false);
                  }}
                  className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    currentStyleId === style.id
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {style.name} {style.isCustom && '(Custom)'}
                </button>
              ))}
            </div>
            <div className="mt-2 border-t border-border pt-2">
              <button
                onClick={() => setShowCustomStyleDialog(true)}
                className="flex w-full items-center justify-center rounded-md py-1.5 text-sm text-primary transition-colors hover:bg-primary/10 hover:text-primary/80"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Custom Style
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showCustomStyleDialog} onOpenChange={setShowCustomStyleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Map Style</DialogTitle>
            <DialogDescription>
              Enter details for your custom map style. The style URL should point to a valid
              MapLibre/Mapbox style JSON.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="style-name">
                Style Name
              </label>
              <Input
                id="style-name"
                value={newStyleName}
                onChange={e => setNewStyleName(e.target.value)}
                placeholder="e.g., My Custom Style"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="style-url">
                Style URL
              </label>
              <Input
                id="style-url"
                value={newStyleUrl}
                onChange={e => setNewStyleUrl(e.target.value)}
                placeholder="https://example.com/style.json"
              />
              <p className="text-xs text-muted-foreground">
                Enter the URL to a MapLibre/Mapbox GL style definition JSON file
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddCustomStyle}>Add Style</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StyleSelector;
