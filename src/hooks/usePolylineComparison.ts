import { useState, useEffect, useRef } from 'react';
import { decodePolyline } from '../utils/polylineDecoder';
import { toast } from 'sonner';

export type ComparisonType = 'overlay' | 'sideBySide' | 'diff';

interface PolylineComparisonOptions {
  initialComparisonMode?: boolean;
  initialSecondaryPolyline?: string;
  initialSecondaryCoordinates?: [number, number][];
  initialComparisonType?: ComparisonType;
  initialOverlayOpacity?: number;
  initialShowDivergence?: boolean;
  initialShowIntersections?: boolean;
}

export function usePolylineComparison(options: PolylineComparisonOptions = {}) {
  const {
    initialComparisonMode = false,
    initialSecondaryPolyline = '',
    initialSecondaryCoordinates = [],
    initialComparisonType = 'overlay',
    initialOverlayOpacity = 80,
    initialShowDivergence = true,
    initialShowIntersections = true
  } = options;
  
  console.log('usePolylineComparison init with:', { 
    initialComparisonMode,
    hasInitialSecondaryPolyline: !!initialSecondaryPolyline,
    initialSecondaryCoordinatesCount: initialSecondaryCoordinates.length,
    initialComparisonType
  });
  
  const [comparisonMode, setComparisonMode] = useState(initialComparisonMode);
  const [secondaryPolyline, setSecondaryPolyline] = useState(initialSecondaryPolyline);
  const [secondaryCoordinates, setSecondaryCoordinates] = useState<[number, number][]>(initialSecondaryCoordinates);
  const [comparisonType, setComparisonType] = useState<ComparisonType>(initialComparisonType);
  const [overlayOpacity, setOverlayOpacity] = useState(initialOverlayOpacity);
  const [showDivergence, setShowDivergence] = useState(initialShowDivergence);
  const [showIntersections, setShowIntersections] = useState(initialShowIntersections);
  const initialLoadRef = useRef(true);
  
  useEffect(() => {
    if (initialLoadRef.current && initialSecondaryPolyline && initialSecondaryCoordinates.length === 0 && initialComparisonMode) {
      console.log('Decoding initial secondary polyline because no coordinates were provided');
      initialLoadRef.current = false;
      
      try {
        const decodedCoordinates = decodePolyline(initialSecondaryPolyline);
        
        if (decodedCoordinates.length >= 2) {
          setSecondaryCoordinates(decodedCoordinates);
          console.log('Initialized secondary polyline with', decodedCoordinates.length, 'points');
        } else {
          console.warn('Initial secondary polyline has too few points');
        }
      } catch (error) {
        console.error('Error decoding initial secondary polyline:', error);
      }
    } else if (initialLoadRef.current) {
      initialLoadRef.current = false;
      if (initialSecondaryCoordinates.length > 0) {
        console.log('Using pre-decoded secondary coordinates:', initialSecondaryCoordinates.length);
      }
    }
  }, [initialSecondaryPolyline, initialComparisonMode, initialSecondaryCoordinates]);

  useEffect(() => {
    if (initialLoadRef.current) {
      return; 
    }
    
    if (!secondaryPolyline || secondaryPolyline.trim() === '') {
      console.log('No secondary polyline provided, clearing coordinates');
      setSecondaryCoordinates([]);
      return;
    }

    try {
      console.log('Decoding secondary polyline:', secondaryPolyline.substring(0, 20) + '...');
      const decodedCoordinates = decodePolyline(secondaryPolyline);

      if (
        !decodedCoordinates ||
        !Array.isArray(decodedCoordinates) ||
        decodedCoordinates.length < 2
      ) {
        console.warn('Invalid secondary polyline: not enough coordinates');
        toast.error('Invalid polyline format - needs at least 2 points');
        return;
      }

      console.log('Secondary polyline decoded:', decodedCoordinates.length, 'points');
      console.log('Sample coordinates:', JSON.stringify(decodedCoordinates.slice(0, 3)));
      console.log(
        'First coordinate:',
        decodedCoordinates[0],
        'Last coordinate:',
        decodedCoordinates[decodedCoordinates.length - 1]
      );

      setSecondaryCoordinates(decodedCoordinates);

      // Auto-enable comparison mode when a secondary polyline is added
      if (decodedCoordinates.length > 0 && !comparisonMode) {
        setComparisonMode(true);
        toast.success('Comparison mode enabled with ' + decodedCoordinates.length + ' points');
      }
    } catch (error) {
      console.error('Error decoding secondary polyline:', error);
      toast.error('Error decoding secondary polyline');
      setSecondaryCoordinates([]);
    }
  }, [secondaryPolyline, comparisonMode]);

  const handleComparisonTypeChange = (type: ComparisonType) => {
    console.log('Comparison type changed to:', type);
    setComparisonType(type);
  };

  const handleComparisonToggle = (value: boolean) => {
    const newValue = Boolean(value);
    console.log('Toggle comparison mode:', newValue);

    setComparisonMode(newValue);

    if (newValue) {
      if (secondaryPolyline && secondaryCoordinates.length > 0) {
        toast.success('Comparison mode enabled with ' + secondaryCoordinates.length + ' points');
      } else {
        toast.info('Please enter a secondary polyline to compare');
      }
    } else {
      setSecondaryPolyline('');
      setSecondaryCoordinates([]);
      toast.info('Comparison mode disabled');
    }
  };

  return {
    comparisonMode,
    setComparisonMode: handleComparisonToggle,
    secondaryPolyline,
    setSecondaryPolyline,
    secondaryCoordinates,
    setSecondaryCoordinates,
    comparisonType,
    handleComparisonTypeChange,
    overlayOpacity,
    setOverlayOpacity,
    showDivergence,
    setShowDivergence,
    showIntersections,
    setShowIntersections,
  };
}
