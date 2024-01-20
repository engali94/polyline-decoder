
import { useState, useEffect } from 'react';
import { decodePolyline } from '../utils/polylineDecoder';

type ComparisonType = 'overlay' | 'sideBySide' | 'diff';

export function usePolylineComparison() {
  const [comparisonMode, setComparisonMode] = useState(false);
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
      setSecondaryCoordinates(decodedCoordinates);
    } catch (error) {
      console.error('Error decoding secondary polyline:', error);
      setSecondaryCoordinates([]);
    }
  }, [secondaryPolyline]);

  const handleComparisonTypeChange = (type: ComparisonType) => {
    setComparisonType(type);
  };

  return {
    comparisonMode,
    setComparisonMode,
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
