
import React from 'react';
import { Info } from 'lucide-react';

interface ComparisonHeaderProps {
  comparisonMode: boolean;
  handleComparisonToggle: (value: boolean) => void;
}

const ComparisonHeader: React.FC<ComparisonHeaderProps> = () => {
  return (
    <div className="flex items-center mb-3">
      <div className="flex items-center space-x-2">
        <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary">Comparison</span>
        <div className="hidden sm:flex items-center text-xs text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          <span>Compare two polylines</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonHeader;
