import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProcessType } from '@/lib/types';

interface Props {
  value: ProcessType;
  onChange: (val: ProcessType) => void;
  disabled?: boolean;
}

export const ProcessTypeSelector = ({ value, onChange, disabled }: Props) => {
  return (
    <Select value={value} onValueChange={(val) => { if (val) onChange(val as ProcessType); }} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="REAL_TIME">
          <div className="flex flex-col py-1">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--color-process-rt)]" /> Real-Time
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">Preemptive priority. Lower number = higher priority.</span>
          </div>
        </SelectItem>
        <SelectItem value="INTERACTIVE">
          <div className="flex flex-col py-1">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--color-process-int)]" /> Interactive
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">Round robin. Adaptive time quantum based on load.</span>
          </div>
        </SelectItem>
        <SelectItem value="BATCH">
          <div className="flex flex-col py-1">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--color-process-batch)]" /> Batch
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">SRTF. Shortest remaining burst receives CPU.</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
