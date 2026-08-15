import React from 'react';
import { GanttSegment } from '@/lib/simulation-utils';
import { ProcessInput, SimulationEvent, ProcessType } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
  segments: GanttSegment[];
  processes: ProcessInput[];
  events: SimulationEvent[];
  totalTime: number;
}

export const GanttChart = ({ segments, processes, events, totalTime }: Props) => {
  const getProcessTypeAtTime = (pid: number, time: number): ProcessType => {
    let currentClass = processes.find(p => p.id === pid)?.type || 'INTERACTIVE';
    for (const e of events) {
      if (e.time > time) break;
      if (e.processId === pid && e.type === 'AGING' && e.details?.toType) {
        currentClass = e.details.toType as ProcessType;
      }
    }
    return currentClass;
  };

  return (
    <div className="w-full bg-card border rounded-lg p-6">
      <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-6">
        GANTT CHART
      </h3>

      {segments.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm italic py-8">
          No execution data available.
        </div>
      ) : (
        <div className="relative w-full h-16 bg-muted/30 rounded-md flex overflow-hidden border">
          {segments.map((seg, idx) => {
            const process = processes.find(p => p.id === seg.processId);
            if (!process && seg.processId !== 0) return null;
            
            const pType = seg.processId !== 0 ? getProcessTypeAtTime(seg.processId, seg.start) : null;
            
            const colorClass = 
              seg.processId === 0 ? 'bg-muted/20' :
              pType === 'REAL_TIME' ? 'bg-[var(--color-process-rt)]/80 hover:bg-[var(--color-process-rt)]' :
              pType === 'INTERACTIVE' ? 'bg-[var(--color-process-int)]/80 hover:bg-[var(--color-process-int)]' :
              'bg-[var(--color-process-batch)]/80 hover:bg-[var(--color-process-batch)]';
            
            const widthPct = (seg.duration / totalTime) * 100;

            if (seg.processId === 0) {
              return (
                <Tooltip key={idx}>
                  <TooltipTrigger>
                    <div 
                      style={{ width: `${widthPct}%` }}
                      className={`h-full border-r last:border-r-0 ${colorClass} flex items-center justify-center transition-colors cursor-help`}
                    >
                      {widthPct > 2 && <span className="text-xs text-muted-foreground">Idle</span>}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p><strong>System Idle</strong></p>
                      <p>Time: {seg.start} &rarr; {seg.end}</p>
                      <p>Duration: {seg.duration}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Popover key={idx}>
                <PopoverTrigger>
                  <div 
                    style={{ width: `${widthPct}%` }}
                    className={`h-full border-r last:border-r-0 border-background ${colorClass} flex items-center justify-center transition-colors cursor-pointer text-primary-foreground font-bold`}
                  >
                    {widthPct > 2 && `P${seg.processId}`}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-2">
                    <h4 className="font-bold border-b pb-2">Process P{seg.processId} Block</h4>
                    <div className="text-sm grid grid-cols-2 gap-y-1">
                      <span className="text-muted-foreground">Orig Class:</span>
                      <span className="text-right">{process?.type.replace('_', '-')}</span>
                      
                      <span className="text-muted-foreground">Exec Class:</span>
                      <span className="text-right font-medium">{pType?.replace('_', '-')}</span>
                      
                      <span className="text-muted-foreground">Arrival:</span>
                      <span className="text-right">{process?.arrivalTime}</span>
                      
                      <span className="text-muted-foreground">Priority:</span>
                      <span className="text-right">{process?.priority}</span>
                      
                      <div className="col-span-2 border-t my-1"></div>
                      
                      <span className="text-muted-foreground">Start Time:</span>
                      <span className="text-right">{seg.start}</span>
                      
                      <span className="text-muted-foreground">End Time:</span>
                      <span className="text-right">{seg.end}</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      )}
      
      {/* Timeline markers */}
      {segments.length > 0 && (
        <div className="relative w-full h-6 mt-1 text-[10px] text-muted-foreground">
          <div className="absolute left-0">0</div>
          {segments.map((seg, idx) => (
             // Only show the end marker if it's large enough or it's the last one
             <div 
               key={idx}
               className="absolute text-center -translate-x-1/2"
               style={{ left: `${(seg.end / totalTime) * 100}%` }}
             >
               {seg.end}
             </div>
          ))}
        </div>
      )}
    </div>
  );
};
