import React from 'react';
import { SimulationResult, ProcessInput } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  result: SimulationResult;
  processes: ProcessInput[];
}

export const ProcessMetricsTable = ({ result, processes }: Props) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-4">
        PROCESS METRICS
      </h3>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>PID</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Burst</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Turnaround</TableHead>
              <TableHead>Waiting</TableHead>
              <TableHead>Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.processMetrics.map((p) => {
              const originalProcess = processes.find(op => op.id === p.processId);
              return (
                <TableRow key={p.processId}>
                  <TableCell className="font-bold">P{p.processId}</TableCell>
                  <TableCell>{originalProcess?.arrivalTime ?? '-'}</TableCell>
                  <TableCell>{originalProcess?.burstTime ?? '-'}</TableCell>
                  <TableCell>{p.completionTime}</TableCell>
                  <TableCell className="font-medium text-blue-400">{p.turnaroundTime}</TableCell>
                  <TableCell className="font-medium text-orange-400">{p.waitingTime}</TableCell>
                  <TableCell>{p.responseTime}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1">Avg Waiting</span>
          <span className="text-xl font-bold">{result.metrics.averageWaitingTime.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1">Avg Turnaround</span>
          <span className="text-xl font-bold">{result.metrics.averageTurnaroundTime.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1">Avg Response</span>
          <span className="text-xl font-bold">{result.metrics.averageResponseTime.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1">CPU Utilization</span>
          <span className="text-xl font-bold">{result.metrics.cpuUtilization.toFixed(1)}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1">Total Time</span>
          <span className="text-xl font-bold">{result.timeline[result.timeline.length - 1]?.end || result.timeline.length}</span>
        </div>
      </div>
    </div>
  );
};
