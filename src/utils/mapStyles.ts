
export const mapStyles = {
  osm: {
    name: "OpenStreetMap",
    url: "https://api.maptiler.com/maps/openstreetmap/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
  },
  streets: {
    name: "Streets",
    url: "https://api.maptiler.com/maps/streets-v2/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
  },
  outdoor: {
    name: "Outdoor",
    url: "https://api.maptiler.com/maps/outdoor/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
  },
  basic: {
    name: "Basic",
    url: "https://api.maptiler.com/maps/basic-v2/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
  },
  bright: {
    name: "Bright",
    url: "https://api.maptiler.com/maps/bright/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
  },
  dark: {
    name: "Dark",
    url: "https://api.maptiler.com/maps/dataviz-dark/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
  },
  positron: {
    name: "Positron",
    url: "https://tiles.stadiamaps.com/styles/stamen_watercolor.json"
  },
  terrain: {
    name: "Terrain",
    url: "https://api.maptiler.com/maps/topo-v2/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
  }
};

export type MapStyle = keyof typeof mapStyles;
