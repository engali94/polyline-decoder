
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import PolylineInput from '../components/PolylineInput';
import PolylineComparison from '../components/PolylineComparison';
import Statistics from '../components/Statistics';
import ExportOptions from '../components/ExportOptions';
import { decodePolyline, calculateDistance } from '../utils/polylineDecoder';

const Index = () => {
  const [polyline, setPolyline] = useState('');
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState(0);
  const [isDecoding, setIsDecoding] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [secondaryPolyline, setSecondaryPolyline] = useState('');
  const [secondaryCoordinates, setSecondaryCoordinates] = useState<[number, number][]>([]);
  const [comparisonType, setComparisonType] = useState<'overlay' | 'sideBySide' | 'diff'>('overlay');
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [showDivergence, setShowDivergence] = useState(true);
  const [showIntersections, setShowIntersections] = useState(true);
  
  // Decode primary polyline whenever input changes
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
    }
  }, [secondaryPolyline]);
  
  const handleClear = () => {
    setPolyline('');
  };
  
  return (
    <div className="flex flex-col h-screen p-4 md:p-6 max-w-7xl mx-auto">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        <div className="lg:col-span-2 h-[calc(100vh-13rem)] rounded-xl overflow-hidden relative">
          <Map 
            coordinates={coordinates} 
            secondaryCoordinates={secondaryCoordinates}
            isLoading={isDecoding}
            comparisonMode={comparisonMode}
            comparisonType={comparisonType}
            overlayOpacity={overlayOpacity}
            showDivergence={showDivergence}
            showIntersections={showIntersections}
          />
        </div>
        
        <div className="space-y-4 overflow-y-auto h-[calc(100vh-13rem)] pr-1 scrollbar-hide">
          <PolylineInput 
            value={polyline} 
            onChange={setPolyline} 
            onClear={handleClear} 
          />
          
          <PolylineComparison
            primaryPolyline={polyline}
            setPrimaryPolyline={setPolyline}
            comparisonMode={comparisonMode}
            setComparisonMode={setComparisonMode}
          />
          
          <Statistics coordinates={coordinates} distance={distance} />
          
          <ExportOptions coordinates={coordinates} />
        </div>
      </div>
    </div>
  );
};

export default Index;
