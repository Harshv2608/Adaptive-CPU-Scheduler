import React, { useMemo } from 'react';
import { SimulationResult, ProcessInput } from '@/lib/types';
import { usePlayback } from '@/hooks/usePlayback';
import { compressTimeline, buildReadyQueue, getProcessStateAtTime, getEventsAtTime } from '@/lib/simulation-utils';
import { CpuPanel } from './CpuPanel';
import { ReadyQueue } from './ReadyQueue';
import { GanttChart } from './GanttChart';
import { EventTimeline } from './EventTimeline';
import { ProcessMetricsTable } from './ProcessMetricsTable';
import { SchedulerDecisionPanel } from './SchedulerDecisionPanel';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Props {
  result: SimulationResult;
  processes: ProcessInput[];
}

export const SimulationPlayback = ({ result, processes }: Props) => {
  const totalTime = result.simulation.totalTime;
  const { time, isPlaying, speed, setSpeed, togglePlayback, restart, jumpTo } = usePlayback(totalTime);

  const segments = useMemo(() => compressTimeline(result.timeline), [result.timeline]);
  
  const segmentAtTime = segments.find(s => time >= s.start && time < s.end);
  const currentCpuPid = segmentAtTime ? segmentAtTime.processId : 0;
  
  const currentCpuProcess = currentCpuPid !== 0 
    ? result.processes.find(p => p.id === currentCpuPid) || null 
    : null;
    
  const cpuProcessState = currentCpuPid !== 0 
    ? getProcessStateAtTime(result, currentCpuPid, time) 
    : undefined;

  const queue = useMemo(() => buildReadyQueue(result, time, currentCpuPid), [result, time, currentCpuPid]);
  
  // Show all events up to the current playback time
  const visibleEvents = useMemo(() => result.events.filter(e => e.time <= time), [result.events, time]);
  const eventsAtTime = useMemo(() => getEventsAtTime(result.events, time), [result.events, time]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Playback Controls */}
      <div className="bg-card border rounded-lg p-4 flex flex-col md:flex-row items-center gap-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="icon" onClick={restart}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button size="icon" onClick={togglePlayback} className={isPlaying ? "bg-amber-500 hover:bg-amber-600 text-black" : ""}>
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </Button>
        </div>
        
        <div className="flex-1 w-full flex items-center gap-4">
          <span className="text-sm font-medium w-12 text-right">t={time}</span>
          <Slider 
            value={[time]} 
            max={totalTime} 
            step={1} 
            onValueChange={(vals: any) => jumpTo(Array.isArray(vals) ? vals[0] : vals)}
            className="flex-1"
          />
          <span className="text-sm font-medium w-12">{totalTime}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 bg-muted rounded-md p-1">
          {[0.5, 1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-xs rounded transition-colors ${speed === s ? 'bg-background shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 h-full">
        <div className="col-span-1 flex flex-col gap-6">
          <CpuPanel activePid={currentCpuPid} process={currentCpuProcess} currentClass={cpuProcessState?.currentClass} />
          <ReadyQueue queue={queue} />
        </div>
        <div className="col-span-1 lg:col-span-1">
          <EventTimeline events={visibleEvents} />
        </div>
        {/* Third Column: Scheduler Decision Panel */}
        <div className="lg:col-span-1">
          <SchedulerDecisionPanel 
            time={time} 
            currentProcess={currentCpuProcess} 
            eventsAtTime={eventsAtTime} 
            processes={processes} 
          />
        </div>
      </div>

      <GanttChart segments={segments as any} processes={processes} events={result.events} totalTime={totalTime} />

      <ProcessMetricsTable result={result} processes={processes} />
    </div>
  );
};
