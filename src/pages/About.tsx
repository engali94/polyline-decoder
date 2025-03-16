import React from 'react';
import Header from '../components/Header';

const About = () => {
  return (
    <div className="flex flex-col h-screen p-4 md:p-6 max-w-7xl mx-auto">
      <Header />
      
      <div className="mt-6 prose prose-slate max-w-none">
        <h1>About Polyline Encoder and Decoder</h1>
        
        <h2>What is a Polyline?</h2>
        <p>
          A polyline is a compact way to represent a series of coordinates. In mapping applications, 
          polylines are commonly used to encode paths, routes, and other geographic line features.
          The most popular implementation is the Google Polyline Algorithm Format, which converts
          latitude and longitude coordinates into a compressed string format.
        </p>
        
        <h2>Why Use Polyline Encoding?</h2>
        <p>
          Polyline encoding offers several advantages:
        </p>
        <ul>
          <li><strong>Reduced Data Size:</strong> Encoded polylines are much smaller than raw coordinate arrays, making them ideal for transmitting location data over networks.</li>
          <li><strong>URL-Safe:</strong> Encoded polylines can be safely included in URLs.</li>
          <li><strong>Industry Standard:</strong> The format is widely used across mapping platforms including Google Maps, Apple Maps, and many GIS applications.</li>
          <li><strong>Efficient Storage:</strong> Polylines require less storage space in databases and caches.</li>
        </ul>
        
        <h2>Our Polyline Tool</h2>
        <p>
          Our free online polyline encoder and decoder tool provides:
        </p>
        <ul>
          <li><strong>Interactive Encoding/Decoding:</strong> Convert between coordinate pairs and encoded polyline strings with one click</li>
          <li><strong>Visual Map Representation:</strong> See your polylines rendered on an interactive map</li>
          <li><strong>Comparison Tools:</strong> Compare multiple polylines to analyze differences and similarities</li>
          <li><strong>Precision Control:</strong> Adjust encoding precision based on your needs</li>
          <li><strong>Export Options:</strong> Download your data in various formats</li>
          <li><strong>Developer-Friendly:</strong> Generate code in multiple programming languages</li>
        </ul>
        
        <h2>How Polyline Encoding Works</h2>
        <p>
          The algorithm works by:
        </p>
        <ol>
          <li>Converting the latitude and longitude values to integers by multiplying by a precision factor (usually 10^5)</li>
          <li>Encoding each integer as a series of ASCII characters</li>
          <li>Using a delta encoding technique where only the difference between consecutive points is encoded</li>
        </ol>
        
        <h2>Common Uses for Polyline Encoding</h2>
        <ul>
          <li>Displaying routes on maps</li>
          <li>Storing GPS tracks</li>
          <li>Sharing route data between applications</li>
          <li>Rendering path animations</li>
          <li>Analyzing movement patterns</li>
          <li>Geofencing applications</li>
        </ul>
        
        <p>
          Whether you're a developer working with location data, a GIS professional, or just interested in
          maps and geography, our polyline encoder and decoder tool provides a simple yet powerful
          way to work with geographic path data.
        </p>
      </div>
    </div>
  );
};

export default About; 