import React from 'react';
import { Pencil, Magnet, RotateCcw, RotateCw } from 'lucide-react';

interface EditControlsProps {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  snap: boolean;
  setSnap: (v: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const EditControls: React.FC<EditControlsProps> = ({
  enabled,
  setEnabled,
  snap,
  setSnap,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="editor-controls glass absolute left-4 top-20 z-10 flex space-x-2 rounded-lg p-2">
      <button
        onClick={() => setEnabled(!enabled)}
        className={`rounded-md p-1.5 ${enabled ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} transition-colors hover:bg-opacity-90`}
        title="Toggle edit mode (E)"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={() => setSnap(!snap)}
        className={`rounded-md p-1.5 ${snap ? 'bg-primary text-primary-foreground' : 'bg-secondary/70 text-secondary-foreground'} transition-colors hover:bg-opacity-90`}
        title="Snap to points"
      >
        <Magnet className="h-4 w-4" />
      </button>
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`rounded-md p-1.5 ${canUndo ? 'bg-secondary/70 text-secondary-foreground hover:bg-opacity-90' : 'bg-muted text-muted-foreground opacity-60'} `}
        title="Undo (Ctrl/Cmd+Z)"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`rounded-md p-1.5 ${canRedo ? 'bg-secondary/70 text-secondary-foreground hover:bg-opacity-90' : 'bg-muted text-muted-foreground opacity-60'} `}
        title="Redo (Ctrl/Cmd+Y)"
      >
        <RotateCw className="h-4 w-4" />
      </button>
    </div>
  );
};

export default EditControls;
