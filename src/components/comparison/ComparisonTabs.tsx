import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Layers, Split, Diff, BarChart2 } from 'lucide-react';
import OverlayTab from './OverlayTab';
import DiffTab from './DiffTab';
import SideBySideTab from './SideBySideTab';
import StatsTab from './StatsTab';

type ComparisonViewType = 'overlay' | 'sideBySide' | 'diff' | 'stats';

interface ComparisonTabsProps {
  activeTab: ComparisonViewType;
  handleTabChange: (value: string) => void;
  overlayOpacity: number;
  setOverlayOpacity: (value: number) => void;
  showDivergence: boolean;
  setShowDivergence: (value: boolean) => void;
  showIntersections: boolean;
  setShowIntersections: (value: boolean) => void;
  alignmentThreshold: number;
  setAlignmentThreshold: (value: number) => void;
  chartData: any[];
  distanceDiff: number;
  pointsDiff: number;
  formatDistance: (meters: number) => string;
}

const ComparisonTabs: React.FC<ComparisonTabsProps> = ({
  activeTab,
  handleTabChange,
  overlayOpacity,
  setOverlayOpacity,
  showDivergence,
  setShowDivergence,
  showIntersections,
  setShowIntersections,
  alignmentThreshold,
  setAlignmentThreshold,
  chartData,
  distanceDiff,
  pointsDiff,
  formatDistance,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-2 grid w-full grid-cols-4 bg-muted/70">
        <TabsTrigger value="overlay" className="flex items-center gap-1 text-xs">
          <Layers className="h-3 w-3" />
          <span className="hidden sm:inline">Overlay</span>
        </TabsTrigger>
        <TabsTrigger value="sideBySide" className="flex items-center gap-1 text-xs">
          <Split className="h-3 w-3" />
          <span className="hidden sm:inline">Side-by-Side</span>
        </TabsTrigger>
        <TabsTrigger value="diff" className="flex items-center gap-1 text-xs">
          <Diff className="h-3 w-3" />
          <span className="hidden sm:inline">Diff</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center gap-1 text-xs">
          <BarChart2 className="h-3 w-3" />
          <span className="hidden sm:inline">Stats</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overlay" className="mt-0">
        <OverlayTab overlayOpacity={overlayOpacity} setOverlayOpacity={setOverlayOpacity} />
      </TabsContent>

      <TabsContent value="diff" className="mt-0">
        <DiffTab
          showDivergence={showDivergence}
          setShowDivergence={setShowDivergence}
          showIntersections={showIntersections}
          setShowIntersections={setShowIntersections}
        />
      </TabsContent>

      <TabsContent value="sideBySide" className="mt-0">
        <SideBySideTab
          alignmentThreshold={alignmentThreshold}
          setAlignmentThreshold={setAlignmentThreshold}
        />
      </TabsContent>

      <TabsContent value="stats" className="mt-0">
        <StatsTab
          chartData={chartData}
          distanceDiff={distanceDiff}
          pointsDiff={pointsDiff}
          formatDistance={formatDistance}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ComparisonTabs;
