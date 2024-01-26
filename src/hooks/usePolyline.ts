
import { useState, useEffect } from 'react';
import { decodePolyline, calculateDistance } from '../utils/polylineDecoder';

export function usePolyline() {
  const [polyline, setPolyline] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState(0);
  const [isDecoding, setIsDecoding] = useState(false);
  const [precision, setPrecision] = useState(5);

  // Decode polyline whenever input changes
  useEffect(() => {
    if (!polyline) {
      setCoordinates([]);
      setDistance(0);
      return;
    }
    
    setIsDecoding(true);
    
    // Small timeout to allow the UI to update before decoding
    const timer = setTimeout(() => {
      try {
        // The decoder returns coordinates as [lng, lat], 
        // which is the correct order for map display
        const decodedCoordinates = decodePolyline(polyline, precision);
        setCoordinates(decodedCoordinates);
        setDistance(calculateDistance(decodedCoordinates));
        
        // Log for debugging
        if (decodedCoordinates.length > 0) {
          console.log("First coordinate:", decodedCoordinates[0]);
        }
      } catch (error) {
        console.error('Error decoding polyline:', error);
      } finally {
        setIsDecoding(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [polyline, precision]);

  const handleClear = () => {
    setPolyline('');
  };

  return {
    polyline,
    setPolyline,
    coordinates,
    distance,
    isDecoding,
    handleClear,
    precision,
    setPrecision
  };
}
