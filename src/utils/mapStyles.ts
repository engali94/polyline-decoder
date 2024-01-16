
export const mapStyles = {
  osm: {
    name: "OpenStreetMap",
    url: "https://demotiles.maplibre.org/style.json"
  },
  positron: {
    name: "Positron",
    url: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  },
  dark: {
    name: "Dark Matter",
    url: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
  },
  voyager: {
    name: "Voyager",
    url: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
  },
  rastertiles: {
    name: "Raster Tiles",
    url: "https://demotiles.maplibre.org/style.json"
  },
  watercolor: {
    name: "Watercolor",
    url: "https://tiles.stadiamaps.com/styles/stamen_watercolor.json?api_key=undefined"
  },
  terrain: {
    name: "Terrain",
    url: "https://demotiles.maplibre.org/terrain-style.json"
  }
};

export type MapStyle = keyof typeof mapStyles;
