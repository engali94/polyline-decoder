
import React from 'react';
import { Switch } from '../ui/switch';
import { InfoCircle } from 'lucide-react';

interface ComparisonHeaderProps {
  comparisonMode: boolean;
  handleComparisonToggle: (value: boolean) => void;
}

const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({ 
  comparisonMode, 
  handleComparisonToggle 
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs font-medium text-primary">Comparison</span>
        <div className="hidden sm:flex items-center text-xs text-muted-foreground">
          <InfoCircle className="h-3 w-3 mr-1" />
          <span>Compare two polylines</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">Enable</span>
        <Switch 
          checked={comparisonMode}
          onCheckedChange={handleComparisonToggle}
          className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
          aria-label="Toggle comparison mode"
        />
      </div>
    </div>
  );
};

export default ComparisonHeader;
