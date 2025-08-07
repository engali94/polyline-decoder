import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';

interface UsePolylineEditorProps {
  map: React.MutableRefObject<maplibregl.Map | null>;
  coordinates: [number, number][];
  onChange: (coords: [number, number][]) => void;
  enabled: boolean;
  snap?: boolean;
  snapTolerancePx?: number;
  additionalSnapPoints?: [number, number][];
  setEnabled?: (v: boolean) => void;
}

interface UsePolylineEditorReturn {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function usePolylineEditor({
  map,
  coordinates,
  onChange,
  enabled,
  snap = true,
  snapTolerancePx = 10,
  additionalSnapPoints = [],
  setEnabled,
}: UsePolylineEditorProps): UsePolylineEditorReturn {
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const selectedIndexRef = useRef<number | null>(null);
  const historyRef = useRef<[number, number][][]>([]);
  const futureRef = useRef<[number, number][][]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
  };

  const pushHistory = (prev: [number, number][]) => {
    historyRef.current.push(prev);
    futureRef.current = [];
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(false);
  };

  const undo = () => {
    if (!historyRef.current.length) return;
    const prev = historyRef.current.pop()!;
    futureRef.current.push([...coordinates]);
    onChange(prev);
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  };

  const redo = () => {
    if (!futureRef.current.length) return;
    const next = futureRef.current.pop()!;
    historyRef.current.push([...coordinates]);
    onChange(next);
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  };

  const getAllSnapPoints = (): [number, number][] => {
    return [...coordinates, ...additionalSnapPoints];
  };

  const snapLngLat = (lngLat: maplibregl.LngLat): maplibregl.LngLat => {
    if (!map.current || !snap) return lngLat;
    const m = map.current;
    const pt = m.project(lngLat);
    let best: { d: number; ll: maplibregl.LngLat } | null = null;

    for (const [lng, lat] of getAllSnapPoints()) {
      const candidate = new maplibregl.LngLat(lng, lat);
      const cpt = m.project(candidate);
      const d = Math.hypot(cpt.x - pt.x, cpt.y - pt.y);
      if (best === null || d < best.d) best = { d, ll: candidate };
    }

    if (best && best.d <= snapTolerancePx) return best.ll;
    return lngLat;
  };

  const rebuildMarkers = () => {
    if (!map.current) return;
    clearMarkers();

    coordinates.forEach((coord, idx) => {
      const el = document.createElement('div');
      el.className = 'h-3 w-3 rounded-full bg-primary ring-2 ring-background shadow';
      el.tabIndex = 0;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedIndexRef.current = idx;
        el.classList.add('ring-primary');
      });

      const marker = new maplibregl.Marker({ element: el, draggable: true })
        .setLngLat(coord as [number, number])
        .addTo(map.current!);

      const onDrag = () => {
        const lngLat = snapLngLat(marker.getLngLat());
        marker.setLngLat(lngLat);
        const prev = [...coordinates];
        const next = [...coordinates];
        next[idx] = [lngLat.lng, lngLat.lat];
        onChange(next);
      };

      const onDragEnd = () => {
        const lngLat = marker.getLngLat();
        const prev = [...coordinates];
        const next = [...coordinates];
        next[idx] = [lngLat.lng, lngLat.lat];
        pushHistory(prev);
        onChange(next);
      };

      marker.on('drag', onDrag);
      marker.on('dragend', onDragEnd);

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (!enabled) {
      clearMarkers();
      return;
    }
    rebuildMarkers();
    return clearMarkers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    rebuildMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, enabled]);

  useEffect(() => {
    if (!map.current) return;
    if (!enabled) return;

    const handleMapClick = (e: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      if (!map.current) return;
      const target = e.originalEvent?.target as HTMLElement | null;
      if (target && target.closest('.editor-controls')) return;

      const lngLat = snapLngLat(e.lngLat);
      const prev = [...coordinates];

      // Try inserting near a segment if click is close, otherwise append
      const m = map.current;
      const clickPt = m.project(lngLat);
      let insertAt = coordinates.length;
      let minDist = Infinity;

      for (let i = 0; i < coordinates.length - 1; i++) {
        const a = m.project(new maplibregl.LngLat(coordinates[i][0], coordinates[i][1]));
        const b = m.project(new maplibregl.LngLat(coordinates[i + 1][0], coordinates[i + 1][1]));
        const apx = clickPt.x - a.x;
        const apy = clickPt.y - a.y;
        const abx = b.x - a.x;
        const aby = b.y - a.y;
        const ab2 = abx * abx + aby * aby || 1;
        let t = (apx * abx + apy * aby) / ab2;
        t = Math.max(0, Math.min(1, t));
        const proj = { x: a.x + abx * t, y: a.y + aby * t };
        const d = Math.hypot(clickPt.x - proj.x, clickPt.y - proj.y);
        if (d < minDist) {
          minDist = d;
          insertAt = i + 1;
        }
      }

      const next = [...coordinates];
      if (minDist <= 12) next.splice(insertAt, 0, [lngLat.lng, lngLat.lat]);
      else next.push([lngLat.lng, lngLat.lat]);

      pushHistory(prev);
      onChange(next);
    };

    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }
      if (e.key.toLowerCase() === 'e') {
        if (setEnabled) setEnabled(!enabled);
        return;
      }
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedIndexRef.current !== null) {
        const idx = selectedIndexRef.current;
        if (idx === null || idx < 0 || idx >= coordinates.length) return;
        const prev = [...coordinates];
        const next = coordinates.filter((_, i) => i !== idx);
        pushHistory(prev);
        onChange(next);
        selectedIndexRef.current = null;
      }
      if (e.key === 'Escape') {
        selectedIndexRef.current = null;
      }
    };

    map.current.on('click', handleMapClick);
    window.addEventListener('keydown', handleKey);

    return () => {
      map.current?.off('click', handleMapClick);
      window.removeEventListener('keydown', handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, coordinates]);

  return { undo, redo, canUndo, canRedo };
}
