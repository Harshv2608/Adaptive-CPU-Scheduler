import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProcessInput } from '@/lib/types';
import { Button } from '@/components/ui/button';

export const WORKLOAD_PRESETS: Record<string, ProcessInput[]> = {
  balanced: [
    { id: 1, arrivalTime: 0, burstTime: 5, priority: 2, type: 'REAL_TIME' },
    { id: 2, arrivalTime: 1, burstTime: 3, priority: 3, type: 'INTERACTIVE' },
    { id: 3, arrivalTime: 2, burstTime: 4, priority: 4, type: 'BATCH' },
  ],
  interactive_heavy: [
    { id: 1, arrivalTime: 0, burstTime: 2, priority: 3, type: 'INTERACTIVE' },
    { id: 2, arrivalTime: 1, burstTime: 2, priority: 3, type: 'INTERACTIVE' },
    { id: 3, arrivalTime: 2, burstTime: 3, priority: 3, type: 'INTERACTIVE' },
    { id: 4, arrivalTime: 3, burstTime: 2, priority: 3, type: 'INTERACTIVE' },
    { id: 5, arrivalTime: 4, burstTime: 8, priority: 4, type: 'BATCH' },
  ],
  real_time_critical: [
    { id: 1, arrivalTime: 0, burstTime: 4, priority: 1, type: 'REAL_TIME' },
    { id: 2, arrivalTime: 1, burstTime: 2, priority: 2, type: 'REAL_TIME' },
    { id: 3, arrivalTime: 2, burstTime: 6, priority: 4, type: 'BATCH' },
    { id: 4, arrivalTime: 5, burstTime: 3, priority: 1, type: 'REAL_TIME' },
  ],
  batch_heavy: [
    { id: 1, arrivalTime: 0, burstTime: 10, priority: 4, type: 'BATCH' },
    { id: 2, arrivalTime: 1, burstTime: 8, priority: 4, type: 'BATCH' },
    { id: 3, arrivalTime: 2, burstTime: 12, priority: 4, type: 'BATCH' },
    { id: 4, arrivalTime: 5, burstTime: 2, priority: 2, type: 'INTERACTIVE' },
  ],
  starvation_demo: [
    { id: 1, arrivalTime: 0, burstTime: 5, priority: 3, type: 'INTERACTIVE' },
    { id: 2, arrivalTime: 1, burstTime: 15, priority: 4, type: 'BATCH' },
    { id: 3, arrivalTime: 2, burstTime: 4, priority: 3, type: 'INTERACTIVE' },
    { id: 4, arrivalTime: 6, burstTime: 5, priority: 3, type: 'INTERACTIVE' },
    { id: 5, arrivalTime: 10, burstTime: 5, priority: 3, type: 'INTERACTIVE' },
  ],
  preemption_demo: [
    { id: 1, arrivalTime: 0, burstTime: 8, priority: 4, type: 'BATCH' },
    { id: 2, arrivalTime: 2, burstTime: 4, priority: 2, type: 'REAL_TIME' },
    { id: 3, arrivalTime: 4, burstTime: 2, priority: 1, type: 'REAL_TIME' },
  ],
};

interface Props {
  onLoadPreset: (processes: ProcessInput[]) => void;
  disabled?: boolean;
}

export const WorkloadPresets = ({ onLoadPreset, disabled }: Props) => {
  const [selected, setSelected] = React.useState<string>("");

  const handleLoad = () => {
    if (selected && WORKLOAD_PRESETS[selected]) {
      // deep copy to avoid mutating the original preset
      const processes = JSON.parse(JSON.stringify(WORKLOAD_PRESETS[selected]));
      onLoadPreset(processes);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Select value={selected} onValueChange={(val) => { if (val) setSelected(val); }} disabled={disabled}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Custom Workload" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="balanced">Balanced</SelectItem>
          <SelectItem value="interactive_heavy">Interactive Heavy</SelectItem>
          <SelectItem value="real_time_critical">Real-Time Critical</SelectItem>
          <SelectItem value="batch_heavy">Batch Heavy</SelectItem>
          <SelectItem value="starvation_demo">Starvation Demo</SelectItem>
          <SelectItem value="preemption_demo">Preemption Demo</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="secondary" onClick={handleLoad} disabled={!selected || disabled}>
        Load Preset
      </Button>
    </div>
  );
};
