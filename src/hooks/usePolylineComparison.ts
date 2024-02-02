
import { useState, useEffect } from 'react';
import { decodePolyline } from '../utils/polylineDecoder';
import { toast } from 'sonner';

type ComparisonType = 'overlay' | 'sideBySide' | 'diff';

export function usePolylineComparison() {
  // Set comparison mode to true by default
  const [comparisonMode, setComparisonMode] = useState(true);
  const [secondaryPolyline, setSecondaryPolyline] = useState('');
  const [secondaryCoordinates, setSecondaryCoordinates] = useState<[number, number][]>([]);
  const [comparisonType, setComparisonType] = useState<ComparisonType>('overlay');
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [showDivergence, setShowDivergence] = useState(true);
  const [showIntersections, setShowIntersections] = useState(true);
  
  // Decode secondary polyline for comparison features
  useEffect(() => {
    if (!secondaryPolyline) {
      setSecondaryCoordinates([]);
      return;
    }
    
    try {
      const decodedCoordinates = decodePolyline(secondaryPolyline);
      console.log("Secondary polyline decoded:", decodedCoordinates.length);
      setSecondaryCoordinates(decodedCoordinates);
    } catch (error) {
      console.error('Error decoding secondary polyline:', error);
      toast.error('Error decoding secondary polyline');
      setSecondaryCoordinates([]);
    }
  }, [secondaryPolyline]);

  const handleComparisonTypeChange = (type: ComparisonType) => {
    console.log("Comparison type changed to:", type);
    setComparisonType(type);
  };

  const handleComparisonToggle = (value: boolean) => {
    // Direct boolean assignment to prevent type issues
    const newValue = Boolean(value);
    console.log("Toggle comparison mode:", newValue);
    
    setComparisonMode(newValue);
    
    // Show toast notification for better UX
    if (newValue) {
      toast.success("Comparison mode enabled");
    } else {
      setSecondaryPolyline('');
      toast.info("Comparison mode disabled");
    }
  };

  return {
    comparisonMode,
    setComparisonMode: handleComparisonToggle,
    secondaryPolyline,
    setSecondaryPolyline,
    secondaryCoordinates,
    comparisonType,
    handleComparisonTypeChange,
    overlayOpacity,
    setOverlayOpacity,
    showDivergence,
    setShowDivergence,
    showIntersections,
    setShowIntersections
  };
}
