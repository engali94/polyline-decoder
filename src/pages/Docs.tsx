import React from 'react';
import Header from '../components/Header';

const Docs = () => {
  return (
    <div className="flex flex-col h-screen p-4 md:p-6 max-w-7xl mx-auto">
      <Header />
      
      <div className="mt-6 prose prose-slate max-w-none">
        <h1>Polyline Encoder/Decoder Documentation</h1>
        
        <h2>How to Use the Polyline Encoder/Decoder Tool</h2>
        <p>
          Our polyline encoder and decoder tool makes it easy to work with encoded polylines.
          Below are examples and explanations of how to use the key features.
        </p>
        
        <h3>Encoding Coordinates</h3>
        <p>To encode a list of coordinates:</p>
        <ol>
          <li>Enter coordinate pairs in the input box (one pair per line or comma-separated)</li>
          <li>The tool will automatically encode them into a polyline string</li>
          <li>You can adjust the precision level for encoding</li>
        </ol>
        
        <div className="bg-slate-100 p-4 rounded-md">
          <h4>Example:</h4>
          <p>Input coordinates:</p>
          <pre className="bg-slate-200 p-2 rounded text-sm overflow-x-auto">
            38.5, -120.2
            40.7, -120.95
            43.252, -126.453
          </pre>
          <p>Encoded polyline (precision 5):</p>
          <pre className="bg-slate-200 p-2 rounded text-sm overflow-x-auto">
            _p~iF~ps|U_ulLnnqC_mqNvxq`@
          </pre>
        </div>
        
        <h3>Decoding Polylines</h3>
        <p>To decode a polyline string:</p>
        <ol>
          <li>Enter or paste the encoded polyline string</li>
          <li>The tool automatically decodes it into coordinates</li>
          <li>Results are displayed on the map and in the coordinate viewer</li>
        </ol>
        
        <div className="bg-slate-100 p-4 rounded-md">
          <h4>Example:</h4>
          <p>Encoded polyline:</p>
          <pre className="bg-slate-200 p-2 rounded text-sm overflow-x-auto">
            _p~iF~ps|U_ulLnnqC_mqNvxq`@
          </pre>
          <p>Decoded coordinates:</p>
          <pre className="bg-slate-200 p-2 rounded text-sm overflow-x-auto">
            [38.5, -120.2]
            [40.7, -120.95]
            [43.252, -126.453]
          </pre>
        </div>
        
        <h3>Comparing Polylines</h3>
        <p>
          The tool allows you to compare two polylines to analyze their similarities and differences:
        </p>
        <ol>
          <li>Enter your primary polyline</li>
          <li>Enable comparison mode</li>
          <li>Enter your secondary polyline</li>
          <li>Choose from three different comparison modes:
            <ul>
              <li><strong>Overlay:</strong> Shows both polylines on the same map</li>
              <li><strong>Side by Side:</strong> Displays two maps for visual comparison</li>
              <li><strong>Diff:</strong> Highlights differences and intersections between paths</li>
            </ul>
          </li>
        </ol>
        
        <h3>Code Exports</h3>
        <p>
          After decoding a polyline, you can export the coordinates as code snippets for various programming languages:
        </p>
        <ul>
          <li>Swift (for iOS development)</li>
          <li>Java/Kotlin (for Android development)</li>
          <li>JavaScript (for web applications)</li>
          <li>Rust (for systems programming)</li>
        </ul>
        
        <h3>Advanced Options</h3>
        <p>The tool provides several advanced features:</p>
        <ul>
          <li><strong>Precision Control:</strong> Adjust the encoding precision from 4 (±11m) to 7 (±0.01m)</li>
          <li><strong>Style Customization:</strong> Change colors, line thickness, and line styles</li>
          <li><strong>Data Export:</strong> Download your coordinates in GeoJSON or CSV formats</li>
          <li><strong>Similarity Analysis:</strong> Calculate how similar two polylines are</li>
        </ul>
        
        <h2>Google Polyline Algorithm Format Specification</h2>
        <p>
          Our tool implements the Google Polyline Algorithm Format, which works as follows:
        </p>
        <ol>
          <li>Convert the latitude and longitude to integers by multiplying by 10^5</li>
          <li>Compute the delta between consecutive points</li>
          <li>Convert each delta to binary and mask the 5 least significant bits</li>
          <li>Add 63 to each binary chunk and convert to ASCII</li>
          <li>Result is a URL-safe string representing the full path</li>
        </ol>
        
        <h2>API Usage</h2>
        <p>
          For developers who want to integrate polyline encoding/decoding into their own applications,
          consider using these libraries:
        </p>
        <ul>
          <li>JavaScript: <code>@mapbox/polyline</code> or <code>google-polyline</code></li>
          <li>Python: <code>polyline</code></li>
          <li>Java: <code>google-maps-services-java</code></li>
          <li>Swift: <code>Polyline</code> package</li>
          <li>C#: <code>GeoCoordinate.NetStandard</code></li>
        </ul>
        
        <p>
          This documentation provides a basic overview of working with polylines and our tool. For more
          specific questions or advanced usage scenarios, please contact us.
        </p>
      </div>
    </div>
  );
};

export default Docs; 