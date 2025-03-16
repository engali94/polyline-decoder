# 🚏 Polyline Encoder & Decoder

<div align="center">

![Polyline Encoder/Decoder Tool](/public/og-image.png)

**Interactive tool for encoding, decoding, and visualizing polylines in real-time**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen.svg)](https://polylinedecoder.online)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.0-blue.svg)](https://reactjs.org/)

</div>

## ✨ Features

- **🔄 Interactive Encoding/Decoding**: Convert between coordinate pairs and encoded polyline strings instantly
- **🗺️ Visual Map Representation**: See your polylines rendered on interactive maps
- **📊 Advanced Comparison**: Compare multiple polylines with overlay, side-by-side, and differential analysis
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🎨 Style Customization**: Adjust colors, line thickness, and styles
- **🔍 Detailed Statistics**: View distance, density, and other metrics
- **💾 Export Options**: Download coordinates in various formats (GeoJSON, CSV)
- **📋 Code Generation**: Export coordinates as code snippets for Swift, Java, JavaScript, and Rust

## 🚀 Quick Start

### Try it online

Visit [https://polylinedecoder.online](https://polylinedecoder.online) to use the tool without installation.

### Run locally

```bash
# Clone the repository
git clone https://github.com/engali94/polyline-decoder.git
cd polyline-decoder

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Installation for Development

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/engali94/polyline-decoder.git
   cd polyline-decoder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## 📖 How to Use

### Encoding Coordinates

1. Enter coordinate pairs in the input box (one pair per line or comma-separated)
2. The encoded polyline string will automatically be generated
3. Adjust precision using the slider if needed

### Decoding Polylines

1. Enter or paste the encoded polyline string
2. The coordinates will be decoded and displayed on the map
3. Use the statistics panel to analyze the path

### Comparing Polylines

1. Enter your primary polyline
2. Enable comparison mode
3. Enter your secondary polyline
4. Choose from three comparison modes:
   - **Overlay**: Shows both polylines on the same map
   - **Side by Side**: Displays two maps for visual comparison
   - **Diff**: Highlights differences and intersections between paths

## 💻 For Developers

### Google Polyline Algorithm

This tool implements the Google Polyline Algorithm Format, which works by:

1. Converting coordinates to integers (multiplied by a precision factor)
2. Computing deltas between consecutive points
3. Encoding each value into a series of ASCII characters

### Integrating with Your Projects

You can use the core encoding/decoding functions in your own projects:

```javascript
import { encode, decode } from './src/utils/polylineEncoder';

// Encode coordinates
const coordinates = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]];
const encoded = encode(coordinates);
console.log(encoded); // "_p~iF~ps|U_ulLnnqC_mqNvxq`@"

// Decode a polyline
const decoded = decode("_p~iF~ps|U_ulLnnqC_mqNvxq`@");
console.log(decoded); // [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]
```

### Technology Stack

- **Frontend**: React, TypeScript
- **UI Components**: Shadcn UI, Tailwind CSS
- **Map Rendering**: MapLibre GL
- **State Management**: React Hooks
- **Building**: Vite

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve this project.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MapLibre GL](https://maplibre.org/) for the powerful mapping capabilities
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- All contributors who have helped improve this project

---

<p align="center">Made with ❤️ for the developer community</p>
