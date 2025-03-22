import React from 'react';
import { Switch } from '../ui/switch';

interface DiffTabProps {
  showDivergence: boolean;
  setShowDivergence: (value: boolean) => void;
  showIntersections: boolean;
  setShowIntersections: (value: boolean) => void;
}

const DiffTab: React.FC<DiffTabProps> = ({
  showDivergence,
  setShowDivergence,
  showIntersections,
  setShowIntersections,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <span>Show Divergence</span>
        </label>
        <Switch checked={showDivergence} onCheckedChange={setShowDivergence} />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <span>Show Intersections</span>
        </label>
        <Switch checked={showIntersections} onCheckedChange={setShowIntersections} />
      </div>
    </div>
  );
};

export default DiffTab;
