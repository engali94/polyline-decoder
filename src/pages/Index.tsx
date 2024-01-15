
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import PolylineInput from '../components/PolylineInput';
import Statistics from '../components/Statistics';
import ExportOptions from '../components/ExportOptions';
import { decodePolyline, calculateDistance } from '../utils/polylineDecoder';

const Index = () => {
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
  
  return (
    <div className="flex flex-col h-screen p-4 md:p-6 max-w-7xl mx-auto">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        <div className="lg:col-span-2 h-[calc(100vh-13rem)] rounded-xl overflow-hidden relative">
          <Map coordinates={coordinates} isLoading={isDecoding} />
        </div>
        
        <div className="space-y-4 overflow-y-auto h-[calc(100vh-13rem)] pr-1 scrollbar-hide">
          <PolylineInput 
            value={polyline} 
            onChange={setPolyline} 
            onClear={handleClear} 
          />
          
          <Statistics coordinates={coordinates} distance={distance} />
          
          <ExportOptions coordinates={coordinates} />
        </div>
      </div>
    </div>
  );
};

export default Index;
