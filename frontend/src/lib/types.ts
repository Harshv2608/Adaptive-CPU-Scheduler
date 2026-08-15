export type ProcessType = 'REAL_TIME' | 'INTERACTIVE' | 'BATCH';
export type AlgorithmType = 'FCFS' | 'SJF' | 'PRIORITY' | 'ROUND_ROBIN' | 'HYBRID';

export interface ProcessInput {
  id: number;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  type: ProcessType;
}

export interface SimulationConfig {
  algorithm: AlgorithmType;
  timeQuantum: number;
  agingThreshold: number;
  totalTime: number;
}

export interface TimelineSegment {
  start: number;
  end: number;
  processId: number;
}

export interface EventDetails {
  quantum?: number;
  fromType?: string;
  toType?: string;
  waitingTime?: number;
}

export interface SimulationEvent {
  time: number;
  type: 'ARRIVAL' | 'DISPATCH' | 'PREEMPTION' | 'QUANTUM_EXPIRE' | 'AGING' | 'PROMOTION' | 'COMPLETION' | 'IDLE';
  processId: number;
  reason?: string;
  details?: EventDetails;
}

export interface SimulationMetrics {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
}

export interface ProcessMetrics {
  processId: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
}

export interface SimulationResult {
  simulation: SimulationConfig;
  processes: ProcessInput[];
  timeline: TimelineSegment[];
  events: SimulationEvent[];
  metrics: SimulationMetrics;
  processMetrics: ProcessMetrics[];
}

export interface AlgorithmMetadata {
  id: AlgorithmType;
  name: string;
  preemptive: boolean;
}
