import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { ShareableState, getStateFromUrl, decodeStateFromUrl } from '../utils/urlState';
import { toast } from 'sonner';
import { decodePolyline, calculateDistance } from '../utils/polylineDecoder';

const Index = () => {
  const [searchParams] = useSearchParams();
  const stateParam = searchParams.get('state');
  console.log('URL state parameter detected:', stateParam ? 'present' : 'not present');
  
  const urlState = stateParam ? decodeStateFromUrl(stateParam) : null;
  console.log('State decoded from URL:', urlState ? 'successful' : 'no state or error');
  
  let initialCoordinates: [number, number][] = [];
  let initialDistance = 0;
  let initialSecondaryCoordinates: [number, number][] = [];
  
  if (urlState?.primaryPolyline) {
    console.log('Primary polyline found in URL, length:', urlState.primaryPolyline.length);
    try {
      initialCoordinates = decodePolyline(urlState.primaryPolyline, urlState.precision || 5);
      initialDistance = calculateDistance(initialCoordinates);
      console.log('Pre-decoded primary coordinates:', initialCoordinates.length, 'points');
    } catch (error) {
      console.error('Error pre-decoding primary polyline from URL:', error);
    }
  }
  
  if (urlState?.secondaryPolyline && urlState?.comparisonMode) {
    console.log('Secondary polyline found in URL, length:', urlState.secondaryPolyline.length);
    try {
      initialSecondaryCoordinates = decodePolyline(urlState.secondaryPolyline, urlState.precision || 5);
      console.log('Pre-decoded secondary coordinates:', initialSecondaryCoordinates.length, 'points');
    } catch (error) {
      console.error('Error pre-decoding secondary polyline from URL:', error);
    }
  }
  
  // Force immediate decoding instead of relying on hook initialization
  // This addresses the scenario where hook doesn't initialize correctly
  const initialHookParams = {
    initialPolyline: urlState?.primaryPolyline || '',
    initialCoordinates: initialCoordinates,
    initialDistance: initialDistance,
    initialPrecision: urlState?.precision
  };

  const {
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
  } = usePolyline(initialHookParams);

  const {
    comparisonMode,
    setComparisonMode,
    secondaryPolyline,
    setSecondaryPolyline,
    secondaryCoordinates,
    setSecondaryCoordinates,
    comparisonType,
    handleComparisonTypeChange,
    overlayOpacity,
    setOverlayOpacity,
    showDivergence,
    setShowDivergence,
    showIntersections,
    setShowIntersections,
  } = usePolylineComparison({
    initialComparisonMode: urlState?.comparisonMode,
    initialSecondaryPolyline: urlState?.secondaryPolyline,
    initialSecondaryCoordinates: initialSecondaryCoordinates,
    initialComparisonType: urlState?.comparisonType,
    initialOverlayOpacity: urlState?.overlayOpacity,
    initialShowDivergence: urlState?.showDivergence,
    initialShowIntersections: urlState?.showIntersections,
  });

  useEffect(() => {
    if (urlState && initialCoordinates.length > 0 && coordinates.length === 0) {
      console.log('Setting pre-decoded coordinates directly from URL state');
      setCoordinates(initialCoordinates);
    }
    
    if (urlState && initialSecondaryCoordinates.length > 0 && secondaryCoordinates.length === 0) {
      console.log('Setting pre-decoded secondary coordinates directly from URL state');
      setSecondaryCoordinates(initialSecondaryCoordinates);
    }
  }, [urlState, initialCoordinates, initialSecondaryCoordinates, coordinates, secondaryCoordinates, setCoordinates, setSecondaryCoordinates]);

  useEffect(() => {
    if (urlState?.primaryPolyline) {
      const timer = setTimeout(() => {
        console.log('Force-triggering decode process for primary polyline from URL');
        if (urlState.primaryPolyline) {
          const decodedCoords = decodePolyline(urlState.primaryPolyline, urlState.precision || 5);
          setCoordinates(decodedCoords);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [urlState?.primaryPolyline, urlState?.precision, setCoordinates]);

  useEffect(() => {
    if (polyline && coordinates.length === 0) {
      console.log('Polyline detected but no coordinates - will force decode after delay');
      const timer = setTimeout(() => {
        try {
          const decodedCoords = decodePolyline(polyline, precision);
          console.log('Force-decoding polyline after 1s delay:', decodedCoords.length, 'points');
          setCoordinates(decodedCoords);
        } catch (error) {
          console.error('Error in force-decode:', error);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [polyline, coordinates.length, precision, setCoordinates]);

  useEffect(() => {
    if (urlState?.secondaryPolyline && urlState?.comparisonMode) {
      const timer = setTimeout(() => {
        console.log('Force-triggering decode process for secondary polyline from URL');
        if (urlState.secondaryPolyline) {
          const decodedCoords = decodePolyline(urlState.secondaryPolyline, urlState.precision || 5);
          console.log('Force-decoding secondary polyline after delay:', decodedCoords.length, 'points');
          setSecondaryCoordinates(decodedCoords);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [urlState?.secondaryPolyline, urlState?.comparisonMode, urlState?.precision, setSecondaryCoordinates]);

  useEffect(() => {
    if (secondaryPolyline && secondaryCoordinates.length === 0 && comparisonMode) {
      console.log('Secondary polyline detected but no coordinates - will force decode after delay');
      const timer = setTimeout(() => {
        try {
          const decodedCoords = decodePolyline(secondaryPolyline, precision);
          console.log('Force-decoding secondary polyline after delay:', decodedCoords.length, 'points');
          setSecondaryCoordinates(decodedCoords);
        } catch (error) {
          console.error('Error in force-decode of secondary polyline:', error);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [secondaryPolyline, secondaryCoordinates.length, comparisonMode, precision, setSecondaryCoordinates]);

  const [primaryColor, setPrimaryColor] = useState(urlState?.primaryColor || '#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState(urlState?.secondaryColor || '#10b981');
  const [primaryLineWidth, setPrimaryLineWidth] = useState(urlState?.primaryLineWidth || 3);
  const [secondaryLineWidth, setSecondaryLineWidth] = useState(urlState?.secondaryLineWidth || 3);
  const [primaryLineDash, setPrimaryLineDash] = useState<number[]>(urlState?.primaryLineDash || []);
  const [secondaryLineDash, setSecondaryLineDash] = useState<number[]>(urlState?.secondaryLineDash || []);

  useEffect(() => {
    if (urlState) {
      console.log('Loaded state from URL - showing toast');
      toast.success('Loaded visualization from shared link');
    }
  }, [urlState]);

  const getShareableState = (): ShareableState => ({
    primaryPolyline: polyline,
    secondaryPolyline: secondaryPolyline,
    comparisonMode,
    comparisonType,
    overlayOpacity,
    showDivergence,
    showIntersections,
    precision,
    primaryColor,
    secondaryColor,
    primaryLineWidth,
    secondaryLineWidth,
    primaryLineDash,
    secondaryLineDash,
  });

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

      <Header shareableState={getShareableState()} />

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
            onCoordinatesChange={setCoordinates}
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
