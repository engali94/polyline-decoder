
import React, { useState } from 'react';
import { decodePolyline, calculateDistance } from '../utils/polylineDecoder';
import ComparisonHeader from './comparison/ComparisonHeader';
import SecondaryPolylineInput from './comparison/SecondaryPolylineInput';
import ComparisonTabs from './comparison/ComparisonTabs';
import { generateChartData, formatDistance } from './comparison/PolylineComparisonUtils';

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
  
  const handleComparisonToggle = (value: boolean) => {
    setComparisonMode(value);
    if (!value) {
      setSecondaryPolyline('');
    }
  };

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
        handleComparisonToggle={handleComparisonToggle} 
      />

      {comparisonMode && (
        <>
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
        </>
      )}
    </div>
  );
};

export default PolylineComparison;
