
import { useState, useEffect } from 'react';
import { decodePolyline, calculateDistance } from '../utils/polylineDecoder';

export function usePolyline() {
  const [polyline, setPolyline] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState(0);
  const [isDecoding, setIsDecoding] = useState(false);

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
        const decodedCoordinates = decodePolyline(polyline);
        setCoordinates(decodedCoordinates);
        setDistance(calculateDistance(decodedCoordinates));
      } catch (error) {
        console.error('Error decoding polyline:', error);
      } finally {
        setIsDecoding(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [polyline]);

  const handleClear = () => {
    setPolyline('');
  };

  return {
    polyline,
    setPolyline,
    coordinates,
    distance,
    isDecoding,
    handleClear
  };
}
