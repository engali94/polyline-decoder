import React from 'react';
import Header from '../components/Header';
import {
  BookOpen,
  Code,
  Download,
  ArrowRight,
  Copy,
  FileCode,
  Settings2,
  BarChart,
} from 'lucide-react';

const Docs = () => {
  return (
    <div className="mx-auto flex h-screen max-w-full flex-col p-2 md:p-3">
      <Header />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="panel animate-fade-in md:col-span-3">
          <div className="mb-4 flex items-center space-x-1">
            <span className="flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
              <BookOpen className="mr-1 h-3.5 w-3.5" /> Polyline Encoder/Decoder Documentation
            </span>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">How to Use the Polyline Encoder/Decoder Tool</h2>
              <p className="text-sm text-muted-foreground">
                Our polyline encoder and decoder tool makes it easy to work with encoded polylines.
                Below are examples and explanations of how to use the key features.
              </p>
            </div>

            <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
              <h3 className="flex items-center text-sm font-medium">
                <Code className="mr-2 h-4 w-4 text-primary" />
                Encoding Coordinates
              </h3>
              <p className="text-sm">To encode a list of coordinates:</p>
              <ol className="space-y-2">
                <li className="flex items-start text-sm">
                  <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    1
                  </span>
                  <span>
                    Enter coordinate pairs in the input box (one pair per line or comma-separated)
                  </span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    2
                  </span>
                  <span>The tool will automatically encode them into a polyline string</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    3
                  </span>
                  <span>You can adjust the precision level for encoding</span>
                </li>
              </ol>

              <div className="space-y-2 rounded-md bg-background/80 p-3">
                <h4 className="text-xs font-medium">Example:</h4>
                <div className="space-y-1">
                  <p className="text-xs">Input coordinates:</p>
                  <pre className="overflow-x-auto rounded bg-slate-100 p-2 text-xs">
                    38.5, -120.2 40.7, -120.95 43.252, -126.453
                  </pre>
                </div>
                <div className="space-y-1">
                  <p className="text-xs">Encoded polyline (precision 5):</p>
                  <pre className="overflow-x-auto rounded bg-slate-100 p-2 text-xs">
                    {`}~kvHmzrr@ba\\hnc@jiu@r{Zqx~@hjp@pwEhnc@zhu@zflAbxn@fhjBvqHroaAgcnAp}gAeahAtqGkngAinc@_h|@r{Zad\\y|_D}_y@swg@ysg@}llBpoZqa{@xrw@~eBaaX}{uAero@uqGadY}nr@\`dYs_NquNgbjAf{l@|yh@bfc@}nr@z}q@i|i@zgz@r{ZhjFr}gApob@ff}@laIsen@dgYhdPvbIren@`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
              <h3 className="flex items-center text-sm font-medium">
                <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                Decoding Polylines
              </h3>
              <p className="text-sm">To decode a polyline string:</p>
              <ol className="space-y-2">
                <li className="flex items-start text-sm">
                  <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    1
                  </span>
                  <span>Enter or paste the encoded polyline string</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    2
                  </span>
                  <span>The tool automatically decodes it into coordinates</span>
                </li>
                <li className="flex items-start text-sm">
                  <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    3
                  </span>
                  <span>Results are displayed on the map and in the coordinate viewer</span>
                </li>
              </ol>

              <div className="space-y-2 rounded-md bg-background/80 p-3">
                <h4 className="text-xs font-medium">Example:</h4>
                <div className="space-y-1">
                  <p className="text-xs">Encoded polyline:</p>
                  <pre className="overflow-x-auto rounded bg-slate-100 p-2 text-xs">
                    {`}~kvHmzrr@ba\\hnc@jiu@r{Zqx~@hjp@pwEhnc@zhu@zflAbxn@fhjBvqHroaAgcnAp}gAeahAtqGkngAinc@_h|@r{Zad\\y|_D}_y@swg@ysg@}llBpoZqa{@xrw@~eBaaX}{uAero@uqGadY}nr@\`dYs_NquNgbjAf{l@|yh@bfc@}nr@z}q@i|i@zgz@r{ZhjFr}gApob@ff}@laIsen@dgYhdPvbIren@`}
                  </pre>
                </div>
                <div className="space-y-1">
                  <p className="text-xs">Decoded coordinates:</p>
                  <pre className="overflow-x-auto rounded bg-slate-100 p-2 text-xs">
                    [38.5, -120.2] [40.7, -120.95] [43.252, -126.453]
                  </pre>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
                <h3 className="flex items-center text-sm font-medium">
                  <BarChart className="mr-2 h-4 w-4 text-primary" />
                  Comparing Polylines
                </h3>
                <p className="text-sm">
                  Compare two polylines to analyze similarities and differences:
                </p>
                <ol className="space-y-2">
                  <li className="flex items-start text-sm">
                    <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      1
                    </span>
                    <span>Enter your primary polyline</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      2
                    </span>
                    <span>Enable comparison mode</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      3
                    </span>
                    <span>Enter your secondary polyline</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      4
                    </span>
                    <span>Choose from comparison modes:</span>
                  </li>
                </ol>

                <div className="grid grid-cols-1 gap-2 pl-7">
                  <div className="flex items-center rounded bg-background/80 p-2 text-xs">
                    <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                    <strong>Overlay:</strong> Shows both polylines on the same map
                  </div>
                  <div className="flex items-center rounded bg-background/80 p-2 text-xs">
                    <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                    <strong>Side by Side:</strong> Displays two maps for visual comparison
                  </div>
                  <div className="flex items-center rounded bg-background/80 p-2 text-xs">
                    <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                    <strong>Diff:</strong> Highlights differences and intersections
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
                <h3 className="flex items-center text-sm font-medium">
                  <FileCode className="mr-2 h-4 w-4 text-primary" />
                  Code Exports
                </h3>
                <p className="text-sm">
                  Export coordinates as code snippets for various programming languages:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-background/80 p-2">
                    <div className="mb-1 flex items-center text-xs font-medium">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-primary"></div>
                      Swift
                    </div>
                    <p className="text-xs text-muted-foreground">iOS development</p>
                  </div>

                  <div className="rounded-md bg-background/80 p-2">
                    <div className="mb-1 flex items-center text-xs font-medium">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-primary"></div>
                      Java/Kotlin
                    </div>
                    <p className="text-xs text-muted-foreground">Android development</p>
                  </div>

                  <div className="rounded-md bg-background/80 p-2">
                    <div className="mb-1 flex items-center text-xs font-medium">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-primary"></div>
                      JavaScript
                    </div>
                    <p className="text-xs text-muted-foreground">Web applications</p>
                  </div>

                  <div className="rounded-md bg-background/80 p-2">
                    <div className="mb-1 flex items-center text-xs font-medium">
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-primary"></div>
                      Rust
                    </div>
                    <p className="text-xs text-muted-foreground">Systems programming</p>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs">
                    <Copy className="h-3 w-3" />
                    Copy
                  </div>
                  <div className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs">
                    <Download className="h-3 w-3" />
                    Download
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
              <h3 className="flex items-center text-sm font-medium">
                <Settings2 className="mr-2 h-4 w-4 text-primary" />
                Advanced Options
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm">
                      <span className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                        <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                      </span>
                      <span>
                        <strong>Precision Control:</strong> Adjust encoding precision from 4 (±11m)
                        to 7 (±0.01m)
                      </span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                        <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                      </span>
                      <span>
                        <strong>Style Customization:</strong> Change colors, line thickness, and
                        line styles
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm">
                      <span className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                        <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                      </span>
                      <span>
                        <strong>Data Export:</strong> Download coordinates in GeoJSON or CSV formats
                      </span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="mr-2 mt-0.5 rounded-full bg-primary/10 p-1">
                        <span className="block h-1.5 w-1.5 rounded-full bg-primary"></span>
                      </span>
                      <span>
                        <strong>Similarity Analysis:</strong> Calculate how similar two polylines
                        are
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">
                Google Polyline Algorithm Format Specification
              </h3>
              <div className="space-y-2 rounded-lg bg-background/50 p-3 text-xs">
                <p>
                  Our tool implements the Google Polyline Algorithm Format, which works as follows:
                </p>
                <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                  <li>Convert the latitude and longitude to integers by multiplying by 10^5</li>
                  <li>Compute the delta between consecutive points</li>
                  <li>Convert each delta to binary and mask the 5 least significant bits</li>
                  <li>Add 63 to each binary chunk and convert to ASCII</li>
                  <li>Result is a URL-safe string representing the full path</li>
                </ol>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
              <h3 className="flex items-center text-sm font-medium">
                <Code className="mr-2 h-4 w-4 text-primary" />
                API Usage
              </h3>
              <p className="text-sm">
                For developers who want to integrate polyline encoding/decoding into their own
                applications, consider using these libraries:
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-md bg-background/80 p-2">
                  <div className="text-xs font-medium">JavaScript</div>
                  <code className="text-xs text-muted-foreground">@mapbox/polyline</code>
                </div>
                <div className="rounded-md bg-background/80 p-2">
                  <div className="text-xs font-medium">Python</div>
                  <code className="text-xs text-muted-foreground">polyline</code>
                </div>
                <div className="rounded-md bg-background/80 p-2">
                  <div className="text-xs font-medium">Java</div>
                  <code className="text-xs text-muted-foreground">google-maps-services-java</code>
                </div>
                <div className="rounded-md bg-background/80 p-2">
                  <div className="text-xs font-medium">Swift</div>
                  <code className="text-xs text-muted-foreground">Polyline</code>
                </div>
                <div className="rounded-md bg-background/80 p-2">
                  <div className="text-xs font-medium">C#</div>
                  <code className="text-xs text-muted-foreground">GeoCoordinate.NetStandard</code>
                </div>
              </div>
            </div>

            <p className="rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              This documentation provides a basic overview of working with polylines and our tool.
              For more specific questions or advanced usage scenarios, please contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
