import { SimulationResult, SimulationEvent, ProcessInput, ProcessType } from './types';

export interface GanttSegment {
  processId: number;
  start: number;
  end: number;
  duration: number;
}

// Timeline in SimulationResult is already TimelineSegment[] from C engine json!
// So we don't need to compress it here if the C engine does it.
export function compressTimeline(timeline: any[]): GanttSegment[] {
  // Wait, backend json returns {start, end, processId} in timeline.
  return timeline.map(s => ({
    processId: s.processId,
    start: s.start,
    end: s.end,
    duration: s.end - s.start
  }));
}

export function getEventsAtTime(events: SimulationEvent[], time: number): SimulationEvent[] {
  return events.filter(e => e.time === time);
}

export interface ReadyQueueProcess extends ProcessInput {
  currentClass: ProcessType;
  remainingTime: number;
}

export function buildReadyQueue(result: SimulationResult, time: number, currentCpuPid: number): ReadyQueueProcess[] {
  // A process is in the ready queue if:
  // 1. It has arrived (arrivalTime <= time)
  // 2. It has not completed (remainingTime > 0)
  // 3. It is not currently running (pid !== currentCpuPid)
  // 
  // We determine remainingTime and currentClass by scanning events up to `time`.
  
  const queue: ReadyQueueProcess[] = [];

  for (const process of result.processes) {
    if (process.arrivalTime > time) continue;

    let remainingTime = process.burstTime;
    let currentClass = process.type;
    let started = false;

    // Fast check: did it complete before or at time?
    const completionEvent = result.events.find(e => e.processId === process.id && e.type === 'COMPLETION');
    if (completionEvent && completionEvent.time <= time) {
      continue;
    }

    // Process events up to current time
    for (const e of result.events) {
      if (e.time > time) break;
      if (e.processId !== process.id) continue;

      if (e.type === 'AGING') {
        if (e.details?.toType) {
          currentClass = e.details.toType as ProcessType;
        }
      }
    }

    // We also need to count how much time this process has run up to `time`.
    // The easiest way is to count its occurrences in the timeline up to `time`.
    let runTime = 0;
    for (let i = 0; i < time; i++) {
      // Find the segment containing this time
      const seg = result.timeline.find(s => i >= s.start && i < s.end);
      if (seg && seg.processId === process.id) runTime++;
    }

    remainingTime = process.burstTime - runTime;

    if (remainingTime > 0 && process.id !== currentCpuPid) {
      queue.push({
        ...process,
        currentClass,
        remainingTime
      });
    }
  }

  return queue;
}

export function getProcessStateAtTime(result: SimulationResult, pid: number, time: number) {
  let currentClass = result.processes.find(p => p.id === pid)?.type || 'INTERACTIVE';
  
  for (const e of result.events) {
    if (e.time > time) break;
    if (e.processId === pid && e.type === 'AGING' && e.details?.toType) {
      currentClass = e.details.toType as ProcessType;
    }
  }
  return { currentClass };
}
