import React from 'react';
import { Info } from 'lucide-react';

interface ComparisonHeaderProps {
  comparisonMode: boolean;
  handleComparisonToggle: (value: boolean) => void;
}

const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({
  comparisonMode,
  handleComparisonToggle,
}) => {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Comparison
        </span>
        <div className="hidden items-center text-xs text-muted-foreground sm:flex">
          <Info className="mr-1 h-3 w-3" />
          <span>Compare two polylines</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonHeader;
