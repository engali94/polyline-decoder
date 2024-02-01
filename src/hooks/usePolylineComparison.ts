
import { useState, useEffect } from 'react';
import { decodePolyline } from '../utils/polylineDecoder';
import { toast } from 'sonner';

type ComparisonType = 'overlay' | 'sideBySide' | 'diff';

export function usePolylineComparison() {
  // Set comparison mode to false by default
  const [comparisonMode, setComparisonMode] = useState(false);
  const [secondaryPolyline, setSecondaryPolyline] = useState('');
  const [secondaryCoordinates, setSecondaryCoordinates] = useState<[number, number][]>([]);
  const [comparisonType, setComparisonType] = useState<ComparisonType>('overlay');
  const [overlayOpacity, setOverlayOpacity] = useState(80); // Increased default opacity for better visibility
  const [showDivergence, setShowDivergence] = useState(true);
  const [showIntersections, setShowIntersections] = useState(true);
  
  // Decode secondary polyline for comparison features
  useEffect(() => {
    console.log("Secondary polyline changed:", secondaryPolyline.substring(0, 20) + (secondaryPolyline.length > 20 ? "..." : ""));
    
    if (!secondaryPolyline || secondaryPolyline.trim() === '') {
      console.log("No secondary polyline provided, clearing coordinates");
      setSecondaryCoordinates([]);
      return;
    }
    
    try {
      const decodedCoordinates = decodePolyline(secondaryPolyline);
      console.log("Secondary polyline decoded:", decodedCoordinates.length, "points");
      console.log("Sample coordinates:", JSON.stringify(decodedCoordinates.slice(0, 3)));
      
      if (decodedCoordinates.length < 2) {
        console.warn("Invalid secondary polyline: not enough coordinates");
        toast.error('Invalid polyline format - needs at least 2 points');
        return;
      }
      
      console.log("Secondary polyline decoded successfully:", decodedCoordinates.length, "points", 
        "First:", decodedCoordinates[0], "Last:", decodedCoordinates[decodedCoordinates.length-1]);
      
      setSecondaryCoordinates(decodedCoordinates);
      
      // Auto-enable comparison mode when a secondary polyline is added
      if (decodedCoordinates.length > 0 && !comparisonMode) {
        setComparisonMode(true);
        toast.success("Comparison mode enabled with " + decodedCoordinates.length + " points");
      }
    } catch (error) {
      console.error('Error decoding secondary polyline:', error);
      toast.error('Error decoding secondary polyline');
      setSecondaryCoordinates([]);
    }
  }, [secondaryPolyline, comparisonMode]);

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
      if (secondaryPolyline && secondaryCoordinates.length > 0) {
        toast.success("Comparison mode enabled with " + secondaryCoordinates.length + " points");
      } else {
        toast.info("Please enter a secondary polyline to compare");
      }
    } else {
      setSecondaryPolyline('');
      setSecondaryCoordinates([]);
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
