export const mapStyles = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://demotiles.maplibre.org/style.json',
  },
  positron: {
    name: 'Positron',
    url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  },
  dark: {
    name: 'Dark Matter',
    url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  },
  voyager: {
    name: 'Voyager',
    url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
};

export type MapStyle = keyof typeof mapStyles;

export interface CustomMapStyle {
  name: string;
  url: string;
}

export const CUSTOM_STYLES_STORAGE_KEY = 'polyline-decoder-custom-map-styles';

export const loadCustomStyles = (): Record<string, CustomMapStyle> => {
  try {
    const saved = localStorage.getItem(CUSTOM_STYLES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to load custom map styles:', error);
    return {};
  }
};

export const saveCustomStyle = (id: string, style: CustomMapStyle): void => {
  try {
    const currentStyles = loadCustomStyles();
    const updatedStyles = { ...currentStyles, [id]: style };
    localStorage.setItem(CUSTOM_STYLES_STORAGE_KEY, JSON.stringify(updatedStyles));
  } catch (error) {
    console.error('Failed to save custom map style:', error);
  }
};

export const removeCustomStyle = (id: string): void => {
  try {
    const currentStyles = loadCustomStyles();
    const { [id]: removed, ...remaining } = currentStyles;
    localStorage.setItem(CUSTOM_STYLES_STORAGE_KEY, JSON.stringify(remaining));
  } catch (error) {
    console.error('Failed to remove custom map style:', error);
  }
};
