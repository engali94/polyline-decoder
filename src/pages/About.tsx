import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import { MapPin, Ruler, Code, Maximize, Download, BarChart3 } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col h-screen p-2 md:p-3 max-w-full mx-auto">
      <Helmet>
        <title>About Online Polyline Encoder, Decoder & Visualizer | Interactive Map Tool</title>
        <meta name="description" content="Learn about polyline encoding, decoding and visualization. Our online tool converts between coordinates and Google polylines with interactive map visualization." />
        <meta name="keywords" content="about polyline, polyline algorithm, google polyline format, online polyline map visualization, encode decode polyline, polyline tools" />
        <meta property="og:title" content="About Online Polyline Encoder, Decoder & Visualizer Tool" />
        <meta property="og:description" content="Learn how polyline encoding works and how our online tool helps visualize routes on interactive maps." />
        <meta name="twitter:title" content="About Online Polyline Encoder, Decoder & Visualizer" />
        <meta name="twitter:description" content="Understand polyline encoding, decoding and visualization for maps and routes with our online tool." />
      </Helmet>
      
      <Header />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-3 panel animate-fade-in">
          <div className="flex items-center space-x-1 mb-4">
            <span className="bg-primary/10 px-2 py-0.5 rounded-full text-sm font-medium text-primary flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1" /> About Polyline Encoder and Decoder
            </span>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">What is a Polyline?</h2>
              <p className="text-sm text-muted-foreground">
                A polyline is a compact way to represent a series of coordinates. In mapping applications, 
                polylines are commonly used to encode paths, routes, and other geographic line features.
                The most popular implementation is the Google Polyline Algorithm Format, which converts
                latitude and longitude coordinates into a compressed string format.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
                <h3 className="text-sm font-medium flex items-center">
                  <Ruler className="h-4 w-4 mr-2 text-primary" />
                  Why Use Polyline Encoding?
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </span>
                    <span><strong>Reduced Data Size:</strong> Encoded polylines are much smaller than raw coordinate arrays</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </span>
                    <span><strong>URL-Safe:</strong> Encoded polylines can be safely included in URLs</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </span>
                    <span><strong>Industry Standard:</strong> Widely used across mapping platforms</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </span>
                    <span><strong>Efficient Storage:</strong> Requires less storage space in databases</span>
                  </li>
                </ul>
              </div>
              
              <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
                <h3 className="text-sm font-medium flex items-center">
                  <Code className="h-4 w-4 mr-2 text-primary" />
                  Our Polyline Tool Features
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </span>
                    <span><strong>Interactive Encoding/Decoding:</strong> Convert between formats instantly</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </span>
                    <span><strong>Visual Map Representation:</strong> See your polylines on interactive maps</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </span>
                    <span><strong>Comparison Tools:</strong> Analyze differences between polylines</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <span className="bg-primary/10 p-1 rounded-full mr-2 mt-0.5">
                      <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </span>
                    <span><strong>Developer-Friendly:</strong> Code generation in multiple languages</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
              <h3 className="text-sm font-medium flex items-center">
                <Maximize className="h-4 w-4 mr-2 text-primary" />
                How Polyline Encoding Works
              </h3>
              <ol className="space-y-2">
                <li className="text-sm flex items-start">
                  <span className="bg-primary/10 h-5 w-5 rounded-full mr-2 flex items-center justify-center text-xs font-medium text-primary">1</span>
                  <span>Converting the latitude and longitude values to integers by multiplying by a precision factor (usually 10^5)</span>
                </li>
                <li className="text-sm flex items-start">
                  <span className="bg-primary/10 h-5 w-5 rounded-full mr-2 flex items-center justify-center text-xs font-medium text-primary">2</span>
                  <span>Encoding each integer as a series of ASCII characters</span>
                </li>
                <li className="text-sm flex items-start">
                  <span className="bg-primary/10 h-5 w-5 rounded-full mr-2 flex items-center justify-center text-xs font-medium text-primary">3</span>
                  <span>Using a delta encoding technique where only the difference between consecutive points is encoded</span>
                </li>
              </ol>
            </div>
            
            <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
              <h3 className="text-sm font-medium flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                Common Uses for Polyline Encoding
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="text-sm bg-background/80 rounded p-2 text-center">Displaying routes on maps</div>
                <div className="text-sm bg-background/80 rounded p-2 text-center">Storing GPS tracks</div>
                <div className="text-sm bg-background/80 rounded p-2 text-center">Sharing route data</div>
                <div className="text-sm bg-background/80 rounded p-2 text-center">Path animations</div>
                <div className="text-sm bg-background/80 rounded p-2 text-center">Movement analysis</div>
                <div className="text-sm bg-background/80 rounded p-2 text-center">Geofencing apps</div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
              Whether you're a developer working with location data, a GIS professional, or just interested in
              maps and geography, our polyline encoder and decoder tool provides a simple yet powerful
              way to work with geographic path data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 