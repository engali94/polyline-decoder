import { useState, useEffect, useCallback, useRef } from 'react';
import { decodePolyline, encodePolyline, calculateDistance } from '../utils/polylineDecoder';

interface UsePolylineOptions {
  initialPolyline?: string;
  initialCoordinates?: [number, number][];
  initialDistance?: number;
  initialPrecision?: number;
}

export function usePolyline(options: UsePolylineOptions | string = '') {
  const opts: UsePolylineOptions = typeof options === 'string' 
    ? { initialPolyline: options } 
    : options;
  
  const {
    initialPolyline = '',
    initialCoordinates = [],
    initialDistance = 0,
    initialPrecision = 5
  } = opts;
  
  
  const [polyline, setPolyline] = useState(initialPolyline);
  const [coordinates, setCoordinates] = useState<[number, number][]>(initialCoordinates);
  const [distance, setDistance] = useState(initialDistance);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isEncoding, setIsEncoding] = useState(false);
  const [precision, setPrecision] = useState(initialPrecision);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (initialLoadRef.current && initialPolyline && initialCoordinates.length === 0) {
      initialLoadRef.current = false;
      try {
        const decodedCoordinates = decodePolyline(initialPolyline, precision);
        setCoordinates(decodedCoordinates);
        setDistance(calculateDistance(decodedCoordinates));
      } catch (error) {
        console.error('Error decoding initial polyline:', error);
      }
    } else if (initialLoadRef.current) {
      initialLoadRef.current = false;
    }
  }, [initialPolyline, precision, initialCoordinates]);

  const prevPolylineRef = useRef<string>('');
  const prevDecodePrecisionRef = useRef<number>(precision);

  useEffect(() => {
    if (initialLoadRef.current || !polyline) {
      return;
    }

    const polylineChanged = prevPolylineRef.current !== polyline;
    const precisionChanged = prevDecodePrecisionRef.current !== precision;

    if (!polylineChanged && !precisionChanged) {
      return;
    }

    prevPolylineRef.current = polyline;
    prevDecodePrecisionRef.current = precision;

    setIsDecoding(true);

    const timer = setTimeout(() => {
      try {
        const decodedCoordinates = decodePolyline(polyline, precision);
        setCoordinates(decodedCoordinates);
        setDistance(calculateDistance(decodedCoordinates));
      } catch (error) {
        console.error('Error decoding polyline:', error);
      } finally {
        setIsDecoding(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [polyline, precision]);


  const handleClear = () => {
    setPolyline('');
    setCoordinates([]);
    setDistance(0);
  };

  const parseCoordinates = (input: string): [number, number][] => {
    try {
      const lines = input.trim().split(/[\n,]+/);
      const result: [number, number][] = [];

      for (let i = 0; i < lines.length; i += 2) {
        const lng = parseFloat(lines[i]);
        const lat = parseFloat(lines[i + 1]);

        if (!isNaN(lng) && !isNaN(lat)) {
          if (Math.abs(lng) <= 180 && Math.abs(lat) <= 90) {
            result.push([lng, lat]);
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return [];
    }
  };

  const setCoordinatesFromText = (text: string) => {
    const parsed = parseCoordinates(text);
    setCoordinates(parsed);
    setDistance(calculateDistance(parsed));
  };

  return {
    polyline,
    setPolyline,
    coordinates,
    setCoordinates,
    setCoordinatesFromText,
    distance,
    isDecoding,
    isEncoding,
    handleClear,
    precision,
    setPrecision,
  };
}
