import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import { usePolylineEditor } from './usePolylineEditor';

interface UseEditorBridgeProps {
  map: React.MutableRefObject<maplibregl.Map | null>;
  coordinates: [number, number][];
  onCoordinatesChange?: (coords: [number, number][]) => void;
  enabled: boolean;
  snap: boolean;
  additionalSnapPoints: [number, number][];
  setEnabled: (v: boolean) => void;
}

export const useEditorBridge = ({
  map,
  coordinates,
  onCoordinatesChange,
  enabled,
  snap,
  additionalSnapPoints,
  setEnabled,
}: UseEditorBridgeProps) => {
  const { undo, redo, canUndo, canRedo } = usePolylineEditor({
    map,
    coordinates,
    onChange: onCoordinatesChange || (() => {}),
    enabled,
    snap,
    additionalSnapPoints,
    setEnabled,
  });

  useEffect(() => {
    const onUndo = () => undo();
    const onRedo = () => redo();
    window.addEventListener('editor-undo', onUndo);
    window.addEventListener('editor-redo', onRedo);
    return () => {
      window.removeEventListener('editor-undo', onUndo);
      window.removeEventListener('editor-redo', onRedo);
    };
  }, [undo, redo]);

  return { undo, redo, canUndo, canRedo };
};
