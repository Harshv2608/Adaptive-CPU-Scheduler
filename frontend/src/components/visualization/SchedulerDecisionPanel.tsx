import React from 'react';
import { ProcessInput, SimulationEvent } from '@/lib/types';
import { BrainCircuit } from 'lucide-react';

interface Props {
  time: number;
  currentProcess: ProcessInput | null;
  eventsAtTime: SimulationEvent[];
  processes: ProcessInput[];
}

export const SchedulerDecisionPanel = ({ time, currentProcess, eventsAtTime, processes }: Props) => {
  // Find the dispatch event at or before this time to get the reason
  const dispatchEvent = eventsAtTime.find(e => e.type === 'DISPATCH' && e.processId === currentProcess?.id);
  const reason = dispatchEvent?.reason || (currentProcess ? 'Continuing execution.' : 'CPU is idle. No processes are ready.');

  // Estimate ready queue counts (approximate based on currentProcess)
  // Real implementation would track full ready queue state per tick, but we can do a simplified version
  
  let strategy = 'N/A';
  if (currentProcess) {
    if (currentProcess.type === 'REAL_TIME') strategy = 'Preemptive Priority';
    if (currentProcess.type === 'INTERACTIVE') strategy = 'Adaptive Round Robin';
    if (currentProcess.type === 'BATCH') strategy = 'SRTF';
  }

  return (
    <div className="bg-card border rounded-lg p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest">
          SCHEDULER DECISION
        </h3>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-muted-foreground">Time</span>
          <span className="font-mono font-bold text-lg">{time}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-muted-foreground">Selected</span>
          <span className="font-bold">{currentProcess ? `P${currentProcess.id}` : 'None'}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-muted-foreground">Class</span>
          <span className="font-bold">{currentProcess ? currentProcess.type?.replace('_', '-') : '-'}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-muted-foreground">Strategy</span>
          <span className="font-bold">{strategy}</span>
        </div>

        <div className="pt-2">
          <span className="text-sm text-muted-foreground block mb-2">Reason</span>
          <div className="bg-muted/30 p-3 rounded-md text-sm border italic">
            "{reason}"
          </div>
        </div>
      </div>
    </div>
  );
};
