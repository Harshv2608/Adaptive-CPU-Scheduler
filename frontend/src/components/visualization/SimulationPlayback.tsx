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
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Props {
  result: SimulationResult;
  processes: ProcessInput[];
}

export const SimulationPlayback = ({ result, processes }: Props) => {
  const totalTime = result.simulation.totalTime;
  const { time, isPlaying, speed, setSpeed, togglePlayback, restart, jumpTo, stepForward, stepBackward } = usePlayback(totalTime);

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

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `schedx-simulation-${result.simulation.algorithm}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportCSV = () => {
    // PID,Arrival,Burst,Priority,Type,Start,Completion,Waiting,Turnaround
    const headers = ["PID", "Arrival", "Burst", "Priority", "Type", "Completion", "Waiting", "Turnaround", "Response", "Preemptions"];
    
    const rows = result.processMetrics.map(pm => {
      const p = processes.find(p => p.id === pm.processId);
      // count preemptions up to completion
      const preemptions = result.timeline.filter(t => t.processId === pm.processId).length - 1;
      
      return [
        pm.processId,
        p?.arrivalTime || 0,
        p?.burstTime || 0,
        p?.priority || 0,
        p?.type || '',
        pm.completionTime,
        pm.waitingTime,
        pm.turnaroundTime,
        pm.responseTime,
        Math.max(0, preemptions)
      ].join(',');
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", encodeURI(csvContent));
    downloadAnchorNode.setAttribute("download", `schedx-metrics-${result.simulation.algorithm}.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Playback Controls */}
      <div className="bg-card border rounded-lg p-4 flex flex-col md:flex-row items-center gap-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="outline" size="icon" onClick={restart} title="Restart">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={stepBackward} disabled={time <= 0} title="Step Backward (Left Arrow)">
            <span className="font-bold">&lt;</span>
          </Button>
          <Button size="icon" onClick={togglePlayback} className={isPlaying ? "bg-amber-500 hover:bg-amber-600 text-black" : ""} title="Play/Pause (Space)">
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </Button>
          <Button variant="outline" size="icon" onClick={stepForward} disabled={time >= totalTime} title="Step Forward (Right Arrow)">
            <span className="font-bold">&gt;</span>
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

        <div className="flex items-center gap-1 shrink-0 bg-muted rounded-md p-1 mr-2">
          {[0.25, 0.5, 1, 2, 4, 8].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-xs rounded transition-colors ${speed === s ? 'bg-background shadow-sm font-bold' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {s}x
            </button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10" title="Export Results">
            <Download className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportJSON}>Export JSON Trace</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCSV}>Export Metrics (CSV)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

      <GanttChart segments={segments as any} processes={processes} events={result.events} metrics={result.processMetrics} totalTime={totalTime} />

      <ProcessMetricsTable result={result} processes={processes} />
    </div>
  );
};
