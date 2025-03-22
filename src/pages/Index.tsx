import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
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
    setCoordinatesFromText,
    distance,
    isDecoding,
    isEncoding,
    handleClear,
    precision,
    setPrecision,
    mode,
    toggleMode,
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
    setShowIntersections,
  } = usePolylineComparison();

  // Add styling state
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#10b981');
  const [primaryLineWidth, setPrimaryLineWidth] = useState(3);
  const [secondaryLineWidth, setSecondaryLineWidth] = useState(3);
  const [primaryLineDash, setPrimaryLineDash] = useState<number[]>([]);
  const [secondaryLineDash, setSecondaryLineDash] = useState<number[]>([]);

  return (
    <div className="mx-auto flex h-screen max-w-full flex-col p-2 md:p-3">
      <Helmet>
        <title>
          Free Online Polyline Decoder, Encoder & Visualizer | Interactive Map Visualization Tool
        </title>
        <meta
          name="description"
          content="Decode, encode and visualize Google polylines instantly with our free online tool. Interactive map visualization for routes, compare multiple polylines, and export to various formats."
        />
        <meta
          name="keywords"
          content="online polyline decoder, polyline encoder, polyline visualizer, google polyline, decode polyline, encode polyline, polyline map visualization, polyline tool, interactive map, polyline converter"
        />
        <link rel="canonical" href="https://polylinedecoder.online" />
        <meta
          property="og:title"
          content="Free Online Polyline Decoder, Encoder & Visualizer | Interactive Map Tool"
        />
        <meta
          property="og:description"
          content="Decode, encode and visualize Google polylines instantly with our free online tool. Interactive map visualization for routes and GPS tracks."
        />
        <meta
          name="twitter:title"
          content="Free Online Polyline Decoder, Encoder & Visualizer Tool"
        />
        <meta
          name="twitter:description"
          content="Decode, encode and visualize Google polylines with interactive maps. Visualize routes and export to various formats."
        />
      </Helmet>

      <Header />

      <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-4">
        <div className="relative h-[calc(100vh-12rem)] overflow-hidden rounded-xl lg:col-span-3">
          <Map
            coordinates={coordinates}
            secondaryCoordinates={secondaryCoordinates}
            isLoading={isDecoding || isEncoding}
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

        <div className="scrollbar-hide h-[calc(100vh-12rem)] space-y-3 overflow-y-auto pr-1">
          <PolylineInput
            value={polyline}
            onChange={setPolyline}
            onClear={handleClear}
            precision={precision}
            onPrecisionChange={setPrecision}
            mode={mode}
            onModeChange={toggleMode}
            isEncoding={isEncoding}
            onCoordinatesInput={setCoordinatesFromText}
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
