import React from 'react';
import { SimulationResult } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface Props {
  result: SimulationResult | null;
}

export const BasicResultSummary = ({ result }: Props) => {
  if (!result) return null;

  return (
    <Card className="p-6 space-y-4 border-primary/20 bg-primary/5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">Simulation Completed</h3>
        <span className="text-xs text-muted-foreground">Detailed visualization coming in Phase 3C</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Total Processes</span>
          <span className="text-2xl font-bold">{result.processes.length}</span>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Execution Time</span>
          <span className="text-2xl font-bold">{result.timeline[result.timeline.length - 1]?.end || 0} ms</span>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">CPU Utilization</span>
          <span className="text-2xl font-bold">{result.metrics.cpuUtilization.toFixed(1)}%</span>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Avg Turnaround</span>
          <span className="text-2xl font-bold">{result.metrics.averageTurnaroundTime.toFixed(1)} ms</span>
        </div>
      </div>
    </Card>
  );
};
