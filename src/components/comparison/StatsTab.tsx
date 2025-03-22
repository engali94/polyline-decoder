import React from 'react';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '../ui/chart';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';

interface StatsTabProps {
  chartData: any[];
  distanceDiff: number;
  pointsDiff: number;
  formatDistance: (meters: number) => string;
}

const StatsTab: React.FC<StatsTabProps> = ({
  chartData,
  distanceDiff,
  pointsDiff,
  formatDistance,
}) => {
  return (
    <div className="space-y-3">
      <div className="mt-2 flex flex-col space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-secondary/50 p-2">
            <div className="text-xs text-muted-foreground">Distance Diff</div>
            <div className="text-sm font-semibold">{formatDistance(distanceDiff)}</div>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2">
            <div className="text-xs text-muted-foreground">Points Diff</div>
            <div className="text-sm font-semibold">{pointsDiff}</div>
          </div>
        </div>

        <div className="mt-2 h-[120px] w-full">
          <ChartContainer
            config={{
              primary: { color: '#3b82f6' },
              secondary: { color: '#10b981' },
              diff: { color: '#ef4444' },
            }}
          >
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis dataKey="index" tick={false} axisLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="primary"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#primaryGradient)"
              />
              <Area
                type="monotone"
                dataKey="secondary"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#secondaryGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Sample elevation profile (blue: primary, green: secondary)
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
