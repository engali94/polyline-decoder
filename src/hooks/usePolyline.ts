import { useState, useEffect } from 'react';
import { decodePolyline, encodePolyline, calculateDistance } from '../utils/polylineDecoder';

export function usePolyline() {
  const [polyline, setPolyline] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState(0);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isEncoding, setIsEncoding] = useState(false);
  const [precision, setPrecision] = useState(5);
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');

  useEffect(() => {
    if (!polyline || mode !== 'decode') {
      return;
    }

    setIsDecoding(true);

    const timer = setTimeout(() => {
      try {
        const decodedCoordinates = decodePolyline(polyline, precision);
        setCoordinates(decodedCoordinates);
        setDistance(calculateDistance(decodedCoordinates));

        if (decodedCoordinates.length > 0) {
          console.log('First coordinate:', decodedCoordinates[0]);
        }
      } catch (error) {
        console.error('Error decoding polyline:', error);
      } finally {
        setIsDecoding(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [polyline, precision, mode]);

  useEffect(() => {
    if (coordinates.length === 0 || mode !== 'encode') {
      return;
    }

    setIsEncoding(true);

    const timer = setTimeout(() => {
      try {
        const encodedPolyline = encodePolyline(coordinates, precision);
        setPolyline(encodedPolyline);

        console.log('Encoded polyline:', encodedPolyline);
      } catch (error) {
        console.error('Error encoding coordinates:', error);
      } finally {
        setIsEncoding(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [coordinates, precision, mode]);

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
    setMode('encode');
  };

  const toggleMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'decode' ? 'encode' : 'decode';

      setPolyline('');
      setCoordinates([]);
      setDistance(0);

      return newMode;
    });
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
    mode,
    toggleMode,
  };
}
