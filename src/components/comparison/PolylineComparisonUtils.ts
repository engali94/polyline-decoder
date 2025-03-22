import { decodePolyline } from '../../utils/polylineDecoder';

export const generateChartData = (
  primaryCoordinates: [number, number][],
  secondaryCoordinates: [number, number][]
) => {
  if (!primaryCoordinates.length && !secondaryCoordinates.length) return [];

  const longerArray =
    primaryCoordinates.length >= secondaryCoordinates.length
      ? primaryCoordinates
      : secondaryCoordinates;

  return longerArray.map((_, i) => {
    const primary = primaryCoordinates[i]
      ? Math.sin(i * 0.2) * 50 + 100 + Math.random() * 10
      : null;
    const secondary = secondaryCoordinates[i]
      ? Math.sin(i * 0.2 + 0.5) * 40 + 110 + Math.random() * 10
      : null;

    return {
      index: i,
      primary,
      secondary,
      diff: primary && secondary ? Math.abs(primary - secondary) : 0,
    };
  });
};

export const formatDistance = (meters: number) => {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};
