import React, { useState, useEffect } from 'react';
import { decodePolyline, calculateDistance } from '../utils/polylineDecoder';
import ComparisonHeader from './comparison/ComparisonHeader';
import SecondaryPolylineInput from './comparison/SecondaryPolylineInput';
import ComparisonTabs from './comparison/ComparisonTabs';
import { generateChartData, formatDistance } from './comparison/PolylineComparisonUtils';
import { toast } from 'sonner';

type ComparisonViewType = 'overlay' | 'sideBySide' | 'diff' | 'stats';

interface PolylineComparisonProps {
  primaryPolyline: string;
  setPrimaryPolyline: (value: string) => void;
  comparisonMode: boolean;
  setComparisonMode: (value: boolean) => void;
  secondaryPolyline: string;
  setSecondaryPolyline: (value: string) => void;
  comparisonType: 'overlay' | 'sideBySide' | 'diff';
  setComparisonType: (type: 'overlay' | 'sideBySide' | 'diff') => void;
  overlayOpacity: number;
  setOverlayOpacity: (value: number) => void;
  showDivergence: boolean;
  setShowDivergence: (value: boolean) => void;
  showIntersections: boolean;
  setShowIntersections: (value: boolean) => void;
}

const PolylineComparison: React.FC<PolylineComparisonProps> = ({
  primaryPolyline,
  setPrimaryPolyline,
  comparisonMode,
  setComparisonMode,
  secondaryPolyline,
  setSecondaryPolyline,
  comparisonType,
  setComparisonType,
  overlayOpacity,
  setOverlayOpacity,
  showDivergence,
  setShowDivergence,
  showIntersections,
  setShowIntersections
}) => {
  const [alignmentThreshold, setAlignmentThreshold] = useState(20);
  const [activeTab, setActiveTab] = useState<ComparisonViewType>(comparisonType);

  const primaryCoordinates = primaryPolyline ? decodePolyline(primaryPolyline) : [];
  const secondaryCoordinates = secondaryPolyline ? decodePolyline(secondaryPolyline) : [];

  const primaryDistance = calculateDistance(primaryCoordinates);
  const secondaryDistance = calculateDistance(secondaryCoordinates);
  const distanceDiff = Math.abs(primaryDistance - secondaryDistance);
  const pointsDiff = Math.abs(primaryCoordinates.length - secondaryCoordinates.length);
  
  const chartData = generateChartData(primaryCoordinates, secondaryCoordinates);
  
  // Enable comparison mode automatically when secondary polyline is entered
  useEffect(() => {
    if (secondaryPolyline && !comparisonMode) {
      setComparisonMode(true);
      toast.success("Comparison mode enabled");
    }
  }, [secondaryPolyline, comparisonMode, setComparisonMode]);

  // Keep activeTab in sync with comparisonType
  useEffect(() => {
    setActiveTab(comparisonType);
  }, [comparisonType]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as ComparisonViewType);
    
    if (value === 'overlay' || value === 'sideBySide' || value === 'diff') {
      setComparisonType(value as 'overlay' | 'sideBySide' | 'diff');
    }
  };

  return (
    <div className="panel animate-fade-in">
      <ComparisonHeader 
        comparisonMode={comparisonMode} 
        handleComparisonToggle={setComparisonMode} 
      />

      {/* Always show the secondary polyline input */}
      <SecondaryPolylineInput 
        secondaryPolyline={secondaryPolyline}
        setSecondaryPolyline={setSecondaryPolyline}
        secondaryCoordinates={secondaryCoordinates}
      />

      {secondaryPolyline && (
        <ComparisonTabs 
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          overlayOpacity={overlayOpacity}
          setOverlayOpacity={setOverlayOpacity}
          showDivergence={showDivergence}
          setShowDivergence={setShowDivergence}
          showIntersections={showIntersections}
          setShowIntersections={setShowIntersections}
          alignmentThreshold={alignmentThreshold}
          setAlignmentThreshold={setAlignmentThreshold}
          chartData={chartData}
          distanceDiff={distanceDiff}
          pointsDiff={pointsDiff}
          formatDistance={formatDistance}
        />
      )}
    </div>
  );
};

export default PolylineComparison;
