import * as LZString from 'lz-string';

// Define the interface for our shareable state
export interface ShareableState {
  primaryPolyline?: string;
  secondaryPolyline?: string;
  comparisonMode?: boolean;
  comparisonType?: 'overlay' | 'sideBySide' | 'diff';
  overlayOpacity?: number;
  showDivergence?: boolean;
  showIntersections?: boolean;
  precision?: number;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLineWidth?: number;
  secondaryLineWidth?: number;
  primaryLineDash?: number[];
  secondaryLineDash?: number[];
}

/**
 * Encode application state to URL-friendly string
 */
export function encodeStateToUrl(state: ShareableState): string {
  // Convert state to JSON string
  const stateString = JSON.stringify(state);
  
  // Compress the string to make the URL shorter
  return LZString.compressToEncodedURIComponent(stateString);
}

/**
 * Decode URL parameter back to application state
 */
export function decodeStateFromUrl(encoded: string | null): ShareableState | null {
  if (!encoded) return null;
  
  try {
    // Decompress the string
    const stateString = LZString.decompressFromEncodedURIComponent(encoded);
    if (!stateString) return null;
    
    // Parse back to object
    return JSON.parse(stateString) as ShareableState;
  } catch (error) {
    console.error('Failed to decode state from URL:', error);
    return null;
  }
}

/**
 * Update the URL with encoded state without page reload
 */
export function updateUrlWithState(state: ShareableState) {
  const encodedState = encodeStateToUrl(state);
  const url = new URL(window.location.href);
  url.searchParams.set('state', encodedState);
  
  console.log('Updating URL with state:', state);
  console.log('Encoded state:', encodedState.substring(0, 30) + '...');
  
  // Update URL without reloading page
  window.history.pushState({ state }, '', url.toString());
}

/**
 * Get state from current URL
 */
export function getStateFromUrl(): ShareableState | null {
  const url = new URL(window.location.href);
  const encodedState = url.searchParams.get('state');
  
  console.log('Reading state from URL parameters:', !!encodedState);
  if (!encodedState) {
    return null;
  }
  
  try {
    const result = decodeStateFromUrl(encodedState);
    console.log('Successfully decoded state from URL:', !!result);
    return result;
  } catch (error) {
    console.error('Error decoding state from URL:', error);
    return null;
  }
} 