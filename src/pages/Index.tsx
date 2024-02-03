import React from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import PolylineInput from '../components/PolylineInput';
import PolylineComparison from '../components/PolylineComparison';
import Statistics from '../components/Statistics';
import ExportOptions from '../components/ExportOptions';
import CoordinatesViewer from '../components/CoordinatesViewer';
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
          
          <Statistics coordinates={coordinates} distance={distance} />
          
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
