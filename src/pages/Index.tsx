import React, { useState } from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import PolylineInput from '../components/PolylineInput';
import PolylineComparison from '../components/PolylineComparison';
import Statistics from '../components/Statistics';
import ExportOptions from '../components/ExportOptions';
import CoordinatesViewer from '../components/CoordinatesViewer';
import AdvancedFeatures from '../components/AdvancedFeatures';
import { usePolyline } from '../hooks/usePolyline';
import { usePolylineComparison } from '../hooks/usePolylineComparison';

const Index = () => {
  // Use our custom hooks
  const {
    polyline,
    setPolyline,
    coordinates,
    distance,
    isDecoding,
    handleClear,
    precision,
    setPrecision
  } = usePolyline();

  const {
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
  } = usePolylineComparison();
  
  // Add styling state
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#10b981');
  const [primaryLineWidth, setPrimaryLineWidth] = useState(3);
  const [secondaryLineWidth, setSecondaryLineWidth] = useState(3);
  const [primaryLineDash, setPrimaryLineDash] = useState<number[]>([]);
  const [secondaryLineDash, setSecondaryLineDash] = useState<number[]>([]);
  
  return (
    <div className="flex flex-col h-screen p-2 md:p-3 max-w-full mx-auto">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 flex-1 overflow-hidden">
        <div className="lg:col-span-3 h-[calc(100vh-12rem)] rounded-xl overflow-hidden relative">
          <Map 
            coordinates={coordinates} 
            secondaryCoordinates={secondaryCoordinates}
            isLoading={isDecoding}
            comparisonMode={comparisonMode}
            comparisonType={comparisonType}
            overlayOpacity={overlayOpacity}
            showDivergence={showDivergence}
            showIntersections={showIntersections}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            primaryLineWidth={primaryLineWidth}
            secondaryLineWidth={secondaryLineWidth}
            primaryLineDash={primaryLineDash}
            secondaryLineDash={secondaryLineDash}
          />
        </div>
        
        <div className="space-y-3 overflow-y-auto h-[calc(100vh-12rem)] pr-1 scrollbar-hide">
          <PolylineInput 
            value={polyline} 
            onChange={setPolyline} 
            onClear={handleClear}
            precision={precision}
            onPrecisionChange={setPrecision}
          />
          
          <PolylineComparison
            primaryPolyline={polyline}
            setPrimaryPolyline={setPolyline}
            comparisonMode={comparisonMode}
            setComparisonMode={setComparisonMode}
            secondaryPolyline={secondaryPolyline}
            setSecondaryPolyline={setSecondaryPolyline}
            comparisonType={comparisonType}
            setComparisonType={handleComparisonTypeChange}
            overlayOpacity={overlayOpacity}
            setOverlayOpacity={setOverlayOpacity}
            showDivergence={showDivergence}
            setShowDivergence={setShowDivergence}
            showIntersections={showIntersections}
            setShowIntersections={setShowIntersections}
            precision={precision}
            setPrecision={setPrecision}
          />
          
          <Statistics 
            coordinates={coordinates} 
            secondaryCoordinates={secondaryCoordinates}
            distance={distance} 
          />
          
          <AdvancedFeatures
            primaryCoordinates={coordinates}
            secondaryCoordinates={secondaryCoordinates}
            precision={precision}
            setPrecision={setPrecision}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
            primaryLineWidth={primaryLineWidth}
            setPrimaryLineWidth={setPrimaryLineWidth}
            secondaryLineWidth={secondaryLineWidth}
            setSecondaryLineWidth={setSecondaryLineWidth}
            primaryLineDash={primaryLineDash}
            setPrimaryLineDash={setPrimaryLineDash}
            secondaryLineDash={secondaryLineDash}
            setSecondaryLineDash={setSecondaryLineDash}
          />
          
          <CoordinatesViewer 
            primaryCoordinates={coordinates} 
            secondaryCoordinates={secondaryCoordinates} 
            primaryLabel="Primary Path"
            secondaryLabel="Secondary Path"
          />
          
          <ExportOptions coordinates={coordinates} />
        </div>
      </div>
    </div>
  );
};

export default Index;
