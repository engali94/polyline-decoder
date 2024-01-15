
export const mapStyles = {
  light: {
    name: "Light",
    url: "mapbox://styles/mapbox/light-v11"
  },
  dark: {
    name: "Dark",
    url: "mapbox://styles/mapbox/dark-v11"
  },
  streets: {
    name: "Streets",
    url: "mapbox://styles/mapbox/streets-v12"
  },
  outdoors: {
    name: "Outdoors",
    url: "mapbox://styles/mapbox/outdoors-v12"
  },
  satellite: {
    name: "Satellite",
    url: "mapbox://styles/mapbox/satellite-v9"
  },
  satelliteStreets: {
    name: "Satellite Streets",
    url: "mapbox://styles/mapbox/satellite-streets-v12"
  }
};

export type MapStyle = keyof typeof mapStyles;
